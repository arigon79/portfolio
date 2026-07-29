import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
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
      <Hero dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main className="page page-content">
        <About />

        <Work />

        <Publication />

        <ProjectCards />

        <section id="miscellaneous">
          <div className="section-label">Achievements</div>
          <p className="ach-lead">{awards.length} awards across hackathons and scholarships.</p>
          <div className="ach-columns">
            {[
              { key: 'hackathon', heading: 'Hackathons & Competitions' },
              { key: 'academic', heading: 'Academic & Scholarships' },
            ].map((group) => {
              const items = awards.filter((a) => a.category === group.key);
              if (!items.length) return null;
              return (
                <div className="ach-col" key={group.key}>
                  <h3 className="ach-col-heading">{group.heading}</h3>
                  <div className="ach-list">
                    {items.map((a, i) => (
                      <article key={a.title} className="ach" style={{ '--i': i }}>
                        <span className={`ach-medal ach-medal--${a.ball}`} aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 4.5h10v3a5 5 0 0 1-10 0z" />
                            <path d="M7 5.5H4.5v1.5A2.5 2.5 0 0 0 7 9.5M17 5.5h2.5v1.5A2.5 2.5 0 0 1 17 9.5" />
                            <path d="M12 12.5V15M9 20h6M10 20l.5-3.5h3l.5 3.5" />
                          </svg>
                        </span>
                        <div className="ach-body">
                          <h3 className="ach-title">{a.title}</h3>
                          <p className="ach-sub">{a.sub} · {a.org}</p>
                        </div>
                        <span className="ach-year">{a.year}</span>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Contact />

        <footer>
          <span className="footer-copy">{profile.footerCopyright}</span>
        </footer>
      </main>
    </>
  );
}
