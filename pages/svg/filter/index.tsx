import { useState } from "react";
// https://www.curtainsjs.com/get-started.html
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="200"
        width="226.855"
        style={{ background: "red" }}
      >
        <defs>
          <linearGradient
            gradientTransform="translate(-353.18 -4908.622) scale(6.99647)"
            gradientUnits="userSpaceOnUse"
            id="a"
            y2="701.6"
            x2="66.7"
            y1="730.2"
            x1="66.7"
          >
            <stop offset="0" style={{ stopColor: "#2075bc", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#29aae1", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient
            gradientTransform="translate(-353.18 -4908.622) scale(6.99647)"
            gradientUnits="userSpaceOnUse"
            id="b"
            y2="701.6"
            x2="54.6"
            y1="730.2"
            x1="54.6"
          >
            <stop offset="0" style={{ stopColor: "#0a6aa8", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#1699c8", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient
            gradientTransform="translate(-353.18 -4908.622) scale(6.99647)"
            gradientUnits="userSpaceOnUse"
            id="c"
            y2="701.6"
            x2="70.7"
            y1="730.2"
            x1="70.7"
          >
            <stop offset="0" style={{ stopColor: "#0a6aa8", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "#1699c8", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          style={{ fill: "url(#a)" }}
          d="m56.89 0-.353.354L0 22.969V200l56.537-21.555L113.427 200l56.538-21.555L226.855 200V22.969L169.965.354 169.61 0v.354l-56.183 22.261L56.89.354V0zm43.026 42.215c.968.017 1.938.077 2.91.187 7.067 1.767 13.783 4.595 20.85 6.008 6.36-1.767 14.487-3.533 20.494.707 3.887 3.887 7.773 8.48 6.006 14.487 10.954 12.014 34.983 13.427 41.697 22.615 1.06 1.413.353 11.66 2.473 17.668l.707 2.828c-2.12 4.24-7.068 15.9-5.301 13.426-1.767 2.473-3.534 3.18-8.48 2.12-4.24 2.828-6.714 4.24-11.307 6.714-4.947 1.06-15.9-2.474-20.848-3.534-9.187-1.766-9.894.354-18.021 4.594-12.014 6.007-9.541 20.85-14.135 29.33 0 1.06.354 1.766.707 2.826s.707 1.766.707 2.473c-13.78 1.767-27.209-.352-39.576-6.36-9.54-4.593-17.667-11.661-24.381-20.142 1.413-.707 3.178-1.766 4.592-2.473 1.06-.353 2.121-1.06 2.828-1.414H60.07c-3.18-.706-1.413-.353-3.886-.353 2.826-3.18 6.715-6.006 7.068-6.36l.352-.353c-3.534 1.06-8.834 2.474-11.66 5.3 1.06-4.946 4.594-8.128 6.36-12.015-4.24 2.12-8.481 4.949-12.015 8.13 0-3.888 4.595-7.776 6.715-10.956 1.413-2.12 3.534-3.886 4.594-6.36-4.24 1.414-14.135 6.713-18.022 9.186 1.767-6.007 9.895-15.193 14.488-19.787-4.593.353-14.134 6.007-18.021 8.127 0-.353.353-.707 0-1.06 3.18-4.948 12.72-12.721 17.314-16.608-5.3.707-15.9 6.36-20.847 8.127 4.24-7.774 18.374-17.313 25.088-22.967l-16.254 4.24c-2.474 0-4.595 1.766-6.715 1.413 8.48-8.481 25.796-23.322 37.103-30.39 0 0 13.665-9.626 28.184-9.374z"
        />
        <path
          style={{ fill: "url(#b)" }}
          d="M56.89 0 0 22.969V200l56.89-21.555v-37.304a85.988 85.988 0 0 1-2.472-2.979 68.24 68.24 0 0 0 2.473-1.33v-2.936c-.21.011-.344.026-.707.026.226-.255.469-.503.707-.752v-3.707c-1.89.797-3.674 1.773-4.948 3.047.823-3.838 3.128-6.615 4.948-9.48v-1.8c-3.761 2.02-7.461 4.566-10.602 7.393 0-3.887 4.595-7.775 6.715-10.955 1.148-1.722 2.753-3.216 3.887-5.04v-1.05c-4.53 1.687-13.615 6.562-17.315 8.916 1.767-6.007 9.895-15.193 14.488-19.787-4.593.353-14.134 6.007-18.021 8.127 0-.353.353-.707 0-1.06 3.18-4.948 12.72-12.721 17.314-16.608-5.3.707-15.9 6.36-20.847 8.127 4.108-7.531 17.444-16.688 24.38-22.395v-.388l-15.546 4.056c-2.474 0-4.595 1.766-6.715 1.413 5.224-5.225 13.802-12.857 22.262-19.604V0z"
        />
        <path
          style={{ fill: "url(#c)" }}
          d="m169.965 0-56.537 22.969v22.627c3.386 1.083 6.775 2.12 10.248 2.814 6.36-1.767 14.487-3.533 20.494.707 3.887 3.887 7.773 8.48 6.006 14.487 4.891 5.364 12.39 8.613 19.789 11.386V0zm-26.397 124.818c-4.455.05-6.377 2.037-12.472 5.217-12.014 6.007-9.541 20.85-14.135 29.33 0 1.06.354 1.766.707 2.826s.707 1.766.707 2.473a74.51 74.51 0 0 1-4.947.465V200l56.537-21.555v-49.47c-4.947 1.06-15.9-2.474-20.848-3.534-2.297-.441-4.063-.64-5.549-.623z"
        />
      </svg>
    </div>
  );
}