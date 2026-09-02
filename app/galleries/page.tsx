import styles from './galleries.module.css';

const galleries = [
  {
    tag: 'Outrigger Canoe',
    title: 'CORA Eastern Sprint Championships',
    description: '2025 Canadian Outrigger Racing Association Eastern Sprint Championships.',
    url: 'https://annezengmedia.pixieset.com/coraeasternsprintchampionships/',
  },
];

export default function GalleriesPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.label}>Galleries</p>
        <h1 className={styles.title}>Event Photography</h1>
      </header>

      <div className={styles.grid}>
        {galleries.map((g) => (
          <a key={g.title} href={g.url} className={styles.card} target="_blank" rel="noopener noreferrer">
            <div className={styles.cardTop}>
              <span className={styles.tag}>{g.tag}</span>
              <span className={styles.arrow}>↗</span>
            </div>
            <h2 className={styles.cardTitle}>{g.title}</h2>
            <p className={styles.cardDesc}>{g.description}</p>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Anne Zeng. All rights reserved.</p>
      </footer>
    </div>
  );
}
