import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  const student = useMemo(() => {
    try {
      const raw = localStorage.getItem('currentStudent');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!student) navigate('/login');
  }, [student, navigate]);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(student || {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${student?.usn || 'profile'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-[#0a0b14] dark:via-[#0a0b14] dark:to-[#0a0b14] flex items-center justify-center p-6 transition-colors">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:.4, y:0}} transition={{duration:1}}
        className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 blur-3xl opacity-30" />
      <motion.div initial={{opacity:0, y:-20}} animate={{opacity:.4, y:0}} transition={{duration:1, delay:.2}}
        className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 blur-3xl opacity-30" />

      <div className="w-full max-w-2xl">
        <div className="mb-4 flex justify-between">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-input/30 dark:hover:bg-input/50 transition-colors">Back</button>
          <div className="flex gap-2">
            <button onClick={downloadJSON} className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">Download JSON</button>
            <button onClick={printPDF} className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors">Download PDF</button>
          </div>
        </div>

        <div ref={printRef} className="bg-white dark:bg-[#0e1020] text-gray-900 dark:text-indigo-100 rounded-2xl border border-gray-200 dark:border-[#1c2035cc] shadow-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {(student?.name || 'ST')[0]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{student?.name || 'Student'}</h1>
              <p className="text-sm text-gray-600 dark:text-indigo-200">USN: {student?.usn || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-[#14162a] rounded-xl p-4 border border-gray-200 dark:border-[#1c2035cc]">
              <div className="text-gray-500 dark:text-indigo-200 text-sm">CGPA</div>
              <div className="text-xl font-semibold">{student?.cgpa ?? '-'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-[#14162a] rounded-xl p-4 border border-gray-200 dark:border-[#1c2035cc]">
              <div className="text-gray-500 dark:text-indigo-200 text-sm">Semester</div>
              <div className="text-xl font-semibold">{student?.semester ?? '-'}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-gray-500 dark:text-indigo-200">Projects</div>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {(student?.projects || []).map((p: any, i: number) => (
                <li key={i} className="font-medium">
                  {typeof p === 'string' ? p : p.name}{p?.description ? ` – ${p.description}` : ''}
                </li>
              ))}
              {(!student?.projects || student.projects.length === 0) && <li className="text-gray-500 dark:text-indigo-300">No projects added</li>}
            </ul>
          </div>

          <div className="mb-6">
            <div className="text-gray-500 dark:text-indigo-200">Skills</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(student?.skills || []).map((s: string) => (
                <span key={s} className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-[#161a2f] text-indigo-700 dark:text-indigo-100 border border-indigo-200 dark:border-[#1c2035cc] text-xs font-semibold">{s}</span>
              ))}
              {(!student?.skills || student.skills.length === 0) && <span className="text-gray-500 dark:text-indigo-300 text-sm">No skills listed</span>}
            </div>
          </div>

          <div>
            <div className="text-gray-500 dark:text-indigo-200">Career Path</div>
            <div className="font-medium mt-2">{student?.careerPath || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


