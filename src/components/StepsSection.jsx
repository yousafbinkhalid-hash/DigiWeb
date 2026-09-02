import "./StepsSection.css";

/* ---------------------------------------------------------------------- */
/*  Icons                                                                  */
/* ---------------------------------------------------------------------- */

const IconIdea = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 3Z" />
  </svg>
);

const IconScratch = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 2v6M12 2c-2.5 1.5-4 4-4 7a4 4 0 0 0 8 0c0-3-1.5-5.5-4-7Z" />
    <path d="M9 21h6l-1.2-4.5h-3.6L9 21Z" />
  </svg>
);

const IconStaff = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="17.5" cy="9" r="2.4" />
    <path d="M15.7 14.2c2.4.3 4.3 2.1 4.3 4.8" />
  </svg>
);

const IconTransparent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconSupport = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M4 13a8 8 0 0 1 16 0" />
    <rect x="2.5" y="13" width="4.5" height="6" rx="1.5" />
    <rect x="17" y="13" width="4.5" height="6" rx="1.5" />
    <path d="M20 19a5 5 0 0 1-5 3h-2" />
  </svg>
);

/* ---------------------------------------------------------------------- */
/*  Content                                                                */
/* ---------------------------------------------------------------------- */

const POINTS = [
  {
    icon: IconIdea,
    title: "We Make Your Idea Step Into Business",
    description: "From a rough concept to a working product — we build the plan and the platform to get you there.",
  },
  {
    icon: IconScratch,
    title: "Making Solutions From Scratch To Success",
    description: "No templates, no shortcuts — every solution is engineered around your specific goals.",
  },
  {
    icon: IconStaff,
    title: "Dedicated Desired Staff",
    description: "A hand-picked team assigned to your project alone, not juggled across a dozen others.",
  },
  {
    icon: IconTransparent,
    title: "Transparent Process, Every Step",
    description: "Clear timelines, honest pricing, and full visibility into progress from day one.",
  },
  {
    icon: IconSupport,
    title: "Support That Doesn't End At Launch",
    description: "We stay on to monitor, maintain and improve your product long after go-live.",
  },
];

/**
 * StepsSection
 *
 * Unlike the other sections, this one no longer reads the page's own
 * scroll position — the whole site now pages between sections one wheel
 * tick/swipe/arrow-key at a time (see SectionPager), so "keep scrolling to
 * reveal the next point" instead means "keep scrolling while this section
 * is active". SectionPager feeds that progress in as `activeStep`
 * (0..POINTS.length): each additional scroll tick while this slide is
 * active increments it by one before control moves on to the next slide,
 * and each item's reveal/pop-in is animated by a CSS transition (see
 * StepsSection.css) rather than a per-frame scroll calculation.
 */
export default function StepsSection({ activeStep = 0 }) {
  const N = POINTS.length;

  return (
    <section id="why-us" className="steps">
      <div className="steps__grid" aria-hidden="true" />

      <div className="steps__inner">
        <div className="steps__head">
          <span className="steps__eyebrow">
            <span className="steps__eyebrow-dot" />
            Why DigiWeb
          </span>
          <h2 className="steps__heading">What Sets Us Apart</h2>
          <p className="steps__subheading">Five reasons growing brands build with us.</p>

          <div className="steps__counter" aria-hidden="true">
            <span>{String(Math.min(activeStep, N)).padStart(2, "0")}</span>
            <span className="steps__counter-total">/ {String(N).padStart(2, "0")}</span>
          </div>

          <div className="steps__hint" style={{ opacity: activeStep >= N ? 0 : 1 }}>
            <span>Keep scrolling</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 4v15M6 13l6 6 6-6" />
            </svg>
          </div>
        </div>

        <ol className="steps__list">
          {POINTS.map((point, i) => {
            const Icon = point.icon;
            const isLast = i === N - 1;
            const revealed = activeStep > i;
            const isCurrent = activeStep === i + 1;
            return (
              <li
                key={point.title}
                className={`steps__item ${revealed ? "is-revealed" : ""} ${isCurrent ? "is-current" : ""} ${revealed && !isCurrent ? "is-done" : ""}`}
                style={{ "--p": revealed ? 1 : 0, "--float-delay": `${i * -0.6}s` }}
              >
                <div className="steps__icon">
                  <Icon />
                </div>
                <div className="steps__rail">
                  <span className="steps__number">{String(i + 1).padStart(2, "0")}</span>
                  {!isLast && (
                    <span className="steps__connector">
                      <span className="steps__connector-fill" />
                    </span>
                  )}
                </div>
                <div className="steps__body">
                  <h3 className="steps__title">{point.title}</h3>
                  <p className="steps__desc">{point.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
