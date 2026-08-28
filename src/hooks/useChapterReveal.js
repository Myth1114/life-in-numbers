import { gsap, useGSAP } from "../animations/gsap";

import { useReducedMotion } from "./useReducedMotion";

export function useChapterReveal(scopeRef) {
  const prefersReducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const revealItems = gsap.utils.toArray("[data-reveal]");

      if (!revealItems.length) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(revealItems, {
          clearProps: "all",
        });

        return;
      }

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          {
            autoAlpha: 0,
            y: 28,
          },
          {
            autoAlpha: 1,
            y: 0,

            duration: 1.2,
            ease: "power3.out",

            scrollTrigger: {
              trigger: item,

              start: "top 88%",

              once: true,
            },
          }
        );
      });
    },
    {
      scope: scopeRef,

      dependencies: [prefersReducedMotion],

      revertOnUpdate: true,
    }
  );
}
