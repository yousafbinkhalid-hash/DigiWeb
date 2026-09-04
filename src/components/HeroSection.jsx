import { useCallback, useEffect, useRef } from "react";
import heroImage from "../assets/hero-tree-city.jpg";
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
  const panelRef = useRef(null);
  const glowRef = useRef(null);
  const mediaInnerRef = useRef(null);
  const rafRef = useRef(null);

  // Two lightweight, related effects share one rAF-throttled listener:
  //  - the panel gets a cursor-follow glow (kept relative to the panel's
  //    own rect so the highlight tracks the dark half only), and
  //  - the photo drifts a few px opposite the cursor for a subtle
  //    parallax "depth" cue, independent of the CSS Ken Burns zoom that's
  //    already animating the image's scale.
  const handlePointerMove = useCallback((e) => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const glow = glowRef.current;
    const mediaInner = mediaInnerRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const cx = e.clientX - sectionRect.left;
    const cy = e.clientY - sectionRect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (panel && glow) {
        const panelRect = panel.getBoundingClientRect();
        const gx = e.clientX - panelRect.left;
        const gy = e.clientY - panelRect.top;
        glow.style.setProperty("--glow-x", `${gx}px`);
        glow.style.setProperty("--glow-y", `${gy}px`);
        glow.style.opacity = "1";
      }
      if (mediaInner) {
        const nx = cx / sectionRect.width - 0.5;
        const ny = cy / sectionRect.height - 0.5;
        mediaInner.style.setProperty("--tilt-x", `${(-nx * 16).toFixed(2)}px`);
        mediaInner.style.setProperty("--tilt-y", `${(-ny * 10).toFixed(2)}px`);
      }
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (mediaInnerRef.current) {
      mediaInnerRef.current.style.setProperty("--tilt-x", "0px");
      mediaInnerRef.current.style.setProperty("--tilt-y", "0px");
    }
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
      {/* Photo half — silhouetted tree framing a distant skyline */}
      <div className="hero__media">
        <div ref={mediaInnerRef} className="hero__media-inner">
          <img className="hero__image" src={heroImage} alt="A tree overlooking a distant city skyline at dawn" />
        </div>
        <div className="hero__media-top-fade" aria-hidden="true" />
        <div className="hero__media-fade" aria-hidden="true" />
        <div className="hero__media-scrim" aria-hidden="true" />
      </div>

      {/* Dark panel half — headline, copy, CTAs */}
      <div ref={panelRef} className="hero__panel">
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
                <span className="hero__headline-line" style={{ "--i": i }} key={i}>
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
      </div>
    </section>
  );
}
