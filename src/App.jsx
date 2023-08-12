
import { CatmullRomCurve3, Vector3 } from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Tubes from './BrainTubes'
import Particles from './BrainParticles'

import { data } from './data'

const PATHS = data.economics[0].paths

const randomRange = (min, max) => Math.random() * (max - min) + min
let curves = []
for(let i = 0; i < 100; i++) {
  let points = []
  let length = randomRange(0.5, 1)
  for(let j = 0; j < 100; j++) {
    points.push(new Vector3().setFromSphericalCoords(
      1, 
      Math.PI - (j / 100) * Math.PI * length,
      (i / 100) * Math.PI * 2, 
    ))
  }

  let tempCurve = new CatmullRomCurve3(points)
  curves.push(tempCurve)
}

let brainCurves = []
PATHS.forEach(path => {
  let points = []
  for(let i = 0; i < path.length; i+=3) {
    points.push(new Vector3(path[i], path[i+1], path[i+2]))
  }

  let tempCurve = new CatmullRomCurve3(points)
  brainCurves.push(tempCurve)
})

export default function App() {
  return <Canvas camera={{ position: [0, 0, 0.3], near: 0.01, far: 100 }}>
    <color attach="background" args={['black']} />
    <OrbitControls />
    <ambientLight />
    <pointLight position={[10, 10, 10]} />

    <Tubes allTheCurves={brainCurves} />
    <Particles allTheCurves={curves} />
  </Canvas>
}
