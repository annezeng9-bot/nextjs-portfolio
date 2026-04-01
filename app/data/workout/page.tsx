// @ts-nocheck
'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './workout.module.css';

const RAW = [
  { date: "2026-03-24", title: "Day 1", duration: 50, exercises: [
    { name: "Pull Up", sets: [{reps:3},{reps:4},{reps:4},{reps:4}] },
    { name: "Squat (Barbell)", sets: [{w:55,r:5,type:'warmup'},{w:125,r:5},{w:125,r:5},{w:125,r:5},{w:125,r:5}] },
    { name: "Romanian Deadlift (Barbell)", sets: [{w:125,r:8},{w:125,r:8},{w:125,r:8}] },
    { name: "Overhead Press (Barbell)", sets: [{w:55,r:5,type:'warmup'},{w:65,r:5},{w:65,r:5}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:10,r:10},{w:7.5,r:10},{w:7.5,r:10}] },
  ], notes: ["wtf why so hard / 148 bpm", "65 shoulder weird. maybe too wide.", "3 fast? / had to pause after 3rd rep"] },
  { date: "2026-03-19", title: "Pre cardio small lift", duration: 21, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:4}] },
    { name: "Lateral Raise (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10}] },
    { name: "Front Raise (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10}] },
    { name: "Arnold Press (Dumbbell)", sets: [{w:20,r:10},{w:20,r:8}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:25,r:10},{w:25,r:10},{w:25,r:10}] },
  ], notes: [] },
  { date: "2026-03-17", title: "Upper Body", duration: 81, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:4}] },
    { name: "Overhead Press (Barbell)", sets: [{w:65,r:8,type:'warmup'},{w:70,r:5},{w:70,r:5}] },
    { name: "Bench Press (Barbell)", sets: [{w:45,r:5,type:'warmup'},{w:95,r:5,type:'warmup'},{w:105,r:4},{w:105,r:3},{w:95,r:5}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:7.5,r:10},{w:7.5,r:10},{w:7.5,r:10}] },
    { name: "Face Pull", sets: [{w:22.5,r:12},{w:22.5,r:12},{w:22.5,r:12}] },
    { name: "Single Arm Landmine Press (Barbell)", sets: [{w:50,r:8,type:'warmup'},{w:60,r:6},{w:60,r:6},{w:60,r:6}] },
    { name: "Bicep Curl (Dumbbell)", sets: [{w:20,r:20},{w:15,r:10},{w:20,r:15},{w:10,r:8}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:15,r:10,type:'warmup'},{w:15,r:10},{w:20,r:10}] },
    { name: "Triceps Extension (Dumbbell)", sets: [{w:12.5,r:20,type:'warmup'},{w:20,r:11},{w:20,r:8},{w:20,r:10}] },
  ], notes: ["heavy? why left hand hurt"] },
  { date: "2026-03-15", title: "Day 1", duration: 79, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:3},{reps:5}] },
    { name: "Squat (Barbell)", sets: [{w:45,r:5,type:'warmup'},{w:135,r:5},{w:135,r:5},{w:135,r:5}] },
    { name: "Clean and Press", sets: [{w:65,r:5},{w:65,r:5},{w:75,r:5}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:10,r:10},{w:10,r:10},{w:10,r:10}] },
    { name: "Bicep Curl (Cable)", sets: [{w:20,r:12},{w:20,r:12},{w:20,r:12}] },
    { name: "Face Pull", sets: [{w:30,r:12},{w:40,r:12},{w:40,r:12}] },
    { name: "Triceps Pushdown", sets: [{w:40,r:12},{w:50,r:12},{w:50,r:12}] },
  ], notes: ["not heavy but slow (good)"] },
  { date: "2026-03-10", title: "Re-Sync Post Vacation", duration: 83, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:4},{reps:5}] },
    { name: "Squat (Barbell)", sets: [{w:135,r:5},{w:135,r:5},{w:135,r:5}] },
    { name: "Romanian Deadlift (Barbell)", sets: [{w:135,r:8},{w:135,r:8},{w:135,r:5}] },
    { name: "Bench Press (Barbell)", sets: [{w:45,r:5,type:'warmup'},{w:95,r:5},{w:95,r:5},{w:95,r:5}] },
    { name: "Seated Cable Row - V Grip (Cable)", sets: [{w:55,r:8},{w:55,r:6}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:7.5,r:8},{w:7.5,r:8},{w:7.5,r:8}] },
    { name: "Lateral Raise (Dumbbell)", sets: [{w:15,r:10},{w:15,r:10},{w:15,r:10}] },
    { name: "Arnold Press (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:15,r:10,type:'warmup'},{w:20,r:10},{w:20,r:10}] },
  ], notes: ["is this 70%? am i lightheaded???", "IM EXHAUSTED"] },
  { date: "2026-02-28", title: "Taipei workout", duration: 62, exercises: [
    { name: "Pull Up", sets: [{reps:3},{reps:5},{reps:5}] },
    { name: "Squat (Barbell)", sets: [{w:45,r:5,type:'warmup'},{w:135,r:5},{w:135,r:5},{w:135,r:5}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:10,r:10},{w:10,r:10},{w:10,r:10}] },
    { name: "Lat Pulldown (Cable)", sets: [{w:90,r:8,type:'warmup'},{w:110,r:8},{w:110,r:6}] },
    { name: "Triceps Rope Pushdown", sets: [{w:60,r:12},{w:70,r:12},{w:70,r:12}] },
    { name: "Face Pull", sets: [{w:30,r:12},{w:30,r:12},{w:30,r:12}] },
    { name: "Single Arm Curl (Cable)", sets: [{w:15,r:8},{w:20,r:10}] },
  ], notes: [] },
  { date: "2026-02-23", title: "Hotel workout", duration: 64, exercises: [
    { name: "Bulgarian Split Squat", sets: [{w:20,r:10},{w:20,r:10},{w:20,r:10}] },
    { name: "Single Leg Romanian Deadlift (Dumbbell)", sets: [{w:10,r:10},{w:10,r:10},{w:10,r:12}] },
    { name: "Overhead Press (Dumbbell)", sets: [{w:20,r:14},{w:20,r:14},{w:20,r:14}] },
    { name: "Bent Over Row (Dumbbell)", sets: [{w:20,r:18},{w:20,r:18},{w:20,r:18}] },
    { name: "Lateral Raise (Dumbbell)", sets: [{w:15,r:10},{w:15,r:15},{w:15,r:15}] },
    { name: "Triceps Extension (Dumbbell)", sets: [{w:10,r:20},{w:10,r:19}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:15,r:10,type:'warmup'},{w:20,r:10},{w:20,r:10}] },
  ], notes: [] },
  { date: "2026-02-12", title: "Pre Jog", duration: 45, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5}] },
    { name: "Front Squat", sets: [{w:45,r:5,type:'warmup'},{w:135,r:5},{w:135,r:5}] },
    { name: "Bicep Curl (Dumbbell)", sets: [{w:25,r:14},{w:25,r:15},{w:25,r:10}] },
    { name: "Hammer Curl (Dumbbell)", sets: [{w:25,r:14},{w:25,r:10},{w:25,r:10}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10}] },
    { name: "Triceps Pushdown", sets: [{w:35,r:12,type:'warmup'},{w:40,r:12},{w:40,r:12}] },
  ], notes: ["3x5 progression neutral grip - right shoulder hurts / last set pullups no hurt"] },
  { date: "2026-02-07", title: "Upper Body", duration: 88, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5}] },
    { name: "Overhead Press (Barbell)", sets: [{w:65,r:6,type:'warmup'},{w:75,r:5},{w:70,r:5}] },
    { name: "Bench Press (Barbell)", sets: [{w:45,r:5,type:'warmup'},{w:95,r:5,type:'warmup'},{w:105,r:5},{w:105,r:6}] },
    { name: "Seated Cable Row - V Grip (Cable)", sets: [{w:52.5,r:8},{w:55,r:8}] },
    { name: "Seated Incline Curl (Dumbbell)", sets: [{w:25,r:15},{w:25,r:10},{w:25,r:10}] },
    { name: "Concentration Curl", sets: [{w:12.5,r:10},{w:10,r:10},{w:10,r:10}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:15,r:10},{w:15,r:10}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:7.5,r:10},{w:7.5,r:10},{w:7.5,r:10}] },
  ], notes: ["75 too heavy", "pinky on knurling - wider grip / right shoulder kinda hurts"] },
  { date: "2026-02-05", title: "PreJog", duration: 48, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5},{reps:4}] },
    { name: "Overhead Press (Barbell)", sets: [{w:65,r:6,type:'warmup'},{w:75,r:5},{w:75,r:5}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:5,r:20},{w:5,r:15},{w:5,r:15}] },
    { name: "Single Arm Curl (Cable)", sets: [{w:17.5,r:6},{w:17.5,r:6},{w:17.5,r:6}] },
  ], notes: ["pullup/neutral grip/pullup/chinup SLOW AF"] },
  { date: "2026-02-03", title: "Day 1 - Lower Body", duration: 62, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5},{reps:4},{reps:3}] },
    { name: "Deadlift (Barbell)", sets: [{w:135,r:5,type:'warmup'},{w:225,r:3,type:'failure'},{w:185,r:5},{w:135,r:5}] },
    { name: "Reverse Lunge (Barbell)", sets: [{w:65,r:8},{w:65,r:8},{w:65,r:8}] },
    { name: "Clean and Press", sets: [{w:65,r:5},{w:75,r:5},{w:75,r:5}] },
    { name: "Lateral Raise (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10},{w:15,r:8}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:25,r:10},{w:25,r:10},{w:25,r:10}] },
  ], notes: ["200 messed up my lower back"] },
  { date: "2026-01-30", title: "Upper body", duration: 108, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:4},{reps:5},{reps:4},{reps:4}] },
    { name: "Bench Press (Barbell)", sets: [{w:45,r:8,type:'warmup'},{w:75,r:5,type:'warmup'},{w:95,r:5,type:'warmup'},{w:105,r:5},{w:105,r:5},{w:105,r:5}] },
    { name: "Seated Cable Row - V Grip (Cable)", sets: [{w:50,r:8},{w:50,r:8},{w:50,r:8}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:5,r:18},{w:5,r:15},{w:2.5,r:16}] },
    { name: "Seated Incline Curl (Dumbbell)", sets: [{w:25,r:14},{w:25,r:10},{w:20,r:10}] },
    { name: "Cross Body Hammer Curl", sets: [{w:20,r:14},{w:20,r:16},{w:20,r:16}] },
    { name: "Arnold Press (Dumbbell)", sets: [{w:10,r:14},{w:10,r:16},{w:10,r:10}] },
    { name: "Triceps Extension (Dumbbell)", sets: [{w:20,r:14},{w:20,r:10},{w:20,r:10}] },
    { name: "Single Arm Landmine Press (Barbell)", sets: [{w:55,r:6,type:'warmup'},{w:60,r:6},{w:60,r:6},{w:55,r:6}] },
  ], notes: ["Right shoulder still kinda messed up"] },
  { date: "2026-01-29", title: "Pre-Jog", duration: 37, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5},{reps:5},{reps:4}] },
    { name: "Overhead Press (Barbell)", sets: [{w:65,r:8},{w:65,r:8}] },
    { name: "Bent Over Row (Barbell)", sets: [{w:65,r:8,type:'warmup'},{w:85,r:8},{w:85,r:8}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:5,r:18},{w:5,r:18}] },
    { name: "Zottman Curl (Dumbbell)", sets: [{w:25,r:16},{w:25,r:15}] },
  ], notes: [] },
  { date: "2026-01-27", title: "Day 1 - Lower Body", duration: 64, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5},{reps:4},{reps:4}] },
    { name: "Squat (Barbell)", sets: [{w:45,r:8,type:'warmup'},{w:135,r:5},{w:135,r:5},{w:135,r:5},{w:135,r:5},{w:135,r:5}] },
    { name: "Romanian Deadlift (Barbell)", sets: [{w:135,r:8},{w:135,r:8},{w:135,r:8}] },
    { name: "Lateral Raise (Dumbbell)", sets: [{w:15,r:10},{w:15,r:8},{w:15,r:8}] },
    { name: "Front Raise (Dumbbell)", sets: [{w:15,r:10},{w:15,r:8},{w:15,r:8}] },
    { name: "Preacher Curl (Dumbbell)", sets: [{w:20,r:10},{w:20,r:10},{w:20,r:10}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:2.5,r:16},{w:2.5,r:16},{w:2.5,r:16}] },
  ], notes: [] },
  { date: "2026-01-22", title: "Upper body", duration: 94, exercises: [
    { name: "Pull Up", sets: [{reps:5},{reps:5},{reps:5},{reps:4},{reps:5}] },
    { name: "Bench Press (Dumbbell)", sets: [{w:70,r:6},{w:70,r:8},{w:70,r:8}] },
    { name: "Dumbbell Row", sets: [{w:35,r:8,type:'warmup'},{w:45,r:6},{w:45,r:6},{w:45,r:6}] },
    { name: "Seated Incline Curl (Dumbbell)", sets: [{w:20,r:14},{w:20,r:12},{w:20,r:12}] },
    { name: "Concentration Curl", sets: [{w:10,r:10},{w:10,r:10},{w:10,r:10}] },
    { name: "Hammer Curl (Dumbbell)", sets: [{w:7.5,r:20,type:'warmup'},{w:10,r:20},{w:10,r:20},{w:10,r:20}] },
    { name: "Single Arm Landmine Press (Barbell)", sets: [{w:55,r:6,type:'warmup'},{w:70,r:6},{w:60,r:6},{w:60,r:6}] },
  ], notes: [] },
  { date: "2026-01-20", title: "Evening workout", duration: 65, exercises: [
    { name: "Front Squat", sets: [{w:115,r:5,type:'warmup'},{w:135,r:4},{w:135,r:4},{w:135,r:3}] },
    { name: "Romanian Deadlift (Barbell)", sets: [{w:65,r:5,type:'warmup'},{w:135,r:5},{w:135,r:8},{w:135,r:8}] },
    { name: "Reverse Lunge (Barbell)", sets: [{w:65,r:8},{w:65,r:8},{w:65,r:8}] },
    { name: "Single Arm Lateral Raise (Cable)", sets: [{w:2.5,r:15},{w:2.5,r:15},{w:2.5,r:15}] },
    { name: "Bicep Curl (Dumbbell)", sets: [{w:10,r:20},{w:10,r:20},{w:10,r:20}] },
    { name: "Hammer Curl (Dumbbell)", sets: [{w:10,r:20},{w:10,r:20},{w:10,r:20}] },
  ], notes: [] },
];

const BW = 145;

function calcVolume(s) {
  let vol = 0;
  s.exercises.forEach(ex => ex.sets.forEach(st => {
    if (st.type === 'warmup') return;
    const r = st.r || st.reps || 0;
    vol += st.w ? st.w * r : BW * r;
  }));
  return Math.round(vol);
}

function totalReps(s, name) {
  const ex = s.exercises.find(e => e.name === name);
  if (!ex) return 0;
  return ex.sets.filter(st => st.type !== 'warmup').reduce((a, st) => a + (st.r || st.reps || 0), 0);
}

const sessions = [...RAW].map(s => ({
  ...s,
  volume: calcVolume(s),
  pullupReps: totalReps(s, 'Pull Up'),
  dateObj: new Date(s.date),
  shortDate: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
})).sort((a, b) => a.dateObj - b.dateObj);

const exFreq = {};
sessions.forEach(s => s.exercises.forEach(e => {
  const base = e.name.replace(/ \(.*\)/, '').replace(/Single Arm /, '').replace(/ - V Grip/, '');
  exFreq[base] = (exFreq[base] || 0) + e.sets.filter(st => st.type !== 'warmup').length;
}));
const topEx = Object.entries(exFreq).sort((a, b) => b[1] - a[1]).slice(0, 6);
const maxExSets = topEx[0][1];

const muscleMap = {
  'Shoulders': ['Lateral Raise', 'Front Raise', 'Overhead Press', 'Arnold Press', 'Landmine Press', 'Face Pull'],
  'Back / Pull': ['Pull Up', 'Row', 'Lat Pulldown', 'Cable Row'],
  'Legs': ['Squat', 'Deadlift', 'Lunge', 'Bulgarian', 'Front Squat', 'Romanian'],
  'Chest': ['Bench Press', 'Dip'],
  'Arms': ['Curl', 'Tricep', 'Pushdown', 'Extension'],
};
const muscleColors = { 'Shoulders': '#c8ff00', 'Back / Pull': '#00d4ff', 'Legs': '#ff3c5a', 'Chest': '#ff9500', 'Arms': '#c084fc' };
const muscleVol = {};
Object.keys(muscleMap).forEach(m => muscleVol[m] = 0);
sessions.forEach(s => s.exercises.forEach(e => {
  for (const [muscle, keywords] of Object.entries(muscleMap)) {
    if (keywords.some(k => e.name.includes(k))) {
      muscleVol[muscle] += e.sets.filter(st => st.type !== 'warmup').reduce((a, st) => a + (st.r || st.reps || 0), 0);
      break;
    }
  }
}));
const totalMuscleVol = Object.values(muscleVol).reduce((a, b) => a + b, 0);

function getISOWeek(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return `${d.getFullYear()}-W${String(1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)).padStart(2,'0')}`;
}
function weekLabel(isoWeek) {
  const [year, wStr] = isoWeek.split('-W');
  const w = parseInt(wStr);
  const jan4 = new Date(parseInt(year), 0, 4);
  const weekStart = new Date(jan4.getTime() + (w - 1) * 7 * 86400000 - ((jan4.getDay() + 6) % 7) * 86400000);
  return weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
const weekMap = {};
sessions.forEach(s => { const wk = getISOWeek(s.dateObj); weekMap[wk] = (weekMap[wk] || 0) + s.duration; });
const weekEntries = Object.entries(weekMap).sort((a, b) => a[0].localeCompare(b[0]));
const maxWeekMins = Math.max(...weekEntries.map(e => e[1]));

const totalVol = sessions.reduce((a, s) => a + s.volume, 0);
const totalMins = sessions.reduce((a, s) => a + s.duration, 0);
const totalPullupReps = sessions.reduce((a, s) => a + s.pullupReps, 0);
const bestSession = sessions.reduce((a, s) => s.volume > a.volume ? s : a, sessions[0]);
const spanDays = Math.round((sessions[sessions.length-1].dateObj - sessions[0].dateObj) / (1000*60*60*24));
const avgDuration = Math.round(totalMins / sessions.length);
const maxVol = Math.max(...sessions.map(s => s.volume));

const funFacts = [
  `${totalVol.toLocaleString()} LBS OF TOTAL VOLUME. A DAIRY COW WEIGHS ABOUT 1,500 LBS. THAT'S ${(totalVol/1500).toFixed(0)} COWS.`,
  `${totalVol.toLocaleString()} LBS LIFTED ACROSS ${sessions.length} SESSIONS. THE AVERAGE CAR WEIGHS 4,094 LBS. THAT'S ${(totalVol/4094).toFixed(1)} CARS.`,
  `${totalPullupReps} PULL-UP REPS LOGGED OVER ${sessions.length} SESSIONS. AN AVERAGE OF ${(totalPullupReps/sessions.length).toFixed(1)} PER SESSION.`,
  `THE HEAVIEST SESSION WAS ${bestSession.shortDate} AT ${bestSession.volume.toLocaleString()} LBS. A MALE GRIZZLY BEAR AVERAGES 600 LBS. THAT'S ${(bestSession.volume/600).toFixed(1)} GRIZZLIES.`,
  `${totalMins} TOTAL MINUTES OVER ${spanDays} DAYS. THAT'S ${((totalMins/spanDays)*100/60/24).toFixed(2)}% OF EACH DAY SPENT IN THE GYM.`,
  `${sessions.length} SESSIONS IN ${spanDays} DAYS. ONE SESSION EVERY ${(spanDays/sessions.length).toFixed(1)} DAYS ON AVERAGE.`,
];

const BORING = ['ok', '', 'easy?'];
function censorText(text) {
  return text.replace(/\b(fuck(?:ed|ing|s)?|shit|ass|wtf|damn|crap)\b/gi, m => m[0] + '***');
}
const funNotes = [];
sessions.forEach(s => s.notes.forEach(n => {
  const clean = censorText(n.replace(/\\n/g, ' ').replace(/\n/g, ' ').trim());
  if (clean && !BORING.includes(clean.toLowerCase()) && clean.length > 5) {
    funNotes.push({ date: s.shortDate, text: clean });
  }
}));
function vibeColor(text) {
  const t = text.toLowerCase();
  if (t.includes('hurt') || t.includes('dead') || t.includes('shoulder') || t.includes('back')) return '#ff3c5a';
  if (t.includes('easy') || t.includes('good') || t.includes('clean')) return '#c8ff00';
  if (t.includes('exhaust') || t.includes('heavy') || t.includes('hard')) return '#ff9500';
  return '#00d4ff';
}

function PullupChart() {
  const ref = useRef(null);
  const [markup, setMarkup] = useState('');
  useEffect(() => {
    if (!ref.current) return;
    const W = ref.current.parentElement.clientWidth - 32;
    const H = 160;
    const PAD = { top: 20, right: 16, bottom: 28, left: 36 };
    const points = sessions.map(s => ({ date: s.shortDate, reps: s.pullupReps }));
    const n = points.length;
    const xScale = i => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);
    const allReps = points.map(p => p.reps);
    const minR = Math.max(0, Math.min(...allReps) - 2);
    const maxR = Math.max(...allReps) + 2;
    const yScale = r => PAD.top + (1 - (r - minR) / (maxR - minR)) * (H - PAD.top - PAD.bottom);
    ref.current.setAttribute('viewBox', `0 0 ${W} ${H}`);
    ref.current.setAttribute('height', H);
    let html = '';
    const yTicks = [...new Set([minR, Math.round((minR + maxR) / 2), maxR].map(v => Math.round(v)))];
    yTicks.forEach(val => {
      const y = yScale(val);
      html += `<line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}" stroke="#1e1e1e" stroke-width="1"/>`;
      html += `<text x="${PAD.left - 6}" y="${y + 4}" fill="#444" font-size="9" text-anchor="end" font-family="Space Mono,monospace">${val}</text>`;
    });
    points.forEach((p, i) => {
      html += `<text x="${xScale(i)}" y="${H - 4}" fill="#444" font-size="8" text-anchor="middle" font-family="Space Mono,monospace">${p.date}</text>`;
    });
    const baseline = yScale(minR);
    const areaD = `M ${xScale(0)},${baseline} L ${points.map((p, i) => `${xScale(i)},${yScale(p.reps)}`).join(' L ')} L ${xScale(n-1)},${baseline} Z`;
    html += `<path d="${areaD}" fill="#00d4ff" opacity="0.06"/>`;
    const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.reps)}`).join(' ');
    html += `<path d="${lineD}" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    points.forEach((p, i) => {
      const x = xScale(i), y = yScale(p.reps);
      const isHigh = p.reps === Math.max(...allReps);
      const isLow = p.reps === Math.min(...allReps);
      const dotColor = isHigh ? '#c8ff00' : isLow ? '#ff3c5a' : '#00d4ff';
      const tipX = Math.min(Math.max(x, PAD.left + 30), W - PAD.right - 30);
      html += `<g>
        <circle cx="${x}" cy="${y}" r="${isHigh || isLow ? 4.5 : 3.5}" fill="${dotColor}" stroke="#111" stroke-width="1.5"/>
        <g class="pu-tip" style="pointer-events:none;opacity:0;transition:opacity 0.15s">
          <rect x="${tipX - 24}" y="${y - 28}" width="48" height="18" rx="2" fill="#1a1a1a" stroke="#333"/>
          <text x="${tipX}" y="${y - 15}" fill="${dotColor}" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${p.reps} reps</text>
        </g>
      </g>`;
    });
    setMarkup(html);
  }, []);
  return <svg ref={ref} width="100%" style={{ display: 'block', overflow: 'visible' }} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function Modal({ idx, onClose }) {
  const s = sessions[idx];
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #2a2a2a', maxWidth: 500, width: '100%', maxHeight: '78vh', overflowY: 'auto', padding: '1.5rem 1.75rem', position: 'relative', fontFamily: "'Space Mono', monospace" }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#555', fontSize: '1rem', cursor: 'pointer' }}>x</button>
        <div style={{ marginBottom: '1.25rem', paddingBottom: '0.9rem', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#444', marginBottom: '0.3rem' }}>{s.shortDate} - {s.duration} min</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: '#c8ff00', lineHeight: 1.1 }}>{s.title}</div>
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.3rem' }}>{s.volume.toLocaleString()} lbs total volume</div>
        </div>
        {s.exercises.map((ex, ei) => {
          const sets = ex.sets.filter(st => st.type !== 'warmup');
          if (!sets.length) return null;
          const exVol = sets.reduce((a, st) => { const r = st.r || st.reps || 0; return a + (st.w ? st.w * r : BW * r); }, 0);
          return (
            <div key={ei} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' }}>{ex.name}</div>
                <div style={{ fontSize: '0.6rem', color: '#444' }}>{exVol.toLocaleString()} lbs</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                {sets.map((st, i) => {
                  const r = st.r || st.reps || 0;
                  return (
                    <tr key={i}>
                      <td style={{ color: '#444', padding: '0.3rem 0.75rem 0.3rem 0', fontSize: '0.62rem', whiteSpace: 'nowrap' }}>Set {i+1}{st.type === 'failure' ? ' FAIL' : ''}</td>
                      <td style={{ color: '#e8e8e8', padding: '0.3rem 0.75rem', fontSize: '0.7rem' }}>{st.w ? `${st.w} lbs` : 'BW'} x {r}</td>
                      <td style={{ color: '#444', padding: '0.3rem 0 0.3rem 0.75rem', fontSize: '0.62rem', textAlign: 'right' }}>{(st.w ? st.w * r : BW * r).toLocaleString()} lbs</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              <div style={{ height: 1, background: '#1a1a1a', marginTop: '0.6rem' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const fact = funFacts[0]; // stable â€” no Math.random on server

export default function WorkoutPage() {
  const [modalIdx, setModalIdx] = useState(null);
  const firstDate = sessions[0].dateObj;

  return (
    <div style={{ fontFamily: "'Space Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');`}</style>

      <div className={styles.header}>
        <a href="/data" className={styles.back}>Projects</a>
        <p className={styles.label}>Data</p>
        <h1 className={styles.title}>Workout Log</h1>
      </div>

      <div style={{ background: '#0a0a0a', color: '#e8e8e8', margin: '0 160px 80px', border: '0.5px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 100, opacity: 0.4 }} />

        <header style={{ borderBottom: '1px solid #222', padding: '2rem 2.5rem 1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1.8 }}>
            <strong style={{ color: '#e8e8e8', display: 'block', fontSize: '1rem' }}>JAN - MAR 2026</strong>
            {sessions.length} sessions tracked<br />data from hevy export
          </div>
        </header>

        <main style={{ padding: '2rem 2.5rem', display: 'grid', gap: '1.5rem' }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Total Volume Lifted', value: `${(totalVol/1000).toFixed(0)}K`, sub: 'lbs - incl. bodyweight @ 145', color: '#c8ff00' },
              { label: 'Sessions Logged', value: String(sessions.length), sub: 'Jan 20 - Mar 24, 2026', color: '#ff3c5a' },
              { label: 'Pull-ups Completed', value: String(totalPullupReps), sub: 'reps total - every session', color: '#00d4ff' },
              { label: 'Avg Session Length', value: `${avgDuration}min`, sub: `longest: ${Math.max(...sessions.map(s => s.duration))} min`, color: '#c084fc' },
            ].map((card, i) => (
              <div key={i} style={{ background: '#111', border: '1px solid #222', padding: '1.25rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: card.color }} />
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: '0.5rem' }}>{card.label}</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', lineHeight: 1, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.4rem' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Volume bar chart */}
          <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Session Volume (lbs) - click a bar for details
              <span style={{ flex: 1, height: 1, background: '#222', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 140, paddingBottom: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, height: 1, background: '#222' }} />
              {sessions.map((s, i) => {
                const h = s.volume === 0 ? 4 : Math.max(8, (s.volume / maxVol) * 108);
                const isHighest = s.volume === maxVol;
                const isLow = s.volume < 1000;
                const relDay = Math.round((s.dateObj - firstDate) / (1000*60*60*24)) + 1;
                return (
                  <div key={i} onClick={() => setModalIdx(i)} title={`${s.volume.toLocaleString()} lbs - ${s.shortDate}`}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '100%', height: h, background: isLow ? '#555' : '#c8ff00', opacity: isHighest ? 1 : 0.85, minHeight: 2, position: 'relative' }}>
                      {isHighest && <div style={{ position: 'absolute', top: '-1.4rem', fontSize: '0.6rem', color: '#c8ff00', whiteSpace: 'nowrap' }}>PEAK</div>}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-1.8rem', fontSize: '0.55rem', color: '#888', whiteSpace: 'nowrap' }}>D{relDay}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pull-up chart */}
          <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Pull-up Reps per Session - working sets only
              <span style={{ flex: 1, height: 1, background: '#222', display: 'block' }} />
            </div>
            <PullupChart />
          </div>

          {/* Two col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Most-Trained Exercises <span style={{ flex: 1, height: 1, background: '#222', display: 'block' }} />
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <tbody>
                {topEx.map(([name, count]) => (
                  <tr key={name} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.7rem 0', verticalAlign: 'middle' }}>
                      <span style={{ color: '#e8e8e8' }}>{name}</span>
                      <span style={{ color: '#888', fontSize: '0.65rem', display: 'block' }}>{count} working sets</span>
                      <div style={{ height: 3, background: '#222', borderRadius: 2, marginTop: '0.35rem' }}>
                        <div style={{ height: '100%', width: `${(count/maxExSets*100).toFixed(0)}%`, background: '#ff3c5a', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: '#ff3c5a', verticalAlign: 'middle' }}>{count}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Rep Share by Muscle Group <span style={{ flex: 1, height: 1, background: '#222', display: 'block' }} />
              </div>
              {Object.entries(muscleVol).sort((a, b) => b[1] - a[1]).map(([m, v]) => {
                const pct = (v / totalMuscleVol * 100).toFixed(0);
                return (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 120, color: '#888', flexShrink: 0 }}>{m}</div>
                    <div style={{ flex: 1, height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: muscleColors[m], borderRadius: 3 }} />
                    </div>
                    <div style={{ color: '#e8e8e8', fontSize: '0.65rem', width: 35, textAlign: 'right' }}>{pct}%</div>
                  </div>
                );
              })}
              <div style={{ flex: 1 }} />
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', margin: '1.25rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                Minutes Worked Out per Week <span style={{ flex: 1, height: 1, background: '#222', display: 'block' }} />
              </div>
              {weekEntries.map(([wk, mins]) => (
                <div key={wk} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.62rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 52, color: '#888', flexShrink: 0, textAlign: 'right' }}>{weekLabel(wk)}</div>
                  <div style={{ flex: 1, height: 10, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(mins/maxWeekMins*100).toFixed(1)}%`, background: '#c8ff00', borderRadius: 2 }} />
                  </div>
                  <div style={{ width: 36, color: '#e8e8e8', textAlign: 'right' }}>{mins}m</div>
                </div>
              ))}
              <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '0.25rem' }}>total training minutes per calendar week</div>
            </div>
          </div>

          {/* Fun fact */}
          <div style={{ background: '#111', border: '1px solid #222', padding: '1.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ position: 'absolute', top: '-1rem', left: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '8rem', color: '#222', lineHeight: 1, pointerEvents: 'none' }}>"</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(0.8rem, 1.8vw, 1.1rem)', color: '#e8e8e8', position: 'relative', zIndex: 1, letterSpacing: '0.04em', lineHeight: 1.6 }}>{fact}</div>
          </div>

        </main>
      </div>

      {modalIdx !== null && <Modal idx={modalIdx} onClose={() => setModalIdx(null)} />}
    </div>
  );
}
