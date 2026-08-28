import { useEffect, useRef } from "react";

import { gsap, useGSAP } from "../animations/gsap";

import { useReducedMotion } from "../hooks/useReducedMotion";

function LifeGridCanvas({ livedWeeks, lifespan }) {
  const canvasRef = useRef(null);
  const drawGridRef = useRef(null);

  const visibleWeeksRef = useRef(0);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const columns = 52;
    const rows = lifespan;
    const totalWeeks = columns * rows;

    const completedWeeks = Math.min(livedWeeks, totalWeeks);

    function drawGrid() {
      const rectangle = canvas.getBoundingClientRect();

      if (rectangle.width === 0 || rectangle.height === 0) {
        return;
      }

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rectangle.width * pixelRatio);

      canvas.height = Math.round(rectangle.height * pixelRatio);

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      context.clearRect(0, 0, rectangle.width, rectangle.height);

      const rootStyles = getComputedStyle(document.documentElement);

      const rustColor = rootStyles.getPropertyValue("--color-rust").trim();

      const mossColor = rootStyles.getPropertyValue("--color-moss").trim();

      const futureColor = rootStyles
        .getPropertyValue("--color-hairline-strong")
        .trim();

      const cellWidth = rectangle.width / columns;

      const cellHeight = rectangle.height / rows;

      const squareSize = Math.min(cellWidth, cellHeight) * 0.72;

      const visibleWeeks = Math.min(
        Math.floor(visibleWeeksRef.current),
        completedWeeks
      );

      const hasReachedCurrentWeek = visibleWeeks >= completedWeeks;

      for (let index = 0; index < totalWeeks; index += 1) {
        const column = index % columns;

        const row = Math.floor(index / columns);

        const x = column * cellWidth + (cellWidth - squareSize) / 2;

        const y = row * cellHeight + (cellHeight - squareSize) / 2;

        if (index < visibleWeeks) {
          context.fillStyle = rustColor;

          context.fillRect(x, y, squareSize, squareSize);
        } else if (
          index === completedWeeks &&
          completedWeeks < totalWeeks &&
          hasReachedCurrentWeek
        ) {
          context.fillStyle = mossColor;

          context.fillRect(x, y, squareSize, squareSize);
        } else {
          context.strokeStyle = futureColor;

          context.lineWidth = 1;

          context.strokeRect(x, y, squareSize, squareSize);
        }
      }
    }

    drawGridRef.current = drawGrid;

    drawGrid();

    const resizeObserver = new ResizeObserver(() => {
      drawGrid();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      drawGridRef.current = null;
    };
  }, [livedWeeks, lifespan]);

  useGSAP(
    () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const totalWeeks = lifespan * 52;

      const completedWeeks = Math.min(livedWeeks, totalWeeks);

      if (prefersReducedMotion) {
        visibleWeeksRef.current = completedWeeks;

        drawGridRef.current?.();

        return;
      }

      visibleWeeksRef.current = 0;
      drawGridRef.current?.();

      const animationState = {
        visibleWeeks: 0,
      };

      gsap.to(animationState, {
        visibleWeeks: completedWeeks,

        ease: "none",

        scrollTrigger: {
          trigger: canvas,

          start: "top 88%",
          end: "bottom 88%",
          scrub: 1,
          invalidateOnRefresh: true,
        },

        onUpdate: () => {
          visibleWeeksRef.current = animationState.visibleWeeks;

          drawGridRef.current?.();
        },

        onComplete: () => {
          visibleWeeksRef.current = completedWeeks;

          drawGridRef.current?.();
        },
      });
    },
    {
      scope: canvasRef,

      dependencies: [livedWeeks, lifespan, prefersReducedMotion],

      revertOnUpdate: true,
    }
  );

  return (
    <>
      <canvas
        className="life-grid__canvas"
        ref={canvasRef}
        aria-hidden="true"
      />

      <p className="visually-hidden">
        A grid containing {lifespan} rows and 52 columns. Each mark represents
        one week. {livedWeeks.toLocaleString()} weeks are marked as lived.
      </p>
    </>
  );
}

export default LifeGridCanvas;
