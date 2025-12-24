import React, { useState, useEffect, useRef } from 'react';
import {
  useGetMessagesQuery,
  useGetProfileQuery,
  useSendMessageMutation,
} from '../stores';
import type { ChatMessage } from '../stores/interfaces/chatAI';
import { ROLE } from '../constants/nav-items';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: profileData } = useGetProfileQuery();
  const userId = profileData?.data?._id || 'default';

  // if (profileData?.data?.role === ROLE.ADMIN) return;

  // RTK Query hooks
  const { data, refetch, isFetching } = useGetMessagesQuery(
    { userId },
    { skip: !open },
  );
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      await sendMessage({ userId, content: input.trim() }).unwrap();
      setInput('');
      // Optionally refetch messages after sending
      setTimeout(() => refetch(), 200);
    } catch {
      // handle error (optional)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  // Map backend messages to display format
  const messages: { role: 'user' | 'assistant'; content: string }[] = data?.data
    ?.length
    ? data.data.map((msg: ChatMessage) => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.content,
      }))
    : [{ role: 'assistant', content: 'Xin chào! Tôi có thể giúp gì cho bạn?' }];

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      {open && (
        <div className="w-[600px] h-[400px] bg-white rounded-2xl overflow-hidden flex flex-col shadow-xl">
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center font-bold">
            <span>QLĐV</span>
            <button
              onClick={() => setOpen(false)}
              className="bg-transparent border-none text-xl text-white cursor-pointer hover:opacity-80"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-100">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 px-3 rounded-xl max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-auto'
                    : 'bg-gray-200 mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex border-t border-gray-300">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending || isFetching}
              className="flex-1 border-none p-4 text-sm outline-none caret-black disabled:bg-gray-50"
            />
            <button
              onClick={handleSend}
              disabled={isSending || isFetching}
              className="bg-blue-500 text-white border-none px-4 cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          className="bg-blue-500 text-white border-none rounded-full w-[60px] h-[60px] text-2xl cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}
    </div>
  );
}
