import { IconView } from "../../../pagesComponents/three/iconview/IconView";
import { loadFont } from "../../../pagesComponents/three/iconview/load-font";
import { useBasicview } from "../../../pagesComponents/three/useBasicView";

export default function Iconview() {
  useBasicview(async () => {
    await loadFont();
    const view = new IconView(document.body);
    view.startRendering();
    return view;
  });
  return null;
}
