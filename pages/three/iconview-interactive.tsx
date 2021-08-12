import { IconViewInteractive } from "@/pagesComponents/three/iconview-interactive/IconViewInteractive";
import { useEffect } from "react";
import { loadFont } from "@/pagesComponents/three/iconview/load-font";
import { useBasicview } from "@/pagesComponents/three/useBasicView";

export default function Iconview() {
  useBasicview(async () => {
    await loadFont();
    const view = new IconViewInteractive(document.body);
    view.startRendering();
    view.debug();
    return view;
  });
  return null;
}
