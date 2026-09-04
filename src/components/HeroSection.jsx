import { useCallback, useEffect, useRef } from "react";
import { usePager } from "../PagerContext";
import heroImage from "../assets/hero-tree-city.jpg";
import heroImageMobile from "../assets/hero-tree-city-mobile.jpg";
import "./HeroSection.css";

/**
 * HeroSection
 *
 * Minimal by design: one headline, one short line of support copy, one
 * call to action. Everything else (eyebrow tag, second CTA, stat row)
 * was cut in favour of the photo doing the talking.
 *
 * Props:
 *  - headline      {string}  Main headline (use \n for a manual line break)
 *  - subheadline   {string}  Supporting line
 *  - primaryCta    {{label, href, onClick}}
 */
export default function HeroSection({
  headline = "We Build Solutions.\nYou Build an Empire.",
  subheadline = "From first sketch to full-scale dominance — we build what lasts.",
  primaryCta = { label: "Start a Project", href: "#contact" },
}) {
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const mediaInnerRef = useRef(null);
  const rafRef = useRef(null);
  const { goToId } = usePager();

  // One rAF-throttled listener drives two lightweight effects:
  //  - a cursor-follow glow over the whole hero, and
  //  - the photo drifting a few px opposite the cursor for a subtle
  //    parallax "depth" cue, independent of the CSS Ken Burns zoom that's
  //    already animating the image's scale.
  const handlePointerMove = useCallback((e) => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    const mediaInner = mediaInnerRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (glow) {
        glow.style.setProperty("--glow-x", `${cx}px`);
        glow.style.setProperty("--glow-y", `${cy}px`);
        glow.style.opacity = "1";
      }
      if (mediaInner) {
        const nx = cx / rect.width - 0.5;
        const ny = cy / rect.height - 0.5;
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
      {/* Full-bleed photo — silhouetted tree framing a distant skyline */}
      <div className="hero__media">
        <div ref={mediaInnerRef} className="hero__media-inner">
          <picture>
            <source media="(max-width: 780px)" srcSet={heroImageMobile} />
            <img className="hero__image" src={heroImage} alt="A tree overlooking a distant city skyline at dawn" />
          </picture>
        </div>
        <div className="hero__media-scrim" aria-hidden="true" />
        <div ref={glowRef} className="hero__glow" aria-hidden="true" />
      </div>

      {/* Copy overlay — sits directly on the photo, readable via the scrim */}
      <div className="hero__inner">
        <div className="hero__content">
          <h1 className="hero__headline">
            {headline.split("\n").map((line, i) => (
              <span className="hero__headline-line" style={{ "--i": i }} key={i}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__subheadline">{subheadline}</p>

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
        </div>
      </div>

      {/* Scroll assist — nudges the visitor into the next slide */}
      <button
        type="button"
        className="hero__scroll"
        onClick={() => goToId("about")}
        aria-label="Scroll to the About section"
      >
        <span className="hero__scroll-label">Scroll</span>
        <span className="hero__scroll-track" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4v14M12 18l-6-6M12 18l6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </section>
  );
}
