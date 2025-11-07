import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Shield } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './login.css'; // Import custom styles for the calendar

const Login = () => {
  const navigate = useNavigate();
  const [usn, setUsn] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginType, setLoginType] = useState('student'); // 'student' or 'admin'

  const handleLogin = () => {
    if (loginType === 'admin') {
      if (usn === 'admin' && password === 'admin') {
        navigate('/admin-dashboard');
      } else {
        alert('Invalid admin credentials');
      }
    } else {
      if (usn && dob) {
        // This is the original logic: save details and navigate to the entry page
        localStorage.setItem('pendingStudent', JSON.stringify({ usn, dob }));
        navigate('/student-entry');
      } else {
        alert('Please enter USN and Date of Birth');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-[#0b0b12] dark:via-[#0b0b12] dark:to-[#0b0b12] text-foreground p-4">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:.5, y:0}} transition={{duration:1}}
        className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 blur-3xl opacity-30" />
      <motion.div initial={{opacity:0, y:-20}} animate={{opacity:.5, y:0}} transition={{duration:1, delay:.2}}
        className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 blur-3xl opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/80 dark:bg-[#12121b]/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            EduWeave
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Your campus connection.</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-[#1f1f2b] p-1 rounded-full">
          <button
            onClick={() => setLoginType('student')}
            className={`w-1/2 p-2 rounded-full transition-colors text-gray-700 dark:text-gray-300 ${loginType === 'student' ? 'bg-violet-600 text-white' : ''}`}>
            <Users className="inline-block w-5 h-5 mr-2" />
            Student
          </button>
          <button
            onClick={() => setLoginType('admin')}
            className={`w-1/2 p-2 rounded-full transition-colors text-gray-700 dark:text-gray-300 ${loginType === 'admin' ? 'bg-violet-600 text-white' : ''}`}>
            <Shield className="inline-block w-5 h-5 mr-2" />
            Admin
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
          <div className="relative">
            <Users className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder={loginType === 'student' ? 'University Serial Number (USN)' : 'Admin ID'}
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1f1f2b] text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-colors"
            />
          </div>
          {loginType === 'student' ? (
            <div className="relative">
              <Calendar className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2 z-10" />
              <DatePicker
                selected={dob ? new Date(dob) : null}
                onChange={(date: Date | null) => setDob(date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Select Date of Birth"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                maxDate={new Date()}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1f1f2b] text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-colors cursor-pointer"
                wrapperClassName="w-full"
                calendarClassName="dark:bg-[#1f1f2b] dark:border-gray-700 dark:text-white"
                popperClassName="dark:bg-[#1f1f2b] dark:border-gray-700 dark:text-white z-50"
                dateFormat="dd/MM/yyyy"
                showPopperArrow={false}
              />
            </div>
          ) : (
            <div className="relative">
              <Shield className="absolute w-5 h-5 text-gray-400 top-1/2 left-4 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#1f1f2b] text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-violet-500 focus:outline-none transition-colors"
              />
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 font-semibold text-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-violet-400/20 transition-all"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
