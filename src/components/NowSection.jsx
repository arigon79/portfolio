import { useEffect, useMemo, useRef, useState } from 'react';
import info from '../data/info.json';

const MESSAGES = info.now.messages;

export default function NowSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef([]);
  const bodyRef = useRef(null);
  const msgs = useMemo(() => MESSAGES.map((m, i) => ({
    ...m,
    isFirst: i === 0 || MESSAGES[i - 1].from !== m.from,
    isLast: i === MESSAGES.length - 1 || MESSAGES[i + 1].from !== m.from,
  })), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        setShowTyping(true);
        const BASE = 600;
        const STEP = 1000;

        msgs.forEach((_, i) => {
          const t = setTimeout(() => {
            setVisibleCount(i + 1);
            if (i === msgs.length - 1) setShowTyping(false);
          }, BASE + i * STEP);
          timerRef.current.push(t);
        });
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      timerRef.current.forEach(clearTimeout);
    };
  }, [msgs]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [visibleCount, showTyping]);

  return (
    <section id="now" ref={sectionRef}>
      <div className="section-label">What I&apos;m up to</div>

      <div className="im-wrap">
        <div className="im-phone">
          <div className="im-status-bar">
            <span className="im-time">9:41</span>
            <div className="im-status-icons">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.4" />
                <rect x="4" y="2.5" width="3" height="9.5" rx="1" opacity="0.6" />
                <rect x="8" y="1" width="3" height="11" rx="1" opacity="0.8" />
                <rect x="12" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor" aria-hidden="true">
                <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5.1L14.5 3.7C12.7 1.7 10.2.5 7.5.5S2.3 1.7.5 3.7l1.3 1.4C3.2 3.5 5.2 2.5 7.5 2.5z" opacity="0.4" />
                <path d="M7.5 5.5c1.5 0 2.9.6 3.9 1.6l1.3-1.4C11.4 4.3 9.6 3.5 7.5 3.5S3.6 4.3 2.3 5.7l1.3 1.4c1-1 2.4-1.6 3.9-1.6z" opacity="0.7" />
                <circle cx="7.5" cy="10" r="1.5" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor" aria-hidden="true">
                <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
                <rect x="1.5" y="2.5" width="17" height="7" rx="1.5" />
                <path d="M23 4.5v3a1.5 1.5 0 0 0 0-3z" opacity="0.4" />
              </svg>
            </div>
          </div>

          <div className="im-header">
            <button className="im-back" aria-label="Back">
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 1 1 8 9 15" />
              </svg>
            </button>
            <div className="im-contact">
              <div className="im-contact-avatar">
                {info.now.contactAvatar.startsWith('/') ? (
                  <img src={info.now.contactAvatar} alt={info.now.contactName} />
                ) : (
                  <span>{info.now.contactAvatar}</span>
                )}
              </div>
              <div className="im-contact-info">
                <div className="im-contact-name">{info.now.contactName}</div>
                <div className="im-contact-status">{info.now.contactStatus}</div>
              </div>
            </div>
            <div className="im-header-actions">
              <button aria-label="Video call" className="im-action-btn">
                <svg width="18" height="14" viewBox="0 0 22 16" fill="currentColor" aria-hidden="true">
                  <path d="M14 3H2C1.4 3 1 3.4 1 4v8c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1z" />
                  <path d="M15 6l6-3v10l-6-3V6z" />
                </svg>
              </button>
              <button aria-label="Info" className="im-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="im-body" ref={bodyRef}>
            <div className="im-timestamp">{info.now.timestamp}</div>

            {msgs.slice(0, visibleCount).map((m, i) => {
              const isMe = m.from === 'me';
              return (
                <div
                  key={`${m.from}-${m.text}`}
                  className={`im-row${isMe ? ' im-row--me' : ' im-row--friend'} is-visible`}
                  style={{ '--delay': '0s' }}
                >
                  {!isMe && (
                    <div className={`im-avatar${m.isFirst ? '' : ' im-avatar--ghost'}`} aria-hidden="true">
                      {m.isFirst && (info.now.contactAvatar.startsWith('/') ? (
                        <img src={info.now.contactAvatar} alt={info.now.contactName} />
                      ) : (
                        <span>{info.now.contactAvatar}</span>
                      ))}
                    </div>
                  )}

                  <div className={`im-bubble${m.isFirst ? ' is-first' : ''}${m.isLast ? ' is-last' : ''}`}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {showTyping && visibleCount < msgs.length && (
              <div className="im-row im-row--friend is-visible">
                <div className="im-avatar" aria-hidden="true"><span>{info.now.contactAvatar.startsWith('/') ? '' : info.now.contactAvatar}</span></div>
                <div className="im-bubble im-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <div className="im-input-bar">
            <button className="im-input-icon" aria-label="Apps">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 14h10M14 9v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="im-input-field">
              <span className="im-input-placeholder">iMessage</span>
            </div>
            <button className="im-input-icon" aria-label="Voice">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
