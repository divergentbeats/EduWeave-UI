import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, User, Send, Book, BrainCircuit, BarChart3, UserSquare, Settings, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../src/components/ui/modal'; // Import the Modal component
import { TopBar } from '../src/components/dashboard/TopBar'; // Import the TopBar component

// Mock data, similar to what might come from localStorage or an API
const studentData = {
  name: 'Jane Doe',
  usn: '1AB23CD001',
  cgpa: 8.7,
  semester: 5,
  email: 'jane.doe@example.com',
  phone: '123-456-7890',
  projects: ['AI-Powered Chatbot', 'E-commerce Website'],
  skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm AI Echo, your campus assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: "Thanks for your question! I'm still under development, but I'll be able to answer your questions about campus, courses, and more very soon." }]);
    }, 1000);
  };

  const handleLogout = () => {
    // Clear user session/storage here
    navigate('/login');
  };

  const dashboardWidgets = [
    {
      title: 'My Profile',
      icon: <UserSquare size={24} className="text-indigo-400" />,
      value: 'View Full Profile',
      action: () => setProfileModalOpen(true),
      bg: 'from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30'
    },
    {
      title: 'Current CGPA',
      icon: <BarChart3 size={24} className="text-green-400" />,
      value: studentData.cgpa,
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
    },
    {
      title: 'Projects',
      icon: <Book size={24} className="text-purple-400" />,
      value: studentData.projects.length,
      bg: 'from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30'
    },
    {
      title: 'Skills',
      icon: <BrainCircuit size={24} className="text-orange-400" />,
      value: studentData.skills.length,
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30'
    },
  ];

  return (
    <>
      <TopBar 
        onMenuToggle={() => {}} 
        onProfileClick={() => setProfileModalOpen(true)}
        onSettingsClick={() => setSettingsModalOpen(true)}
        onLogoutClick={handleLogout}      
      />
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Welcome, {studentData.name}!</h1>
              <p className="text-muted-foreground">Here's a snapshot of your academic journey.</p>
            </div>
          </motion.div>

          {/* Widgets Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {dashboardWidgets.map((widget, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${widget.bg} border border-border/20 flex flex-col justify-between`}
              >
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-foreground/80">{widget.title}</p>
                  {widget.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold mt-2">{widget.value}</p>
                  {widget.action && (
                    <button onClick={widget.action} className="text-sm font-semibold text-indigo-500 dark:text-indigo-300 mt-2 flex items-center gap-1 group">
                      View <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* AI Echo Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-card border border-border/20 rounded-2xl shadow-lg"
          >
            <div className="p-4 border-b border-border/20">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bot className="text-primary"/>
                AI Echo
              </h2>
              <p className="text-sm text-muted-foreground">Your personal campus assistant</p>
            </div>
            <div className="p-4 h-96 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 max-w-lg ${msg.from === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`p-3 rounded-2xl ${msg.from === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border/20">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about courses, events, or campus life..."
                  className="w-full bg-input-background rounded-full pl-4 pr-12 py-3 border border-border focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <button onClick={handleSendMessage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Send size={20}/>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title="My Profile">
        <div className="space-y-4">
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>USN:</strong> {studentData.usn}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Phone:</strong> {studentData.phone}</p>
          <p><strong>CGPA:</strong> {studentData.cgpa}</p>
          <p><strong>Semester:</strong> {studentData.semester}</p>
          <p><strong>Projects:</strong> {studentData.projects.join(', ')}</p>
          <p><strong>Skills:</strong> {studentData.skills.join(', ')}</p>
        </div>
      </Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Settings">
        <div className="space-y-4">
          <p><strong>Theme:</strong> Dark</p>
          <p><strong>Language:</strong> English</p>
          <p><strong>Notifications:</strong> Enabled</p>
        </div>
      </Modal>

      <Modal isOpen={isNotificationsModalOpen} onClose={() => setNotificationsModalOpen(false)} title="Notifications">
        <ul className="space-y-4">
          <li className="p-4 bg-muted rounded-lg">Your fees for the next semester are due on <strong>2024-08-15</strong>.</li>
          <li className="p-4 bg-muted rounded-lg">New course materials for <strong>CS301</strong> have been uploaded.</li>
          <li className="p-4 bg-muted rounded-lg">The library will be closed this weekend for maintenance.</li>
        </ul>
      </Modal>
    </>
  );
};

export default StudentDashboard;
