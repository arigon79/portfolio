import info from '../data/info.json';

const WORK = info.work.items;

function statusLabel(s) {
  return info.work.statusLabels[s] ?? info.work.statusLabels.completed;
}

export default function Work() {
  return (
    <section id="experience">
      <div className="section-label">Work</div>

      <div className="bp-list">
        {WORK.map((w, i) => {
          const Tag = w.href ? 'a' : 'div';
          return (
            <Tag
              key={w.company}
              className={`bp-pass bp-pass--${w.status}`}
              href={w.href}
              target={w.href ? '_blank' : undefined}
              rel={w.href ? 'noopener noreferrer' : undefined}
              style={{
                '--bp-color': w.color,
                '--bp-delay': `${i * 0.07}s`,
              }}
            >
              <div className="bp-main">
                <div className="bp-row bp-row--head">
                  <div className="bp-brand">
                    <span className="bp-logo">✈</span>
                    <span className="bp-airline">{info.work.airline}</span>
                  </div>
                  <div className={`bp-status bp-status--${w.status}`}>
                    {w.status === 'active' && <span className="bp-pulse" />}
                    {statusLabel(w.status)}
                  </div>
                </div>

                <div className="bp-route">
                  <div className="bp-route-col">
                    <div className="bp-route-label">FROM</div>
                    <div className="bp-route-code">{w.code}</div>
                    <div className="bp-route-name">{w.location}</div>
                  </div>

                  <div className="bp-route-line" aria-hidden="true">
                    <span className="bp-route-plane">✈</span>
                  </div>

                  <div className="bp-route-col">
                    <div className="bp-route-label">ROLE</div>
                    <div className="bp-route-code">{w.role.split(' ').slice(-1)[0].slice(0, 3).toUpperCase()}</div>
                    <div className="bp-route-name">{w.role}</div>
                  </div>
                </div>

                <div className="bp-row bp-row--meta">
                  <div className="bp-meta">
                    <div className="bp-meta-label">Passenger</div>
                    <div className="bp-meta-value">{info.work.passenger}</div>
                  </div>
                  <div className="bp-meta">
                    <div className="bp-meta-label">Carrier</div>
                    <div className="bp-meta-value">{w.company}</div>
                  </div>
                  <div className="bp-meta">
                    <div className="bp-meta-label">Date</div>
                    <div className="bp-meta-value bp-meta-value--mono">{w.dates}</div>
                  </div>
                </div>
              </div>

              <div className="bp-perf" aria-hidden="true">
                <span className="bp-notch bp-notch--top" />
                <span className="bp-notch bp-notch--bot" />
              </div>

              <div className="bp-stub">
                <div className="bp-stub-label">SEAT</div>
                <div className="bp-stub-seat">{(i + 1).toString().padStart(2, '0')}<span>A</span></div>
                <div className="bp-stub-code">{w.code}</div>
                <div className="bp-barcode" aria-hidden="true">
                  {Array.from({ length: 28 }).map((_, j) => (
                    <span key={j} style={{ width: `${1 + (j * 7919 % 4)}px` }} />
                  ))}
                </div>
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}
