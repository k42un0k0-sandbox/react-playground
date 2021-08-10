import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

export default function Modal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const [state, setState] = useState(open);
  useEffect(() => {
    if (open) setState(true);
  }, [open]);
  return (
    typeof document !== "undefined" &&
    ReactDOM.createPortal(
      state && (
        <Fade
          open={open}
          onExit={() => {
            setState(false);
          }}
        >
          {children}
        </Fade>
      ),
      document.body
    )
  );
}

function Fade({
  open,
  children,
  onExit,
}: {
  onExit: () => void;
  open: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    setTimeout(() => {
      ref.current.style.opacity = open ? "1" : "0";
    });
  }, [open]);
  return (
    <Transition
      in={open}
      onExited={onExit}
      timeout={{ enter: 0, exit: duration }}
    >
      {(state) => {
        console.log(state);
        return (
          <div
            ref={ref}
            style={{
              ...defaultStyle,
            }}
          >
            {children}
          </div>
        );
      }}
    </Transition>
  );
}
