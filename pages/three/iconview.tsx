import { useEffect } from "react";
import { IconView } from "../../pagesComponents/three/iconview/IconView";
import { loadFont } from "../../pagesComponents/three/iconview/load-font";
import { useBasicview } from "../../pagesComponents/three/useBasicView";

export default function Iconview() {
  useBasicview(async () => {
    await loadFont();
    return new IconView(document.body);
  });
  return null;
}
