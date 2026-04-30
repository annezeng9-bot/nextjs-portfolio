'use client';
import { useState } from 'react';
import styles from './jalen.module.css';

const JALEN_DATA = [
  { team: "Oklahoma City Thunder",  abbr: "OKC", jalens: [{ name: "Jalen Williams", winShares: 6.2, allStar: false }, { name: "Jaylin Williams", winShares: 3.4, allStar: false }], record: "64-18", wins: 64, seed: "W1" },
  { team: "San Antonio Spurs",      abbr: "SAS", jalens: [], record: "62-20", wins: 62, seed: "W2" },
  { team: "Detroit Pistons",        abbr: "DET", jalens: [{ name: "Jalen Duren",   winShares: 9.1, allStar: true  }], record: "60-22", wins: 60, seed: "E1" },
  { team: "Boston Celtics",         abbr: "BOS", jalens: [{ name: "Jaylen Brown",   winShares: 11.4, allStar: true  }], record: "56-26", wins: 56, seed: "E2" },
  { team: "Denver Nuggets",         abbr: "DEN", jalens: [{ name: "Jalen Pickett", winShares: 0.7, allStar: false }], record: "54-28", wins: 54, seed: "W3" },
  { team: "Los Angeles Lakers",     abbr: "LAL", jalens: [], record: "53-29", wins: 53, seed: "W4" },
  { team: "New York Knicks",        abbr: "NYK", jalens: [{ name: "Jalen Brunson", winShares: 10.8, allStar: true  }], record: "53-29", wins: 53, seed: "E3" },
  { team: "Cleveland Cavaliers",    abbr: "CLE", jalens: [{ name: "Jaylon Tyson",  winShares: 4.6, allStar: false }], record: "52-30", wins: 52, seed: "E4" },
  { team: "Houston Rockets",        abbr: "HOU", jalens: [{ name: "Jalen Green",   winShares: 5.1, allStar: false }], record: "52-30", wins: 52, seed: "W5" },
  { team: "Minnesota Timberwolves", abbr: "MIN", jalens: [{ name: "Jaylen Clark",  winShares: 1.2, allStar: false }], record: "49-33", wins: 49, seed: "W6" },
  { team: "Toronto Raptors",        abbr: "TOR", jalens: [], record: "46-36", wins: 46, seed: "E5" },
  { team: "Atlanta Hawks",          abbr: "ATL", jalens: [{ name: "Jalen Johnson", winShares: 8.8, allStar: true  }], record: "46-36", wins: 46, seed: "E6" },
  { team: "Philadelphia 76ers",     abbr: "PHI", jalens: [{ name: "Jalen Carter",  winShares: 4.2, allStar: false }], record: "45-37", wins: 45, seed: "E7" },
  { team: "Phoenix Suns",           abbr: "PHX", jalens: [], record: "45-37", wins: 45, seed: "W7" },
  { team: "Orlando Magic",          abbr: "ORL", jalens: [{ name: "Jalen Suggs",   winShares: 4.3, allStar: false }], record: "45-37", wins: 45, seed: "E8" },
  { team: "Charlotte Hornets",      abbr: "CHO", jalens: [], record: "44-38", wins: 44, seed: "E9" },
  { team: "Miami Heat",             abbr: "MIA", jalens: [], record: "43-39", wins: 43, seed: "E10" },
  { team: "Portland Trail Blazers", abbr: "POR", jalens: [], record: "42-40", wins: 42, seed: "W8" },
  { team: "Los Angeles Clippers",   abbr: "LAC", jalens: [], record: "42-40", wins: 42, seed: "W9" },
  { team: "Golden State Warriors",  abbr: "GSW", jalens: [], record: "37-45", wins: 37, seed: "W10" },
  { team: "Milwaukee Bucks",        abbr: "MIL", jalens: [], record: "32-50", wins: 32, seed: "E11" },
  { team: "Chicago Bulls",          abbr: "CHI", jalens: [{ name: "Jalen Smith",   winShares: 2.9, allStar: false }], record: "31-51", wins: 31, seed: "E12" },
  { team: "New Orleans Pelicans",   abbr: "NOP", jalens: [], record: "26-56", wins: 26, seed: "W11" },
  { team: "Dallas Mavericks",       abbr: "DAL", jalens: [], record: "26-56", wins: 26, seed: "W12" },
  { team: "Memphis Grizzlies",      abbr: "MEM", jalens: [{ name: "Jaylen Wells",  winShares: 3.1, allStar: false }], record: "25-57", wins: 25, seed: "W13" },
  { team: "Sacramento Kings",       abbr: "SAC", jalens: [], record: "22-60", wins: 22, seed: "W14" },
  { team: "Utah Jazz",              abbr: "UTA", jalens: [], record: "22-60", wins: 22, seed: "W15" },
  { team: "Brooklyn Nets",          abbr: "BKN", jalens: [{ name: "Jalen Wilson",  winShares: 0.4, allStar: false }], record: "20-62", wins: 20, seed: "E13" },
  { team: "Indiana Pacers",         abbr: "IND", jalens: [], record: "19-63", wins: 19, seed: "E14" },
  { team: "Washington Wizards",     abbr: "WAS", jalens: [], record: "17-65", wins: 17, seed: "E15" },
];

function totalWS(t: typeof JALEN_DATA[0]) { return t.jalens.reduce((s, j) => s + j.winShares, 0); }
function avg(arr: typeof JALEN_DATA) { return arr.length ? +(arr.reduce((s, t) => s + t.wins, 0) / arr.length).toFixed(1) : 0; }

const g0 = JALEN_DATA.filter(t => t.jalens.length === 0);
const g1 = JALEN_DATA.filter(t => t.jalens.length === 1);
const g2 = JALEN_DATA.filter(t => t.jalens.length === 2);
const AVG = { 0: avg(g0), 1: avg(g1), 2: avg(g2) };

function InkBar({ wins, max = 64 }: { wins: number; max?: number }) {
  const pct = Math.min((wins / max) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "3px 0" }}>
      <div style={{ flex: 1, height: 5, background: "#e8e0d0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "#1a1a1a" }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: "'Playfair Display', serif", fontWeight: 700, minWidth: 28, textAlign: "right", color: "#1a1a1a" }}>{wins}</span>
    </div>
  );
}

function Rule({ style }: { style?: React.CSSProperties }) {
  return <div style={{ borderTop: "1px solid #1a1a1a", width: "100%", ...style }} />;
}
function DoubleRule({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <div style={{ borderTop: "3px solid #1a1a1a" }} />
      <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 2 }} />
    </div>
  );
}

function TeamRow({ team, rank }: { team: typeof JALEN_DATA[0]; rank: number }) {
  const n  = team.jalens.length;
  const ws = totalWS(team);
  const label = n === 2 ? "**" : n === 1 ? "*" : "o";
  const labelColor = n === 2 ? "#c0392b" : n === 1 ? "#555" : "#bbb";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "22px 22px 1fr 60px 52px 52px", gap: 6, alignItems: "center", padding: "5px 0", borderBottom: "1px solid #d4c9b5", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
      <span style={{ color: "#999", textAlign: "right" }}>{rank}</span>
      <span style={{ textAlign: "center", fontSize: 13, color: labelColor, lineHeight: 1 }}>{label}</span>
      <div>
        <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 11, fontFamily: "'Playfair Display', serif" }}>{team.team}</div>
        {n > 0 && (
          <div style={{ fontSize: 9, color: "#777", marginTop: 1 }}>
            {team.jalens.map((j, i) => <span key={j.name}>{j.allStar ? "* " : ""}{j.name}{i < team.jalens.length - 1 ? ", " : ""}</span>)}
          </div>
        )}
      </div>
      <div style={{ textAlign: "right" }}><InkBar wins={team.wins} /></div>
      <span style={{ textAlign: "center", color: "#444" }}>{team.record}</span>
      <span style={{ textAlign: "right", color: n > 0 ? "#1a1a1a" : "#bbb", fontWeight: n > 0 ? 600 : 400 }}>{n > 0 ? ws.toFixed(1) : "-"}</span>
    </div>
  );
}

export default function JalenPage() {
  const [sortKey, setSortKey] = useState("wins");
  const [filter,  setFilter]  = useState("all");

  const filtered = JALEN_DATA.filter(t => filter === "all" ? true : t.jalens.length === parseInt(filter));
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "wins")  return b.wins - a.wins;
    if (sortKey === "ws")    return totalWS(b) - totalWS(a);
    if (sortKey === "count") return b.jalens.length - a.jalens.length;
    return 0;
  });

  const maxWS   = Math.max(...JALEN_DATA.map(totalWS));
  const maxWins = 64;

  return (
    <div className={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Playfair+Display+SC:wght@700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>

      <div className={styles.header}>
        <a href="/data" className={styles.back}>Projects</a>
        <p className={styles.label}>Data</p>
        <h1 className={styles.title}>Jalen Tracker</h1>
      </div>

      <div className={styles.window}>
        <div className={styles.windowBody}>

          {/* Masthead */}
          <div style={{ paddingTop: 36, paddingBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: 5, fontFamily: "'IBM Plex Mono', monospace", color: "#888", marginBottom: 10, textTransform: "uppercase" }}>
              The Jalen Gazette &nbsp;&middot;&nbsp; NBA Analytics Bureau &nbsp;&middot;&nbsp; Vol. IV, No. 26 &nbsp;&middot;&nbsp; Apr. 13, 2026
            </div>
            <DoubleRule style={{ marginBottom: 14 }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(40px, 8vw, 96px)", lineHeight: 0.9, letterSpacing: -2, color: "#1a1a1a" }}>
              The Jalen<br />
              <span style={{ fontStyle: "italic" }}>Effect</span>
            </h1>
            <DoubleRule style={{ marginTop: 14, marginBottom: 12 }} />
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "italic", fontSize: "clamp(13px, 2vw, 16px)", color: "#444", maxWidth: 560, margin: "0 auto", lineHeight: 1.5 }}>
              It started with Jalen Rose. The Michigan Fab Five guard who turned his first name into a cultural footprint so large that the NBA has never quite recovered. Since Rose suited up in 1994, the league has seen a quiet but undeniable proliferation of Jalens -- each one seemingly compelled by birthright to play basketball at the highest level. This is a rigorous, data-driven investigation into whether the name itself carries winning DNA, or whether we are simply pattern-matching our way into believing something beautiful.
            </p>
          </div>

          {/* Scatter plot */}
          <Rule style={{ margin: "24px 0" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, marginBottom: 14 }}>
            Win Shares vs. Team Wins
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 200, paddingRight: 6 }}>
              {[64, 48, 32, 16].map(v => (
                <span key={v} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999" }}>{v}W</span>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative", height: 200, background: "#ede8de", border: "1px solid #c8bfaa" }}>
              {[0,25,50,75,100].map(p => (
                <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, borderLeft: "1px solid #d5cfc3" }} />
              ))}
              {[0,25,50,75,100].map(p => (
                <div key={p} style={{ position: "absolute", top: `${p}%`, left: 0, right: 0, borderTop: "1px solid #d5cfc3" }} />
              ))}
              {JALEN_DATA.map(team => {
                const ws = totalWS(team);
                const n  = team.jalens.length;
                const cx = maxWS > 0 ? (ws / maxWS) * 92 + 2 : 2;
                const cy = 94 - (team.wins / maxWins) * 88;
                const sz = n === 2 ? 13 : n === 1 ? 9 : 7;
                const fill = n === 2 ? "#c0392b" : n === 1 ? "#1a1a1a" : "none";
                return (
                  <div key={team.abbr} title={`${team.team} | ${team.wins}W | ${ws.toFixed(1)} Jalen WS`} style={{ position: "absolute", left: `${cx}%`, top: `${cy}%`, transform: "translate(-50%,-50%)", width: sz, height: sz, borderRadius: "50%", background: fill, border: `1.5px solid ${n === 0 ? "#999" : fill}` }} />
                );
              })}
            </div>
          </div>
          <div style={{ marginLeft: 36, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["0 WS", "4 WS", "8 WS", "12+ WS"].map(l => (
              <span key={l} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999" }}>{l}</span>
            ))}
          </div>

          <Rule style={{ margin: "24px 0 0" }} />

          {/* Standings table */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22 }}>Full League Standings</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 0, border: "1px solid #1a1a1a" }}>
                  {[{k:"all",l:"All"},{k:"2",l:"2 Jalens"},{k:"1",l:"1 Jalen"},{k:"0",l:"None"}].map((f, i) => (
                    <button key={f.k} onClick={() => setFilter(f.k)} style={{ background: filter===f.k ? "#1a1a1a" : "transparent", border: "none", borderLeft: i > 0 ? "1px solid #1a1a1a" : "none", padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: filter===f.k ? "#f5f0e8" : "#1a1a1a", letterSpacing: 0.5, cursor: "pointer" }}>{f.l}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 0, border: "1px solid #1a1a1a" }}>
                  {[{k:"wins",l:"Wins"},{k:"ws",l:"Win Shares"},{k:"count",l:"Jalens"}].map((s, i) => (
                    <button key={s.k} onClick={() => setSortKey(s.k)} style={{ background: sortKey===s.k ? "#c0392b" : "transparent", border: "none", borderLeft: i > 0 ? "1px solid #1a1a1a" : "none", padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: sortKey===s.k ? "#fff" : "#1a1a1a", letterSpacing: 0.5, cursor: "pointer" }}>{s.l}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "22px 22px 1fr 60px 52px 52px", gap: 6, padding: "4px 0 6px", borderBottom: "2px solid #1a1a1a", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
              <span style={{ textAlign: "right" }}>#</span>
              <span style={{ textAlign: "center" }}>J</span>
              <span>Team</span>
              <span style={{ textAlign: "right" }}>Wins</span>
              <span style={{ textAlign: "center" }}>Record</span>
              <span style={{ textAlign: "right" }}>WS</span>
            </div>
            {sorted.map((team, i) => <TeamRow key={team.abbr} team={team} rank={i + 1} />)}
          </div>

          {/* Avg wins bar chart */}
          <Rule style={{ margin: "32px 0 24px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, marginBottom: 14 }}>Average Wins by Jalen Count</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "2 Jalens", avg: AVG[2], count: g2.length, accent: true },
              { label: "1 Jalen",  avg: AVG[1], count: g1.length, accent: false },
              { label: "0 Jalens", avg: AVG[0], count: g0.length, accent: false },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: row.accent ? "#c0392b" : "#1a1a1a" }}>{row.label}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#888" }}>{row.avg} avg &middot; {row.count} team{row.count !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ height: 22, background: "#e8e0d0", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(row.avg / 64) * 100}%`, background: row.accent ? "#c0392b" : "#1a1a1a" }} />
                  <span style={{ position: "absolute", left: `${(row.avg / 64) * 100 + 1}%`, top: "50%", transform: "translateY(-50%)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", fontWeight: 600 }}>{row.avg}W</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <DoubleRule style={{ margin: "32px 0 16px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999", letterSpacing: 1, flexWrap: "wrap", gap: 6 }}>
            <span>* DENOTES ALL-STAR &nbsp;&middot;&nbsp; ** = 2 JALENS &nbsp;&middot;&nbsp; * = 1 JALEN &nbsp;&middot;&nbsp; o = NONE</span>
            <span>WIN SHARES ARE SEASON-TO-DATE ESTIMATES &nbsp;&middot;&nbsp; FINAL STANDINGS · 2025–26 REGULAR SEASON</span>
          </div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontStyle: "italic", fontSize: 13, color: "#aaa", marginTop: 28, lineHeight: 1.7 }}>
            Please note: If it&apos;s not blatantly clear, this is not an actual scientific analysis on the impact of Jalens on an NBA roster. But maybe naming your son Jalen improves his chances of making it to the NBA.
          </p>

        </div>
      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Anne Zeng. All rights reserved.</p>
      </footer>
    </div>
  );
}
