import { useMemo } from 'react'
import { AdditiveBlending, Color } from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

const randomRange = (min, max) => Math.random() * (max - min) + min

function BrainParticles({allTheCurves}) {
  let positions = useMemo(() => {
    let positions = []
    for(let i = 0; i < 100; i++) {
      positions.push(
        randomRange(-1, 1),
        randomRange(-1, 1),
        randomRange(-1, 1),
      )
    }
    return new Float32Array(positions)
  }, [])

  const BrainParticleMaterial = shaderMaterial(
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

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        gl_PointSize = 3.0 * (1.0 / - mvPosition.z);
        gl_PointSize = 50.0;
      }
    `,
    // fragment shader
    /*glsl*/`
      uniform float time;
      uniform vec3 color;
      varying float vProgress;
      varying vec2 vUv;
      void main() {
        float disc = length(gl_PointCoord.xy - 0.5);
        float opacity = 0.3 * smoothstep(0.5, 0.4, disc);

        gl_FragColor = vec4(vec3(opacity), 1.0);
      }
    `
  )

  extend({ BrainParticleMaterial })

  return <points>
    <bufferGeometry attach="geometry">
      <bufferAttribute
        attach="attributes-position"
        count={positions.length / 3}
        array={positions}
        itemSize={3}
      />
    </bufferGeometry>

    <brainParticleMaterial 
      attach="material" 
      depthWrite={false}
      depthTest={false}
      transparent={true}
      blending={AdditiveBlending}
    />
  </points>
}

export default BrainParticles