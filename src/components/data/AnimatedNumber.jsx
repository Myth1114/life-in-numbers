import { useRef } from "react";

import { gsap, useGSAP } from "../../animations/gsap";

import { useReducedMotion } from "../../hooks/useReducedMotion";

import { formatWholeNumber } from "../../utils/numberFormat";

function AnimatedNumber({ value, className = "" }) {
  const numberRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  const formattedValue = formatWholeNumber(value);

  useGSAP(
    () => {
      if (!numberRef.current) {
        return;
      }

      if (prefersReducedMotion) {
        numberRef.current.textContent = formattedValue;

        return;
      }

      const counter = {
        current: 0,
      };

      gsap.to(counter, {
        current: value,

        duration: 2.2,
        ease: "power2.out",

        scrollTrigger: {
          trigger: numberRef.current,
          start: "top 88%",
          once: true,
        },

        onUpdate: () => {
          if (!numberRef.current) {
            return;
          }

          numberRef.current.textContent = formatWholeNumber(
            Math.round(counter.current)
          );
        },

        onComplete: () => {
          if (numberRef.current) {
            numberRef.current.textContent = formattedValue;
          }
        },
      });
    },
    {
      dependencies: [value, formattedValue, prefersReducedMotion],

      revertOnUpdate: true,
    }
  );

  return (
    <span className={className} aria-label={formattedValue}>
      <span ref={numberRef} aria-hidden="true">
        {formattedValue}
      </span>
    </span>
  );
}

export default AnimatedNumber;
