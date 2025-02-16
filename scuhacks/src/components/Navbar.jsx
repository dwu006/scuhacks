import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { SpinningLogo } from './SpinningLogo';

function Navbar() {
  return (
    <nav className="flex justify-between items-center max-w-6xl mx-auto mr-72 py-4 px-6 bg-white/80 backdrop-blur-sm">
      <Link to="/" className="flex items-center">
        <div className="w-20 h-20">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <SpinningLogo />
          </Canvas>
        </div>
        <span className="text-2xl font-bold text-[#5c4934]">Virtual Plant</span>
      </Link>
      <div className="flex items-center space-x-6">
        <ul className="flex space-x-6 text-[#8c7355]">
          <li><Link to="/garden" className="hover:text-[#7fa37f] transition-colors">Garden</Link></li>
          <li><Link to="/plants" className="hover:text-[#7fa37f] transition-colors">Plants</Link></li>
          <li><Link to="/education" className="hover:text-[#7fa37f] transition-colors">Education</Link></li>
          <li><Link to="/upload" className="hover:text-[#7fa37f] transition-colors">Upload Picture</Link></li>
        </ul>
        <div className="flex items-center space-x-2 ml-6">
          <Link to="/account" className="hover:text-[#7fa37f] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#7fa37f] text-white flex items-center justify-center hover:bg-[#4c724c] transition-colors">
              <span className="text-sm">AC</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
