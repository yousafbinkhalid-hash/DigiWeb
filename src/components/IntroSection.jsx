import { useEffect, useRef, useState } from "react";
import "./IntroSection.css";

/* ---------------------------------------------------------------------- */
/*  Icons                                                                  */
/* ---------------------------------------------------------------------- */

const IconStrategy = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const IconEngineering = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="5" width="17" height="12" rx="2" />
    <path d="m8 10-2 2 2 2M16 10l2 2-2 2M13 9l-2 6" />
  </svg>
);

const IconGrowth = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="m3.5 16 6-6 4 4 7-8" />
    <path d="M15.5 5.5h5v5" />
  </svg>
);

/* ---------------------------------------------------------------------- */
/*  Content                                                                */
/* ---------------------------------------------------------------------- */

const STATS = [
  { label: "Years Experience", value: 8, suffix: "+" },
  { label: "Happy Clients", value: 120, suffix: "+" },
  { label: "Projects Completed", value: 250, suffix: "+" },
  { label: "Team Experts", value: 35, suffix: "+" },
];

const FEATURES = [
  {
    icon: IconStrategy,
    title: "Strategy-Led Design",
    description: "Every pixel serves a purpose — grounded in research, not guesswork.",
  },
  {
    icon: IconEngineering,
    title: "Clean Engineering",
    description: "Maintainable, well-tested code built to scale with your business.",
  },
  {
    icon: IconGrowth,
    title: "Measurable Growth",
    description: "We track what matters and iterate toward real, reportable results.",
  },
];

/* ---------------------------------------------------------------------- */
/*  Scroll-driven reveal hook                                             */
/* ---------------------------------------------------------------------- */

function useReveal(threshold = 0.25) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ---------------------------------------------------------------------- */
/*  Count-up hook — animates once the parent reports visible               */
/* ---------------------------------------------------------------------- */

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatCounter({ stat, active, delay }) {
  const value = useCountUp(stat.value, active);
  return (
    <div className="intro__stat" style={{ transitionDelay: `${delay}ms` }}>
      <strong className="intro__stat-value">
        {value}
        {stat.suffix}
      </strong>
      <span className="intro__stat-label">{stat.label}</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Section                                                                */
/* ---------------------------------------------------------------------- */

export default function IntroSection() {
  const sectionRef = useRef(null);
  const [headerRef, headerVisible] = useReveal(0.3);
  const [statsRef, statsVisible] = useReveal(0.35);
  const [gridRef, gridVisible] = useReveal(0.2);

  // Continuous parallax tied to scroll position (not just a one-time reveal)
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    let raf = null;

    const update = () => {
      raf = null;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (section below viewport) -> 0 (centered) -> 1 (above viewport)
      const progress = (vh - rect.top) / (vh + rect.height) - 0.5;
      node.style.setProperty("--scroll-progress", progress.toFixed(4));
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
    <section id="about" ref={sectionRef} className="intro">
      <div className="intro__blob intro__blob--a" aria-hidden="true" />
      <div className="intro__blob intro__blob--b" aria-hidden="true" />
      <div className="intro__grid" aria-hidden="true" />

      <div className="intro__inner">
        <div
          ref={headerRef}
          className={`intro__header ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="intro__eyebrow">
            <span className="intro__eyebrow-dot" />
            Who We Are
          </span>
          <h2 className="intro__heading">
            A Digital Team Obsessed
            <br />
            With <em>Real Results</em>
          </h2>
          <p className="intro__paragraph">
            DigiWeb is a small, senior team of designers and engineers who partner with
            ambitious brands to plan, build and grow their digital presence — no bloated
            process, no hand-offs, just work that ships and performs.
          </p>
        </div>

        <div
          ref={statsRef}
          className={`intro__stats ${statsVisible ? "is-visible" : ""}`}
        >
          {STATS.map((stat, i) => (
            <StatCounter key={stat.label} stat={stat} active={statsVisible} delay={i * 90} />
          ))}
        </div>

        <div
          ref={gridRef}
          className={`intro__features ${gridVisible ? "is-visible" : ""}`}
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="intro__card"
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                <div className="intro__card-icon">
                  <Icon />
                </div>
                <h3 className="intro__card-title">{feature.title}</h3>
                <p className="intro__card-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
