import { useRef } from "react";
import { Heart, HeartPulse, Wind } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";
import { formatWholeNumber } from "../../utils/numberFormat";

import { gsap, useGSAP } from "../../animations/gsap";

import { useReducedMotion } from "../../hooks/useReducedMotion";

import "./Body.css";

function Body({ lifeData }) {
  const bodyMetrics = [
    {
      key: "heartbeats",
      label: "Heartbeats",
      value: lifeData.estimated.heartbeats,
      description: "Using a resting reference of 72 beats per minute.",
      icon: HeartPulse,
    },
    {
      key: "breaths",
      label: "Breaths",
      value: lifeData.estimated.breaths,
      description: "Using a gentle reference of 16 breaths per minute.",
      icon: Wind,
    },
  ];

  const sectionRef = useRef(null);
  useChapterReveal(sectionRef);
  const heartbeatRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();
  useGSAP(
    () => {
      if (!heartbeatRef.current || prefersReducedMotion) {
        return;
      }

      const heartbeat = gsap.timeline({
        repeat: -1,
        paused: true,

        scrollTrigger: {
          trigger: heartbeatRef.current,

          start: "top 90%",
          end: "bottom 10%",

          onEnter: (self) => {
            self.animation.play();
          },

          onLeave: (self) => {
            self.animation.pause();
          },

          onEnterBack: (self) => {
            self.animation.play();
          },

          onLeaveBack: (self) => {
            self.animation.pause();
          },
        },
      });

      heartbeat
        .to(heartbeatRef.current, {
          scale: 1.16,
          duration: 0.12,
          ease: "power2.out",
        })
        .to(heartbeatRef.current, {
          scale: 1,
          duration: 0.14,
          ease: "power2.in",
        })
        .to(heartbeatRef.current, {
          scale: 1.09,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(heartbeatRef.current, {
          scale: 1,
          duration: 0.16,
          ease: "power2.in",
        })
        .to(
          {},
          {
            duration: 0.7,
          }
        );
    },
    {
      scope: sectionRef,

      dependencies: [prefersReducedMotion],

      revertOnUpdate: true,
    }
  );
  return (
    <section
      ref={sectionRef}
      className="data-section body-chapter"
      id="body"
      aria-labelledby="body-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">02</p>

          <div>
            <p className="data-section__eyebrow">The body clock</p>

            <h2 className="data-section__title" id="body-title">
              A million tiny keeps.
            </h2>

            <p className="data-section__introduction">
              The body keeps its own calendar. These are some of the cycles that
              have carried you here.
            </p>
          </div>
        </header>

        <div className="body__heartbeat" data-reveal>
          <div className="body__heartbeat-mark" aria-hidden="true">
            <span className="body__heartbeat-line" />

            <Heart
              ref={heartbeatRef}
              className="body__heartbeat-icon"
              size={42}
              strokeWidth={1.25}
            />

            <span className="body__heartbeat-line" />
          </div>

          <div className="body__heartbeat-copy">
            <p className="body__heartbeat-label">An estimated rhythm</p>

            <p className="body__heartbeat-text">
              Quietly continuing while the rest of life receives your attention.
            </p>
          </div>
        </div>

        <div className="data-grid">
          {bodyMetrics.map((metric) => {
            const MetricIcon = metric.icon;

            return (
              <article className="data-metric" key={metric.key} data-reveal>
                <div className="data-metric__top">
                  <p className="data-metric__label">{metric.label}</p>

                  <MetricIcon
                    className="data-metric__icon"
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                <p className="data-metric__value body-chapter__value">
                  <span
                    className="body-chapter__approximation"
                    aria-label="Approximately"
                  >
                    ~
                  </span>

                  {formatWholeNumber(metric.value)}
                </p>

                <p className="data-metric__description">{metric.description}</p>
              </article>
            );
          })}
        </div>

        <aside className="data-note" data-reveal>
          <p className="data-note__label">About these figures</p>

          <div>
            <p className="data-note__description">
              These are estimates based on general reference rates. They are not
              personal health measurements.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Body;
