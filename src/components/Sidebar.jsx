import { Link } from 'react-router-dom';
import { X, User, Trophy, Calendar, Gavel, MessageSquare, Bot, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { icon: User, label: 'View Profile', path: '/profile' },
    { icon: Trophy, label: 'Host Events', path: '/host-events' },
    { icon: Calendar, label: 'My Events', path: '/my-events' },
    { icon: Gavel, label: 'Judge Events', path: '/judge-events' },
    { icon: MessageSquare, label: 'Chats', path: '/chat' },
    { icon: Bot, label: 'Chatbot Assistant', path: '/chatbot' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="text-white">
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-sm text-blue-100">{user?.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center space-x-3 px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-gray-700 group-hover:text-blue-600 font-medium transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-6 py-3 rounded-lg hover:bg-red-50 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
              <span className="text-gray-700 group-hover:text-red-600 font-medium transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
