import info from '../data/info.json';
import { useLanguage } from '../context/LanguageContext';
import { normalizeResearchGraphic } from '../utils/ongoingResearch';

function Monocular3DGraphic() {
  return (
    <svg viewBox="0 0 640 300" role="presentation" focusable="false">
      <g className="ongoing-graphic-grid">
        <path d="M40 244H600" />
        <path d="M90 210H550" />
        <path d="M150 174H490" />
        <path d="M220 138H420" />
        <path d="M82 244 262 112M190 244 292 112M298 244 322 112M406 244 352 112M514 244 382 112" />
      </g>

      <g className="ongoing-graphic-camera">
        <path d="M52 105h74l18 18v64l-18 18H52l-18-18v-64Z" />
        <circle cx="90" cy="155" r="27" />
        <circle cx="90" cy="155" r="11" />
      </g>

      <g className="ongoing-graphic-rays">
        <path d="M117 140 246 100M117 155 246 155M117 170 246 210" />
        <path d="M117 140 438 76M117 155 438 155M117 170 438 234" />
      </g>

      <g className="ongoing-graphic-cube ongoing-graphic-cube--near">
        <path d="m247 100 72 20v91l-72-20Z" />
        <path d="m247 100 42-26 72 20-42 26Z" />
        <path d="m319 120 42-26v91l-42 26Z" />
      </g>

      <g className="ongoing-graphic-cube ongoing-graphic-cube--far">
        <path d="m438 76 92 26v132l-92-26Z" />
        <path d="m438 76 50-31 92 26-50 31Z" />
        <path d="m530 102 50-31v132l-50 31Z" />
      </g>

      <path className="ongoing-graphic-measure" d="M390 66v170m-11-158 11-12 11 12m-22 146 11 12 11-12" />
      <circle className="ongoing-graphic-pulse" cx="390" cy="155" r="10" />
    </svg>
  );
}

function GazeGraphic() {
  return (
    <svg viewBox="0 0 640 300" role="presentation" focusable="false">
      <g className="ongoing-graphic-eye">
        <path d="M36 145c42-62 122-62 164 0-42 62-122 62-164 0Z" />
        <circle cx="118" cy="145" r="35" />
        <circle cx="118" cy="145" r="14" />
        <circle cx="127" cy="135" r="5" />
      </g>

      <g className="ongoing-graphic-gaze-path">
        <path d="M133 145 350 92" />
        <path d="M133 145 410 166" />
        <path d="M133 145 334 226" />
        <circle cx="350" cy="92" r="8" />
        <circle cx="410" cy="166" r="8" />
        <circle cx="334" cy="226" r="8" />
      </g>

      <g className="ongoing-graphic-code-panel">
        <rect x="278" y="48" width="286" height="204" rx="18" />
        <path d="M278 84h286" />
        <circle cx="302" cy="66" r="6" />
        <circle cx="323" cy="66" r="6" />
        <circle cx="344" cy="66" r="6" />
        <path d="m319 119-20 18 20 18m32-36 20 18-20 18m58-40-24 47" />
        <path d="M304 191h94M304 215h148" />
      </g>

      <g className="ongoing-graphic-agent">
        <path d="M456 108h116a24 24 0 0 1 24 24v41a24 24 0 0 1-24 24h-50l-26 24 6-24h-46a24 24 0 0 1-24-24v-41a24 24 0 0 1 24-24Z" />
        <path d="M462 153h10l7-18 13 36 12-28 10 19 8-9h12" />
      </g>
    </svg>
  );
}

function FallbackGraphic() {
  return (
    <svg viewBox="0 0 640 300" role="presentation" focusable="false">
      <g className="ongoing-graphic-fallback">
        <circle cx="210" cy="150" r="58" />
        <circle cx="430" cy="96" r="36" />
        <circle cx="430" cy="212" r="44" />
        <path d="M266 136 394 103M266 166l121 37M430 132v36" />
      </g>
    </svg>
  );
}

function ResearchGraphic({ type }) {
  const graphic = normalizeResearchGraphic(type);

  return (
    <div className={`pub-thumb ongoing-research-visual ongoing-research-visual--${graphic}`} aria-hidden="true">
      {graphic === 'monocular3d' && <Monocular3DGraphic />}
      {graphic === 'gaze' && <GazeGraphic />}
      {graphic === 'fallback' && <FallbackGraphic />}
    </div>
  );
}

export default function OngoingResearch() {
  const { t } = useLanguage();

  return (
    <section className="ongoing-research" aria-labelledby="ongoing-research-heading">
      <div className="ongoing-research-heading">
        <span className="ongoing-research-kicker" aria-hidden="true">NOW</span>
        <h3 id="ongoing-research-heading">{t.researchProfile.ongoingResearch}</h3>
      </div>

      <div className="pub-list ongoing-research-grid">
        {info.ongoingResearch.map((research) => (
          <article className="pub-row ongoing-research-card" key={research.title}>
            <ResearchGraphic type={research.graphic} />

            <div className="pub-content ongoing-research-card-body">
              <div className="ongoing-research-meta">
                <span className="ongoing-research-status">
                  <span aria-hidden="true" />
                  {t.researchProfile.ongoingStatus}
                </span>
                <span className="ongoing-research-lab">{research.lab}</span>
              </div>

              <h4 className="pub-title">{research.title}</h4>
              <p className="research-paper-takeaway">{research.description}</p>

              <div className="research-paper-tags ongoing-research-tags" aria-label="Research topics">
                {research.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
