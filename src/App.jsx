import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { data } from './data'

const PATHS = data.economics[0].paths

console.log(PATHS)

function Tube() {
  let points = []
  for (let i = 0; i < 10; i++) {
    points.push(new THREE.Vector3(
      (i - 5) * 2,
      Math.sin(i * 2) * 10 + 5,
      0
    ))
  }
  let curve = new THREE.CatmullRomCurve3(points)
  return <>
    <mesh>
      <tubeGeometry args={[curve, 64, 0.1, 8, false]} />
      <meshPhongMaterial color="hotpink" side={THREE.DoubleSide} />
    </mesh>
  </>
}

export default function App() {

  return <Canvas>
    <OrbitControls />
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <mesh>
      <boxGeometry />
      <meshPhongMaterial color="hotpink" />
    </mesh>

    <Tube />
  </Canvas>
}
