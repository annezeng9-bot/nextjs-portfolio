import styles from './data.module.css';

export const metadata = { title: 'Anne Zeng' };

const projects = [
  {
    tag: 'Analytics',
    title: 'Jalen Tracker',
    description: 'A rigorous, data-driven study on the undeniable winning advantage of having players named Jalen on an NBA roster.',
    url: '/data/jalen',
  },
  {
    tag: 'Data',
    title: 'Workout Log',
    description: 'Personal workout dashboard. Tracking total weight lifted across sessions, with detailed breakdowns by exercise group and other relevant metrics.',
    url: '/data/workout',
  },
];

export default function ProjectsPage() {
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
    </div>
  );
}
