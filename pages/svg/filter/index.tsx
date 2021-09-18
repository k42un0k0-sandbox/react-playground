import { useState } from "react";

export default function SVGFilter() {
  const [value, setValue] = useState(5);
  return (
    <div className="wrapper">
      <label htmlFor="numocControl">numOctaves</label>
      <input
        type="range"
        min="0"
        max="10"
        value={value}
        onChange={(e) => {
          setValue(e.target.valueAsNumber);
        }}
        step="1"
        id="numocControl"
      />
      <span id="value">{value}</span>

      <svg>
        <filter id="feGaussianBlur">
          <feGaussianBlur stdDeviation={value} />
        </filter>
      </svg>
      <div style={{ filter: "url(#feGaussianBlur)", fontSize: 20 }}>
        うんこうんこうんこ
      </div>
      <svg>
        <filter id="filter">
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="1 0 0 0 0 0 1 0 .2 0 0 0 1 1 0 0 0 0 .2 0"
            result="color"
          />
          <feGaussianBlur in="color" stdDeviation="8" result="colorBlur" />
          <feOffset in="colorBlur" dx="-8" dy="8" result="colorBlurOffset" />
          {/* <feComposite
            in="SourceGraphic"
            in2="colorBlurOffset"
            operator="over"
          /> */}
        </filter>
        <filter id="filter2">
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="1 0 0 0 0 0 1 0 .2 0 0 0 1 1 0 0 0 0 .2 0"
            result="color"
          />
          <feGaussianBlur in="color" stdDeviation="8" result="colorBlur" />
          <feOffset in="colorBlur" dx="-8" dy="8" result="colorBlurOffset" />
          <feComposite
            in="SourceGraphic"
            // in2="colorBlurOffset"
            operator="over"
          />
        </filter>
      </svg>
      <div>
        <img src="/sample.png" style={{ filter: "url(#filter)" }} />
        <img src="/sample.png" style={{ filter: "url(#filter2)" }} />
      </div>
    </div>
  );
}
