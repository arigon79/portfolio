import { useState, useEffect, useRef } from 'react';
import info from '../data/info.json';

const SLIDES = info.about.slides;
const SPOTIFY_EMBED = info.about.spotifyEmbed;
const TRANSITION_MS = 750;
const AUTOPLAY_MS = 4000;

export default function About() {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [inView, setInView] = useState(false);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setLeaving(current);
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => {
      setLeaving(null);
      setAnimating(false);
    }, TRANSITION_MS);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setInView(visible);
        if (visible) {
          clearInterval(timerRef.current);
          setCurrent(0);
          setLeaving(null);
          setAnimating(false);
        }
      },
      { threshold: 0.25 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => goTo((current + 1) % SLIDES.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timerRef.current);
  }, [current, animating, inView]);

  const slide = SLIDES[current];

  return (
    <div id="about" className="about-wrap" ref={sectionRef}>
      <div className="about-photo-col">
        <div
          className="about-frame"
          style={{ '--slide-color': slide.color }}
        >
          {SLIDES.map((s, i) => {
            const isActive = i === current;
            const isLeaving = i === leaving;
            let cls = 'about-slide';
            if (isLeaving) cls += ' is-leaving';
            else if (isActive) cls += animating ? ' is-entering' : ' is-visible';
            return (
              <div key={s.src} className={cls} aria-hidden={!isActive}>
                <img src={s.src} alt={s.label} />
              </div>
            );
          })}

          <div className="about-dots">
            {SLIDES.map((s, i) => (
              <button
                key={s.src}
                className={`about-dot${i === current ? ' is-active' : ''}`}
                onClick={() => { clearInterval(timerRef.current); goTo(i); }}
                aria-label={`Show ${s.label} photo`}
              />
            ))}
          </div>
        </div>

        <div className="about-caption" key={`caption-${current}`}>
          <span className="about-caption-tag" style={{ color: slide.color }}>{slide.tag}</span>
        </div>
      </div>

      <div className="about-text-col">
        <div className="section-label">About me</div>
        <div className="bio">
          {info.about.bio.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {SPOTIFY_EMBED && (
          <div className="about-spotify">
            <iframe
              style={{ borderRadius: '12px' }}
              src={SPOTIFY_EMBED}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify playlist"
            />
          </div>
        )}
      </div>
    </div>
  );
}
