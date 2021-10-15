import { useEffect, useRef, useState } from "react";
// FIXME: これがあるとbuildで落ちる
import { sums, greet } from "../../rust/pkg/rust_bg.wasm";

export default function WorkerComp() {
  const tsWorkerRef = useRef<Worker | null>();
  const wasmWorkerRef = useRef<Worker | null>();

  const [tsWorkerMessages, setTsWorkerMessages] = useState<String[]>([]);
  const [wasmWorkerMessages, setWasmWorkerMessages] = useState<String[]>([]);

  useEffect(() => {
    // From https://webpack.js.org/guides/web-workers/#syntax
    tsWorkerRef.current = new Worker(
      new URL("pagesComponents/performance/sample.worker.ts", import.meta.url)
    );

    tsWorkerRef.current.addEventListener("message", (evt) => {
      console.log("Message from TS worker:", evt.data);
      const newMessages = [...tsWorkerMessages, evt.data];
      setTsWorkerMessages(newMessages);
    });

    tsWorkerRef.current.postMessage({ type: "start" });

    wasmWorkerRef.current = new Worker(
      new URL("pagesComponents/performance/wasm.worker.ts", import.meta.url)
    );

    wasmWorkerRef.current.addEventListener("message", (evt) => {
      console.log("Message from WASM worker:", evt.data);
      const newMessages = [...wasmWorkerMessages, evt.data];
      setWasmWorkerMessages(newMessages);
    });

    wasmWorkerRef.current.postMessage({ type: "start" });
    console.log(sums(10000));
  }, []);

  return (
    <div>
      <h2>TS worker messages:</h2>
      <pre>
        {tsWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join("\n\n")}
      </pre>
      <h2>WASM worker messages:</h2>
      <pre>
        {wasmWorkerMessages
          .map((msg) => JSON.stringify(msg, null, 2))
          .join("\n\n")}
      </pre>
    </div>
  );
}
