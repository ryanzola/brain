import { useRef } from 'react'
import { AdditiveBlending, Color, DoubleSide } from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

function Tube({curve}) {
  const brainMat = useRef()

  useFrame(({ clock }) => {
    brainMat.current.uniforms.time.value = clock.getElapsedTime()
  })

  const BrainMaterial = shaderMaterial(
    { time: 0, color: new Color(0.1, 0.3, 0.6) },
    // vertex shader
    /*glsl*/`
      uniform float time;

      varying float vProgress;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + time * 3.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    // fragment shader
    /*glsl*/`
      uniform float time;
      uniform vec3 color;
      varying float vProgress;
      varying vec2 vUv;
      void main() {
        vec3 finalColor = mix(color, color * 0.25, vProgress);

        float hideCorners = smoothstep(1.0, 0.9, vUv.x) * smoothstep(0.0, 0.1, vUv.x);

        gl_FragColor.rgba = vec4(finalColor, hideCorners);
      }
    `
  )

  extend({ BrainMaterial })

  return <mesh>
      <tubeGeometry args={[curve, 64, 0.001, 3, false]} />
      <brainMaterial 
        ref={brainMat} 
        side={DoubleSide} 
        transparent={true}
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}  
      />
    </mesh>
}

function Tubes({allTheCurves}) {
  return <>
    {allTheCurves.map((curve, index) => <Tube key={index} curve={curve} />)}
  </>
}

export default Tubes