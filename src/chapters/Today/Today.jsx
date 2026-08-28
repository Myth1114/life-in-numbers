import { useRef, useState } from "react";
import { ArrowUpRight, CircleHelp, RotateCcw } from "lucide-react";
import { formatDisplayDate, formatWholeNumber } from "../../utils/numberFormat";

import { gsap, useGSAP } from "../../animations/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Download } from "lucide-react";

import { toPng } from "html-to-image";

import ShareCard from "../../components/share/ShareCard";
import "./Today.css";

function Today({ lifeData, onReadAgain, onAnotherDate, onStartOver }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const formattedBirthDate = formatDisplayDate(lifeData.birthDate);
  const formattedDays = formatWholeNumber(lifeData.lived.days);

  const sectionRef = useRef(null);
  const visualRef = useRef(null);

  const [shareStatus, setShareStatus] = useState("idle");
  const shareCardRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  useGSAP(
    () => {
      const visual = visualRef.current;
      const word = visual?.querySelector(".today__word");
      const number = visual?.querySelector(".today__number");
      const revealItems = gsap.utils.toArray("[data-today-reveal]");

      if (prefersReducedMotion) {
        gsap.set([word, number, ...revealItems].filter(Boolean), {
          clearProps: "all",
        });

        return;
      }

      if (visual && word && number) {
        const visualTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: visual,

            start: "top 80%",

            once: true,
          },
        });

        visualTimeline.fromTo(
          word,
          {
            autoAlpha: 0,
            y: 46,
          },
          {
            autoAlpha: 1,
            y: 0,

            duration: 1.25,
            ease: "power3.out",
          }
        );

        visualTimeline.fromTo(
          number,
          {
            autoAlpha: 0,
            y: 58,
            scale: 0.86,
            rotation: -3,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotation: 0,

            duration: 1.35,
            ease: "power3.out",
          },
          "-=0.72"
        );
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

            duration: 1.15,
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
      scope: sectionRef,

      dependencies: [prefersReducedMotion],

      revertOnUpdate: true,
    }
  );
  async function handleDownloadCard() {
    if (!shareCardRef.current || shareStatus === "generating") {
      return;
    }

    try {
      setShareStatus("generating");

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const imageUrl = await toPng(shareCardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,

        backgroundColor: "#e8e2d6",

        style: {
          position: "static",
          top: "auto",
          left: "auto",
          right: "auto",

          width: "1080px",
          height: "1350px",

          margin: "0",
          transform: "none",
        },
      });

      const downloadLink = document.createElement("a");

      downloadLink.download = "life-in-numbers-summary.png";

      downloadLink.href = imageUrl;

      document.body.appendChild(downloadLink);

      downloadLink.click();
      downloadLink.remove();

      setShareStatus("complete");
    } catch (error) {
      console.error("Unable to create share card:", error);

      setShareStatus("error");
    }
  }

  return (
    <section
      className="today"
      id="today"
      aria-labelledby="today-title"
      ref={sectionRef}
    >
      <div className="today__container">
        <div className="today__visual-area" ref={visualRef}>
          <div className="today__visual" aria-hidden="true">
            <p className="today__word">Today</p>

            <p className="today__number">1</p>
          </div>
          {/* 
          <button
            className="today__explain-button"
            type="button"
            aria-expanded={showExplanation}
            aria-controls="today-explanation"
            onClick={() => setShowExplanation((current) => !current)}
          >
            <CircleHelp size={20} strokeWidth={1.5} aria-hidden="true" />

            <span>Explain this</span>
          </button>

          {showExplanation && (
            <p className="today__explanation" id="today-explanation">
              Future figures were reference points. Today is different: it is
              the one unit of time currently available to you.
            </p>
          )} */}
        </div>

        <div className="today__summary">
          <p className="today__summary-label" data-today-reveal>
            A personal summary
          </p>

          <h2 className="today__title" id="today-title" data-today-reveal>
            You have been here for approximately <em>{formattedDays} days</em>,
            since {formattedBirthDate}.
          </h2>

          <p className="today__description" data-today-reveal>
            The future figures were only a reference. This one is more certain:
            today is the only square asking to be noticed.
          </p>

          <div className="today__actions" data-today-reveal>
            <button
              className="today__primary-action"
              type="button"
              onClick={onReadAgain}
            >
              <span>Read it again</span>

              <ArrowUpRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>

            <button
              className="today__secondary-action"
              type="button"
              onClick={onAnotherDate}
            >
              <RotateCcw size={20} strokeWidth={1.5} aria-hidden="true" />

              <span>Another date</span>
            </button>
            <button
              className="today__secondary-action"
              type="button"
              onClick={handleDownloadCard}
              disabled={shareStatus === "generating"}
            >
              <Download size={20} strokeWidth={1.5} aria-hidden="true" />

              <span>
                {shareStatus === "generating"
                  ? "Creating card..."
                  : shareStatus === "complete"
                  ? "Download again"
                  : shareStatus === "error"
                  ? "Try download again"
                  : "Download my numbers"}
              </span>
            </button>
          </div>
        </div>

        <footer className="today__footer" data-today-reveal>
          <p>Life in Numbers / An almanac for the living.</p>

          <p className="today__privacy">No data leaves this page.</p>
        </footer>
      </div>

      <div className="today__bottom-bar" data-today-reveal>
        <button
          className="today__start-over"
          type="button"
          onClick={onStartOver}
        >
          <RotateCcw size={19} strokeWidth={1.5} aria-hidden="true" />

          <span>Start over</span>
        </button>

        {/* <div className="today__progress" aria-label="Journey complete">
          <span />
          <span />
          <span />
          <span />
          <span className="is-active" />
        </div> */}
      </div>
      <ShareCard ref={shareCardRef} lifeData={lifeData} />
    </section>
  );
}

export default Today;
