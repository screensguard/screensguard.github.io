import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-end">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-gray-100 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/writeups" 
              className="text-gray-300 hover:text-gray-100 transition-colors font-medium"
            >
              Writeups
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
