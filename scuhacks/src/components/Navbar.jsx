import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { SpinningLogo } from './SpinningLogo';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <SpinningLogo />
              </Canvas>
            </div>
            <span className="text-2xl font-bold text-[#5c4934] ml-2">Virtual Plant</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              <Link to="/garden" className="text-[#8c7355] hover:text-[#5c4934] transition-colors">Garden</Link>
              <Link to="/plants" className="text-[#8c7355] hover:text-[#5c4934] transition-colors">Plants</Link>
              <Link to="/upload" className="text-[#8c7355] hover:text-[#5c4934] transition-colors">Upload Picture</Link>
            </div>
            
            <Link to="/account" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#dce7dc] text-[#4c724c] flex items-center justify-center hover:bg-[#b8ccb8] transition-colors">
                <span className="text-sm font-medium">AC</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
