import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

function Box({ position, color = '#7fa37f' }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh
      position={position}
      ref={meshRef}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Scene() {
  const gridSize = 4;
  const spacing = 2;

  const boxes = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = (i - gridSize / 2) * spacing;
      const z = (j - gridSize / 2) * spacing;
      boxes.push(
        <Box
          key={`${i}-${j}`}
          position={[x, Math.sin((i + j) * 0.5) * 0.2, z]}
          color={
            (i + j) % 2 === 0
              ? '#7fa37f'  // sage green
              : '#c4b7a6'  // warm taupe
          }
        />
      );
    }
  }

  return (
    <Canvas
      camera={{ position: [10, 10, 10], fov: 50 }}
      style={{ 
        background: '#f7f3eb',
        width: '100%',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      {boxes}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e6dfd3" />
      </mesh>
    </Canvas>
  );
}

export default Scene;
