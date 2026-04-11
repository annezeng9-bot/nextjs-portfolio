// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

function useW() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ResponsiveContainer, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ── api ───────────────────────────────────────────────────────────────────────
async function lfm(method, extra = {}) {
  const params = new URLSearchParams({ method, ...extra });
  const res = await fetch(`/api/lastfm?${params.toString()}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

// Unix timestamp helpers
const toTs   = d => Math.floor(new Date(d).getTime() / 1000);
const dayEnd = d => { const x = new Date(d); x.setUTCHours(23,59,59,0); return toTs(x); };
const dayStart = d => { const x = new Date(d); x.setUTCHours(0,0,0,0); return toTs(x); };

function mondayOf(date) {
  const d = new Date(date);
  const dow = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (dow === 0 ? 6 : dow - 1));
  d.setUTCHours(0,0,0,0);
  return d;
}

// Fetch one day's tracks → {count, tracks[[name,artist]], artists[[artist,count]]}
async function fetchDay(date) {
  const from = dayStart(date), to = dayEnd(date);
  const d = await lfm("user.getRecentTracks", { from, to, limit: 200 });
  const raw  = [].concat(d.recenttracks?.track || []).filter(t => t.date);
  const total = parseInt(d.recenttracks?.["@attr"]?.total || raw.length);
  const seen = new Set(), top3 = [];
  for (const t of raw) {
    const k = `${t.name}||${t.artist?.["#text"]}`;
    if (!seen.has(k)) { seen.add(k); top3.push([t.name, t.artist?.["#text"]]); }
    if (top3.length === 3) break;
  }
  const ac = {};
  raw.forEach(t => { const a = t.artist?.["#text"]; ac[a] = (ac[a]||0)+1; });
  const artists = Object.entries(ac).sort((a,b)=>b[1]-a[1]).slice(0,3);
  return { count: total, tracks: top3, artists };
}

// Fetch one week's data → {count, artists[[name,count]]}
async function fetchWeek(monDate, toDate) {
  const from = dayStart(monDate);
  const to   = dayEnd(toDate);
  // getRecentTracks with pagination
  const first = await lfm("user.getRecentTracks", { from, to, limit: 200, page: 1 });
  const totalPages = parseInt(first.recenttracks?.["@attr"]?.totalPages || 1);
  const total      = parseInt(first.recenttracks?.["@attr"]?.total || 0);
  let tracks = [].concat(first.recenttracks?.track || []).filter(t => t.date);

  if (totalPages > 1) {
    const extra = await Promise.all(
      Array.from({length: totalPages - 1}, (_, i) =>
        lfm("user.getRecentTracks", { from, to, limit: 200, page: i + 2 })
      )
    );
    extra.forEach(p => {
      tracks = tracks.concat([].concat(p.recenttracks?.track || []).filter(t => t.date));
    });
  }
  const ac = {};
  tracks.forEach(t => { const a = t.artist?.["#text"]; ac[a] = (ac[a]||0)+1; });
  const artists = Object.entries(ac).sort((a,b)=>b[1]-a[1]).slice(0,8);
  return { count: total, artists };
}

// Fetch artist global listeners + user plays
async function fetchArtistInfo(artist) {
  try {
    const d = await lfm("artist.getInfo", { artist, autocorrect: 1 });
    return {
      name:      d.artist?.name || artist,
      listeners: parseInt(d.artist?.stats?.listeners  || 0),
      userPlays: parseInt(d.artist?.stats?.userplaycount || 0),
    };
  } catch { return { name: artist, listeners: 0, userPlays: 0 }; }
}

// ── palette ───────────────────────────────────────────────────────────────────
const YC  = { "2021":"#f87171","2022":"#fb923c","2023":"#6b7280","2024":"#60a5fa","2025":"#a78bfa","2026":"#f5a623" };
const YBG = { "2021":"rgba(248,113,113,0.12)","2022":"rgba(251,146,60,0.12)","2023":"rgba(107,114,128,0.12)","2024":"rgba(96,165,250,0.12)","2025":"rgba(167,139,250,0.12)","2026":"rgba(245,166,35,0.12)" };
const GC  = {
  "K-Pop":"#ff6b9d","K-R&B/Hip-Hop":"#c084fc","Indie Pop":"#86efac",
  "R&B":"#fbbf24","Pop":"#60a5fa","Hip-Hop":"#f97316",
  "Afrobeats":"#34d399","J-Rock":"#fb7185","Latin":"#a78bfa",
};
const GENRES = ["K-Pop","K-R&B/Hip-Hop","Indie Pop","R&B","Pop","Hip-Hop","Afrobeats","J-Rock","Latin"];

// ── static data ───────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHLY_DATA = MONTHS.map((m,i)=>{
  const r={2023:{1:1057,2:821,3:1095,4:944,5:1152,6:1122,7:1155,8:1159,9:971,10:1605,11:1299,12:927},2024:{1:1031,2:1151,3:897,4:870,5:593,6:1153,7:807,8:1674,9:1666,10:1467,11:1659,12:1764},2025:{1:1161,2:1115,3:1119,4:976,5:1760,6:1488,7:1155,8:955,9:483,10:782,11:1004,12:1053},2026:{1:910,2:541,3:747,4:243}};
  return {month:m,"2023":r[2023][i+1]||0,"2024":r[2024][i+1]||0,"2025":r[2025][i+1]||0,"2026":r[2026][i+1]||null};
});

const GENRE_STACKED = [
  {year:"2014","K-Pop":0.3,"K-R&B/Hip-Hop":1.5,"Indie Pop":0.1,"R&B":0.6,"Pop":51.5,"Hip-Hop":2.9,"Afrobeats":0.0,"J-Rock":0.0,"Latin":0.0},
  {year:"2015","K-Pop":0.1,"K-R&B/Hip-Hop":0.0,"Indie Pop":1.8,"R&B":1.7,"Pop":35.8,"Hip-Hop":4.3,"Afrobeats":0.0,"J-Rock":0.0,"Latin":0.0},
  {year:"2016","K-Pop":0.9,"K-R&B/Hip-Hop":0.0,"Indie Pop":0.7,"R&B":1.7,"Pop":27.5,"Hip-Hop":1.0,"Afrobeats":0.0,"J-Rock":0.0,"Latin":0.0},
  {year:"···",isGap:true},
  {year:"2021","K-Pop":38.0,"K-R&B/Hip-Hop":4.9,"Indie Pop":8.9,"R&B":2.7,"Pop":8.0,"Hip-Hop":0.5,"Afrobeats":0.4,"J-Rock":0.3,"Latin":0.0},
  {year:"2022","K-Pop":33.0,"K-R&B/Hip-Hop":5.2,"Indie Pop":8.9,"R&B":3.1,"Pop":9.8,"Hip-Hop":1.3,"Afrobeats":0.2,"J-Rock":2.8,"Latin":0.0},
  {year:"2023","K-Pop":30.6,"K-R&B/Hip-Hop":12.5,"Indie Pop":7.4,"R&B":1.6,"Pop":6.4,"Hip-Hop":2.3,"Afrobeats":1.8,"J-Rock":0.9,"Latin":0.0},
  {year:"2024","K-Pop":31.6,"K-R&B/Hip-Hop":14.1,"Indie Pop":9.5,"R&B":5.0,"Pop":6.3,"Hip-Hop":2.3,"Afrobeats":0.4,"J-Rock":1.1,"Latin":0.0},
  {year:"2025","K-Pop":21.8,"K-R&B/Hip-Hop":3.9,"Indie Pop":9.1,"R&B":10.9,"Pop":16.8,"Hip-Hop":2.9,"Afrobeats":1.8,"J-Rock":1.1,"Latin":0.1},
  {year:"2026","K-Pop":5.3,"K-R&B/Hip-Hop":1.9,"Indie Pop":4.4,"R&B":16.1,"Pop":21.1,"Hip-Hop":8.8,"Afrobeats":7.1,"J-Rock":0.3,"Latin":1.0},
];
const GENRE_LINE    = GENRE_STACKED.map(d => d.isGap ? {year:"···",...Object.fromEntries(GENRES.map(g=>[g,null]))} : d);
const DIVERSITY_DATA = [
  {year:"2014",score:54.6},{year:"2015",score:55.5},{year:"2016",score:46.5},{year:"···",score:null},
  {year:"2021",score:70.8},{year:"2022",score:74.5},{year:"2023",score:74.5},
  {year:"2024",score:77.4},{year:"2025",score:79.6},{year:"2026",score:79.6},
];
const GENRE_SHIFTS = [
  {genre:"K-Pop",        delta:-54.1,from:59.4,to:5.3, dir:"down"},
  {genre:"R&B",          delta:+15.5,from:0.6, to:16.1,dir:"up"},
  {genre:"Afrobeats",    delta:+7.1, from:0.0, to:7.1, dir:"up"},
  {genre:"Pop",          delta:-30.4,from:51.5,to:21.1,dir:"down"},
  {genre:"Hip-Hop",      delta:+5.9, from:2.9, to:8.8, dir:"up"},
  {genre:"Indie Pop",    delta:+4.3, from:0.1, to:4.4, dir:"up"},
  {genre:"K-R&B/Hip-Hop",delta:+1.9,from:0.0, to:1.9, dir:"up"},
];
const RADAR_DATA = GENRES.filter(g=>g!=="Pop").map(g=>({genre:g,"2014":GENRE_STACKED[0][g]||0,"2021":GENRE_STACKED[4][g]||0,"2022":GENRE_STACKED[5][g]||0,"2023":GENRE_STACKED[6][g]||0,"2024":GENRE_STACKED[7][g]||0,"2025":GENRE_STACKED[8][g]||0,"2026":GENRE_STACKED[9][g]||0}));

const ERA_COLOR = {2014:"#60a5fa",2015:"#60a5fa",2016:"#93c5fd",2021:"#ff6b9d",2022:"#ff6b9d",2023:"#f472b6",2024:"#a78bfa",2025:"#a78bfa",2026:"#f5a623"};
const ERA_LABEL = {2014:"western pop",2015:"western pop",2016:"transition",2021:"k-pop era",2022:"k-pop era",2023:"k-pop era",2024:"k-pop / r&b",2025:"k-pop / r&b",2026:"present"};
const TOP_ALBUMS = {
  2014:[["1989 (Deluxe)","Taylor Swift",1756],["5SOS (Deluxe)","5 Seconds of Summer",1733],["Journals","Justin Bieber",1481]],
  2015:[["Reflection","Fifth Harmony",1027],["Handwritten","Shawn Mendes",432],["Purpose","Justin Bieber",320]],
  2016:[["Mind of Mine","Zayn",256],["When It's Dark Out","G-Eazy",172],["These Things Happen","G-Eazy",158]],
  2021:[["Eyes Wide Open","TWICE",432],["Summer Nights","TWICE",318],["THE ALBUM","BLACKPINK",248]],
  2022:[["BORN PINK","BLACKPINK",436],["CRAZY IN LOVE","ITZY",305],["CHECKMATE","ITZY",204]],
  2023:[["BORN PINK","BLACKPINK",223],["UNFORGIVEN","LE SSERAFIM",156],["KILL MY DOUBT","ITZY",141]],
  2024:[["rosie","Rosé",643],["BORN TO BE","ITZY",139],["SOS","SZA",137]],
  2025:[["rosie","Rosé",562],["Ruby","Jennie",204],["SOS Deluxe: LANA","SZA",177]],
  2026:[["SWAG II","Justin Bieber",52],["Born in the Wild","Tems",50],["Love Is A Kingdom","Tems",44]],
};
const YOY_YEARS = [2014,2015,2016,"···",2021,2022,2023,2024,2025,2026];
const TOP_ARTISTS_YOY = {
  2014:[["One Direction",2657],["Justin Bieber",2527],["Fifth Harmony",2123],["Taylor Swift",2042],["Ed Sheeran",2025]],
  2015:[["Fifth Harmony",1163],["One Direction",741],["Shawn Mendes",575],["Justin Bieber",439],["Taylor Swift",384]],
  2016:[["G-Eazy",348],["Zayn",303],["Shawn Mendes",262],["The 1975",181],["Ariana Grande",158]],
  2021:[["TWICE",3477],["BLACKPINK",450],["HONNE",248],["BAEKHYUN",239],["Rosé",227]],
  2022:[["ITZY",1183],["BLACKPINK",780],["TWICE",466],["ONE OK ROCK",426],["Lauv",417]],
  2023:[["ITZY",535],["BLACKPINK",480],["LE SSERAFIM",392],["aespa",323],["Jeremy Zucker",321]],
  2024:[["Rosé",881],["LE SSERAFIM",583],["ITZY",403],["aespa",389],["NewJeans",373]],
  2025:[["Rosé",639],["Justin Bieber",431],["Emotional Oranges",375],["Jeremy Zucker",295],["Jennie",271]],
  2026:[["Justin Bieber",182],["Tems",157],["Drake",69],["The Kid LAROI",59],["Ayra Starr",57]],
};
const DISC_BAR = [
  {year:"2014",count:709},{year:"2015",count:231},{year:"2016",count:262},{year:"···",count:null},
  {year:"2021",count:629},{year:"2022",count:479},{year:"2023",count:265},
  {year:"2024",count:204},{year:"2025",count:217},{year:"2026",count:77},
];
const DISCOVERIES = [
  {year:"2014",count:709,top:["One Direction","Justin Bieber","Fifth Harmony","Taylor Swift","Ed Sheeran"]},
  {year:"2015",count:231,top:["Halsey","Tinashe","Sam Hunt","Big Sean","Carly Rae Jepsen"]},
  {year:"2016",count:262,top:["Zayn","Trey Songz","TAEYANG","Flume","The Weeknd"]},
  {year:"···", count:null,top:[]},
  {year:"2021",count:629,top:["TWICE","BLACKPINK","HONNE","BAEKHYUN","Rosé"]},
  {year:"2022",count:479,top:["NewJeans","NAYEON","Coogie","Gemini","Yena"]},
  {year:"2023",count:265,top:["JISOO","Metro Boomin","Dave","YunB","Meloh"]},
  {year:"2024",count:204,top:["Bang Yedam","LAY","VIVIZ","BSS","Chris James"]},
  {year:"2025",count:217,top:["Emotional Oranges","Tems","Ayra Starr","Baby Keem","sunkis"]},
  {year:"2026",count:77, top:["Disco Lines","Modjo","Palm Monkey","DaBaby","jaydon"]},
];



// Mainstream vs Niche drift — % of plays going to artists with 10M+ Last.fm listeners
const MAINSTREAM_DATA = [
  {year:"2014", mainstream:82, niche:18, note:"1D, Taylor, JB — pure pop monoculture"},
  {year:"2015", mainstream:78, niche:22, note:"Fifth Harmony, Shawn Mendes era"},
  {year:"2016", mainstream:65, niche:35, note:"G-Eazy, Zayn — first real drift"},
  {year:"···",  mainstream:null, niche:null, note:""},
  {year:"2021", mainstream:44, niche:56, note:"K-Pop shift brings niche majority"},
  {year:"2022", mainstream:38, niche:62, note:"Deep K-Pop catalogue dominates"},
  {year:"2023", mainstream:35, niche:65, note:"Niche peak — LE SSERAFIM, aespa"},
  {year:"2024", mainstream:30, niche:70, note:"30% mainstream — all-time low"},
  {year:"2025", mainstream:42, niche:58, note:"Rosé, Bieber pull mainstream back up"},
  {year:"2026", mainstream:55, niche:45, note:"Drake, Tems, Bieber — mainstream resurgence"},
];
// ── small ui ──────────────────────────────────────────────────────────────────
const YP = ({year}) => {
  const c=YC[String(year)]||"#888", bg=YBG[String(year)]||"rgba(128,128,128,0.1)";
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:2,background:bg,color:c,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.06em",fontWeight:600,border:`1px solid ${c}40`}}>{year}</span>;
};
const SL = ({children}) => (
  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"clamp(9px,1.8vw,10px)",letterSpacing:"0.15em",color:"#6b7280",textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
    <span style={{display:"inline-block",width:24,height:1,background:"#333"}}/>
    {children}
    <span style={{flex:1,height:1,background:"#1c1c1c"}}/>
  </div>
);
const GDot = ({g}) => <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:GC[g],flexShrink:0}}/>;

const Spinner = ({label=""}) => (
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"40px 0",color:"#333"}}>
    <svg width="16" height="16" viewBox="0 0 16 16" style={{animation:"spin 1s linear infinite"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="8" cy="8" r="6" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="20 18" strokeLinecap="round"/>
    </svg>
    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.08em"}}>{label||"fetching from last.fm"}</span>
  </div>
);

const PlainTip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#111",border:"1px solid #222",padding:"10px 14px",borderRadius:4}}>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#6b7280",marginBottom:6}}>{label}</div>
      {payload.filter(p=>p.value!=null).map(p=>(
        <div key={p.dataKey} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:p.color||p.fill,display:"inline-block"}}/>
          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#ccc"}}>{p.dataKey}: <strong style={{color:"#f0ece0"}}>{typeof p.value==="number"?p.value.toLocaleString():p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};
const GenreTip = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  const s=[...payload].filter(p=>p.value>0.05).sort((a,b)=>b.value-a.value);
  if (!s.length) return null;
  return (
    <div style={{background:"#111",border:"1px solid #222",padding:"12px 14px",borderRadius:4,maxWidth:210}}>
      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#6b7280",marginBottom:8}}>{label}</div>
      {s.map(p=>(
        <div key={p.dataKey} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:p.fill||p.stroke,display:"inline-block",flexShrink:0}}/>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#ccc"}}>{p.dataKey}</span>
          </div>
          <strong style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#f0ece0"}}>{p.value?.toFixed(1)}%</strong>
        </div>
      ))}
    </div>
  );
};
const GapTick = ({x,y,payload}) => {
  if (payload.value==="···") return <text x={x} y={y+12} textAnchor="middle" fill="#333" fontSize={14} fontFamily="'IBM Plex Mono',monospace">···</text>;
  return <text x={x} y={y+12} textAnchor="middle" fill="#777" fontSize={10} fontFamily="'IBM Plex Mono',monospace">{payload.value}</text>;
};

function fmtListeners(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1)+"M";
  if (n >= 1e3) return Math.round(n/1e3)+"K";
  return String(n);
}

// ── main ──────────────────────────────────────────────────────────────────────
export default function MusicDashboard() {
  // dates
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const yrNow     = today.getFullYear();
  const yr1       = yrNow - 1;
  const yr2       = yrNow - 2;
  const yr3       = yrNow - 3;
  const yr4       = yrNow - 4;
  const yr5       = yrNow - 5;
  const ydayLabel = yesterday.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  const monThisWk = mondayOf(today);
  const sunThisWk = new Date(monThisWk); sunThisWk.setUTCDate(monThisWk.getUTCDate()+6);

  // live state
  const [dayData,  setDayData]  = useState(null);
  const [weekData, setWeekData] = useState(null);
  const [loadErr,  setLoadErr]  = useState({});

  // static ui state
  const [monthYear, setMonthYear] = useState(null);
  const [hidden,    setHidden]    = useState(new Set());
  const [radarYr,   setRadarYr]   = useState("all");
  const [discYear,  setDiscYear]  = useState(null);
  const w = useW();

  const toggleG = g => setHidden(p=>{const n=new Set(p);n.has(g)?n.delete(g):n.add(g);return n;});

  useEffect(() => {
    // Yesterday — fetch for yrNow, yr1, yr2
    const yd0 = new Date(yesterday);
    const yd1 = new Date(yesterday); yd1.setFullYear(yr1);
    const yd2 = new Date(yesterday); yd2.setFullYear(yr2);
    const yd3 = new Date(yesterday); yd3.setFullYear(yr3);
    const yd4 = new Date(yesterday); yd4.setFullYear(yr4);
    const yd5 = new Date(yesterday); yd5.setFullYear(yr5);

    Promise.all([
      fetchDay(yd0).then(d=>[yrNow,d]),
      fetchDay(yd1).then(d=>[yr1,d]),
      fetchDay(yd2).then(d=>[yr2,d]),
      fetchDay(yd3).then(d=>[yr3,d]),
      fetchDay(yd4).then(d=>[yr4,d]),
      fetchDay(yd5).then(d=>[yr5,d]),
    ]).then(rows => {
      setDayData(Object.fromEntries(rows));
    }).catch(e => setLoadErr(p=>({...p,day:e.message})));

    // This week — same week across 3 years
    const mon0 = mondayOf(today);
    const mon1 = new Date(mon0); mon1.setFullYear(yr1);
    const mon2 = new Date(mon0); mon2.setFullYear(yr2);
    // For past years use full Sun end, for current year use today
    const end0 = today;
    const end1 = new Date(mon1); end1.setUTCDate(mon1.getUTCDate()+6);
    const end2 = new Date(mon2); mon2.setUTCDate(mon2.getUTCDate()+6); // reuse mon2 as end

    const mon3 = new Date(mon0); mon3.setFullYear(yr3);
    const end3 = new Date(mon3); end3.setUTCDate(mon3.getUTCDate()+6);
    const mon4 = new Date(mon0); mon4.setFullYear(yr4);
    const end4 = new Date(mon4); end4.setUTCDate(mon4.getUTCDate()+6);
    const mon5 = new Date(mon0); mon5.setFullYear(yr5);
    const end5 = new Date(mon5); end5.setUTCDate(mon5.getUTCDate()+6);

    Promise.all([
      fetchWeek(mon0, end0).then(d=>[yrNow,{...d,partial:true}]),
      fetchWeek(mon1, end1).then(d=>[yr1, d]),
      fetchWeek(mon2, new Date(mon2)).then(d=>[yr2, d]),
      fetchWeek(mon3, end3).then(d=>[yr3, d]),
      fetchWeek(mon4, end4).then(d=>[yr4, d]),
      fetchWeek(mon5, end5).then(d=>[yr5, d]),
    ]).then(rows => {
      setWeekData(Object.fromEntries(rows));
    }).catch(e => setLoadErr(p=>({...p,week:e.message})));


  }, []);

  const yearsOrdered = [yr5, yr4, yr3, yr2, yr1, yrNow];

  return (
    <div style={{minHeight:"100vh",background:"#080808",fontFamily:"'Syne',sans-serif",color:"#f0ece0",paddingBottom:60}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#111}::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .hov:hover{background:#181818!important;border-color:#2a2a2a!important}
        .btn:hover{opacity:1!important}
      `}</style>

      {/* HEADER */}
      <div style={{padding:w<600?"12px 12px 10px":w<900?"16px 16px 14px":"28px 36px 24px",borderBottom:"1px solid #181818",display:"flex",alignItems:w<600?"flex-start":"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:12,flexDirection:w<600?"column":"row"}}>
        <div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,letterSpacing:"0.18em",color:"#f5a62340",textTransform:"uppercase",marginBottom:8}}>last.fm · live</div>
          <h1 style={{margin:0,fontSize:w<600?18:w<900?24:36,fontWeight:800,letterSpacing:"-0.02em",lineHeight:1}}>Listening<br/><span style={{color:"#f5a623"}}>History</span></h1>
        </div>
        <div style={{display:"flex",gap:32,flexWrap:"wrap"}}>
          {[{l:"on record since",v:"2008"},{l:"total scrobbles",v:"182,000+"},{l:"yesterday",v:ydayLabel}].map(s=>(
            <div key={s.l} style={{textAlign:"right"}}>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,letterSpacing:"0.12em",color:"#555",textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:w<600?13:18,fontWeight:700}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:w<600?"14px 12px 0":w<900?"20px 16px 0":"36px 36px 0",display:"grid",gap:w<600?24:w<900?32:48}}>

        {/* ── YESTERDAY (LIVE) ── */}
        <section>
          <SL>Yesterday · {ydayLabel}</SL>
          {!dayData && !loadErr.day && <Spinner/>}
          {loadErr.day && <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#f87171",padding:"20px 0"}}>Error: {loadErr.day}</div>}
          {dayData && (
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
            <div style={{display:"grid",gridTemplateColumns:w<480?"repeat(2,minmax(130px,1fr))":w<900?"repeat(3,minmax(130px,1fr))":"repeat(6,minmax(130px,1fr))",gap:8}}>
              {yearsOrdered.map(yr=>{
                const d=dayData[yr]; const c=YC[String(yr)]||"#888";
                if (!d||d.count===0) return (
                  <div key={yr} style={{background:"#0a0a0a",border:"1px solid #161616",borderRadius:6,padding:16,borderTop:"2px solid #1e1e1e",opacity:0.4,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:140,gap:8,minWidth:0}}>
                    <YP year={yr}/>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#333",marginTop:8,textAlign:"center",lineHeight:1.8}}>no plays<br/>this date</div>
                  </div>
                );
                return (
                  <div key={yr} style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"12px 10px 10px",borderTop:`2px solid ${c}`,minWidth:0,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:16}}>
                      <YP year={yr}/>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:16,fontWeight:600,color:c}}>{d.count.toLocaleString()}</span>
                    </div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:12}}>top 3 tracks</div>
                    {d.tracks.map(([t,a],i)=>(
                      <div key={i} style={{paddingBottom:8,marginBottom:8,borderBottom:i<2?"1px solid #181818":"none"}}>
                        <div style={{fontSize:"clamp(10px,1.8vw,13px)",fontWeight:600,color:"#e8e4d8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t}</div>
                        <div style={{fontSize:11,color:"#555",fontFamily:"'IBM Plex Mono',monospace",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a}</div>
                      </div>
                    ))}
                    <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #181818"}}>
                      <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>most played</div>
                      {d.artists.map(([a,ct],i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:11,color:"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>{a}</span>
                          <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:c,flexShrink:0,marginLeft:8}}>{ct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </section>

        {/* ── THIS WEEK (LIVE) ── */}
        <section>
          <SL>This Week · {monThisWk.toLocaleDateString("en-US",{month:"short",day:"numeric"})}–{sunThisWk.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</SL>
          {!weekData && !loadErr.week && <Spinner/>}
          {loadErr.week && <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#f87171",padding:"20px 0"}}>Error: {loadErr.week}</div>}
          {weekData && (
            <div style={{display:"grid",gridTemplateColumns:w<900?"1fr":"1fr 2fr",gap:16}}>
              <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px 16px 12px"}}>
                <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:20}}>scrobbles this week</div>
                {yearsOrdered.map(yr=>{
                  const w=weekData[yr]; if (!w) return null;
                  const maxW=Math.max(...yearsOrdered.map(y=>weekData[y]?.count||0));
                  return (
                    <div key={yr} style={{marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"center"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}><YP year={yr}/>{w.partial&&<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444"}}>in progress</span>}</div>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:16,fontWeight:600,color:YC[String(yr)]}}>{w.count.toLocaleString()}</span>
                      </div>
                      <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${w.count/maxW*100}%`,background:YC[String(yr)],borderRadius:3}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px 20px 16px"}}>
                <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:20}}>top artists this week</div>
                <div style={{display:"grid",gridTemplateColumns:w<600?"repeat(2,1fr)":w<900?"repeat(3,1fr)":"repeat(6,1fr)",gap:10}}>
                  {yearsOrdered.map(yr=>{
                    const w=weekData[yr]; if (!w) return null;
                    return (
                      <div key={yr}>
                        <div style={{marginBottom:12}}><YP year={yr}/></div>
                        {w.artists.map(([a,ct],i)=>(
                          <div key={i} style={{marginBottom:8}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                              <span style={{fontSize:12,color:i===0?"#f0ece0":"#888",fontWeight:i===0?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{a}</span>
                              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:YC[String(yr)]}}>{ct}</span>
                            </div>
                            <div style={{height:2,background:"#1a1a1a",borderRadius:1}}>
                              <div style={{height:"100%",width:`${ct/w.artists[0][1]*100}%`,background:YC[String(yr)]+"60",borderRadius:1}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── MONTHLY (STATIC) ── */}
        <section>
          <SL>Monthly Listening Rhythm · 2023–2026</SL>
          <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"24px 16px 16px"}}>
            <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
              {["2023","2024","2025","2026"].map(y=>(
                <button key={y} className="btn" onClick={()=>setMonthYear(monthYear===y?null:y)}
                  style={{background:"none",border:`1px solid ${monthYear===null||monthYear===y?YC[y]:YC[y]+"30"}`,borderRadius:3,padding:"4px 12px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:monthYear===null||monthYear===y?YC[y]:YC[y]+"50",opacity:monthYear!==null&&monthYear!==y?0.35:1,transition:"all 0.2s"}}>{y}</button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_DATA} margin={{top:4,right:16,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                <XAxis dataKey="month" tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={{stroke:"#222"}} tickLine={false}/>
                <YAxis tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={false} tickLine={false} width={36}/>
                <Tooltip content={<PlainTip/>}/>
                {["2023","2024","2025","2026"].map(y=>(
                  <Line key={y} type="monotone" dataKey={y} stroke={YC[y]} strokeWidth={monthYear===null||monthYear===y?2:0.5} strokeOpacity={monthYear===null||monthYear===y?1:0.15} dot={false} connectNulls={false}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── GENRE COMPOSITION ── */}
        <section>
          <SL>Genre Composition · 2014–2026</SL>
          <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"24px 16px 20px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20,alignItems:"center"}}>
              {GENRES.map(g=>(
                <button key={g} className="btn" onClick={()=>toggleG(g)}
                  style={{display:"flex",alignItems:"center",gap:6,background:"none",border:`1px solid ${hidden.has(g)?"#1e1e1e":GC[g]+"50"}`,borderRadius:3,padding:"4px 10px",cursor:"pointer",opacity:hidden.has(g)?0.2:1,transition:"all 0.2s"}}>
                  <GDot g={g}/><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:hidden.has(g)?"#333":GC[g]}}>{g}</span>
                </button>
              ))}
            </div>
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:"30%",top:0,bottom:28,borderLeft:"1px dashed #2a2a2a",zIndex:2,pointerEvents:"none",display:"flex",alignItems:"center"}}>
                <div style={{background:"#111",border:"1px solid #222",borderRadius:3,padding:"4px 8px",whiteSpace:"nowrap",marginLeft:4}}>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#3a3a3a",letterSpacing:"0.06em"}}>2017–2020 · no data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={GENRE_STACKED} margin={{top:4,right:8,bottom:0,left:0}} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                  <XAxis dataKey="year" tick={<GapTick/>} axisLine={{stroke:"#222"}} tickLine={false}/>
                  <YAxis tickFormatter={v=>`${v}%`} tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={false} tickLine={false} width={36}/>
                  <Tooltip content={<GenreTip/>} cursor={{fill:"rgba(255,255,255,0.02)"}}/>
                  {GENRES.filter(g=>!hidden.has(g)).map(g=>(
                    <Bar key={g} dataKey={g} stackId="a" fill={GC[g]} maxBarSize={90}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:"grid",gridTemplateColumns:w<480?"1fr":w<900?"repeat(2,1fr)":"repeat(4,1fr)",gap:12,marginTop:20,paddingTop:16,borderTop:"1px solid #181818"}}>
              {[{era:"2014–15",copy:"Pure pop era. 1D, Taylor, JB dominate.",accent:"#60a5fa"},{era:"2016",copy:"Transition. Pop fades, nothing new yet.",accent:"#6b7280"},{era:"2021–24",copy:"K-Pop takeover. Up to 38% of all plays.",accent:"#ff6b9d"},{era:"2025–26",copy:"R&B, Pop, Afrobeats diversify the mix.",accent:"#34d399"}].map(({era,copy,accent})=>(
                <div key={era} style={{borderLeft:`2px solid ${accent}`,paddingLeft:12}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{era}</div>
                  <div style={{fontSize:12,color:"#bbb",lineHeight:1.5}}>{copy}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GENRE ARCS + DIVERSITY ── */}
        <section>
          <div style={{display:"grid",gridTemplateColumns:w<900?"1fr":"2fr 1fr",gap:20}}>
            <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"24px 16px 16px"}}>
              <SL>Genre Arcs</SL>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={GENRE_LINE} margin={{top:4,right:16,bottom:0,left:0}}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                  <XAxis dataKey="year" tick={<GapTick/>} axisLine={{stroke:"#222"}} tickLine={false}/>
                  <YAxis tickFormatter={v=>`${v}%`} tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={false} tickLine={false} width={36}/>
                  <Tooltip content={<GenreTip/>}/>
                  {GENRES.filter(g=>!hidden.has(g)).map(g=>(
                    <Line key={g} type="monotone" dataKey={g} stroke={GC[g]} strokeWidth={2} dot={{r:3,fill:GC[g],strokeWidth:0}} activeDot={{r:5}} connectNulls={false}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"24px 16px 20px",display:"flex",flexDirection:"column"}}>
              <SL>Listening Variety</SL>
              <div style={{fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:"#555",marginBottom:16,lineHeight:1.6}}>Spread index — 0 = one genre, 100 = balanced</div>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={DIVERSITY_DATA} margin={{top:4,right:8,bottom:0,left:0}}>
                  <defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f5a623" stopOpacity={0.25}/><stop offset="95%" stopColor="#f5a623" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                  <XAxis dataKey="year" tick={<GapTick/>} axisLine={{stroke:"#222"}} tickLine={false}/>
                  <YAxis domain={[40,85]} tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,fill:"#555"}} axisLine={false} tickLine={false} width={24}/>
                  <Tooltip content={<PlainTip/>}/>
                  <Line type="monotone" dataKey="score" stroke="#f5a623" strokeWidth={2} dot={{r:3,fill:"#f5a623",strokeWidth:0}} connectNulls={false}/>
                </LineChart>
              </ResponsiveContainer>
              <div style={{marginTop:"auto",paddingTop:16,display:"flex",flexDirection:"column",gap:8}}>
                {[{l:"2014",v:"54.6",c:"#555"},{l:"2026",v:"79.6",c:"#f5a623"}].map(({l,v,c})=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#555"}}>{l}</span>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:15,fontWeight:700,color:c}}>{v}</span>
                  </div>
                ))}
                <div style={{height:1,background:"#1c1c1c",margin:"2px 0"}}/>
                <div style={{fontSize:12,color:"#555",lineHeight:1.6}}>+25 pts. Monoculture era is over.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GENRE SHIFTS + RADAR ── */}
        <section>
          <SL>Genre Shifts · 2014 → 2026</SL>
          <div style={{display:"grid",gridTemplateColumns:w<900?"1fr":"1fr 1fr",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {GENRE_SHIFTS.map(({genre,delta,from,to,dir})=>(
                <div key={genre} style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><GDot g={genre}/><span style={{fontSize:12,fontWeight:600,color:"#e8e4d8"}}>{genre}</span></div>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:700,color:dir==="up"?"#4ade80":"#f87171"}}>{dir==="up"?"+":""}{delta.toFixed(1)}pp</span>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <div style={{flex:from,height:6,background:GC[genre],borderRadius:2,opacity:0.4,minWidth:2}}/>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",flexShrink:0}}>{from}%</span>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#333",flexShrink:0}}>→</span>
                    <div style={{flex:to,height:6,background:GC[genre],borderRadius:2,minWidth:to>0?2:0}}/>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:dir==="up"?"#4ade80":"#f87171",flexShrink:0}}>{to}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px 12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div><div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.1em"}}>Genre Fingerprint</div><div style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:"#333",marginTop:2}}>Pop excluded — see stacked bar above</div></div>
                <div style={{display:"flex",gap:8}}>
                  {["all","2014","2021","2022","2023","2024","2025","2026"].map(y=>(
                    <button key={y} className="btn" onClick={()=>setRadarYr(y)}
                      style={{background:"none",border:`1px solid ${radarYr===y?(y==="all"?"#f0ece0":YC[y]||"#444"):"#222"}`,borderRadius:3,padding:"3px 8px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:radarYr===y?(y==="all"?"#f0ece0":YC[y]||"#f0ece0"):"#555",transition:"all 0.2s"}}>{y==="all"?"overlay":y}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:10,marginBottom:4,minHeight:18,flexWrap:"wrap"}}>
                {radarYr==="all"
                  ? ["2014","2021","2022","2023","2024","2025","2026"].map(y=>(
                      <div key={y} style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{width:10,height:2,background:YC[y],display:"inline-block"}}/><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:YC[y]}}>{y}</span>
                      </div>
                    ))
                  : radarYr&&YC[radarYr]&&(
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:16,height:2,background:YC[radarYr],display:"inline-block"}}/><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:YC[radarYr]}}>{radarYr}</span>
                      </div>
                    )
                }
              </div>
              <ResponsiveContainer width="100%" height={310}>
                <RadarChart data={RADAR_DATA} margin={{top:10,right:28,bottom:10,left:28}}>
                  <PolarGrid stroke="#1e1e1e"/>
                  <PolarAngleAxis dataKey="genre" tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,fill:"#666"}}/>
                  <PolarRadiusAxis angle={30} domain={[0,25]} tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,fill:"#333"}} tickCount={3} tickFormatter={v=>`${v}%`}/>
                  {["2014","2021","2022","2023","2024","2025","2026"].filter(y=>radarYr==="all"||radarYr===y).map(y=>(
                    <Radar key={y} name={y} dataKey={y} stroke={YC[y]||"#888"} fill={YC[y]||"#888"} fillOpacity={radarYr==="all"?0.08:0.15} strokeWidth={radarYr==="all"?1.5:2}/>
                  ))}
                  <Tooltip content={<GenreTip/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ── TOP ALBUMS ── */}
        <section>
          <SL>Top Albums · Rolling by Year</SL>
          <div style={{display:"grid",gridTemplateColumns:w<600?"1fr":w<900?"repeat(2,1fr)":"repeat(3,1fr)",gap:12}}>
            {Object.entries(TOP_ALBUMS).map(([yr,albums])=>{
              const y=Number(yr); const col=ERA_COLOR[y]; const lbl=ERA_LABEL[y];
              return (
                <div key={yr} className="hov" style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"14px 14px 12px",transition:"all 0.2s",borderTop:`2px solid ${col}22`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:600,color:col}}>{yr}</span>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#444",textTransform:"uppercase",letterSpacing:"0.08em"}}>{lbl}</span>
                  </div>
                  <div style={{height:1,background:"#1c1c1c",marginBottom:12}}/>
                  {albums.map(([album,artist,count],i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<2?10:0,paddingBottom:i<2?10:0,borderBottom:i<2?"1px solid #181818":"none"}}>
                      <div style={{width:20,height:20,borderRadius:3,background:`${col}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:col,fontWeight:600}}>{i+1}</span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#e8e4d8",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{album}</div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:3}}>
                          <div style={{fontSize:11,color:"#666",fontFamily:"'IBM Plex Mono',monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"75%"}}>{artist}</div>
                          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:col,flexShrink:0}}>{count.toLocaleString()}</div>
                        </div>
                        <div style={{height:2,background:"#1a1a1a",borderRadius:1,marginTop:5}}>
                          <div style={{height:"100%",width:`${count/albums[0][2]*100}%`,background:`${col}50`,borderRadius:1}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── MAINSTREAM VS NICHE DRIFT ── */}
        <section>
          <SL>Mainstream vs Niche Drift · 2014–2026</SL>
          <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"24px 20px 20px"}}>
            <div style={{fontSize:12,color:"#555",lineHeight:1.7,marginBottom:20,fontFamily:"'IBM Plex Mono',monospace"}}>
              % of plays going to mainstream artists (10M+ Last.fm listeners) vs niche. 2014–2016: ~65–82% mainstream. By 2024: 30%.
            </div>
            <div style={{display:"flex",gap:20,marginBottom:16,flexWrap:"wrap"}}>
              {[["Mainstream","#60a5fa"],["Niche","#a78bfa"]].map(([l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:16,height:3,background:c,display:"inline-block",borderRadius:2}}/>
                  <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:c,letterSpacing:"0.08em"}}>{l}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MAINSTREAM_DATA} margin={{top:4,right:16,bottom:0,left:0}}>
                <defs>
                  <linearGradient id="gMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gNiche" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                <XAxis dataKey="year" tick={<GapTick/>} axisLine={{stroke:"#222"}} tickLine={false}/>
                <YAxis tickFormatter={v => v + "%"} tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={false} tickLine={false} width={36} domain={[0,100]}/>
                <Tooltip content={<PlainTip/>}/>
                <Area type="monotone" dataKey="mainstream" stroke="#60a5fa" strokeWidth={2} fill="url(#gMain)" dot={{r:3,fill:"#60a5fa",strokeWidth:0}} connectNulls={false}/>
                <Area type="monotone" dataKey="niche" stroke="#a78bfa" strokeWidth={2} fill="url(#gNiche)" dot={{r:3,fill:"#a78bfa",strokeWidth:0}} connectNulls={false}/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"grid",gridTemplateColumns:w<900?"1fr":"repeat(3,1fr)",gap:12,marginTop:20,paddingTop:16,borderTop:"1px solid #181818"}}>
              {[
                {era:"2014–16",stat:"65–82%",label:"mainstream",color:"#60a5fa",note:"Pop monoculture. Almost no niche listening."},
                {era:"2023–24",stat:"30–35%",label:"mainstream",color:"#a78bfa",note:"K-Pop deep cuts hit niche majority."},
                {era:"2025–26",stat:"42–55%",label:"mainstream",color:"#f5a623",note:"Bieber, Tems pull the needle back."},
              ].map(({era,stat,label,color,note})=>(
                <div key={era} style={{borderLeft:"2px solid " + color + "50",paddingLeft:12}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{era}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:18,fontWeight:700,color:color,marginBottom:4}}>{stat}</div>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{label}</div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.5}}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEW DISCOVERIES ── */}
        <section>
          <SL>New Artist Discoveries · Per Year</SL>
          <div style={{display:"grid",gridTemplateColumns:w<900?"1fr":"3fr 2fr",gap:20}}>
            <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px 16px 16px"}}>
              <div style={{fontSize:11,fontFamily:"'IBM Plex Mono',monospace",color:"#555",marginBottom:16}}>Artists heard for the first time — click a bar</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DISC_BAR} margin={{top:4,right:8,bottom:0,left:0}} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false}/>
                  <XAxis dataKey="year" tick={<GapTick/>} axisLine={{stroke:"#222"}} tickLine={false}/>
                  <YAxis tick={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fill:"#555"}} axisLine={false} tickLine={false} width={36}/>
                  <Tooltip content={<PlainTip/>}/>
                  <Bar dataKey="count" radius={[3,3,0,0]} maxBarSize={60} cursor="pointer" onClick={d=>setDiscYear(discYear===d.year?null:d.year)}>
                    {DISC_BAR.map(d=>{
                      const col=d.year==="···"?"#111":d.year<="2016"?"#60a5fa":d.year<="2023"?"#ff6b9d":d.year<="2025"?"#a78bfa":"#f5a623";
                      return <Cell key={d.year} fill={discYear===d.year?col:col+"60"} stroke={discYear===d.year?col:"none"} strokeWidth={1}/>;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px"}}>
              {!discYear ? (
                <div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center",alignItems:"center",gap:8}}>
                  <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#2a2a2a",textTransform:"uppercase",letterSpacing:"0.1em"}}>click a bar</div>
                  <div style={{fontSize:12,color:"#222",textAlign:"center",lineHeight:1.6}}>to see top new<br/>artist finds</div>
                </div>
              ) : (()=>{
                const entry = DISCOVERIES.find(d=>d.year===discYear);
                if (!entry||!entry.count) return null;
                const col=discYear<="2016"?"#60a5fa":discYear<="2023"?"#ff6b9d":discYear<="2025"?"#a78bfa":"#f5a623";
                return (
                  <div>
                    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:16}}>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,fontWeight:600,color:"#f0ece0"}}>{entry.year}</span>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#555"}}>{entry.count.toLocaleString()} new</span>
                    </div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>top new finds</div>
                    {entry.top.map((a,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<4?"1px solid #181818":"none"}}>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:col,width:16}}>{i+1}</span>
                        <span style={{fontSize:13,color:"#e8e4d8",fontWeight:i===0?600:400}}>{a}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* ── TOP ARTISTS YOY ── */}
        <section>
          <SL>Top 5 Artists · Year Over Year · 2014–2026</SL>
          <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",borderRadius:6,padding:"20px",overflowX:"auto"}}>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${YOY_YEARS.length},1fr)`,gap:3,minWidth:700}}>
              {YOY_YEARS.map(yr=>{
                if (yr==="···") return (
                  <div key="gap" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0",gap:4}}>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:14,color:"#222"}}>···</div>
                    <div style={{width:1,flex:1,background:"#1a1a1a"}}/>
                  </div>
                );
                const data=TOP_ARTISTS_YOY[yr], maxV=data[0][1];
                const c=yr<=2016?"#60a5fa":yr<=2023?"#ff6b9d":yr<=2025?"#a78bfa":"#f5a623";
                return (
                  <div key={yr}>
                    <div style={{padding:"10px 8px 8px",marginBottom:2}}>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:c,fontWeight:600}}>{yr}</span>
                    </div>
                    {data.map(([a,ct],i)=>(
                      <div key={i} style={{padding:"6px 8px",marginBottom:2,borderRadius:3,background:`${c}${Math.round(ct/maxV*18+3).toString(16).padStart(2,"0")}`,display:"flex",flexDirection:"column",gap:2}}>
                        <span style={{fontSize:11,color:"#ccc",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a}</span>
                        <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:c}}>{ct.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
