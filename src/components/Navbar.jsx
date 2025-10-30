import { useState } from 'react';
import { Rocket, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './Auth/LoginModal';
import { SignupModal } from './Auth/SignupModal';
import { ProfileSidebar } from './ProfileSidebar';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-red from-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Rocket size={32} />
              <span className="text-2xl font-bold">InnovateHub</span>
            </div>

            <div>
              {user && profile ? (
                <button
                  onClick={() => setShowProfileSidebar(true)}
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition"
                >
                  <User size={20} />
                  <span>{profile.name}</span>
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg transition font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-lg transition font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />

      <ProfileSidebar
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
      />
    </>
  );
};
