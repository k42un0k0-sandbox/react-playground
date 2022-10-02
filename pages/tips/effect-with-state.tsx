import { useEffect, useState } from "react";

export default function EffectDeps() {
  const [state, setState] = useState(0);

  useEffect(() => {
    const onClick = () => {
      setState((v) => v + 1);
    };
    console.log(1);
    document.getElementById("button").addEventListener("click", onClick);
    return () => {
      document.getElementById("button").removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div>
      <button id="button">click</button>
      {state}
    </div>
  );
}
