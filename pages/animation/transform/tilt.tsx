import { useEffect } from "react";

export default function Tilt() {
  return (
    <div
      onMouseMove={function (e) {
        const x = e.nativeEvent.clientX / 400;
        const y = e.nativeEvent.clientY / 600;
        e.currentTarget.style.transform = `perspective(500px) rotateY(${
          x * 30 - 30
        }deg) rotateX(${-y * 30 + 15}deg)`;
      }}
      style={{
        margin: "auto",
        backgroundColor: "gray",
        width: 400,
        height: 600,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          backgroundColor: "red",
          width: 200,
          height: 100,
          transform: "translateZ(200px) scale(0.7)",
        }}
      ></div>
    </div>
  );
}
