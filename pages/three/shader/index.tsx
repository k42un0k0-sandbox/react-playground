import { HelloShader } from "../../../pagesComponents/three/shader/HelloShader";
import { useBasicview } from "../../../pagesComponents/three/useBasicView";

export default function Shader() {
  useBasicview(() => {
    return new HelloShader(document.body);
  });
  return <div></div>;
}
