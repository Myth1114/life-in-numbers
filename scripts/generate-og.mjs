import sharp from "sharp";

const outputPath = "public/social/og-default.png";

const svg = `
<svg
  width="1200"
  height="630"
  viewBox="0 0 1200 630"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect
    width="1200"
    height="630"
    fill="#E8E2D6"
  />

  <rect
    x="0"
    y="0"
    width="1200"
    height="14"
    fill="#A45132"
  />

  <line
    x1="72"
    y1="104"
    x2="1128"
    y2="104"
    stroke="#171714"
    stroke-opacity="0.22"
    stroke-width="2"
  />

  <text
    x="72"
    y="78"
    fill="#171714"
    font-family="Arial, sans-serif"
    font-size="20"
    font-weight="600"
    letter-spacing="3"
  >
    LIFE IN NUMBERS
  </text>

  <text
    x="1128"
    y="78"
    fill="#77736B"
    font-family="Arial, sans-serif"
    font-size="17"
    font-weight="600"
    letter-spacing="2"
    text-anchor="end"
  >
    A PERSONAL ALMANAC
  </text>

  <text
    x="72"
    y="180"
    fill="#A45132"
    font-family="Arial, sans-serif"
    font-size="18"
    font-weight="600"
    letter-spacing="3"
  >
    A VISUAL STORY ABOUT YOUR TIME
  </text>

  <text
    x="72"
    y="283"
    fill="#171714"
    font-family="Georgia, serif"
    font-size="88"
    letter-spacing="-3"
  >
    <tspan x="72" dy="0">
      Where did all
    </tspan>

    <tspan x="72" dy="92">
      that time go?
    </tspan>
  </text>

  <text
    x="962"
    y="405"
    fill="#A45132"
    font-family="Georgia, serif"
    font-size="300"
    font-style="italic"
    text-anchor="middle"
  >
    1
  </text>

  <line
    x1="72"
    y1="485"
    x2="1128"
    y2="485"
    stroke="#171714"
    stroke-opacity="0.22"
    stroke-width="2"
  />

  <text
    x="72"
    y="540"
    fill="#77736B"
    font-family="Georgia, serif"
    font-size="26"
  >
    Days. Weeks. Heartbeats. Moons.
  </text>

  <text
    x="72"
    y="580"
    fill="#77736B"
    font-family="Georgia, serif"
    font-size="26"
  >
    Your life, measured differently.
  </text>

  <text
    x="1128"
    y="574"
    fill="#66705A"
    font-family="Arial, sans-serif"
    font-size="18"
    font-weight="600"
    letter-spacing="2"
    text-anchor="end"
  >
    PRIVATE BY DESIGN
  </text>
</svg>
`;

await sharp(Buffer.from(svg))
  .png({
    compressionLevel: 9,
  })
  .toFile(outputPath);

console.log(`Created ${outputPath}`);
