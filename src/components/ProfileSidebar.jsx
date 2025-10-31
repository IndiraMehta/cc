import { X, User, Calendar, Trophy, MessageCircle, Bot, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileSidebar = ({ isOpen, onClose }) => {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const menuItems = [
    { icon: User, label: 'View Profile', action: 'profile' },
    { icon: PlusCircle, label: 'Host Events', action: 'host' },
    { icon: Calendar, label: 'My Events', action: 'myevents' },
    { icon: Trophy, label: 'Judge Events', action: 'judge' },
    { icon: MessageCircle, label: 'Chats', action: 'chats' },
    { icon: Bot, label: 'Chatbot', action: 'chatbot' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-8 p-4 bg-gradient-to-red from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {profile?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-lg">{profile?.name}</p>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                {profile?.role || 'participant'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.action}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('navigate', { detail: item.action }));
                  onClose();
                }}
              >
                <item.icon size={20} className="text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
