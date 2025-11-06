import { ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function ProfileCard() {
  const navigate = useNavigate();
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center text-white shadow-lg" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            SK
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sarah Kumar</h3>
          <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              Semester 6
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Computer Science
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
              CGPA: 8.7
            </span>
          </div>

          {/* AI Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 mb-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="text-indigo-600" style={{ fontWeight: 600 }}>AI Summary:</span>{" "}
                You're improving steadily in AI and Web Dev! Keep focusing on practical projects.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="outline"
            className="rounded-full border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 group"
            onClick={() => navigate('/profile')}
          >
            View Full Profile
            <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
