import { useEffect, useMemo, useRef } from 'react'
import { AdditiveBlending, Color } from 'three'
import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

const randomRange = (min, max) => Math.random() * (max - min) + min

function BrainParticles({allTheCurves}) {
  let density = 10
  let numberOfPoints = density * allTheCurves.length
  const myPoints = useRef([])
  const brainGeo = useRef()

  let positions = useMemo(() => {
    let positions = []
    for(let i = 0; i < numberOfPoints; i++) {
      positions.push(
        randomRange(-1, 1),
        randomRange(-1, 1),
        randomRange(-1, 1),
      )
    }
    return new Float32Array(positions)
  }, [numberOfPoints])

  let randoms = useMemo(() => {
    let randoms = []
    for(let i = 0; i < numberOfPoints; i++) {
      randoms.push(
        randomRange(0.3, 1.0),
      )
    }
    return new Float32Array(randoms)
  }, [numberOfPoints])

  const BrainParticleMaterial = shaderMaterial(
    { time: 0, color: new Color(0.1, 0.3, 0.6) },
    // vertex shader
    /*glsl*/`
      attribute float random;

      uniform float time;

      varying float vProgress;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vProgress = smoothstep(-1.0, 1.0, sin(vUv.x * 8.0 + time * 3.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        gl_PointSize = random * 2.0 * (1.0 / - mvPosition.z);
        // gl_PointSize = 50.0;
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

  useEffect(() => {
    console.log({allTheCurves, density})
    for(let i = 0; i < allTheCurves.length; i++) {
      for(let j = 0; j < density; j++) {
        myPoints.current.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.001,
          curve: allTheCurves[i],
          curPosition: Math.random()
        })
      }
    }
  })

  useFrame(() => {
    let curpositions = brainGeo.current.attributes.position.array

    for(let i = 0; i < myPoints.current.length; i++) {
      myPoints.current[i].curPosition += myPoints.current[i].speed
      myPoints.current[i].curPosition = myPoints.current[i].curPosition % 1

      let curPoint = myPoints.current[i].curve.getPointAt(myPoints.current[i].curPosition)

      curpositions[i * 3] = curPoint.x
      curpositions[i * 3 + 1] = curPoint.y
      curpositions[i * 3 + 2] = curPoint.z
    }

    brainGeo.current.attributes.position.needsUpdate = true
  })

  return <points>
    <bufferGeometry attach="geometry" ref={brainGeo}>
      <bufferAttribute
        attach="attributes-position"
        count={positions.length / 3}
        array={positions}
        itemSize={3}
      />
      <bufferAttribute
        attach="attributes-random"
        count={randoms.length}
        array={randoms}
        itemSize={1}
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