import { useEffect, useRef } from "react";
import {useMotionValue,motion,useTransform} from "framer-motion"
import { Queue } from "@/lib/queue";
import ProgressCircle from "@/components/progress/ProgressCircle";

type Props = {
  start:number,
  end:number,
  srcList:string[],
}
 
export default function ScrollAnimationCanvas({srcList,start,end}:Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const value = useMotionValue(0)
  useEffect(()=>{
    const queue = new Queue()
    const imageList =[];
    srcList.forEach((src,i)=>{
      queue.addTask((cb)=>{
        imageList[i]=loadImage(src,cb)
      })
    })
    function loadImage(src:string,cb:()=>void){
      const image = new Image();
      image.onload = function(){
        value.set(value.get()+ 100/87)
        cb()
      }
      image.src = src
      return image
    }

    window.addEventListener("scroll",(e)=>{
      if(value.get()<100)return;
      const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const ctx = ref.current.getContext("2d")
      const index = Math.floor(((window.scrollY-start) / (end - start))*(imageList.length-1))
      if(index===44||index===33||index===55||index===66)return;
      if(index<0||index>imageList.length-1)return;
      ctx.clearRect(0, 0, 1080, 1400);
      ctx.drawImage(imageList[index],0,0)
    })
  })
  const circumference =Math.ceil(2 * Math.PI * 40);
  const fillPercents = useTransform(value,(latestValue)=>Math.ceil((circumference / 100) * (100 - latestValue)))

  return (
    <div style={{height: 2000}}>
      <ProgressCircle progress={value} radius={40} strokeWidth={5} />
      <canvas style={{position:"sticky",top:50}} ref={ref} width="1080" height="1400" />
    </div>
  );
}
