import Image from 'next/image';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        <div className={styles.imageCol}>
          <div className={styles.imageWrap}>
            <Image
              src="/photos/portrait.jpg"
              alt="Anne Zeng"
              width={1030}
              height={1030}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <a href="mailto:info@annezeng.site" className={styles.emailUnderPhoto}>info@annezeng.site</a>
        </div>

        <div className={styles.textCol}>
          <h1 className={styles.name}>Hi, I&apos;m Anne.</h1>
          <p className={styles.tagline}>Toronto-based Sports Photographer</p>

          <blockquote className={styles.quote}>
            &ldquo;Y&apos;ALL KNOW WHAT TODAY IS. TODAY IS TACOOOO TUESDAAAAY&rdquo;
            <cite className={styles.quoteCite}>— LeBron James</cite>
          </blockquote>

          <div className={styles.divider} />

          <div className={styles.contact}>
            <a href="https://www.instagram.com/annezmedia/" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/annezmedia/" target="_blank" rel="noopener noreferrer" className={styles.iconLink} aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>

          <div className={styles.ctas}>
            <a href="/galleries" className={styles.ctaLink}>View galleries →</a>
            <a href="/collection" className={styles.collectionLink}>Check out my card collection!</a>
          </div>
        </div>

      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Anne Zeng. All rights reserved.</p>
      </footer>
    </div>
  );
}
