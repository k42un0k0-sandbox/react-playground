import Overlay from "@/pagesComponents/animation/intro/Overlay";
import { useSteps } from "@/pagesComponents/animation/intro/useSteps";
import {
  createRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export default function Intro() {
  const { next, ...step } = useSteps<HTMLButtonElement>(4);
  return (
    <div>
      <Overlay {...step.container} />
      <div>
        <button
          {...step.steps[0]}
          onClick={() => {
            step.step == null ? step.start() : next();
          }}
          style={{ margin: 20 }}
        >
          hello
        </button>
        <button
          {...step.steps[1]}
          onClick={() => {
            step.step == null ? step.start() : next();
          }}
          style={{ margin: 20 }}
        >
          world
        </button>
        <button
          {...step.steps[2]}
          onClick={() => {
            step.step == null ? step.start() : next();
          }}
          style={{ margin: 20 }}
        >
          world
        </button>
        <button
          {...step.steps[3]}
          onClick={() => {
            step.step == null ? step.start() : next();
          }}
          style={{ margin: 20 }}
        >
          world
        </button>
      </div>
    </div>
  );
}
