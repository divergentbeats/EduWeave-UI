import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentEntry = () => {
  const [usn, setUsn] = useState('');
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [attendance, setAttendance] = useState('');
  // Simple guided inputs instead of raw JSON
  const [gradeAI, setGradeAI] = useState('');
  const [gradeDBMS, setGradeDBMS] = useState('');
  const [gradeCN, setGradeCN] = useState('');
  const [projectsText, setProjectsText] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let pending: any = null;
    try {
      const raw = localStorage.getItem('pendingStudent');
      pending = raw ? JSON.parse(raw) : null;
    } catch {}
    if (pending) {
      setUsn(pending.usn);
      setDob(pending.dob);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
      // Compile grades from individual fields
      const gradesObj: Record<string, number> = {} as any;
      if (gradeAI) gradesObj['AI'] = parseFloat(gradeAI);
      if (gradeDBMS) gradesObj['DBMS'] = parseFloat(gradeDBMS);
      if (gradeCN) gradesObj['CN'] = parseFloat(gradeCN);

      // Parse projects: each line "Project name - short description"
      const projectsArr: Array<{ name: string; description?: string }> = [];
      if (projectsText.trim()) {
        projectsText.split('\n').forEach(line => {
          const [name, description] = line.split('-').map(s => s.trim());
          if (name) {
            projectsArr.push({ name, description });
          }
        });
      }

      // Parse skills: "Python, React, ML" -> ["Python", "React", "ML"]
      const skillsArr = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);

      const student = {
        usn,
        dob,
        name,
        department,
        semester: parseInt(semester),
        cgpa: parseFloat(cgpa),
        attendance: parseFloat(attendance),
        grades: gradesObj,
        projects: projectsArr,
        skills: skillsArr
      };

      const students = JSON.parse(localStorage.getItem('students')) || [];
      students.push(student);
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('currentStudent', JSON.stringify(student));
      localStorage.removeItem('pendingStudent');

      navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 max-h-screen overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Student Entry
          </h1>
          <p className="text-gray-600">Enter your details to create your profile</p>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">USN</label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                required
                disabled
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Semester</label>
              <input
                type="number"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 6"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">CGPA</label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 8.7"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Attendance %</label>
              <input
                type="number"
                step="0.01"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 88.5"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Grades (per subject)</label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                step="0.1"
                value={gradeAI}
                onChange={(e) => setGradeAI(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="AI (e.g., 9.0)"
              />
              <input
                type="number"
                step="0.1"
                value={gradeDBMS}
                onChange={(e) => setGradeDBMS(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="DBMS (e.g., 8.5)"
              />
              <input
                type="number"
                step="0.1"
                value={gradeCN}
                onChange={(e) => setGradeCN(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="CN (e.g., 7.8)"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter grades you know; you can leave others blank.</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Projects</label>
            <textarea
              value={projectsText}
              onChange={(e) => setProjectsText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder={'One per line: Project name - short description'}
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">Example: AI Chatbot - Campus Q&A assistant</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Skills</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder='Comma separated e.g., Python, React, ML'
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentEntry;
