import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Props = { data?: Record<string, number> };

export function GradesCard({ data }: Props) {
  const gradesData = data
    ? Object.entries(data).map(([subject, value]) => ({ semester: subject, cgpa: Number(value) }))
    : [
        { semester: "Sem 1", cgpa: 7.8 },
        { semester: "Sem 2", cgpa: 8.1 },
        { semester: "Sem 3", cgpa: 8.3 },
        { semester: "Sem 4", cgpa: 8.5 },
        { semester: "Sem 5", cgpa: 8.4 },
        { semester: "Sem 6", cgpa: 8.7 }
      ];
  const currentCGPA = gradesData[gradesData.length - 1].cgpa;
  const previousCGPA = gradesData[Math.max(0, gradesData.length - 2)].cgpa;
  const improvement = currentCGPA - previousCGPA;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#0e1020] border border-gray-200 dark:border-[#1c2035cc] shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 style={{ fontWeight: 700 }}>Your CGPA Progress</h4>
            <p className="text-sm text-gray-500 dark:text-indigo-200">Performance trend</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" style={{ fontWeight: 800 }}>
            {currentCGPA}
          </div>
          <div className="text-xs text-green-600 flex items-center justify-end gap-1">
            <TrendingUp className="w-3 h-3" />
            +{improvement.toFixed(1)} from last sem
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={gradesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="semester" stroke="#666" />
            <YAxis domain={[7, 10]} stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
              }}
            />
            <Line
              type="monotone"
              dataKey="cgpa"
              stroke="url(#gradeGradient)"
              strokeWidth={3}
              dot={{ fill: "#6366f1", r: 6 }}
              activeDot={{ r: 8 }}
            />
            <defs>
              <linearGradient id="gradeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-center">
          <div className="text-sm text-gray-600 mb-1">Highest</div>
          <div className="text-xl text-indigo-600" style={{ fontWeight: 700 }}>8.7</div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-center">
          <div className="text-sm text-gray-600 mb-1">Average</div>
          <div className="text-xl text-purple-600" style={{ fontWeight: 700 }}>8.3</div>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-center">
          <div className="text-sm text-gray-600 mb-1">Trend</div>
          <div className="text-xl text-green-600" style={{ fontWeight: 700 }}>↑</div>
        </div>
      </div>
    </div>
  );
}
