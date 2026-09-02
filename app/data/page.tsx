'use client';
import { useState, useEffect } from 'react';
import styles from './data.module.css';

const projects = [
  {
    tag: 'Analytics',
    title: 'Jalen Tracker',
    description: 'A highly analytical, game-breaking analysis dashboard on the impact of players named Jalen on a NBA team.',
    url: '/data/jalen',
  },
  {
    tag: 'Data',
    title: 'Workout Log',
    description: 'Personal workout dashboard tracking overall weight lifted over the course of my workouts and the breakdown of the exercise groups and other relevant information.',
    url: '/data/workout',
  },
  {
    tag: 'Live Data',
    title: 'Listening History',
    description: 'A live music dashboard pulling from Last.fm — genre composition, listening trends, hidden gems, and year-over-year breakdowns from 2014 to present.',
    url: '/data/music',
  },
];

const SESSION_KEY = 'data_unlocked';

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === 'rosie') {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 61px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: '0 20px',
    }}>
      <p style={{
        fontSize: 10,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--grey-400)',
        margin: 0,
      }}>
        Data · Password required
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280 }}>
        <input
          type="password"
          value={value}
          onChange={e => { setValue(e.target.value); setError(false); }}
          autoFocus
          placeholder="Password"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 13,
            border: `0.5px solid ${error ? '#c0392b' : 'var(--grey-200)'}`,
            borderRadius: 4,
            outline: 'none',
            fontFamily: 'inherit',
            background: 'transparent',
            color: 'var(--black)',
            letterSpacing: '0.04em',
          }}
        />
        {error && (
          <p style={{ margin: 0, fontSize: 11, color: '#c0392b', letterSpacing: '0.06em' }}>
            Incorrect password.
          </p>
        )}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '0.5px solid var(--grey-200)',
            borderRadius: 4,
            background: 'transparent',
            color: 'var(--black)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

export default function ProjectsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) return null;
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.label}>Data</p>
        <h1 className={styles.title}>Projects</h1>
      </header>

      <div className={styles.grid}>
        {projects.map((p) => (
          <a key={p.title} href={p.url} className={styles.card} target={p.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
            <div className={styles.cardTop}>
              <span className={styles.tag}>{p.tag}</span>
            </div>
            <h2 className={styles.cardTitle}>{p.title}</h2>
            <p className={styles.cardDesc}>{p.description}</p>
          </a>
        ))}
      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Anne Zeng. All rights reserved.</p>
      </footer>
    </div>
  );
}
