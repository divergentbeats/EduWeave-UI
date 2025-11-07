import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, User, Send, Book, BrainCircuit, BarChart3, UserSquare, Settings, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../src/components/ui/modal'; // Import the Modal component
import { TopBar } from '../src/components/dashboard/TopBar'; // Import the TopBar component
import { populateMockData } from '../src/utils/mockStudentData';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('currentStudent');
    if (data) {
      setStudentData(JSON.parse(data));
    } else {
      // Populate mock data for demo
      populateMockData();
      const mockData = localStorage.getItem('currentStudent');
      setStudentData(JSON.parse(mockData));
    }
  }, [navigate]);

  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm AI Echo, your campus assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notification data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Assignment Due',
      message: 'Your Machine Learning assignment is due tomorrow at 11:59 PM',
      type: 'warning',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'New Grade Posted',
      message: 'Your Database Management System grade has been posted: A-',
      type: 'success',
      time: '1 day ago'
    },
    {
      id: 3,
      title: 'Campus Event',
      message: 'Tech Talk: "AI in Healthcare" scheduled for Friday, 3:00 PM',
      type: 'info',
      time: '2 days ago'
    },
    {
      id: 4,
      title: 'Attendance Alert',
      message: 'Your attendance in Computer Networks is below 75%',
      type: 'warning',
      time: '3 days ago'
    }
  ]);

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
    localStorage.removeItem('currentStudent');
    localStorage.removeItem('pendingStudent');
    navigate('/login');
  };

  if (!studentData) {
    return <div>Loading...</div>; // Or a proper loader
  }

  const dashboardWidgets = [
    {
      title: 'My Profile',
      icon: <UserSquare size={24} className="text-indigo-400" />,
      value: 'View Full Profile',
      action: () => navigate('/profile'),
      bg: 'from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30'
    },
    {
      title: 'Current CGPA',
      icon: <BarChart3 size={24} className="text-green-400" />,
      value: studentData?.cgpa || 'N/A',
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'
    },
    {
      title: 'Attendance',
      icon: <Book size={24} className="text-purple-400" />,
      value: studentData?.attendance ? `${studentData.attendance}%` : 'N/A',
      bg: 'from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30'
    },
    {
      title: 'Skills',
      icon: <BrainCircuit size={24} className="text-orange-400" />,
      value: studentData?.skills?.length || 0,
      bg: 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30'
    },
  ];

  return (
    <>
      <TopBar 
        studentData={studentData}
        onMenuToggle={() => {}} 
        onProfileClick={() => setProfileModalOpen(true)}
        onSettingsClick={() => setSettingsModalOpen(true)}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
        onLogoutClick={handleLogout}      
      />
      
      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-6 top-20 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'info' ? 'bg-blue-500' :
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/community')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Community
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Settings
              </button>
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

          {/* Academic Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Grades Card */}
            <div className="bg-card border border-border/20 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="text-primary"/>
                Subject Grades
              </h3>
              <div className="space-y-3">
                {Object.entries(studentData.grades || {}).map(([subject, grade]) => (
                  <div key={subject} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">{subject}</span>
                    <span className="font-bold text-lg">{grade}</span>
                  </div>
                ))}
                {Object.keys(studentData.grades || {}).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No grades available yet</p>
                )}
              </div>
            </div>

            {/* Projects Card */}
            <div className="bg-card border border-border/20 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="text-primary"/>
                Recent Projects
              </h3>
              <div className="space-y-3">
                {studentData.projects?.slice(0, 3).map((project, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <h4 className="font-semibold">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
                {(studentData.projects?.length || 0) === 0 && (
                  <p className="text-muted-foreground text-center py-4">No projects added yet</p>
                )}
                {studentData.projects?.length > 3 && (
                  <button 
                    onClick={() => navigate('/profile')}
                    className="text-sm font-semibold text-indigo-500 dark:text-indigo-300 mt-2 flex items-center gap-1 group"
                  >
                    View All Projects <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Echo Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {studentData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold">{studentData.name}</h3>
              <p className="text-muted-foreground">{studentData.usn}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{studentData.department}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Semester</p>
              <p className="font-semibold">{studentData.semester}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">CGPA</p>
              <p className="font-semibold">{studentData.cgpa}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Attendance</p>
              <p className="font-semibold">{studentData.attendance}%</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {studentData.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Projects</h4>
            <div className="space-y-2">
              {studentData.projects.map((project, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{project.name}</p>
                  {project.description && (
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Settings">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Appearance</h3>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <label htmlFor="theme-select" className="font-medium">Theme</label>
              <select id="theme-select" className="bg-input-background border border-border rounded-md px-2 py-1">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Preferences</h3>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <label htmlFor="language-select" className="font-medium">Language</label>
              <select id="language-select" className="bg-input-background border border-border rounded-md px-2 py-1">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg mt-2">
              <span className="font-medium">Email Notifications</span>
              <label htmlFor="notif-toggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" id="notif-toggle" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Account</h3>
            <button className="w-full text-left p-3 bg-muted rounded-lg font-medium hover:bg-muted/80 transition-colors">
              Change Password
            </button>
            <button className="w-full text-left p-3 mt-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors">
              Delete Account
            </button>
          </div>
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
