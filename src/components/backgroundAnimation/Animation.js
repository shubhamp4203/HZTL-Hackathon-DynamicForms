import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import NET from "vanta/src/vanta.net.js";

export const Animation = () => {
    const material = new THREE.MeshStandardMaterial({
        vertexColors: true // or THREE.VertexColors in older versions
      });
  const vantaRef = useRef(null);
  useEffect(() => {
    const vantaEffect = NET({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      //Control the min-size of the animation
      minHeight: 20.0,
      minWidth: 20.0,
      //Modify the sizing
      scale: 1.0,
      scaleMobile: 1.0,
      //Customise the colors
      color: 0xff3f81,
      backgroundColor: 0x23153c,
      //Customise the dots
      points: 6.0,
      maxDistance: 15.0,
      spacing: 14.0,
    });
  });
  return (
    <div className="w-screen h-screen absolute top-0 -z-1" id="vanta" ref={vantaRef}>
    </div>
  );
};

