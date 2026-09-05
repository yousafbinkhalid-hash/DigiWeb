import { useCallback, useEffect, useRef, useState } from "react";
import globalServicesImage from "../assets/global-services.jpg";
import "./ServicesSection.css";

/* ---------------------------------------------------------------------- */
/*  Inline icon set — used inside the floating description card only      */
/* ---------------------------------------------------------------------- */

const IconDesign = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 3.5 9 7.5c0 2.5-2 4-4 4h-2a2 2 0 0 0-1.5 3.3c.4.5.5 1 .1 1.5-.4.5-1 1.7-1.6 1.7Z" />
    <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="11" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="15.8" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const IconDev = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="m9 8-4 4 4 4" />
    <path d="m15 8 4 4-4 4" />
    <path d="m13 5-2 14" />
  </svg>
);

const IconSeo = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.4-4.4" />
    <path d="M8 10.5c.3-2 1.2-3 2.5-3" />
  </svg>
);

const IconUx = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9 9h6M9 13h6M9 17h3" />
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
/*  Default content — override via props                                  */
/* ---------------------------------------------------------------------- */

const DEFAULT_SERVICES = [
  {
    id: "design",
    label: "Web Design",
    icon: IconDesign,
    description: "Modern, on-brand interfaces crafted to convert visitors into customers.",
  },
  {
    id: "dev",
    label: "Development",
    icon: IconDev,
    description: "Fast, secure, scalable builds using clean and maintainable code.",
  },
  {
    id: "seo",
    label: "SEO & Marketing",
    icon: IconSeo,
    description: "Data-driven strategies that grow your visibility and organic traffic.",
  },
  {
    id: "ux",
    label: "UI/UX Design",
    icon: IconUx,
    description: "Intuitive, research-backed experiences that keep users coming back.",
  },
  {
    id: "support",
    label: "Hosting & Support",
    icon: IconSupport,
    description: "Reliable hosting and responsive support, day and night.",
  },
];

// Base angle (degrees) of each node around the nucleus, evenly spaced,
// starting at 12 o'clock. The orbit ring's own rotation is added on top of
// these in CSS, so nodes keep revolving continuously.
const NODE_ANGLES = [-90, -18, 54, 126, 198];

const PROXIMITY_RADIUS = 110; // px — how close the cursor must get to ripple a node
const ACTIVATE_RADIUS = 64; // px — how close the cursor must get to "catch" a node
const RELEASE_RADIUS = 105; // px — larger than ACTIVATE_RADIUS so a caught node doesn't
// let go the instant the cursor drifts a little — a generous, forgiving hover zone
// instead of requiring a precise landing on a small, slowly-orbiting target.
const TYPE_SPEED_MS = 16; // ms per character for the typewriter effect
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Types `text` out one character at a time and returns the progressively
 * revealed string. Respects prefers-reduced-motion by showing the full
 * text immediately instead of animating it.
 */
function useTypewriter(text, speed = TYPE_SPEED_MS) {
  const [trackedText, setTrackedText] = useState(text);
  const [output, setOutput] = useState(text || "");
  const [done, setDone] = useState(true);

  // Reset synchronously during render when the target text changes — React's
  // recommended pattern for "adjusting state when a prop changes", instead
  // of an effect whose body would call setState unconditionally.
  if (text !== trackedText) {
    setTrackedText(text);
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!text || reduceMotion) {
      setOutput(text || "");
      setDone(true);
    } else {
      setOutput("");
      setDone(false);
    }
  }

  // Progressively reveal characters via a timer — a genuine external
  // subscription, so setState only ever happens inside its callback.
  useEffect(() => {
    if (!text) return undefined;
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOutput(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return [output, done];
}

/**
 * ServicesSection
 *
 * Props:
 *  - eyebrow      {string}  Small tag line above the heading
 *  - heading      {string}  Section heading
 *  - subheading   {string}  Supporting paragraph
 *  - services     {Array}   Override the 5 default services — [{id, label, icon, description}]
 */
export default function ServicesSection({
  eyebrow = "What We Offer",
  heading = "Our Services",
  subheading = "Everything you need to launch and grow, all under one roof.",
  services = DEFAULT_SERVICES,
}) {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const glowRef = useRef(null);
  const popoverRef = useRef(null);
  const rafRef = useRef(null);
  const popRafRef = useRef(null);
  const nodeRefs = useRef([]);
  const [activeId, setActiveId] = useState(null);

  const list = (services && services.length ? services : DEFAULT_SERVICES).slice(0, 5);

  const handlePointerMove = useCallback((e) => {
    const node = sectionRef.current;
    const glow = glowRef.current;
    if (!node || !glow) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { clientX, clientY } = e;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      glow.style.setProperty("--glow-x", `${x}px`);
      glow.style.setProperty("--glow-y", `${y}px`);
      glow.style.opacity = "1";

      // Ripple each node based on cursor proximity to its badge, and track
      // the nearest one so we can "catch" it magnetically — no need to land
      // a precise click on a small, slowly-orbiting target.
      let nearestId = null;
      let nearestDist = Infinity;
      const distances = {};

      nodeRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        const id = el.dataset.id;
        distances[id] = dist;

        const proximity = clamp(1 - dist / PROXIMITY_RADIUS, 0, 1);
        el.style.setProperty("--proximity", proximity.toFixed(3));

        if (dist < nearestDist) {
          nearestDist = dist;
          nearestId = id;
        }
      });

      setActiveId((cur) => {
        if (nearestDist <= ACTIVATE_RADIUS) return nearestId;
        // Hysteresis: once caught, keep a node active until the cursor
        // drifts well past it, instead of dropping out right at the edge.
        if (cur && distances[cur] !== undefined && distances[cur] <= RELEASE_RADIUS) return cur;
        return null;
      });
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    nodeRefs.current.forEach((el) => el && el.style.setProperty("--proximity", "0"));
    setActiveId(null);
  }, []);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  // Keep the floating description card glued to whichever node is active —
  // it tracks the badge every frame while it eases inward toward the core,
  // and keeps following if the badge is still mid-transition.
  useEffect(() => {
    const popover = popoverRef.current;
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (popRafRef.current) cancelAnimationFrame(popRafRef.current);
    if (!activeId || !popover || !section || !visual) return undefined;

    const idx = list.findIndex((s) => s.id === activeId);
    const badge = nodeRefs.current[idx];
    if (!badge) return undefined;

    const update = () => {
      // The popover is CSS-positioned relative to .services__visual (its
      // nearest positioned ancestor), but we clamp horizontally against the
      // wider <section> so the card has room to sit beside edge nodes
      // without being squeezed into the narrow visual circle.
      const sectionRect = section.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      const cx = badgeRect.left + badgeRect.width / 2 - visualRect.left;
      const topY = badgeRect.top - visualRect.top;
      const bottomY = badgeRect.bottom - visualRect.top;
      const placeBelow = badgeRect.top - visualRect.top < visualRect.height / 2;

      const popW = popover.offsetWidth || 240;
      const margin = 14;
      const minLeft = sectionRect.left - visualRect.left + popW / 2 + margin;
      const maxLeft = sectionRect.right - visualRect.left - popW / 2 - margin;
      const left = clamp(cx, minLeft, Math.max(minLeft, maxLeft));

      popover.style.setProperty("--pop-x", `${left}px`);
      popover.style.setProperty("--pop-y", `${placeBelow ? bottomY + 16 : topY - 16}px`);
      popover.dataset.placement = placeBelow ? "below" : "above";

      popRafRef.current = requestAnimationFrame(update);
    };
    update();

    return () => popRafRef.current && cancelAnimationFrame(popRafRef.current);
  }, [activeId, list]);

  const toggleActive = (id) => setActiveId((cur) => (cur === id ? null : id));
  const activeService = list.find((s) => s.id === activeId) || null;
  const [typedDescription, typingDone] = useTypewriter(activeService ? activeService.description : "");

  return (
    <section
      id="services"
      ref={sectionRef}
      className="services"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {/* ambient background layers */}
      <img src={globalServicesImage} alt="" className="services__bg-image" aria-hidden="true" />
      <div className="services__bg-scrim" aria-hidden="true" />
      <div className="services__grid" aria-hidden="true" />
      <div ref={glowRef} className="services__glow" aria-hidden="true" />

      <div className="services__inner">
        <div className="services__head">
          <span className="services__eyebrow">
            <span className="services__eyebrow-dot" />
            {eyebrow}
          </span>
          <h2 className="services__heading">{heading}</h2>
          <p className="services__subheading">{subheading}</p>
        </div>

        <div className="services__visual" ref={visualRef}>
          <div className="services__core">
            <span className="services__ring services__ring--1" />
            <span className="services__ring services__ring--2" />
            <span className="services__ring services__ring--3" />
          </div>

          <div className={`services__orbit ${activeId ? "is-paused" : ""}`}>
            {list.map((s, i) => {
              const isActive = activeId === s.id;
              return (
                <div
                  key={s.id}
                  className={`services__node services__node--${i} ${isActive ? "is-active" : ""}`}
                  style={{ "--angle": `${NODE_ANGLES[i]}deg` }}
                  onClick={() => toggleActive(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  onBlur={() => setActiveId((cur) => (cur === s.id ? null : cur))}
                >
                  <button
                    ref={(el) => (nodeRefs.current[i] = el)}
                    type="button"
                    data-id={s.id}
                    className={`services__node-badge ${isActive ? "is-active" : ""}`}
                    aria-expanded={isActive}
                    aria-label={s.label}
                  >
                    <span className="services__node-dot" aria-hidden="true" />
                    <span className="services__node-name">{s.label}</span>
                    <span className="services__node-ripple" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Description card — follows the active node and opens right
              beside it, above or below depending on where it sits. */}
          <div
            ref={popoverRef}
            className={`services__popover ${activeService ? "is-open" : ""}`}
            aria-live="polite"
          >
            {activeService && (
              <div className="services__popover-inner">
                <div className="services__popover-icon">
                  <activeService.icon />
                </div>
                <div className="services__popover-text">
                  <h3>{activeService.label}</h3>
                  <p>
                    {typedDescription}
                    <span className={`services__popover-cursor ${typingDone ? "is-done" : ""}`} aria-hidden="true" />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="services__hint">Hover or tap a service to see what's included</p>
      </div>
    </section>
  );
}
