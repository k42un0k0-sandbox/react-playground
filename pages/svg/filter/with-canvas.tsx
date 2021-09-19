import { TouchTexture } from "@/pagesComponents/three/iconview/interactive/TouchTexture";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

/**
 * touchtextureで色を作って、feDisplacementMapで要素にフィルターをかける
 * @returns
 */
export default function WithCanvas() {
  const [imageUrl,setImageUrl] =useState('')
  const textureRef= useRef<TouchTexture>(null)
  useEffect(()=>{
     textureRef.current = new TouchTexture(800,200)
    const tick = ()=>{
      textureRef.current.update()
      setImageUrl(
        textureRef.current.canvas.toDataURL()
      )
    requestAnimationFrame(tick)
    }
    tick()
  },[])
  return <><div style={{width:800,height:200,backgroundColor:'red'}} onMouseMove={(e)=>{
    const elm = e.target as HTMLDivElement
    const rect = elm.getBoundingClientRect()
    const pos ={ x: (e.clientX-rect.left)/800,y:(e.clientY-rect.top)/200}
    textureRef.current.addTouch(pos)
  }}>

  </div>
  <svg>
    <filter id='filter'>
    <feImage xlinkHref={imageUrl}/>
    <feDisplacementMap in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
  <div style={{filter:'url(#filter)',fontSize:50,textAlign:'center'}}>
    Hello World Unko Man
    </div>
  </>;
}
