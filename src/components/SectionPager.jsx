import { useCallback, useEffect, useRef, useState } from "react";
import { PagerContext } from "../PagerContext";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import IntroSection from "./IntroSection";
import ServicesSection from "./ServicesSection";
import PhoneShowcaseSection from "./PhoneShowcaseSection";
import StepsSection from "./StepsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import "./SectionPager.css";

const STEP_COUNT = 5;
const TRANSITION_MS = 900;
const STEP_TRANSITION_MS = 500;
const WHEEL_THRESHOLD = 10;
const SWIPE_THRESHOLD = 42;

// The phone showcase embeds a second copy of this very site in an <iframe
// src="/?embed=1">. That nested copy runs this exact same module, so
// without this guard it would try to embed a showcase of its own, which
// would embed one of its own, forever. Reading the flag once here and
// omitting the slide entirely on the embedded side caps the nesting at
// exactly one phone.
const isEmbedded =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("embed") === "1";

const SLIDES = [
  { id: "home", label: "Home", render: () => <HeroSection /> },
  { id: "about", label: "About", render: () => <IntroSection /> },
  { id: "services", label: "Services", render: () => <ServicesSection /> },
  ...(isEmbedded
    ? []
    : [{ id: "showcase", label: "Live Demo", render: () => <PhoneShowcaseSection /> }]),
  { id: "why-us", label: "Why Us", render: (activeStep) => <StepsSection activeStep={activeStep} /> },
  { id: "contact", label: "Contact", render: () => <ContactSection /> },
  { id: "footer", label: "Footer", render: () => <Footer brand="DigiWeb" /> },
];

const STEPS_INDEX = SLIDES.findIndex((s) => s.id === "why-us");
const FOOTER_INDEX = SLIDES.findIndex((s) => s.id === "footer");
const LAST_INDEX = SLIDES.length - 1;

/**
 * SectionPager
 *
 * Replaces ordinary page scrolling with a controlled, one-gesture-per-
 * section experience: a single wheel tick, swipe, or arrow-key press moves
 * exactly one section (see the wheel/touch/key listeners below), instead
 * of the user having to manually scroll each section into place. Two
 * sections need special handling because they aren't a single static
 * screen:
 *  - StepsSection reveals its five points one at a time — while it's the
 *    active slide, each gesture advances/retreats a local `stepIndex`
 *    before handing off to the next/previous slide, so "one scroll = one
 *    thing happens" still holds even though there are five things to see.
 *  - Contact and Footer's content can still run taller than one viewport
 *    on narrow/short screens even after compaction; rather than shrinking
 *    them past legibility, their CSS opts them into scrolling internally,
 *    and gestures over them only page away once already scrolled to the
 *    edge being pushed past (see activeSlideAtEdge below).
 */
export default function SectionPager() {
  const [index, setIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  // Mobile browsers resize the *visible* viewport as their address bar/
  // toolbar shows or hides, and `100vh` famously does not track that — it
  // stays pinned to the tallest the viewport ever gets, while each
  // .pager__slide is sized with `100dvh`, which does track it. Paging by a
  // flat `N * 100vh` transform (as CSS vh) while slides are laid out at
  // `100dvh` heights drifts the two out of sync by exactly the toolbar's
  // height per section on a real phone — invisible on desktop or in a
  // fixed-size test viewport, where vh and dvh are identical, but on an
  // actual device it makes swipes land short/long and stack sections out
  // of alignment. Measuring the real pixel height in JS and animating in
  // px sidesteps the mismatch entirely, since it tracks the same dynamic
  // number `dvh` does rather than the static `vh` figure.
  const [viewportH, setViewportH] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 0));

  const indexRef = useRef(0);
  const stepIndexRef = useRef(0);
  const lockedRef = useRef(false);
  const unlockTimerRef = useRef(null);
  const prevIndexRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const trackRef = useRef(null);

  // Refs are only ever read from event handlers (never during render), but
  // they still need to be mutated outside of render itself, so the sync
  // happens in an effect rather than inline in the component body.
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Keep the measured viewport height current as a mobile browser's chrome
  // shows/hides (address bar, keyboard, etc.) — visualViewport fires more
  // reliably for this on mobile Safari than the plain resize event alone.
  // The resulting transform correction has to land instantly rather than
  // animate through the track's normal 900ms transition — that transition
  // exists for deliberate section changes, and letting a mere toolbar
  // show/hide (which can happen just from the user scrolling *inside*
  // Footer/Contact's internal scroll) visibly slide the whole page would
  // read as a spurious, unrequested page change.
  useEffect(() => {
    const onResize = () => {
      const track = trackRef.current;
      if (track) track.style.transition = "none";
      setViewportH(window.innerHeight);
      // Let the instant jump paint before handing the transition back to
      // the CSS class, so a *real* section change right after this still
      // animates normally.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (track) track.style.transition = "";
        });
      });
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, []);

  const lockFor = useCallback((ms) => {
    lockedRef.current = true;
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      lockedRef.current = false;
    }, reduceMotionRef.current ? 60 : ms);
  }, []);

  const goToIndex = useCallback(
    (next) => {
      const clamped = Math.max(0, Math.min(LAST_INDEX, next));
      if (clamped === indexRef.current) return;
      setIndex(clamped);
      lockFor(TRANSITION_MS);
    },
    [lockFor]
  );

  const goToId = useCallback(
    (id) => {
      const target = SLIDES.findIndex((s) => s.id === id);
      if (target === -1) return;
      if (target === STEPS_INDEX) {
        setStepIndex(target > indexRef.current ? 0 : STEP_COUNT);
      }
      goToIndex(target);
    },
    [goToIndex]
  );

  const advance = useCallback(
    (direction) => {
      if (lockedRef.current) return;

      if (indexRef.current === STEPS_INDEX) {
        if (direction > 0 && stepIndexRef.current < STEP_COUNT) {
          setStepIndex((s) => Math.min(STEP_COUNT, s + 1));
          lockFor(STEP_TRANSITION_MS);
          return;
        }
        if (direction < 0 && stepIndexRef.current > 0) {
          setStepIndex((s) => Math.max(0, s - 1));
          lockFor(STEP_TRANSITION_MS);
          return;
        }
      }

      goToIndex(indexRef.current + direction);
    },
    [goToIndex, lockFor]
  );

  // Whenever we land on the Steps slide, prime its progress based on which
  // direction we arrived from: nothing revealed yet if arriving forward,
  // everything already revealed if arriving backward from Contact.
  useEffect(() => {
    const prev = prevIndexRef.current;
    if (index === STEPS_INDEX && prev !== index) {
      setStepIndex(prev < index ? 0 : STEP_COUNT);
    }
    prevIndexRef.current = index;
  }, [index]);

  // A gesture over the active slide only pages away once its own content
  // is already scrolled to the edge the gesture is pushing past — most
  // slides never scroll at all (they're built to fit exactly one
  // viewport), but Contact and Footer's stacked layouts can still run
  // taller than 100dvh on narrow/short screens, and are set up (see their
  // CSS) to scroll internally in that case rather than being clipped.
  const activeSlideAtEdge = useCallback((direction) => {
    const node = document.querySelector(".pager__slide.is-active")?.firstElementChild;
    if (!node) return true;
    // Only defer to a slide's own scrolling when its CSS has actually
    // opted into overflow-y: auto/scroll at the current breakpoint (only
    // Footer, always, and Contact, on narrow screens). Every other slide
    // keeps overflow: hidden by design — checking scrollHeight there too
    // would be fragile: decorative elements that deliberately bleed past
    // the edge (background blobs etc.) can nudge scrollHeight above
    // clientHeight even though the section can't actually be scrolled,
    // which would make wheel/swipe gestures silently do nothing instead
    // of paging.
    const { overflowY } = getComputedStyle(node);
    if (overflowY !== "auto" && overflowY !== "scroll") return true;
    const maxScroll = node.scrollHeight - node.clientHeight;
    if (maxScroll <= 1) return true; // nothing to internally scroll
    return direction > 0 ? node.scrollTop >= maxScroll - 1 : node.scrollTop <= 1;
  }, []);

  useEffect(() => {
    let touchStartY = null;
    let touchActive = false;

    const shouldPassThrough = (direction) => !activeSlideAtEdge(direction);

    const onWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      if (shouldPassThrough(direction)) return; // let the active slide scroll internally
      e.preventDefault();
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      advance(direction);
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchActive = true;
    };

    const onTouchMove = (e) => {
      if (!touchActive || touchStartY === null) return;
      const direction = touchStartY - e.touches[0].clientY > 0 ? 1 : -1;
      if (shouldPassThrough(direction)) return;
      e.preventDefault();
    };

    const onTouchEnd = (e) => {
      if (touchStartY === null) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      touchActive = false;
      if (Math.abs(dy) < SWIPE_THRESHOLD) return;
      const direction = dy > 0 ? 1 : -1;
      if (shouldPassThrough(direction)) return;
      advance(direction);
    };

    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      if (typing) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (shouldPassThrough(1)) return;
        e.preventDefault();
        advance(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (shouldPassThrough(-1)) return;
        e.preventDefault();
        advance(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [advance, activeSlideAtEdge]);

  useEffect(() => () => unlockTimerRef.current && clearTimeout(unlockTimerRef.current), []);

  const activeId = SLIDES[index].id;

  return (
    <PagerContext.Provider value={{ activeId, goToId }}>
      <Navbar brand="DigiWeb" />

      <div className="pager">
        <div className="pager__track" ref={trackRef} style={{ transform: `translateY(-${index * viewportH}px)` }}>
          {SLIDES.map((slide, i) => {
            const offset = i - index;
            const absOffset = Math.min(Math.abs(offset), 1);
            return (
              <div
                key={slide.id}
                className={`pager__slide ${i === index ? "is-active" : ""}`}
                style={{ "--offset": offset, "--abs-offset": absOffset }}
                aria-hidden={i !== index}
                inert={i !== index ? "" : undefined}
              >
                {slide.id === "why-us" ? slide.render(stepIndex) : slide.render()}
              </div>
            );
          })}
        </div>
      </div>

      <nav className="pager__dots" aria-label="Section navigation">
        {SLIDES.slice(0, FOOTER_INDEX).map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`pager__dot ${i === index ? "is-active" : ""}`}
            aria-label={`Go to ${slide.label} section`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goToId(slide.id)}
          />
        ))}
      </nav>
    </PagerContext.Provider>
  );
}
