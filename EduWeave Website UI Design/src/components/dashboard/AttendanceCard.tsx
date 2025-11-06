import { Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Props = { data?: Record<string, number> };

export function AttendanceCard({ data }: Props) {
  const attendanceData = (data
    ? Object.entries(data).map(([subject, value]) => ({ subject, attendance: Number(value) }))
    : [
        { subject: "ML", attendance: 95 },
        { subject: "DBMS", attendance: 78 },
        { subject: "Web", attendance: 92 },
        { subject: "CN", attendance: 88 },
        { subject: "SE", attendance: 85 }
      ]);
  const avgAttendance = Math.round(attendanceData.reduce((sum, item) => sum + item.attendance, 0) / attendanceData.length);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1020] border border-gray-200 dark:border-[#1c2035cc] shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 style={{ fontWeight: 700 }}>Attendance</h4>
            <p className="text-sm text-gray-500 dark:text-indigo-200">Subject-wise breakdown</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent" style={{ fontWeight: 800 }}>
            {avgAttendance}%
          </div>
          <div className="text-xs text-gray-500">Average</div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Bar
              dataKey="attendance"
              fill="url(#attendanceGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Warning */}
      {attendanceData.some(item => item.attendance < 80) && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-[#332a16] border border-amber-200 dark:border-amber-700/40">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ DBMS attendance is below 80%. Focus on improving it!
          </p>
        </div>
      )}
    </div>
  );
}
