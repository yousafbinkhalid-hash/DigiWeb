import { useCallback, useRef } from "react";
import "./PhoneShowcaseSection.css";

/**
 * PhoneShowcaseSection
 *
 * Two realistic device frames with the actual site running live inside them
 * — not screenshots. Each screen is an <iframe src="/?embed=1"> given a
 * fixed, real pixel size: because an iframe gets its own independent
 * viewport based on its own rendered size (not the outer page's), the
 * site's normal responsive breakpoints fire for real —
 *  - the phone's iframe renders at real phone width, so it comes up in the
 *    site's genuine mobile layout;
 *  - the laptop's iframe renders at a real desktop width, so it comes up in
 *    the genuine desktop layout — even when this section itself is being
 *    viewed on a narrow screen.
 * Only one device is ever visible at once: on wider viewports it's the
 * phone showing the mobile site (the contrast you'd usually expect), and
 * on narrow/mobile viewports it flips to the laptop showing the desktop
 * site — so whichever device you're actually on, the showcase demonstrates
 * the *other* one. Both frames render every time (see PhoneShowcaseSection
 * .css) and CSS alone decides which is shown, so there's no layout shift or
 * remount when the viewport crosses the breakpoint.
 *
 * The `?embed=1` query param is the load-bearing bit: SectionPager reads it
 * and drops this same section from the slide list when present, so the
 * nested copy of the site never tries to embed a showcase of its own —
 * recursion is capped at exactly one level deep, regardless of which
 * device is showing at the time.
 */
const HIGHLIGHTS = [
  "Fully responsive — real device rendering, not a mockup image",
  "Genuinely interactive — click or tap, scroll, and navigate it live",
  "Same code, same performance, running right now",
];

// Shared cursor-tilt behaviour for whichever device frame is currently
// visible — a gentle 3D tilt that follows the pointer, the same "assist"
// animation language as the Hero's photo parallax, for a showcase-y,
// product-shot feel.
function useDeviceTilt(ref) {
  const rafRef = useRef(null);

  const handlePointerMove = useCallback(
    (e) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        node.style.setProperty("--rot-y", `${(nx * 14).toFixed(2)}deg`);
        node.style.setProperty("--rot-x", `${(-ny * 10).toFixed(2)}deg`);
      });
    },
    [ref]
  );

  const handlePointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rot-y", "0deg");
    node.style.setProperty("--rot-x", "0deg");
  }, [ref]);

  return { handlePointerMove, handlePointerLeave };
}

export default function PhoneShowcaseSection() {
  const phoneRef = useRef(null);
  const laptopRef = useRef(null);
  const phoneTilt = useDeviceTilt(phoneRef);
  const laptopTilt = useDeviceTilt(laptopRef);

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
            Right <em>Now</em>,{" "}
            <span className="showcase__heading-device showcase__heading-device--phone">On Android.</span>
            <span className="showcase__heading-device showcase__heading-device--laptop">On Desktop.</span>
          </h2>

          <p className="showcase__paragraph">
            This isn't a screenshot in a frame — it's the actual site, live,
            rendering at real size. Scroll it, click or tap it, see exactly
            what your customers will.
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
          {/* Phone — shown on wider viewports, demoing the mobile site.
              Hidden (not unmounted) below the swap breakpoint so the iframe
              never has to reload when the viewport crosses it. */}
          <div className="showcase__device showcase__device--phone">
            <div className="showcase__phone-scale">
              <div
                ref={phoneRef}
                className="showcase__phone"
                onMouseMove={phoneTilt.handlePointerMove}
                onMouseLeave={phoneTilt.handlePointerLeave}
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
                      title="Live preview of the Digitize.pk website — mobile layout"
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

          {/* Laptop — shown on narrow/mobile viewports, demoing the desktop
              site. The screen iframe is given a fixed real-desktop pixel
              size in CSS regardless of how small the mockup is scaled
              visually, so it genuinely renders the desktop layout. */}
          <div className="showcase__device showcase__device--laptop">
            <div className="showcase__laptop-scale">
              <div
                ref={laptopRef}
                className="showcase__laptop"
                onMouseMove={laptopTilt.handlePointerMove}
                onMouseLeave={laptopTilt.handlePointerLeave}
              >
                <div className="laptop__shadow" aria-hidden="true" />
                <div className="laptop__lid">
                  <span className="laptop__camera" aria-hidden="true" />
                  <div className="laptop__screen">
                    <iframe
                      className="laptop__iframe"
                      src="/?embed=1"
                      title="Live preview of the Digitize.pk website — desktop layout"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="laptop__hinge" aria-hidden="true" />
                <div className="laptop__base">
                  <span className="laptop__notch" aria-hidden="true" />
                </div>
              </div>

              <span className="showcase__badge showcase__badge--live">
                <span className="showcase__badge-dot" />
                Live
              </span>
              <span className="showcase__badge showcase__badge--tag">Desktop · Live Demo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
