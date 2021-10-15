import { useEffect, useState } from "react";

export default function Repeat() {
  const [start, setStart] = useState(0);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const starttime = performance.now();
    let a = [];
    for (let i = 0; i < 1000 * 1000; i++) {
      a.push(i);
    }
    const endtime = performance.now();
    console.log(a.length);
    console.log(`time: ${endtime - starttime}`);
  }, [start]);
  return (
    <div>
      <button
        onClick={() => {
          setStart(start + 1);
        }}
      >
        start{start}
      </button>
      <button
        onClick={() => {
          setReload(reload + 1);
        }}
      >
        reload{reload}
      </button>
    </div>
  );
}
