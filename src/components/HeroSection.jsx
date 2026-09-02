import { useCallback, useEffect, useRef } from "react";
import "./HeroSection.css";

/**
 * HeroSection
 *
 * Props:
 *  - eyebrow       {string}  Small tag line above the headline
 *  - headline      {string}  Main headline (use \n for a manual line break)
 *  - subheadline   {string}  Supporting paragraph
 *  - primaryCta    {{label, href, onClick}}
 *  - secondaryCta  {{label, href, onClick}}
 */
export default function HeroSection({
  eyebrow = "Digital Agency",
  headline = "We Build Solutions\nThat Grow Your Business",
  subheadline = "DigiWeb designs, builds and supports high-performing websites and digital experiences — from first sketch to launch and beyond.",
  primaryCta = { label: "Start a Project", href: "#contact" },
  secondaryCta = { label: "Our Services", href: "#services" },
}) {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef = useRef(null);

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
      </div>
    </section>
  );
}
