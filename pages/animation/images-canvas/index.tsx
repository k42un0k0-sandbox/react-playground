import ScrollAnimationCanvas from "@/pagesComponents/animation/images-canvas/ScrollAnimationCanvas";

export default function ImagesCanvas() {
  return (
    <div>
     <ScrollAnimationCanvas {...{
        srcList: [...Array(87).keys()].map((i)=>{
          return`/images/output-${i}.png`
        }),
        start:0,
        end:200,
     }}/>
     </div>
  );
}
