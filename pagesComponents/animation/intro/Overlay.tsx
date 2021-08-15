import { forwardRef } from "react";
import { createPortal } from "react-dom";

export default forwardRef<HTMLDivElement, { step: number | null }>(
  function Overlay({ step }, ref) {
    return (
      <>
        {typeof document != "undefined" &&
          step != null &&
          createPortal(
            <div
              ref={ref}
              style={{
                boxShadow:
                  "rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px",
                position: "absolute",
                zIndex: 1,
              }}
            ></div>,
            document.body
          )}
        <style jsx global>{`
          .active-step {
            position: relative;
            z-index: 99999;
          }
        `}</style>
      </>
    );
  }
);
