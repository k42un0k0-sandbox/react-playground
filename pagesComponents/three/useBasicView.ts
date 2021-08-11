import { useEffect } from "react";
import { BasicView } from "./BasicView";

export function useBasicview(effect: () => BasicView | Promise<BasicView>) {
  useEffect(() => {
    const basicView = effect();
    return () => {
      async function cleanup() {
        const bv = await basicView;
        bv.stopRendering();
      }
      cleanup();
    };
  });
}
