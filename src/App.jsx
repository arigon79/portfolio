import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import NowSection from './components/NowSection';
import ProjectCards from './components/ProjectCards';
import Work from './components/Work';
import Publication from './components/Publication';
import info from './data/info.json';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ScholarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3L1 9.5l4 2.18V18l7 3.82 7-3.82v-6.32l2-1.09V17h2V9.5L12 3zm6.82 6.05L12 11.72 5.18 9.05 12 5.28l6.82 3.77zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerIconMap = {
  github: GitHubIcon,
  scholar: ScholarIcon,
  x: XIcon,
};

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const { awards, profile } = info;

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

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

        <footer>
          <nav className="footer-links" aria-label="Links">
            {profile.socials.map((social) => {
              const Icon = footerIconMap[social.icon];
              return (
                <a key={social.label} className="icon-link icon-link--plain" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}>
                  {Icon && <Icon />}
                </a>
              );
            })}
          </nav>
          <div className="footer-right">
            <a className="footer-resume" href={profile.resumeHref} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
            <button className="dark-toggle" type="button" onClick={() => setDark((d) => !d)}>
              {dark ? 'Light' : 'Dark'}
            </button>
            <span className="footer-copy">{profile.footerCopyright}</span>
          </div>
        </footer>
      </main>
    </>
  );
}
