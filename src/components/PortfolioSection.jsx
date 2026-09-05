import { useCallback, useRef } from "react";
import "./PortfolioSection.css";

/**
 * PortfolioSection
 *
 * A real client project — https://ayeshag-com-e2gl.vercel.app/ — shown
 * live inside a laptop + phone device pair, the same "genuine iframe, not
 * a screenshot" technique used by PhoneShowcaseSection: each screen is an
 * <iframe src="https://ayeshag-com-e2gl.vercel.app/"> given a fixed real
 * pixel size in CSS, so the laptop renders the project's actual desktop
 * layout and the phone renders its actual mobile layout, side by side.
 *
 * (The device classes here are prefixed `portfolio-laptop__` /
 * `portfolio-phone__` rather than reusing PhoneShowcaseSection's bare
 * `.laptop__*` / `.phone__*` — plain CSS classes aren't scoped per
 * component, and both sections' stylesheets load on the same page, so
 * identical class names there would silently fight over which frame's
 * dimensions win.)
 *
 * Unlike the live-demo showcase, this embeds someone else's live site
 * rather than this one, so there's no `?embed=1` recursion concern — but
 * it does mean the frame's content is only as reliable as that project
 * staying online and not sending an X-Frame-Options/CSP header that
 * refuses to be framed. The "Visit Live Site" link is the fallback for
 * exactly that case: if the preview ever fails to render for a visitor,
 * the real site is still one click away.
 */
const HIGHLIGHTS = [
  "Designed and built end-to-end for a real client",
  "Fully responsive — see it live on desktop and mobile at once",
  "Deployed and running in production right now",
];

const PROJECT_URL = "https://ayeshag-com-e2gl.vercel.app/";

export default function PortfolioSection() {
  const groupRef = useRef(null);
  const rafRef = useRef(null);

  // One shared cursor-tilt on the whole device pair (rather than each
  // device separately) — --rot-x/--rot-y are set on the group and read by
  // both children via normal CSS custom-property inheritance, so the
  // laptop and phone tilt together as a single composition.
  const handlePointerMove = useCallback((e) => {
    const node = groupRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      node.style.setProperty("--rot-y", `${(nx * 10).toFixed(2)}deg`);
      node.style.setProperty("--rot-x", `${(-ny * 7).toFixed(2)}deg`);
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const node = groupRef.current;
    if (!node) return;
    node.style.setProperty("--rot-y", "0deg");
    node.style.setProperty("--rot-x", "0deg");
  }, []);

  return (
    <section id="portfolio" className="portfolio">
      <div className="portfolio__grid" aria-hidden="true" />
      <div className="portfolio__glow" aria-hidden="true" />

      <div className="portfolio__inner">
        <div className="portfolio__copy">
          <span className="portfolio__eyebrow">
            <span className="portfolio__eyebrow-dot" />
            Portfolio
          </span>

          <h2 className="portfolio__heading">
            Real Projects.
            <br />
            Real <em>Results</em>.
          </h2>

          <p className="portfolio__paragraph">
            A live client project, running in production — Ayesha G, a
            wholesale garment manufacturer. Shown here exactly as it is
            today, on both desktop and mobile.
          </p>

          <ul className="portfolio__points">
            {HIGHLIGHTS.map((point) => (
              <li key={point}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          <a className="portfolio__cta" href={PROJECT_URL} target="_blank" rel="noopener noreferrer">
            Visit Live Site
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="portfolio__stage">
          <div className="portfolio__scale">
            <div
              ref={groupRef}
              className="portfolio__group"
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
            >
              <div className="portfolio-laptop">
                <div className="portfolio-laptop__shadow" aria-hidden="true" />
                <div className="portfolio-laptop__lid">
                  <span className="portfolio-laptop__camera" aria-hidden="true" />
                  <div className="portfolio-laptop__screen">
                    <iframe
                      className="portfolio-laptop__iframe"
                      src={PROJECT_URL}
                      title="Ayesha G — live project preview (desktop)"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="portfolio-laptop__hinge" aria-hidden="true" />
                <div className="portfolio-laptop__base">
                  <span className="portfolio-laptop__notch" aria-hidden="true" />
                </div>
              </div>

              <div className="portfolio-phone">
                <div className="portfolio-phone__shadow" aria-hidden="true" />
                <div className="portfolio-phone__frame">
                  <span className="portfolio-phone__button portfolio-phone__button--power" aria-hidden="true" />
                  <span className="portfolio-phone__button portfolio-phone__button--vol" aria-hidden="true" />

                  <div className="portfolio-phone__screen">
                    <span className="portfolio-phone__camera" aria-hidden="true" />
                    <iframe
                      className="portfolio-phone__iframe"
                      src={PROJECT_URL}
                      title="Ayesha G — live project preview (mobile)"
                      loading="lazy"
                    />
                    <span className="portfolio-phone__gesture-bar" aria-hidden="true" />
                  </div>
                  <span className="portfolio-phone__gloss" aria-hidden="true" />
                </div>
              </div>
            </div>

            <span className="portfolio__badge portfolio__badge--live">
              <span className="portfolio__badge-dot" />
              Live
            </span>
            <span className="portfolio__badge portfolio__badge--tag">Ayesha G · Client Project</span>
          </div>
        </div>
      </div>
    </section>
  );
}
