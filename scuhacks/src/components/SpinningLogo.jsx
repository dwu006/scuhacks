import { useRef, useLoader } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpinningLogo() {
  const groupRef = useRef(null);
  const texture = useLoader(THREE.TextureLoader, '/src/assets/PlantPortalLogo.png');

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
    </group>
  );
}
