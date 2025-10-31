import { Link } from 'react-router-dom';
import { Lightbulb, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onToggleSidebar }) => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-blue from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-red from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InnovateHub
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={onToggleSidebar}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-red from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all hover:scale-105"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
                <Menu className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 rounded-lg bg-gradient-to-red from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
