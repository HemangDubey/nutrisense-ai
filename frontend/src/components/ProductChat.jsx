import React, { useState } from 'react';
import { sendChat } from '../services/api';
import { MessageSquare, Send, Loader2, Bot } from 'lucide-react';

const ProductChat = ({ contextData, profile }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    // Context string create kar rahe hain analysis result se
    const contextString = JSON.stringify(contextData);

    try {
      const data = await sendChat(userMsg.text, contextString, profile);
      const aiMsg = { role: 'ai', text: data.answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { role: 'ai', text: "Sorry, I couldn't connect right now." };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Bot size={20} />
        <h3 className="font-bold text-lg">Ask about this Product</h3>
      </div>

      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm italic">
            e.g., "Is this safe for kids?", "Why is there Palm Oil?", "Any side effects?"
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-2 rounded-lg rounded-bl-none border border-slate-700">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading || !question}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-2 rounded-lg transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ProductChat;