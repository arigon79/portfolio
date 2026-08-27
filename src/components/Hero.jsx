import { useEffect, useState } from 'react';
import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a-2.063 2.063 0 1 1 0-4.127 2.063 2.063 0 0 1 0 4.127zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

const hero = info.hero;
const navLinks = hero.navLinks;
const heroIconMap = {
  email: EmailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  web: GlobeIcon,
  scholar: ScholarIcon,
};
const TYPING_LINES = [{ key: 'cmd', text: hero.command, speed: 70 }];
const ROLE_LINES = hero.roles;
const HEADING_TRANSLATIONS = hero.headingTranslations;
const NAV_KEY_BY_HREF = {
  '#about': 'about',
  '#experience': 'experience',
  '#projects': 'projects',
  '#miscellaneous': 'misc',
  '#memories': 'memories',
  '#contact': 'contact',
};

function scrollTo(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Hero({ dark, onToggleDark }) {
  const { t, lang, toggleLang } = useLanguage();
  const [typed, setTyped] = useState({ cmd: '', heading: '', role: '' });
  const [typingDone, setTypingDone] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const revealAndScrollTo = (href) => {
    setNavScrolled(true);
    setMenuOpen(false);
    scrollTo(href);
  };

  useEffect(() => {
    let cancelled = false;

    const typeLine = async (key, text, speed) => {
      for (let i = 1; i <= text.length; i += 1) {
        if (cancelled) return;
        setTyped((prev) => ({ ...prev, [key]: text.slice(0, i) }));
        await wait(speed);
      }
    };

    const deleteLine = async (key, text, speed) => {
      for (let i = text.length - 1; i >= 0; i -= 1) {
        if (cancelled) return;
        setTyped((prev) => ({ ...prev, [key]: text.slice(0, i) }));
        await wait(speed);
      }
    };

    const run = async () => {
      await wait(400);
      if (cancelled) return;

      await typeLine('cmd', TYPING_LINES[0].text, TYPING_LINES[0].speed);
      if (cancelled) return;
      await wait(280);

      setShowCursor(true);
      await typeLine('heading', HEADING_TRANSLATIONS[0], 82);
      if (cancelled) return;
      await wait(280);

      await typeLine('role', ROLE_LINES[0], 48);
      if (!cancelled) setTypingDone(true);

      const loopHeading = async () => {
        let index = 0;
        while (!cancelled) {
          await wait(1800);
          if (cancelled) return;
          await deleteLine('heading', HEADING_TRANSLATIONS[index], 36);
          index = (index + 1) % HEADING_TRANSLATIONS.length;
          if (cancelled) return;
          await typeLine('heading', HEADING_TRANSLATIONS[index], 70);
        }
      };

      const loopRole = async () => {
        let index = 0;
        while (!cancelled) {
          await wait(2200);
          if (cancelled) return;
          await deleteLine('role', ROLE_LINES[index], 30);
          index = (index + 1) % ROLE_LINES.length;
          if (cancelled) return;
          await typeLine('role', ROLE_LINES[index], 46);
        }
      };

      await Promise.all([loopHeading(), loopRole()]);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => setNavScrolled(window.scrollY > 24);
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    if (!navScrolled) setMenuOpen(false);
  }, [navScrolled]);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1));

    const update = () => {
      const offset = window.scrollY + 140;
      let active = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (offset >= top) active = id;
      }
      setActiveSection(active);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <header className={`hero-nav${navScrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
        <a href="#" className="hero-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span className="hero-logo" aria-hidden="true">
            <img src={hero.logoSrc} alt="" />
          </span>
        </a>
        <button
          className="hero-menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="hero-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="hero-nav-actions">
          <nav id="hero-nav-links" className="hero-nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={activeSection === link.href.slice(1) ? 'is-active' : ''}
                onClick={(e) => { e.preventDefault(); revealAndScrollTo(link.href); }}
              >
                {t.nav[NAV_KEY_BY_HREF[link.href]] ?? link.label}
              </a>
            ))}
          </nav>
          <div className="hero-toggle-group">
            <button
              className="hero-dark-toggle hero-lang-toggle"
              type="button"
              onClick={toggleLang}
              aria-label={t.langToggle.ariaLabel}
              lang={lang === 'en' ? 'zh' : 'en'}
            >
              {t.langToggle.label}
            </button>
            <button
              className="hero-dark-toggle"
              type="button"
              onClick={onToggleDark}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? t.darkToggle.light : t.darkToggle.dark}
            </button>
          </div>
        </div>
      </header>

      <div className="hero-center">
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot terminal-dot--red" />
            <span className="terminal-dot terminal-dot--yellow" />
            <span className="terminal-dot terminal-dot--green" />
            <span className="terminal-title">{hero.terminalTitle}</span>
          </div>
          <div className="terminal-body">
            <div className="terminal-portrait" aria-hidden="true">
              <img src={hero.portraitSrc} alt="" />
            </div>
            <div className="terminal-content">
              <p className="terminal-line terminal-line--cmd">
                <span className="terminal-prompt">{hero.promptUser}</span>
                <span className="terminal-muted"> ~ </span>
                <span className="terminal-prompt">%</span>
                <span className="terminal-typewriter">{typed.cmd}</span>
              </p>
              <h1 className="terminal-heading">
                <span className="terminal-wave" aria-hidden="true">👋</span>
                <span className="terminal-typewriter">{typed.heading}</span>
                {showCursor && (
                  <span className={`terminal-cursor${cursorOn ? ' is-on' : ''}`} aria-hidden="true" />
                )}
                <span className="sr-only">Hi, I am Ariji. I am Ariji in Chinese, Korean, Japanese, and Spanish.</span>
              </h1>
              <p className={`terminal-role${typingDone ? ' is-complete' : ''}`}>
                <span className="terminal-role-prompt">&gt; </span>
                <span className="terminal-typewriter">{typed.role}</span>
              </p>
              <div className={`terminal-actions${typingDone ? ' is-visible' : ''}`}>
                <div className="hero-socials">
                  {hero.socials.map((social) => {
                    const Icon = heroIconMap[social.icon];
                    const isExternal = !social.href.startsWith('mailto:');
                    return (
                      <a
                        key={social.label}
                        className={`hero-social-btn hero-social-btn--${social.icon}`}
                        href={social.href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        aria-label={social.label}
                      >
                        {Icon && <Icon />}
                      </a>
                    );
                  })}
                  <a
                    className="hero-resume-btn"
                    href={info.profile.resumeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.resume}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
