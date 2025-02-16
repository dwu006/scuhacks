import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Garden from './pages/Garden';
import Plants from './pages/Plants';
import Upload from './pages/Upload';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Account from './pages/Account.jsx';
import Education from './pages/Education.jsx';

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

function Login({ onGuestLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log('Login attempt with:', email, password);
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    onGuestLogin(true);
  };

  if (isGuest) {
    return <Navigate to="/garden" />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome to Virtual Plant</h2>
          <p className="mt-2 text-sm text-gray-400">Track and manage your garden with AI</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleGuestLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-green-600 text-sm font-medium rounded-md text-green-600 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function NavbarWrapper() {
  const location = useLocation();
  return location.pathname !== '/' ? <Navbar /> : null;
}

function App() {
  const [isGuest, setIsGuest] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<Login onGuestLogin={setIsGuest} />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/account" element={<Account />} />
          <Route path="/education" element={<Education />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
