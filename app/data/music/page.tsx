import MusicDashboard from '@/components/MusicDashboard';
import styles from './music.module.css';

export const metadata = { title: 'Anne Zeng' };

export default function MusicPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/data" className={styles.back}>Projects</a>
        <p className={styles.label}>Data</p>
        <h1 className={styles.title}>Listening History</h1>
      </header>
      <div className={styles.dashboard}>
        <MusicDashboard />
      </div>
    </div>
  );
}
