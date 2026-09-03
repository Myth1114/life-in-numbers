import { useRef, useState } from "react";
import { ArrowUpRight, Download, MapPin, RotateCcw } from "lucide-react";
import { toPng } from "html-to-image";
import { formatDisplayDate, formatWholeNumber } from "../../utils/numberFormat";
import { formatLocationLabel } from "../../services/geocodingService";
import { gsap, useGSAP } from "../../animations/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ShareCard from "../../components/share/ShareCard";
import "./Today.css";

function Today({ lifeData, onReadAgain, onAnotherDate, onStartOver }) {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const shareCardRef = useRef(null);

  const [shareStatus, setShareStatus] = useState("idle");

  const prefersReducedMotion = useReducedMotion();

  const formattedBirthDate = formatDisplayDate(lifeData.birthDate);

  const formattedDays = formatWholeNumber(lifeData.lived.days);

  const birthplace = formatLocationLabel(lifeData.arrival.location);

  const nextMilestone = lifeData.milestones.nextDay;

  const formattedMilestone = formatWholeNumber(nextMilestone.targetDays);

  const formattedMilestoneDate = formatDisplayDate(nextMilestone.milestoneDate);

  const formattedDaysUntil = formatWholeNumber(nextMilestone.daysUntil);

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

  function getShareStatusMessage() {
    if (shareStatus === "generating") {
      return "Creating your share card.";
    }

    if (shareStatus === "complete") {
      return "Your share card has been downloaded.";
    }

    if (shareStatus === "error") {
      return "The share card could not be created. Please try again.";
    }

    return "";
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
        </div>

        <div className="today__summary">
          <p className="today__summary-label" data-today-reveal>
            11 / A personal summary
          </p>

          <h2 className="today__title" id="today-title" data-today-reveal>
            You have been here for approximately <em>{formattedDays} days</em>,
            since {formattedBirthDate}.
          </h2>

          <p className="today__description" data-today-reveal>
            These figures cannot describe everything a life contains. They can
            only make the passing of time a little more visible. Today remains
            the one number still asking to be used.
          </p>

          <div className="today__recap" data-today-reveal>
            <article className="today__recap-item">
              <div className="today__recap-heading">
                <p>Where it began</p>

                <MapPin size={18} strokeWidth={1.5} aria-hidden="true" />
              </div>

              <p className="today__recap-value">{birthplace}</p>

              <p className="today__recap-note">Your selected birthplace</p>
            </article>

            <article className="today__recap-item">
              <div className="today__recap-heading">
                <p>Days completed</p>
              </div>

              <p className="today__recap-value">{formattedDays}</p>

              <p className="today__recap-note">Completed days before today</p>
            </article>

            <article className="today__recap-item today__recap-item--milestone">
              <div className="today__recap-heading">
                <p>Next milestone</p>
              </div>

              <p className="today__recap-value">{formattedMilestone} days</p>

              <p className="today__milestone-date">{formattedMilestoneDate}</p>

              <p className="today__recap-note">
                {formattedDaysUntil} days from today
              </p>
            </article>
          </div>

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

          <p className="visually-hidden" role="status" aria-live="polite">
            {getShareStatusMessage()}
          </p>
        </div>

        <footer className="today__footer" data-today-reveal>
          <p>Life in Numbers / An almanac for the living.</p>

          <p className="today__privacy">
            No account required. We do not intentionally store your birth date
            or birthplace.
          </p>
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
      </div>

      <ShareCard ref={shareCardRef} lifeData={lifeData} />
    </section>
  );
}

export default Today;
