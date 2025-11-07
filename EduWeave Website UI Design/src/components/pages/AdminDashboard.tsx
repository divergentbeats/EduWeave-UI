
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Briefcase, DollarSign, Users, TrendingUp, Building2, CheckCircle, XCircle, Percent } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { getStudentData, listStudents } from '../../../utils/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<Array<{usn:string;name:string}>>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedStudentUsn, setSelectedStudentUsn] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Student Registration', message: '5 new students registered today', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Placement Update', message: '3 students got placed in Tech Corp', time: '4 hours ago', type: 'success' },
    { id: 3, title: 'Low Attendance Alert', message: '15 students have attendance below 75%', time: '6 hours ago', type: 'warning' },
    { id: 4, title: 'System Maintenance', message: 'Scheduled maintenance tonight at 2 AM', time: '1 day ago', type: 'info' }
  ]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentList = await listStudents();
      setAllStudents(studentList);
      const studentData = await Promise.all(
        studentList.map(async (s: { usn: string }) => getStudentData(s.usn))
      );
      setStudents(studentData);
    };
    fetchStudents();
  }, []);

  const onSelectStudent = async (usn: string) => {
    if (!usn) {
      setSelectedStudent(null);
      setSelectedStudentUsn('');
      return;
    }
    const data = await getStudentData(usn);
    setSelectedStudent(data);
    setSelectedStudentUsn(usn);
  };

  const topStudents = useMemo(() => students
    .map(s => {
      const grades = Object.values(s.grades as Record<string, number>);
      const cgpa = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
      return { ...s, cgpa };
    })
    .sort((a, b) => Number(b.cgpa) - Number(a.cgpa))
    .slice(0, 5), [students]);

  const domainDistribution = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      acc[student.domain_interest] = (acc[student.domain_interest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  const transformSkills = (skills: string[]) => skills.map(skill => ({ name: skill, level: Math.floor(Math.random() * 3) + 8 }));

  const transformGrades = (grades: any) => Object.keys(grades).map(key => ({ name: key, grade: grades[key] * 10 }));

  const getAIInsight = (student: any) => {
    if (!student) return { summary: '', prediction: '' };
    const topSkill = student.skills[0];
    const topGrade = Object.keys(student.grades).reduce((a, b) => student.grades[a] > student.grades[b] ? a : b);
    const summary = `${student.name} shows exceptional talent in ${student.domain_interest}, with strong skills in ${topSkill}.`;
    const prediction = `Predictive models suggest a high probability of success in a career focused on ${student.domain_interest}.`;
    return { summary, prediction };
  };
  
  const gradientTextStyle = {
    background: 'linear-gradient(to right, #3b82f6, #1e90ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700, ...gradientTextStyle }}>
          Placement Dashboard
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 1a9 9 0 00-9 9v7l-2 2v1h20v-1l-2-2V10a9 9 0 00-9-9zM12 22a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Main Stats */}
        <div className="p-6 rounded-2xl bg-gray-800 text-white shadow-lg"><Users className="w-6 h-6 mb-4" />
          <div className="text-4xl font-bold">{students.length}</div><div className="text-gray-400 text-sm">Total Students</div>
        </div>
        <div className="p-6 rounded-2xl bg-gray-800 border-gray-700 border"><CheckCircle className="w-6 h-6 mb-4 text-green-500"/>
          <div className="text-4xl font-bold" style={gradientTextStyle}>150</div><div className="text-gray-400 text-sm">Eligible Students</div>
        </div>
        <div className="p-6 rounded-2xl bg-gray-800 border-gray-700 border"><Briefcase className="w-6 h-6 mb-4 text-blue-500"/>
          <div className="text-4xl font-bold" style={gradientTextStyle}>128</div><div className="text-gray-400 text-sm">Placed Students</div>
        </div>
        <div className="p-6 rounded-2xl bg-gray-800 border-gray-700 border"><Percent className="w-6 h-6 mb-4 text-amber-500"/>
          <div className="text-4xl font-bold" style={gradientTextStyle}>85%</div><div className="text-gray-400 text-sm">Placement Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-800 border-gray-700 border shadow-lg">
          <h3 style={{ fontWeight: 700, ...gradientTextStyle }} className="mb-4">Top Performing Students</h3>
          <div className="space-y-4">
            {topStudents.map((student, i) => (
              <div key={student.usn} className="flex items-center justify-between p-3 rounded-lg bg-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-bold" style={gradientTextStyle}>#{i+1}</span>
                  <div>
                    <div className="font-semibold text-white">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.domain_interest}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg" style={gradientTextStyle}>{student.cgpa}</div>
                  <div className="text-xs text-gray-400">CGPA</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-gray-800 border-gray-700 border shadow-lg">
          <h3 style={{ fontWeight: 700, ...gradientTextStyle }} className="mb-4">Domain Interest</h3>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={domainDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                  {domainDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-2">
              {domainDistribution.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], marginRight: '8px' }}></div>
                  <span className="text-sm text-gray-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 mt-6 rounded-2xl bg-gray-800 border-gray-700 border shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h3 style={{ fontWeight: 700, ...gradientTextStyle }}>View Student Details</h3>
          <select
            className="px-3 py-2 rounded-xl bg-gray-700 border-gray-600 border text-sm text-white"
            value={selectedStudentUsn}
            onChange={(e) => onSelectStudent(e.target.value)}
          >
            <option value="" style={{ color: 'black' }}>Select a Student</option>
            {allStudents.map(s => <option key={s.usn} value={s.usn} style={{ color: 'black' }}>{s.usn} — {s.name}</option>)}
          </select>
        </div>
      </div>

      {selectedStudent && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-md mt-6 border-gray-700 border">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={gradientTextStyle}>{selectedStudent.name}</h2>
              <p className="text-gray-400">{selectedStudent.usn}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Semester: <span className='font-bold'>{selectedStudent.semester}</span></p>
              <p className="text-gray-400">Domain Interest: {selectedStudent.domain_interest}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4" style={gradientTextStyle}>Skills</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={transformSkills(selectedStudent.skills)} layout="vertical" margin={{ right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={100} stroke="#a0aec0" />
                  <Bar dataKey="level" fill="#8884d8" barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="font-semibold mb-4" style={gradientTextStyle}>Grades</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={transformGrades(selectedStudent.grades)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0"/>
                  <Bar dataKey="grade" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-gray-900 border-violet-800 border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="mb-2 font-semibold" style={gradientTextStyle}>AI-Powered Insight</h4>
                <p className="text-gray-300">{getAIInsight(selectedStudent).summary}</p>
                <p className='font-semibold text-violet-400 mt-1'>{getAIInsight(selectedStudent).prediction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
