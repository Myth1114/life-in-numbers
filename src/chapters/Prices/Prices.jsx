import { useRef } from "react";

import { ReceiptText } from "lucide-react";

import { useChapterReveal } from "../../hooks/useChapterReveal";
import { useHistoricalPrices } from "../../hooks/useHistoricalPrices";

import "./Prices.css";

function formatCurrency(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function Prices({ lifeData }) {
  const sectionRef = useRef(null);

  useChapterReveal(sectionRef);

  const { priceData, isLoading, error } = useHistoricalPrices(
    lifeData.birthDate
  );

  const birthYear = lifeData.birthDate.getUTCFullYear();

  const purchasingPower = priceData?.purchasingPower;

  return (
    <section
      ref={sectionRef}
      className="data-section prices"
      id="prices"
      aria-labelledby="prices-title"
    >
      <div className="data-section__container">
        <header className="data-section__header" data-reveal>
          <p className="data-section__number">11</p>

          <div>
            <p className="data-section__eyebrow">The receipt</p>

            <h2 className="data-section__title" id="prices-title">
              What ordinary things cost.
            </h2>

            <p className="data-section__introduction">
              A basket of familiar prices from your birth month, placed beside
              the latest published U.S. averages.
            </p>
          </div>
        </header>

        <div className="prices__receipt" data-reveal>
          <header className="prices__receipt-header">
            <ReceiptText size={28} strokeWidth={1.4} aria-hidden="true" />

            <p className="prices__receipt-name">Life in Numbers</p>

            <p className="prices__receipt-date">Price record — {birthYear}</p>
          </header>

          {isLoading && (
            <div className="prices__status" role="status">
              <span className="prices__loading-mark" aria-hidden="true" />

              <p>Looking through the price records…</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="prices__status" role="status">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && priceData && !priceData.available && (
            <div className="prices__status">
              <p>
                Comparable price records were not available for your birth
                month.
              </p>
            </div>
          )}

          {!isLoading && !error && priceData?.available && (
            <>
              <div className="prices__columns">
                <p>Item</p>

                <p>Then</p>

                <p>Latest</p>
              </div>

              <div className="prices__items">
                {priceData.items.map((item) => (
                  <div className="prices__item" key={item.key}>
                    <div>
                      <p className="prices__item-name">{item.label}</p>

                      <p className="prices__item-unit">{item.unit}</p>
                    </div>

                    <p className="prices__value">
                      {formatCurrency(item.birthValue)}
                    </p>

                    <p className="prices__value prices__value--current">
                      {formatCurrency(item.currentValue)}
                    </p>
                  </div>
                ))}
              </div>

              {purchasingPower && (
                <div className="prices__purchasing-power">
                  <p className="prices__purchasing-label">
                    Purchasing-power comparison
                  </p>

                  <p className="prices__purchasing-statement">
                    <strong>$1</strong> in {purchasingPower.birthPeriod.year}{" "}
                    had approximately the same buying power as{" "}
                    <strong>
                      {formatCurrency(purchasingPower.oneDollarToday)}
                    </strong>{" "}
                    in the latest available period.
                  </p>
                </div>
              )}

              <footer className="prices__receipt-footer">
                <p>
                  Birth comparison:{" "}
                  {priceData.items[0]?.birthPeriod.month ??
                    purchasingPower?.birthPeriod.month}{" "}
                  {birthYear}
                </p>

                <p>
                  Latest comparison:{" "}
                  {priceData.items[0]?.currentPeriod.month ??
                    purchasingPower?.currentPeriod.month}{" "}
                  {priceData.items[0]?.currentPeriod.year ??
                    purchasingPower?.currentPeriod.year}
                </p>
              </footer>
            </>
          )}
        </div>

        <aside className="data-note" data-reveal>
          <p className="data-note__label">U.S. reference data</p>

          <div>
            <p className="data-note__title">
              This is context, not a local receipt from your birthplace.
            </p>

            <p className="data-note__description">
              Figures are monthly U.S. city averages published by the Bureau of
              Labor Statistics. Individual shops, cities and countries had
              different prices. Missing historical items are left out rather
              than estimated.
            </p>

            <a
              className="prices__source-link"
              href="https://www.bls.gov/cpi/data.htm"
              target="_blank"
              rel="noreferrer"
            >
              View the BLS data source
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Prices;
