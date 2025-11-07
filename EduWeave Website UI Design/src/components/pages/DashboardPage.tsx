import { AttendanceCard } from "../dashboard/AttendanceCard";
import { GradesCard } from "../dashboard/GradesCard";
import { ProfileCard } from "../dashboard/ProfileCard";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
// allow JS util import
// @ts-ignore
import { getStudentData, listStudents } from "../../../utils/api";

const quickTips = [
  "💡 Focus on improving DBMS attendance this week to stay above 80%",
  "🎯 You're on track for a 9.0 CGPA if you maintain current performance",
  "🚀 Consider starting a new NLP project to strengthen your AI portfolio",
  "📚 Upcoming workshop on Deep Learning - register before slots fill up"
];

export function DashboardPage() {
  const [studentData, setStudentData] = useState<any>(null);
  const [allStudents, setAllStudents] = useState<Array<{usn:string;name:string}>>([]);

  useEffect(() => {
    async function load() {
      try {
        const raw = localStorage.getItem('currentStudent');
        const current = raw ? JSON.parse(raw) : null;
        if (current?.usn) {
          const data = await getStudentData(current.usn);
          setStudentData(data);
        }
        const list = await listStudents();
        setAllStudents(list);
      } catch {}
    }
    load();
  }, []);

  const avgAttendance = useMemo(() => {
    if (!studentData?.attendance) return 88;
    const vals = Object.values(studentData.attendance as Record<string, number>);
    return Math.round(vals.reduce((a: number, b: any) => a + Number(b), 0) / Math.max(1, vals.length));
  }, [studentData]);

  const currentCgpa = useMemo(() => {
    if (!studentData?.grades) return 8.7;
    const vals = Object.values(studentData.grades as Record<string, number>);
    return Number((vals.reduce((a: number, b: any) => a + Number(b), 0) / Math.max(1, vals.length)).toFixed(1));
  }, [studentData]);

  const onSelectStudent = async (usn: string) => {
    const found = allStudents.find((s) => s.usn === usn);
    const payload = { usn, name: found?.name };
    localStorage.setItem('currentStudent', JSON.stringify(payload));
    const data = await getStudentData(usn);
    setStudentData(data);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="mb-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 700 }}>
          Dashboard Overview
        </h1>
      </div>

      {/* Profile Summary */}
      <ProfileCard />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current CGPA */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Current</span>
          </div>
          <div className="text-4xl mb-2" style={{ fontWeight: 800 }}>{currentCgpa}</div>
          <div className="text-indigo-100 text-sm">Current CGPA</div>
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <span className="text-green-300">+0.3 from last sem</span>
          </div>
        </div>

        {/* Average Attendance */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-4xl mb-2 text-purple-600" style={{ fontWeight: 800 }}>{avgAttendance}%</div>
          <div className="text-gray-600 text-sm">Average Attendance</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
            DBMS needs attention
          </div>
        </div>

        {/* Total Projects */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl mb-2 text-violet-600" style={{ fontWeight: 800 }}>12</div>
          <div className="text-gray-600 text-sm">Completed Projects</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-.500">
            45% are AI/ML focused
          </div>
        </div>

        {/* Achievements */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl mb-2 text-amber-600" style={{ fontWeight: 800 }}>5/6</div>
          <div className="text-gray-600 text-sm">Badges Earned</div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
            83% completion rate
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceCard data={studentData?.attendance} />
        <GradesCard data={studentData?.grades} />
      </div>

      {/* AI Quick Tips */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 style={{ fontWeight: 700 }}>AI Quick Tips</h3>
            <p className="text-sm text-gray-600">Personalized recommendations for you</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickTips.map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <p className="text-sm text-gray-700 leading-relaxed group-hover:text-indigo-700 transition-colors">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
