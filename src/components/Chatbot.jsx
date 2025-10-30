import { useState } from 'react';
import { Bot, X, Send, Minimize2 } from 'lucide-react';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m your InnovateHub assistant. How can I help you today?', isBot: true }
  ]);
  const [input, setInput] = useState('');

  const predefinedResponses = {
    'show my events': 'I can help you view your events! Click on your profile and select "My Events" to see all events you\'ve joined.',
    'how to host an event': 'To host an event, click on your profile icon and select "Host Events". Then click "New Event" and fill out the form with your event details.',
    'how to submit': 'To submit your project, go to "My Events" from your profile menu, find the event you want to submit to, and click "Submit Project".',
    'how to join': 'To join an event, browse the homepage and click "Join Event" on any event card that interests you!',
    'submission deadline': 'Submission deadlines are shown in your event details. Check "My Events" to see the end dates for each event you\'ve joined.',
    'how to judge': 'If you\'re invited as a judge, go to "Judge Events" from your profile menu. Select an event and review submissions by providing ratings and feedback.',
    'what can you do': 'I can help you with:\n- Navigating the platform\n- Hosting events\n- Joining events\n- Submitting projects\n- Understanding judging\n- Finding event deadlines',
    'help': 'I can assist with:\n1. How to host an event\n2. How to join events\n3. How to submit projects\n4. Judging submissions\n5. Viewing your events\n\nJust ask me anything!',
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }

    if (input.includes('event') || input.includes('hackathon')) {
      return 'I can help with events! Try asking "how to host an event" or "how to join" for specific guidance.';
    }

    if (input.includes('submit') || input.includes('submission')) {
      return 'For submission help, try asking "how to submit" or "submission deadline".';
    }

    if (input.includes('judge') || input.includes('review')) {
      return 'Need help with judging? Ask "how to judge" for detailed instructions.';
    }

    return 'I\'m not sure about that. Try asking:\n- "How to host an event"\n- "How to join"\n- "How to submit"\n- "Help" for more options';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = { text: getBotResponse(input), isBot: true };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-red from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-bounce"
        >
          <Bot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-red from-blue-600 to-cyan-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold">InnovateHub Assistant</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot size={14} className="text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Ask me anything..."
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {['Help', 'How to join', 'How to submit'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
