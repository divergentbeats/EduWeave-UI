import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [usn, setUsn] = useState<string>('');
  const [dob, setDob] = useState<string>('');

  const handleLogin = () => {
    const studentsData = localStorage.getItem('students');
    const students = studentsData ? JSON.parse(studentsData) : [];
    const student = students.find((s: any) => s.usn === usn && s.dob === dob);

    if (student) {
      localStorage.setItem('currentStudent', JSON.stringify(student));
      navigate('/dashboard');
    } else {
      localStorage.setItem('pendingStudent', JSON.stringify({ usn, dob }));
      navigate('/student-entry');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-[#0b0b12] flex items-center justify-center p-4 transition-colors">
      {/* Animated background orbs */}
      <motion.div initial={{opacity:0, scale:.9}} animate={{opacity:.6, scale:1}} transition={{duration:1.2}}
        className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 blur-3xl opacity-30" />
      <motion.div initial={{opacity:0, scale:.9}} animate={{opacity:.5, scale:1}} transition={{duration:1.2, delay:.2}}
        className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 blur-3xl opacity-30" />
      <div className="bg-white dark:bg-[#12121b] text-gray-900 dark:text-indigo-100 p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-800 transition-colors">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            EduWeave Login
          </h1>
          <p className="text-gray-600">Enter your USN and DOB to continue</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">USN</label>
            <input
              type="text"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your USN"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
