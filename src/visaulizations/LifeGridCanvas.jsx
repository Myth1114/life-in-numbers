import { useEffect, useRef } from "react";

function LifeGridCanvas({ livedWeeks, lifespan }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const columns = 52;
    const rows = lifespan;
    const totalWeeks = columns * rows;

    const drawGrid = () => {
      const rectangle = canvas.getBoundingClientRect();

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rectangle.width * pixelRatio;

      canvas.height = rectangle.height * pixelRatio;

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

      const completedWeeks = Math.min(livedWeeks, totalWeeks);

      for (let index = 0; index < totalWeeks; index += 1) {
        const column = index % columns;

        const row = Math.floor(index / columns);

        const x = column * cellWidth + (cellWidth - squareSize) / 2;

        const y = row * cellHeight + (cellHeight - squareSize) / 2;

        if (index < completedWeeks) {
          context.fillStyle = rustColor;

          context.fillRect(x, y, squareSize, squareSize);
        } else if (index === completedWeeks && completedWeeks < totalWeeks) {
          context.fillStyle = mossColor;

          context.fillRect(x, y, squareSize, squareSize);
        } else {
          context.strokeStyle = futureColor;

          context.lineWidth = 1;

          context.strokeRect(x, y, squareSize, squareSize);
        }
      }
    };

    drawGrid();

    const resizeObserver = new ResizeObserver(drawGrid);

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [livedWeeks, lifespan]);

  return (
    <>
      <canvas
        className="life-grid__canvas"
        ref={canvasRef}
        aria-hidden="true"
      />

      <p className="visually-hidden">
        A grid containing {lifespan} rows and 52 columns. Each mark represents
        one week. {livedWeeks.toLocaleString()}
        weeks are marked as lived.
      </p>
    </>
  );
}

export default LifeGridCanvas;
