import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
import { Homepage } from './pages/Homepage';
import { HostEvents } from './pages/HostEvents';
import { MyEvents } from './pages/MyEvents';
import { JudgeEvents } from './pages/JudgeEvents';
import { Chat } from './pages/Chat';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleNavigate = (event) => {
      if (typeof event.detail === 'string') {
        setCurrentPage(event.detail);
      } else if (event.detail?.page) {
        setCurrentPage(event.detail.page);
      } else {
        setCurrentPage(event.detail);
      }
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Homepage />;
      case 'host':
        return <HostEvents />;
      case 'myevents':
        return <MyEvents />;
      case 'judge':
        return <JudgeEvents />;
      case 'chats':
      case 'chat':
        return <Chat />;
      default:
        return <Homepage />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-bred from-gray-50 to-blue-50">
        <Navbar />
        <main>
          {renderPage()}
        </main>
        <Chatbot />
      </div>
    </AuthProvider>
  );
}

export default App;
