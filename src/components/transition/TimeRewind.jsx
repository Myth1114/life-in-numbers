import { useEffect, useRef } from "react";

import { gsap } from "gsap";

import { useReducedMotion } from "../../hooks/useReducedMotion";

import { formatDisplayDate } from "../../utils/numberFormat";

import { formatLocationLabel } from "../../services/geocodingService";

import "./TimeRewind.css";

function TimeRewind({ birthDate, location, onComplete }) {
  const transitionRef = useRef(null);
  const yearRef = useRef(null);
  const progressRef = useRef(null);

  const completionRef = useRef(onComplete);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const transition = transitionRef.current;

    const yearElement = yearRef.current;

    if (!transition || !yearElement) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const birthYear = birthDate.getUTCFullYear();

    const currentYear = new Date().getFullYear();

    yearElement.textContent = String(currentYear);

    let reducedMotionTimer;

    if (prefersReducedMotion) {
      yearElement.textContent = String(birthYear);

      gsap.set(transition, {
        autoAlpha: 1,
      });

      gsap.set(progressRef.current, {
        scaleX: 1,
      });

      reducedMotionTimer = window.setTimeout(() => {
        completionRef.current?.();
      }, 1000);

      return () => {
        window.clearTimeout(reducedMotionTimer);

        document.body.style.overflow = previousOverflow;
      };
    }

    const yearCounter = {
      value: currentYear,
    };

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },

        onComplete: () => {
          completionRef.current?.();
        },
      });

      timeline
        .set(transition, {
          autoAlpha: 1,
        })
        .set(progressRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        })
        .from("[data-rewind-eyebrow]", {
          opacity: 0,
          y: 14,
          duration: 0.45,
        })
        .from(
          "[data-rewind-label]",
          {
            opacity: 0,
            duration: 0.35,
          },
          "-=0.2"
        )
        .to(
          yearCounter,
          {
            value: birthYear,
            duration: 1.8,
            ease: "power2.inOut",

            onUpdate: () => {
              yearElement.textContent = String(Math.round(yearCounter.value));
            },
          },
          "+=0.1"
        )
        .to(
          progressRef.current,
          {
            scaleX: 1,
            duration: 1.8,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          "[data-rewind-label]",
          {
            opacity: 0,
            y: -8,
            duration: 0.25,
          },
          "-=0.15"
        )
        .fromTo(
          "[data-rewind-arrival]",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          }
        )
        .from(
          "[data-rewind-location]",
          {
            opacity: 0,
            y: 10,
            duration: 0.45,
          },
          "-=0.35"
        )
        .to(
          {},
          {
            duration: 0.65,
          }
        )
        .to(transition, {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.inOut",
        });
    }, transition);

    return () => {
      context.revert();

      document.body.style.overflow = previousOverflow;
    };
  }, [birthDate, prefersReducedMotion]);

  const formattedDate = formatDisplayDate(birthDate);

  const formattedLocation = formatLocationLabel(location);

  return (
    <div
      className="time-rewind"
      ref={transitionRef}
      role="status"
      aria-live="polite"
      aria-label={`Returning to ${formattedDate} in ${formattedLocation}.`}
    >
      <div className="time-rewind__grain" aria-hidden="true" />

      <div className="time-rewind__content">
        <p className="time-rewind__eyebrow" data-rewind-eyebrow>
          Returning to where your story began
        </p>

        <div className="time-rewind__year">
          <p className="time-rewind__label" data-rewind-label>
            Moving through the years
          </p>

          <p className="time-rewind__number" ref={yearRef} aria-hidden="true" />
        </div>

        <div className="time-rewind__arrival" data-rewind-arrival>
          <p className="time-rewind__date">{formattedDate}</p>

          <p className="time-rewind__location" data-rewind-location>
            {formattedLocation}
          </p>
        </div>

        <div className="time-rewind__track" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
    </div>
  );
}

export default TimeRewind;
