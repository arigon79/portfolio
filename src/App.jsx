import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import ProjectCards from './components/ProjectCards';
import Work from './components/Work';
import Publication from './components/Publication';
import MemoryBoard from './components/MemoryBoard';
import Contact from './components/Contact';
import PixelBackground from './components/PixelBackground';
import PixelDrexelDragon from './components/PixelDrexelDragon';
import PixelCritters from './components/PixelCritters';
import info from './data/info.json';
import { LanguageProvider, useLanguage } from './context/LanguageContext';


function AppContent() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { awards, profile } = info;
  const { t } = useLanguage();

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
    <div className="portfolio-app-root">
      <PixelBackground dark={dark} />
      <PixelDrexelDragon />
      <PixelCritters />
      <Hero dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="page page-content">
        <About />

        <Work />

        <Publication />

        <ProjectCards />

        <section id="miscellaneous">
          <div className="section-label">{t.section.achievements}</div>
          <p className="ach-lead">{t.achievements.lead(awards.length)}</p>
          <div className="ach-columns">
            {[
              { key: 'hackathon', heading: t.achievements.hackathons },
              { key: 'academic', heading: t.achievements.academic },
            ].map((group) => {
              const items = awards.filter((a) => a.category === group.key);
              if (!items.length) return null;
              return (
                <div className="ach-col" key={group.key}>
                  <h3 className="ach-col-heading">{group.heading}</h3>
                  <div className="ach-list">
                    {items.map((a, i) => (
                      <article key={a.title} className="ach" style={{ '--i': i }}>
                        <div className={`ach-medal ach-medal--${a.ball}`} aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" />
                            <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
                            <path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V6a2 2 0 0 1 2-2Z" />
                          </svg>
                        </div>
                        <div className="ach-body">
                          <div className="ach-top-row">
                            <h4 className="ach-title">{a.title}</h4>
                            <span className="ach-year">{a.year}</span>
                          </div>
                          <p className="ach-sub">{a.sub}</p>
                          <div className="ach-footer-row">
                            <span className="ach-org-tag">{a.org}</span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <MemoryBoard />

        <Contact />

        <footer>
          <span className="footer-copy">{profile.footerCopyright}</span>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
