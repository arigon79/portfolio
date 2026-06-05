import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import NowSection from './components/NowSection';
import ProjectCards from './components/ProjectCards';
import Work from './components/Work';
import Publication from './components/Publication';
import Contact from './components/Contact';
import info from './data/info.json';


export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { awards, profile } = info;

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
    );
    document.querySelectorAll('main section').forEach((el) => sectionObserver.observe(el));

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );
    document.querySelectorAll('.bp-pass').forEach((el) => cardObserver.observe(el));

    return () => { sectionObserver.disconnect(); cardObserver.disconnect(); };
  }, []);

  return (
    <>
      <Hero />

      <main className="page page-content">
        <About />

        <NowSection />

        <Work />

        <Publication />

        <ProjectCards />

        <section id="miscellaneous">
          <div className="section-label">Awards</div>
          <div className="pk-header">
            <span className="pk-dex-label">Pokédex</span>
            <span className="pk-dex-count">
              <span className="pk-dex-caught">{awards.length}</span>
              <span className="pk-dex-sep"> / </span>
              <span>{awards.length}</span>
              <span className="pk-dex-word"> caught</span>
            </span>
          </div>
          <div className="pk-grid">
            {awards.map((a, i) => (
              <div key={a.title} className="pk-item" style={{ '--i': i }}>
                <div className={`pk-ball pk-ball--${a.ball}`}>
                  <span className="pk-shine" aria-hidden="true" />
                </div>
                <span className="pk-num">#{String(i + 1).padStart(2, '0')}</span>
                <div className="pk-card" role="tooltip">
                  <div className={`pk-card-ball pk-ball pk-ball--${a.ball} pk-ball--sm`}>
                    <span className="pk-shine" aria-hidden="true" />
                  </div>
                  <div className="pk-card-body">
                    <div className="pk-card-title">{a.title}</div>
                    <div className="pk-card-row">
                      <span className={`pk-type pk-type--${a.ball}`}>{a.ball}</span>
                      <span className="pk-card-year">{a.year}</span>
                    </div>
                    <div className="pk-card-sub">{a.sub} · {a.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Contact />

        <footer>
          <span className="footer-copy">{profile.footerCopyright}</span>
          <button className="dark-toggle" type="button" onClick={() => setDark((d) => !d)}>
            {dark ? 'Light' : 'Dark'}
          </button>
        </footer>
      </main>
    </>
  );
}
