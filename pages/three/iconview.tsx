import { useEffect } from "react";
import { IconView } from "../../pagesComponents/three/IconView";
import { loadFont } from "../../pagesComponents/three/load-font";

export default function Iconview() {
  useEffect(() => {
    async function effect() {
      await loadFont();
      new IconView(document.body);
    }
    effect();
  });
  return null;
}
