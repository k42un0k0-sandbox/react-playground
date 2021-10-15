const ctx: Worker = self as unknown as Worker;

async function start() {
  const { sums } = await import("../../rust/pkg/rust_bg.wasm");

  ctx.postMessage({
    type: "wasmData",
    data: sums(10),
  });
}

ctx.addEventListener("message", (evt) => {
  console.log("hello");
  switch (evt.data.type) {
    case "start":
      start();
      return;
  }
});

export {};
