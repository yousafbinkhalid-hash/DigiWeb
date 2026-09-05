import { useCallback, useRef } from "react";
import "./PhoneShowcaseSection.css";

/**
 * PhoneShowcaseSection
 *
 * A realistic Android phone frame with the actual site running live inside
 * it — not a screenshot. The phone screen is an <iframe src="/?embed=1">:
 * because an iframe gets its own independent viewport, the site's normal
 * mobile media queries (max-width: 780px etc.) fire for real based on the
 * iframe's own width, so what shows up is the genuine mobile layout,
 * genuinely interactive (you can scroll/tap it).
 *
 * The `?embed=1` query param is the load-bearing bit: SectionPager reads it
 * and drops this same section from the slide list when present, so the
 * nested copy of the site never tries to embed *another* phone inside
 * itself — recursion is capped at exactly one level deep.
 */
const HIGHLIGHTS = [
  "Fully responsive — real device rendering, not a mockup image",
  "Genuinely interactive — scroll, tap and navigate it live",
  "Same code, same performance, running right now",
];

export default function PhoneShowcaseSection() {
  const phoneRef = useRef(null);
  const rafRef = useRef(null);

  // A gentle 3D tilt that follows the cursor — the same "assist" animation
  // language as the Hero's photo parallax, applied here to the phone frame
  // for a showcase-y, product-shot feel.
  const handlePointerMove = useCallback((e) => {
    const node = phoneRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      node.style.setProperty("--rot-y", `${(nx * 14).toFixed(2)}deg`);
      node.style.setProperty("--rot-x", `${(-ny * 10).toFixed(2)}deg`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const node = phoneRef.current;
    if (!node) return;
    node.style.setProperty("--rot-y", "0deg");
    node.style.setProperty("--rot-x", "0deg");
  }, []);

  return (
    <section id="showcase" className="showcase">
      <div className="showcase__grid" aria-hidden="true" />
      <div className="showcase__glow" aria-hidden="true" />

      <div className="showcase__inner">
        <div className="showcase__copy">
          <span className="showcase__eyebrow">
            <span className="showcase__eyebrow-dot" />
            Live Preview
          </span>

          <h2 className="showcase__heading">
            See It Running.
            <br />
            Right <em>Now</em>, On Android.
          </h2>

          <p className="showcase__paragraph">
            This isn't a screenshot in a phone frame — it's the actual site,
            live, rendering at real device size. Scroll it, tap it, see
            exactly what your customers will.
          </p>

          <ul className="showcase__points">
            {HIGHLIGHTS.map((point) => (
              <li key={point}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <a className="showcase__cta" href="#contact">
            Start Your Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="showcase__stage">
          <div className="showcase__phone-scale">
            <div
              ref={phoneRef}
              className="showcase__phone"
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
            >
              <div className="phone__shadow" aria-hidden="true" />
              <div className="phone__frame">
                <span className="phone__button phone__button--power" aria-hidden="true" />
                <span className="phone__button phone__button--vol-up" aria-hidden="true" />
                <span className="phone__button phone__button--vol-down" aria-hidden="true" />

                <div className="phone__screen">
                  <span className="phone__camera" aria-hidden="true" />
                  <iframe
                    className="phone__iframe"
                    src="/?embed=1"
                    title="Live preview of the Digitize.pk website"
                    loading="lazy"
                  />
                  <span className="phone__gesture-bar" aria-hidden="true" />
                </div>
                <span className="phone__gloss" aria-hidden="true" />
              </div>
            </div>

            <span className="showcase__badge showcase__badge--live">
              <span className="showcase__badge-dot" />
              Live
            </span>
            <span className="showcase__badge showcase__badge--tag">Android · Live Demo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
