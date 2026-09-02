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
            <a href="https://www.instagram.com/annezmedia/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>Instagram</a>
            <a href="https://www.facebook.com/annezmedia/" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>Facebook</a>
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
