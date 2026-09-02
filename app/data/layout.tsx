'use client';
import { useState, useEffect } from 'react';

const COOKIE = 'data_unlocked';

function getCookie() {
  return document.cookie.split(';').some(c => c.trim().startsWith(COOKIE + '=1'));
}

function setCookie() {
  document.cookie = `${COOKIE}=1; path=/; SameSite=Lax`;
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === 'rosie') {
      setCookie();
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

export default function DataLayout({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getCookie()) setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) return null;
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <>{children}</>;
}
