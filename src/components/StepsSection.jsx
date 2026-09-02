import { useEffect, useRef } from "react";
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

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// A little scroll-driven overshoot so each icon "pops" into place rather
// than just fading up in lockstep with the text — still fully scrubbed by
// scroll position, no fixed-duration animation to fall out of sync with.
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// How much total scroll distance the pinned section consumes, in vh per
// point (plus one unit of "hold" at the top before the first item starts
// revealing). Lower = less scrolling required and a faster-feeling reveal.
const SCROLL_VH_PER_UNIT = 82;

export default function StepsSection() {
  const wrapperRef = useRef(null);
  const itemRefs = useRef([]);
  const counterRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const N = POINTS.length;
    let raf = null;

    const update = () => {
      raf = null;
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = wrapper.offsetHeight - vh;
      const scrolledInto = -rect.top;
      const progress = total > 0 ? clamp(scrolledInto / total, 0, 1) : 0;
      const p = progress * (N + 1); // continuous 0..N+1

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        // Item i ramps from 0 -> 1 while p travels from (i+1) to (i+2)
        const itemP = clamp(p - (i + 1), 0, 1);
        el.style.setProperty("--p", itemP.toFixed(4));
        el.style.setProperty("--pop", easeOutBack(itemP).toFixed(4));
        el.classList.toggle("is-revealed", itemP > 0.02);
        el.classList.toggle("is-current", itemP > 0.02 && itemP < 0.98);
        el.classList.toggle("is-done", itemP >= 0.98);
      });

      const revealedCount = clamp(Math.floor(p), 0, N);
      if (counterRef.current) {
        counterRef.current.textContent = String(revealedCount).padStart(2, "0");
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp(1 - p, 0, 1));
      }
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="why-us"
      ref={wrapperRef}
      className="steps"
      style={{ height: `${(POINTS.length + 1) * SCROLL_VH_PER_UNIT}vh` }}
    >
      <div className="steps__pin">
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
              <span ref={counterRef}>00</span>
              <span className="steps__counter-total">/ {String(POINTS.length).padStart(2, "0")}</span>
            </div>

            <div ref={hintRef} className="steps__hint">
              <span>Keep scrolling</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 4v15M6 13l6 6 6-6" />
              </svg>
            </div>
          </div>

          <ol className="steps__list">
            {POINTS.map((point, i) => {
              const Icon = point.icon;
              const isLast = i === POINTS.length - 1;
              return (
                <li
                  key={point.title}
                  ref={(el) => (itemRefs.current[i] = el)}
                  className="steps__item"
                >
                  <div className="steps__icon" style={{ "--float-delay": `${i * -0.6}s` }}>
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
      </div>
    </section>
  );
}
