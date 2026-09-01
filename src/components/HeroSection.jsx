import { useCallback, useEffect, useRef, useState } from "react";
import "./HeroSection.css";

/* ---------------------------------------------------------------------- */
/*  Inline icon set (no external icon library required)                   */
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

/**
 * HeroSection
 *
 * Props:
 *  - companyName   {string}  Shown as the small label under the logo mark
 *  - logoSrc       {string}  URL/path to your company logo image (transparent PNG/SVG recommended)
 *  - eyebrow       {string}  Small tag line above the headline
 *  - headline      {string}  Main headline (use \n for a manual line break)
 *  - subheadline   {string}  Supporting paragraph
 *  - primaryCta    {{label, href, onClick}}
 *  - secondaryCta  {{label, href, onClick}}
 *  - services      {Array}   Override the 5 default services — [{id, label, icon, description}]
 */
export default function HeroSection({
  companyName = "DigiWeb",
  logoSrc = "",
  eyebrow = "Digital Agency",
  headline = "We Build Solutions\nThat Grow Your Business",
  subheadline = "DigiWeb designs, builds and supports high-performing websites and digital experiences — from first sketch to launch and beyond.",
  primaryCta = { label: "Start a Project", href: "#contact" },
  secondaryCta = { label: "Our Services", href: "#services" },
  services = DEFAULT_SERVICES,
}) {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const list = (services && services.length ? services : DEFAULT_SERVICES).slice(0, 5);
  const initials = companyName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handlePointerMove = useCallback((e) => {
    const node = sectionRef.current;
    const glow = glowRef.current;
    if (!node || !glow) return;
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      glow.style.setProperty("--glow-x", `${x}px`);
      glow.style.setProperty("--glow-y", `${y}px`);
      glow.style.opacity = "1";
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  useEffect(() => () => rafRef.current && cancelAnimationFrame(rafRef.current), []);

  const toggleActive = (id) => setActiveId((cur) => (cur === id ? null : id));

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {/* ambient background layers */}
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__particles" aria-hidden="true" />
      <div ref={glowRef} className="hero__glow" aria-hidden="true" />

      <div className="hero__inner">
        {/* ---------------- Left: content ---------------- */}
        <div className="hero__content">
          <span className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            {eyebrow}
          </span>

          <h1 className="hero__headline">
            {headline.split("\n").map((line, i) => (
              <span className="hero__headline-line" key={i}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__subheadline">{subheadline}</p>

          <div className="hero__ctas">
            {primaryCta && (
              <a
                className="hero__btn hero__btn--primary"
                href={primaryCta.href}
                onClick={primaryCta.onClick}
              >
                {primaryCta.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            )}
            {secondaryCta && (
              <a
                className="hero__btn hero__btn--secondary"
                href={secondaryCta.href}
                onClick={secondaryCta.onClick}
              >
                {secondaryCta.label}
              </a>
            )}
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>250+</strong>
              <span>Projects delivered</span>
            </div>
            <div className="hero__stat">
              <strong>99.9%</strong>
              <span>Uptime SLA</span>
            </div>
            <div className="hero__stat">
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </div>

        {/* ---------------- Right: visual composition ---------------- */}
        <div className="hero__visual" id="services">
          <svg className="hero__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {list.map((s, i) => {
              const pos = NODE_POSITIONS[i];
              return (
                <line
                  key={s.id}
                  x1={pos.x}
                  y1={pos.y}
                  x2="50"
                  y2="54"
                  className="hero__line"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              );
            })}
          </svg>

          <div className="hero__core">
            <span className="hero__ring hero__ring--1" />
            <span className="hero__ring hero__ring--2" />
            <span className="hero__ring hero__ring--3" />
            <div className="hero__logo-circle">
              {logoSrc ? (
                <img src={logoSrc} alt={`${companyName} logo`} className="hero__logo-img" />
              ) : (
                <span className="hero__logo-fallback">{initials || "CO"}</span>
              )}
            </div>
          </div>

          {list.map((s, i) => {
            const Icon = s.icon;
            const isActive = activeId === s.id;
            return (
              <div
                key={s.id}
                className={`hero__node hero__node--${i} hero__node--align-${NODE_POSITIONS[i].align}`}
                onMouseEnter={() => setActiveId(s.id)}
                onMouseLeave={() => setActiveId((cur) => (cur === s.id ? null : cur))}
                onClick={() => toggleActive(s.id)}
                onFocus={() => setActiveId(s.id)}
                onBlur={() => setActiveId((cur) => (cur === s.id ? null : cur))}
              >
                <button
                  type="button"
                  className={`hero__node-badge ${isActive ? "is-active" : ""}`}
                  aria-expanded={isActive}
                  aria-label={s.label}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <Icon className="hero__node-icon" />
                </button>
                <span className="hero__node-label">{s.label}</span>

                <div className={`hero__popover ${isActive ? "is-open" : ""}`} role="tooltip">
                  <div className="hero__popover-icon">
                    <Icon />
                  </div>
                  <h3 className="hero__popover-title">{s.label}</h3>
                  <p className="hero__popover-desc">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Arc positions (percent, viewBox 0-100) for up to 5 nodes, with a text-align
   hint so each popover opens away from the viewport edge. */
const NODE_POSITIONS = [
  { x: 4, y: 46, align: "left" },
  { x: 25, y: 14, align: "left" },
  { x: 50, y: 2, align: "center" },
  { x: 75, y: 14, align: "right" },
  { x: 96, y: 46, align: "right" },
];
