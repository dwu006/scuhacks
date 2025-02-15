import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Mock data for statistics (replace with real data later)
const plantStats = {
  totalPlants: 1234,
  totalCO2Offset: 5678,
  topPlants: [
    { name: "Snake Plant", count: 156 },
    { name: "Spider Plant", count: 143 },
    { name: "Peace Lily", count: 128 }
  ],
  topCO2Plants: [
    { name: "Bamboo Palm", offset: 1200 },
    { name: "Dragon Tree", offset: 1100 },
    { name: "Weeping Fig", offset: 950 }
  ]
}

function SpinningLogo() {
  const groupRef = useRef(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  )
}

function AnimatedBox({ initialPosition }) {
  const meshRef = useRef(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const getAdjacentIntersection = (current) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function Scene() {
  const initialPositions = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ]

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  )
}

function StatisticsSidebar() {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 h-auto w-64 bg-black bg-opacity-80 text-white p-6 rounded-l-lg shadow-lg">
      <div className="space-y-8">
        {/* Total Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Garden Statistics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Plants</p>
              <p className="text-2xl font-bold">{plantStats.totalPlants}</p>
            </div>
            <div>
              <p className="text-gray-400">Total CO2 Offset</p>
              <p className="text-2xl font-bold">{plantStats.totalCO2Offset} kg</p>
            </div>
          </div>
        </div>

        {/* Most Popular Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Most Popular Plants</h3>
          <div className="space-y-3">
            {plantStats.topPlants.map((plant, index) => (
              <div key={plant.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">#{index + 1}</span>
                  <span>{plant.name}</span>
                </div>
                <span className="text-gray-400">{plant.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top CO2 Offset Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">Top CO2 Offset Plants</h3>
          <div className="space-y-3">
            {plantStats.topCO2Plants.map((plant, index) => (
              <div key={plant.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">#{index + 1}</span>
                  <span>{plant.name}</span>
                </div>
                <span className="text-gray-400">{plant.offset} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <StatisticsSidebar />
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto mr-72">
          <div className="flex items-center">
            <div className="w-20 h-20">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SpinningLogo />
              </Canvas>
            </div>
            <span className="text-2xl font-bold">Virtual Plant</span>
          </div>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-gray-300">Garden</a></li>
            <li><a href="#" className="hover:text-gray-300">Plants</a></li>
          </ul>
        </nav>
      </header>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 mr-32">
        <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto">Plant a Plant!</h1>
        <h2 className="text-xl mb-10">Take a picture of your plant and get started</h2>
        <button className="bg-white text-black font-bold py-3 px-6 rounded-md hover:bg-gray-200 transition duration-300">
          Upload a picture
        </button>
      </div>
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 15, 35] }}>
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}

export default App
