import { useState } from "react";

const JALEN_DATA = [
  { team: "Oklahoma City Thunder", abbr: "OKC", jalens: [{ name: "Jalen Williams", winShares: 6.2, allStar: false }, { name: "Jaylin Williams", winShares: 3.4, allStar: false }], record: "55–15", wins: 55, seed: "W1" },
  { team: "Detroit Pistons",        abbr: "DET", jalens: [{ name: "Jalen Duren",   winShares: 9.1, allStar: true  }], record: "51–19", wins: 51, seed: "E1" },
  { team: "Boston Celtics",         abbr: "BOS", jalens: [{ name: "Jaylen Brown",   winShares: 11.4, allStar: true  }], record: "47–23", wins: 47, seed: "E2" },
  { team: "New York Knicks",        abbr: "NYK", jalens: [{ name: "Jalen Brunson", winShares: 10.8, allStar: true  }], record: "46–25", wins: 46, seed: "E3" },
  { team: "San Antonio Spurs",      abbr: "SAS", jalens: [], record: "52–18", wins: 52, seed: "W2" },
  { team: "Los Angeles Lakers",     abbr: "LAL", jalens: [], record: "45–25", wins: 45, seed: "W3" },
  { team: "Houston Rockets",        abbr: "HOU", jalens: [{ name: "Jalen Green",   winShares: 5.1, allStar: false }], record: "42–27", wins: 42, seed: "W4" },
  { team: "Denver Nuggets",         abbr: "DEN", jalens: [{ name: "Jalen Pickett", winShares: 0.7, allStar: false }], record: "43–28", wins: 43, seed: "W5" },
  { team: "Minnesota Timberwolves", abbr: "MIN", jalens: [{ name: "Jaylen Clark",  winShares: 1.2, allStar: false }], record: "43–28", wins: 43, seed: "W6" },
  { team: "Cleveland Cavaliers",    abbr: "CLE", jalens: [{ name: "Jaylon Tyson",  winShares: 4.6, allStar: false }], record: "43–27", wins: 43, seed: "E4" },
  { team: "Toronto Raptors",        abbr: "TOR", jalens: [], record: "39–30", wins: 39, seed: "E5" },
  { team: "Phoenix Suns",           abbr: "PHX", jalens: [{ name: "Jalen Green",   winShares: 5.1, allStar: false }], record: "39–31", wins: 39, seed: "W7" },
  { team: "Atlanta Hawks",          abbr: "ATL", jalens: [{ name: "Jalen Johnson", winShares: 8.8, allStar: true  }], record: "38–32", wins: 38, seed: "E7" },
  { team: "Orlando Magic",          abbr: "ORL", jalens: [{ name: "Jalen Suggs",   winShares: 4.3, allStar: false }], record: "38–31", wins: 38, seed: "E6" },
  { team: "Golden State Warriors",  abbr: "GSW", jalens: [], record: "33–37", wins: 33, seed: "W10" },
  { team: "Memphis Grizzlies",      abbr: "MEM", jalens: [{ name: "Jaylen Wells",  winShares: 3.1, allStar: false }], record: "24–45", wins: 24, seed: "W12" },
  { team: "Chicago Bulls",          abbr: "CHI", jalens: [{ name: "Jalen Smith",   winShares: 2.9, allStar: false }], record: "28–42", wins: 28, seed: "E12" },
  { team: "Washington Wizards",     abbr: "WAS", jalens: [], record: "16–53", wins: 16, seed: "E14" },
  { team: "Brooklyn Nets",          abbr: "BKN", jalens: [{ name: "Jalen Wilson",  winShares: 0.4, allStar: false }], record: "17–53", wins: 17, seed: "E13" },
  { team: "Indiana Pacers",         abbr: "IND", jalens: [], record: "15–55", wins: 15, seed: "E15" },
];

function totalWS(t) { return t.jalens.reduce((s, j) => s + j.winShares, 0); }
function avg(arr) { return arr.length ? +(arr.reduce((s, t) => s + t.wins, 0) / arr.length).toFixed(1) : 0; }

const g0 = JALEN_DATA.filter(t => t.jalens.length === 0);
const g1 = JALEN_DATA.filter(t => t.jalens.length === 1);
const g2 = JALEN_DATA.filter(t => t.jalens.length === 2);
const AVG = { 0: avg(g0), 1: avg(g1), 2: avg(g2) };

// Horizontal bar, newspaper style
function InkBar({ wins, max = 55, thick = false }) {
  const pct = Math.min((wins / max) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "3px 0" }}>
      <div style={{ flex: 1, height: thick ? 8 : 5, background: "#e8e0d0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "#1a1a1a" }} />
      </div>
      <span style={{ fontSize: thick ? 13 : 11, fontFamily: "'Playfair Display', serif", fontWeight: 700, minWidth: 28, textAlign: "right", color: "#1a1a1a" }}>{wins}</span>
    </div>
  );
}

// Inline divider rule
function Rule({ style }) {
  return <div style={{ borderTop: "1px solid #1a1a1a", width: "100%", ...style }} />;
}
function ThickRule({ style }) {
  return <div style={{ borderTop: "3px solid #1a1a1a", width: "100%", ...style }} />;
}
function DoubleRule({ style }) {
  return (
    <div style={{ ...style }}>
      <div style={{ borderTop: "3px solid #1a1a1a" }} />
      <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 2 }} />
    </div>
  );
}

// Team row for the standings table
function TeamRow({ team, rank }) {
  const n  = team.jalens.length;
  const ws = totalWS(team);
  const label = n === 2 ? "●●" : n === 1 ? "●" : "○";
  const labelColor = n === 2 ? "#c0392b" : n === 1 ? "#555" : "#bbb";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "22px 22px 1fr 60px 52px 52px",
      gap: 6,
      alignItems: "center",
      padding: "5px 0",
      borderBottom: "1px solid #d4c9b5",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
    }}>
      <span style={{ color: "#999", textAlign: "right" }}>{rank}</span>
      <span style={{ textAlign: "center", fontSize: 13, color: labelColor, lineHeight: 1 }}>{label}</span>
      <div>
        <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: 11, fontFamily: "'Playfair Display', serif" }}>{team.team}</div>
        {n > 0 && (
          <div style={{ fontSize: 9, color: "#777", marginTop: 1 }}>
            {team.jalens.map((j, i) => <span key={j.name}>{j.allStar ? "✦ " : ""}{j.name}{i < team.jalens.length - 1 ? ", " : ""}</span>)}
          </div>
        )}
      </div>
      <div style={{ textAlign: "right" }}>
        <InkBar wins={team.wins} />
      </div>
      <span style={{ textAlign: "center", color: "#444" }}>{team.record}</span>
      <span style={{ textAlign: "right", color: n > 0 ? "#1a1a1a" : "#bbb", fontWeight: n > 0 ? 600 : 400 }}>
        {n > 0 ? ws.toFixed(1) : "—"}
      </span>
    </div>
  );
}

export default function JalenDashboard() {
  const [sortKey, setSortKey] = useState("wins");
  const [filter,  setFilter]  = useState("all");

  const filtered = JALEN_DATA.filter(t =>
    filter === "all" ? true : t.jalens.length === parseInt(filter)
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "wins")  return b.wins - a.wins;
    if (sortKey === "ws")    return totalWS(b) - totalWS(a);
    if (sortKey === "count") return b.jalens.length - a.jalens.length;
    return 0;
  });

  const maxWS   = Math.max(...JALEN_DATA.map(totalWS));
  const maxWins = 55;

  return (
    <div style={{ background: "#f5f0e8", minHeight: "100vh", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Playfair+Display+SC:wght@700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 60px" }}>

        {/* ── Masthead ── */}
        <div style={{ paddingTop: 36, paddingBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: 5, fontFamily: "'IBM Plex Mono', monospace", color: "#888", marginBottom: 10, textTransform: "uppercase" }}>
            The Jalen Gazette &nbsp;·&nbsp; NBA Analytics Bureau &nbsp;·&nbsp; Vol. IV, No. 26 &nbsp;·&nbsp; Mar. 28, 2026
          </div>
          <DoubleRule style={{ marginBottom: 14 }} />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: "clamp(52px, 10vw, 108px)",
            lineHeight: 0.9,
            letterSpacing: -2,
            color: "#1a1a1a",
          }}>
            THE<br /><span style={{ fontStyle: "italic", color: "#c0392b" }}>JALEN</span><br />EFFECT
          </h1>
          <DoubleRule style={{ marginTop: 14, marginBottom: 10 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: "#666", letterSpacing: 1 }}>
            <span>2025–26 NBA REGULAR SEASON</span>
            <span>WIN SHARE ANALYSIS</span>
            <span>ALL SPELLINGS INCLUDED</span>
          </div>
          <Rule style={{ marginTop: 10 }} />
        </div>

        {/* ── Three-column intro ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2px 1fr 2px 1fr", gap: 0, marginTop: 20 }}>

          {/* col 1 */}
          <div style={{ paddingRight: 20 }}>
            <div style={{ fontFamily: "'Playfair Display SC', serif", fontSize: 10, letterSpacing: 2, color: "#888", marginBottom: 8 }}>The Question</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, lineHeight: 1.75, color: "#2a2a2a" }}>
              Does having a Jalen on your roster make you win more basketball games? Correlation is obviously causation so we're here to make some definitive claims on how many Jalens NBA teams should be recruiting for their team.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, lineHeight: 1.75, color: "#2a2a2a", marginTop: 10 }}>
              For this "analysis", I examined every team in the 2025–26 NBA season, aggregating Win Shares for players named Jalen, Jaylen, Jaylin, or Jaylon. Individual statistics clearly do not matter. Only the count of Jalens and their combined contribution to team wins is examined.
            </p>
          </div>

          {/* divider */}
          <div style={{ background: "#1a1a1a", width: 1, margin: "0 20px" }} />

          {/* col 2 — pull stat */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 20px", textAlign: "center", borderLeft: "none" }}>
            <div style={{ fontFamily: "'Playfair Display SC', serif", fontSize: 10, letterSpacing: 2, color: "#888", marginBottom: 12 }}>The Finding</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 72, color: "#c0392b", lineHeight: 1, letterSpacing: -2 }}>
              +{(AVG[2] - AVG[0]).toFixed(0)}
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "#444", marginTop: 6 }}>
              wins gained,<br />0 to 2 Jalens
            </div>
            <Rule style={{ margin: "14px 0", borderColor: "#aaa" }} />
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#888", letterSpacing: 1, lineHeight: 1.7 }}>
              0 JALENS · AVG {AVG[0]} WINS<br />
              1 JALEN &nbsp;· AVG {AVG[1]} WINS<br />
              2 JALENS · AVG {AVG[2]} WINS
            </div>
          </div>

          {/* divider */}
          <div style={{ background: "#1a1a1a", width: 1, margin: "0 20px" }} />

          {/* col 3 */}
          <div style={{ paddingLeft: 20 }}>
            <div style={{ fontFamily: "'Playfair Display SC', serif", fontSize: 10, letterSpacing: 2, color: "#888", marginBottom: 8 }}>The Origin</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, lineHeight: 1.75, color: "#2a2a2a" }}>
              "Jalen" was invented by Jalen Rose's mother — a portmanteau of James and Leonard. The name entered the U.S. top-1,000 baby names in 1992.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, lineHeight: 1.75, color: "#2a2a2a", marginTop: 10 }}>
              By 2025–26, four Jalens made the All-Star Game in the same season — the most same-name All-Stars in NBA history.
            </p>
          </div>
        </div>

        <Rule style={{ margin: "24px 0 0" }} />

        {/* ── Scatter chart section ── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>
              Jalen Win Shares vs. Team Wins
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#888", letterSpacing: 1 }}>
              ● = 1 JALEN &nbsp; ●● = 2 JALENS &nbsp; ○ = NONE
            </div>
          </div>
          <Rule style={{ marginBottom: 12 }} />

          {/* chart */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 200, paddingRight: 6 }}>
              {[55, 42, 28, 15].map(v => (
                <span key={v} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999" }}>{v}W</span>
              ))}
            </div>
            <div style={{ flex: 1, position: "relative", height: 200, background: "#ede8de", border: "1px solid #c8bfaa" }}>
              {/* grid */}
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
                const stroke = n === 0 ? "#999" : "none";
                return (
                  <div key={team.abbr} title={`${team.team} · ${team.wins}W · ${ws.toFixed(1)} Jalen WS`} style={{
                    position: "absolute",
                    left: `${cx}%`, top: `${cy}%`,
                    transform: "translate(-50%,-50%)",
                    width: sz, height: sz, borderRadius: "50%",
                    background: fill, border: `1.5px solid ${n === 0 ? "#999" : fill}`,
                  }} />
                );
              })}
            </div>
          </div>
          <div style={{ marginLeft: 36, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["0 WS", "4 WS", "8 WS", "12+ WS"].map(l => (
              <span key={l} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999" }}>{l}</span>
            ))}
          </div>
        </div>

        <Rule style={{ margin: "24px 0 0" }} />

        {/* ── Full standings table ── */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22 }}>
              Full League Standings
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              {/* filter */}
              <div style={{ display: "flex", gap: 0, border: "1px solid #1a1a1a" }}>
                {[{k:"all",l:"All"},{k:"2",l:"2 Jalens"},{k:"1",l:"1 Jalen"},{k:"0",l:"None"}].map((f, i) => (
                  <button key={f.k} onClick={() => setFilter(f.k)} style={{
                    background: filter===f.k ? "#1a1a1a" : "transparent",
                    border: "none",
                    borderLeft: i > 0 ? "1px solid #1a1a1a" : "none",
                    padding: "4px 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: filter===f.k ? "#f5f0e8" : "#1a1a1a",
                    letterSpacing: 0.5,
                  }}>{f.l}</button>
                ))}
              </div>
              {/* sort */}
              <div style={{ display: "flex", gap: 0, border: "1px solid #1a1a1a" }}>
                {[{k:"wins",l:"Wins"},{k:"ws",l:"Win Shares"},{k:"count",l:"Jalens"}].map((s, i) => (
                  <button key={s.k} onClick={() => setSortKey(s.k)} style={{
                    background: sortKey===s.k ? "#c0392b" : "transparent",
                    border: "none",
                    borderLeft: i > 0 ? "1px solid #1a1a1a" : "none",
                    padding: "4px 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    color: sortKey===s.k ? "#fff" : "#1a1a1a",
                    letterSpacing: 0.5,
                  }}>{s.l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "22px 22px 1fr 60px 52px 52px", gap: 6, padding: "4px 0 6px", borderBottom: "2px solid #1a1a1a", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>
            <span style={{ textAlign: "right" }}>#</span>
            <span style={{ textAlign: "center" }}>J</span>
            <span>Team</span>
            <span style={{ textAlign: "right" }}>Wins</span>
            <span style={{ textAlign: "center" }}>Record</span>
            <span style={{ textAlign: "right" }}>WS</span>
          </div>

          {sorted.map((team, i) => (
            <TeamRow key={team.abbr} team={team} rank={i + 1} />
          ))}
        </div>

        {/* ── Bottom bar chart: avg wins by Jalen count ── */}
        <Rule style={{ margin: "32px 0 24px" }} />
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, marginBottom: 14 }}>
          Average Wins by Jalen Count
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "2 Jalens", avg: AVG[2], count: g2.length, accent: true },
            { label: "1 Jalen",  avg: AVG[1], count: g1.length, accent: false },
            { label: "0 Jalens", avg: AVG[0], count: g0.length, accent: false },
          ].map(row => (
            <div key={row.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: row.accent ? "#c0392b" : "#1a1a1a" }}>
                  {row.label}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#888" }}>
                  {row.avg} avg · {row.count} team{row.count !== 1 ? "s" : ""}
                </span>
              </div>
              <div style={{ height: 22, background: "#e8e0d0", position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, height: "100%",
                  width: `${(row.avg / 55) * 100}%`,
                  background: row.accent ? "#c0392b" : "#1a1a1a",
                }} />
                <span style={{ position: "absolute", left: `${(row.avg / 55) * 100 + 1}%`, top: "50%", transform: "translateY(-50%)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", fontWeight: 600 }}>
                  {row.avg}W
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <DoubleRule style={{ margin: "32px 0 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#999", letterSpacing: 1, flexWrap: "wrap", gap: 6 }}>
          <span>✦ DENOTES ALL-STAR · ●● = 2 JALENS · ● = 1 JALEN · ○ = NONE</span>
          <span>WIN SHARES ARE SEASON-TO-DATE ESTIMATES · STANDINGS THROUGH MAR. 28, 2026</span>
        </div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "#aaa", marginTop: 8, lineHeight: 1.6 }}>
          Please note: If it's not blatantly clear, this is not an actual scientific analysis on the impact of Jalens on an NBA roster. But maybe naming your son Jalen improves his chances of making it to the NBA 🤔
        </p>

      </div>
    </div>
  );
}
