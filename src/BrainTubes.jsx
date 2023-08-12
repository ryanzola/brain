import { useRef } from 'react'
import { AdditiveBlending, Color, DoubleSide, Vector3 } from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

function Tube({curve}) {
  const brainMat = useRef()
  const { viewport } = useThree()

  useFrame(({ clock, mouse }) => {
    brainMat.current.uniforms.time.value = clock.getElapsedTime()
    brainMat.current.uniforms.mouse.value = new Vector3(
      mouse.x * viewport.width / 2,
      mouse.y * viewport.height / 2,
      0
    )
  })

  const BrainMaterial = shaderMaterial(
    { time: 0, color: new Color(0.1, 0.3, 0.6), mouse: new Vector3(0,0,0) },
    // vertex shader
    /*glsl*/`
      uniform vec3 mouse;
      uniform float time;

      varying float vProgress;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + time * 3.0));

        vec3 p = position;
        float maxDist = 0.05;
        float dist = length(mouse - p);

        if(dist < maxDist) {
          vec3 dir = normalize(mouse - p);
          dir *= (1.0-dist / maxDist);
          p -= dir * 0.01;
        }

        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    // fragment shader
    /*glsl*/`
      uniform vec3 color;
      uniform float time;
      uniform vec3 mouse;

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
      <tubeGeometry args={[curve, 64, 0.0005, 3, false]} />
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