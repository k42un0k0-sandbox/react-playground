import { useCallback, useEffect, useRef, useState } from "react";

function useForceUpdate(): [state: number, forceUpdate: () => void] {
  const [state, setState] = useState(0);
  return [state, useCallback(() => setState(state + 1), [state])];
}

let globalValue = 0;
export default function EffectDeps() {
  useEffect(() => {
    console.log("global value effect");
  }, [globalValue]);

  const ref = useRef(0);
  useEffect(() => {
    console.log("ref effect");
  }, [ref.current]);

  const [value, forceUpdate] = useForceUpdate();
  return (
    <div>
      <div>
        <button onClick={forceUpdate}>force update</button>
        {value}
      </div>
      <div>
        <button
          onClick={() => {
            globalValue++;
          }}
        >
          change global
        </button>
        <div>global {globalValue}</div>
      </div>
      <div>
        <button
          onClick={() => {
            ref.current++;
          }}
        >
          change ref
        </button>
        <div>ref {ref.current}</div>
      </div>
    </div>
  );
}
