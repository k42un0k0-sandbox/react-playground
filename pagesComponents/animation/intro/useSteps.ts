import { createRef, useEffect, useMemo, useRef, useState } from "react";

export function useSteps<RefTypes extends HTMLElement>(stepCount: number) {
  const [step, setStep] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>();
  const refs = useMemo(() => {
    return [...Array(stepCount).keys()].map((i) => createRef<RefTypes>());
  }, [stepCount]);
  const container = useMemo(() => {
    return { step, ref: containerRef };
  }, [step, containerRef]);
  const steps = useMemo(() => {
    return [...Array(stepCount).keys()].map((i) => {
      return { className: step == i ? "active-step" : "", ref: refs[i] };
    });
  }, [stepCount, step, refs]);

  useEffect(() => {
    if (step == null) return;
    if (step > stepCount - 1) return;
    const elm = steps[step].ref.current;
    const container = containerRef.current;
    const rect = elm.getBoundingClientRect();
    container.style.top = `${rect.top}px`;
    container.style.left = `${rect.left}px`;
    container.style.width = `${rect.width}px`;
    container.style.height = `${rect.height}px`;
  }, [step]);
  function next() {
    console.log("next", step);
    if (step == null) return;
    if (step + 1 > stepCount - 1) {
      setStep(null);
      return;
    }
    setStep((v) => v + 1);
  }
  function prev() {
    if (step == null) return;
    if (step - 1 < 0) {
      setStep(null);
      return;
    }
    setStep((v) => v - 1);
  }
  function start() {
    setStep(0);
  }
  return { steps, step, container, start, next, prev };
}
