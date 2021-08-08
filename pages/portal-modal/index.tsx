import { useState } from "react";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("../../pagesComponents/portal-modal/Modal"));

export default function PortalModal() {
  const [state, setState] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setState(!state);
        }}
      >
        押せ
      </button>
      <Modal open={state}>
        <div>hello</div>
      </Modal>
      <div>world</div>
    </div>
  );
}
