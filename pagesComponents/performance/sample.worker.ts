const ctx: Worker = self as unknown as Worker;

async function start() {
  ctx.postMessage({
    type: "tsData",
    data: "im worker",
  });
}

ctx.addEventListener("message", (evt) => {
  switch (evt.data.type) {
    case "start":
      start();
      return;
  }
});

export {};
