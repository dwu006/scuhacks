import { Canvas } from '@react-three/fiber';
import { StatisticsSidebar } from '../components/StatisticsSidebar';
import { Scene } from '../components/Scene';

function Garden() {
  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <StatisticsSidebar />
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
  );
}

export default Garden;
