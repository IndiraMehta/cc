import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, User, MessageCircle } from 'lucide-react';

export const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      subscribeToMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_members')
        .select(`
          chats (
            id,
            chat_type,
            event_id,
            events (name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      const chatList = data.map(item => item.chats).filter(Boolean);
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (name, email)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = (chatId) => {
    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', payload.new.sender_id)
            .single();

          setMessages(prev => [...prev, {
            ...payload.new,
            profiles: senderData
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: user.id,
          content: newMessage
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Chats</h1>

      {chats.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">No chats available</p>
          <p className="text-gray-500 text-sm mt-2">Join an event to start chatting with your team</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-bold">Your Chats</h2>
            </div>

            <div className="divide-y">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {chat.events?.name || 'Direct Chat'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{chat.chat_type}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl shadow-md flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg">
                    {selectedChat.events?.name || 'Direct Chat'}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{selectedChat.chat_type} chat</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isMyMessage = message.sender_id === user.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'order-2' : 'order-1'}`}>
                          {!isMyMessage && (
                            <p className="text-xs text-gray-500 mb-1 px-3">
                              {message.profiles.name}
                            </p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              isMyMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="br">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMyMessage ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-end ${isMyMessage ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
                            {isMyMessage
                              ? profile?.name?.charAt(0)
                              : message.profiles.name.charAt(0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
