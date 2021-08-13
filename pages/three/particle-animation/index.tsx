import { loadFont } from "@/pagesComponents/three/iconview/load-font";
import { useBasicview } from "@/pagesComponents/three/useBasicView";
import { ParticleAnimationView } from "@/pagesComponents/three/particle-animation/ParticleAnimationView";

export default function ParticleAnimation() {
  useBasicview(async () => {
    await loadFont();
    const view = new ParticleAnimationView(document.body);
    view.startRendering();
    view.debug();
    return view;
  });
  return null;
}
