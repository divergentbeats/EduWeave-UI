import { useEffect, useMemo, useRef, useState } from 'react';
import data from '@/data/mockData.json';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: string;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'm0', role: 'assistant', text: 'Hi! I\'m AI Echo. Ask me about your progress.', ts: new Date().toLocaleTimeString()
  }]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const mockReplies = useMemo(() => data.chatMocks, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text, ts: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)] || 'Working on it...';
      const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', text: reply, ts: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="h-full flex flex-col rounded-xl border bg-white shadow-sm">
      <div className="px-4 py-3 border-b font-semibold">AI Echo</div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`max-w-[80%] ${m.role === 'assistant' ? 'self-start' : 'self-end ml-auto'}`}>
            <div className={`${m.role === 'assistant' ? 'bg-gray-100' : 'bg-brand text-white'} rounded-2xl px-3 py-2`}>
              <p className="text-sm">{m.text}</p>
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{m.ts}</div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button onClick={sendMessage} className="px-4 py-2 rounded-lg bg-brand text-white text-sm">Send</button>
      </div>
    </div>
  );
}


