import { useEffect, useState } from "react";
import { Curtains, Plane, Vec2 } from "curtainsjs";

const basicVs = `
    precision mediump float;
    
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    
    uniform mat4 uTextureMatrix0;
    
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        
        // varyings
        vVertexPosition = aVertexPosition;
        vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord, 0.0, 1.0)).xy;
    }
`;

const basicFs = `
    precision mediump float;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    uniform sampler2D uSampler0;
    
    uniform float uTime;
    
    void main() {
        vec2 textureCoord = vTextureCoord;
        // displace our pixels along the X axis based on our time uniform
        // textures coords are ranging from 0.0 to 1.0 on both axis
        textureCoord.x += sin(textureCoord.y * 25.0) * cos(textureCoord.x * 25.0) * (cos(uTime / 50.0)) / 25.0;
        
        gl_FragColor = texture2D(uSampler0, textureCoord);
    }
`;

export default function CurtainsJS() {
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  useEffect(() => {
    if (!showChild) return;
    // track the mouse positions to send it to the shaders
    const mousePosition = new Vec2();
    // we will keep track of the last position in order to calculate the movement strength/delta
    const mouseLastPosition = new Vec2();

    const deltas = {
      max: 0,
      applied: 0,
    };

    // set up our WebGL context and append the canvas to our wrapper
    const curtains = new Curtains({
      container: "canvas",
      watchScroll: false, // no need to listen for the scroll in this example
      pixelRatio: Math.min(1.5, window.devicePixelRatio), // limit pixel ratio for performance
    });

    // handling errors
    curtains
      .onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
      })
      .onContextLost(() => {
        // on context lost, try to restore the context
        curtains.restoreContext();
      });

    // get our plane element
    const planeElements = document.getElementsByClassName("plane");

    const vs = `
        precision mediump float;
        // default mandatory variables
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        
        // our texture matrix uniform
        uniform mat4 simplePlaneTextureMatrix;
        // custom variables
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMousePosition;
        uniform float uMouseMoveStrength;
        void main() {
            vec3 vertexPosition = aVertexPosition;
            // get the distance between our vertex and the mouse position
            float distanceFromMouse = distance(uMousePosition, vec2(vertexPosition.x, vertexPosition.y));
            // calculate our wave effect
            float waveSinusoid = cos(5.0 * (distanceFromMouse - (uTime / 75.0)));
            // attenuate the effect based on mouse distance
            float distanceStrength = (0.4 / (distanceFromMouse + 0.4));
            // calculate our distortion effect
            float distortionEffect = distanceStrength * waveSinusoid * uMouseMoveStrength;
            // apply it to our vertex position
            vertexPosition.z +=  distortionEffect / 30.0;
            vertexPosition.x +=  (distortionEffect / 30.0 * (uResolution.x / uResolution.y) * (uMousePosition.x - vertexPosition.x));
            vertexPosition.y +=  distortionEffect / 30.0 * (uMousePosition.y - vertexPosition.y);
            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
            // varyings
            vTextureCoord = (simplePlaneTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vVertexPosition = vertexPosition;
        }
    `;

    const fs = `
        precision mediump float;
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        uniform sampler2D simplePlaneTexture;
        void main() {
            // apply our texture
            vec4 finalColor = texture2D(simplePlaneTexture, vTextureCoord);
            // fake shadows based on vertex position along Z axis
            finalColor.rgb -= clamp(-vVertexPosition.z, 0.0, 1.0);
            // fake lights based on vertex position along Z axis
            finalColor.rgb += clamp(vVertexPosition.z, 0.0, 1.0);
            // handling premultiplied alpha (useful if we were using a png with transparency)
            finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
            gl_FragColor = finalColor;
        }
    `;

    // some basic parameters
    const params = {
      vertexShader: vs,
      fragmentShader: fs,
      widthSegments: 20,
      heightSegments: 20,
      uniforms: {
        resolution: {
          // resolution of our plane
          name: "uResolution",
          type: "2f", // notice this is an length 2 array of floats
          value: [planeElements[0].clientWidth, planeElements[0].clientHeight],
        },
        time: {
          // time uniform that will be updated at each draw call
          name: "uTime",
          type: "1f",
          value: 0,
        },
        mousePosition: {
          // our mouse position
          name: "uMousePosition",
          type: "2f", // again an array of floats
          value: mousePosition,
        },
        mouseMoveStrength: {
          // the mouse move strength
          name: "uMouseMoveStrength",
          type: "1f",
          value: 0,
        },
      },
    };

    // create our plane
    const simplePlane = new Plane(curtains, planeElements[0], params);

    // if there has been an error during init, simplePlane will be null
    simplePlane
      .onReady(() => {
        // set a fov of 35 to reduce perspective (we could have used the fov init parameter)
        simplePlane.setPerspective(35);

        // apply a little effect once everything is ready
        deltas.max = 2;

        // now that our plane is ready we can listen to mouse move event
        const wrapper = document.getElementById("page-wrap");

        wrapper.addEventListener("mousemove", (e) => {
          handleMovement(e, simplePlane);
        });

        wrapper.addEventListener(
          "touchmove",
          (e) => {
            handleMovement(e, simplePlane);
          },
          {
            passive: true,
          }
        );
      })
      .onRender(() => {
        // increment our time uniform
        simplePlane.uniforms.time.value++;

        // decrease both deltas by damping : if the user doesn't move the mouse, effect will fade away
        deltas.applied += (deltas.max - deltas.applied) * 0.02;
        deltas.max += (0 - deltas.max) * 0.01;

        // send the new mouse move strength value
        simplePlane.uniforms.mouseMoveStrength.value = deltas.applied;
      })
      .onAfterResize(() => {
        const planeBoundingRect = simplePlane.getBoundingRect();
        simplePlane.uniforms.resolution.value = [
          planeBoundingRect.width,
          planeBoundingRect.height,
        ];
      })
      .onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");
      });

    // handle the mouse move event
    function handleMovement(e, plane) {
      // update mouse last pos
      mouseLastPosition.copy(mousePosition);

      const mouse = new Vec2();

      // touch event
      if (e.targetTouches) {
        mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
      // mouse event
      else {
        mouse.set(e.clientX, e.clientY);
      }

      // lerp the mouse position a bit to smoothen the overall effect
      mousePosition.set(
        curtains.lerp(mousePosition.x, mouse.x, 0.3),
        curtains.lerp(mousePosition.y, mouse.y, 0.3)
      );

      // convert our mouse/touch position to coordinates relative to the vertices of the plane and update our uniform
      plane.uniforms.mousePosition.value =
        plane.mouseToPlaneCoords(mousePosition);

      // calculate the mouse move strength
      if (mouseLastPosition.x && mouseLastPosition.y) {
        let delta =
          Math.sqrt(
            Math.pow(mousePosition.x - mouseLastPosition.x, 2) +
              Math.pow(mousePosition.y - mouseLastPosition.y, 2)
          ) / 30;
        delta = Math.min(4, delta);
        // update max delta only if it increased
        if (delta >= deltas.max) {
          deltas.max = delta;
        }
      }
    }
  }, [showChild]);
  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }
  return (
    <div id="page-wrap">
      <div id="canvas"></div>
      <div className="wrapper">
        <div className="plane">
          <img src="/mush.png" />
        </div>
      </div>
      <style jsx global>{`
        body {
          /* make the body fits our viewport */
          position: relative;
          width: 100%;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          font-family: "PT Sans", Verdana, sans-serif;
          font-size: 18px;
        }
      `}</style>
      <style jsx>
        {`
          #canvas {
            /* make the canvas wrapper fits the document */
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .wrapper {
            width: 100%;
            height: 100vh;
            display: flex;
          }

          .plane {
            /* define the size of your plane */
            width: 80%;
            height: 80vh;
            margin: 10vh auto;
          }
        `}
      </style>
    </div>
  );
}
