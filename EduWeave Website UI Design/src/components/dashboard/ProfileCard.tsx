import { ExternalLink, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "../ui/dialog";

export function ProfileCard() {
  const [open, setOpen] = useState(false);
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
            onClick={() => setOpen(true)}
          >
            View Full Profile
            <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Profile Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogOverlay className="backdrop-blur-sm" />
        <DialogContent className="sm:max-w-xl bg-white/95">
          <DialogHeader>
            <DialogTitle className="text-indigo-700">Full Profile</DialogTitle>
            <DialogDescription>Overview of the student's current profile</DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid gap-3 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-500">Name</div>
                <div className="font-semibold">Sarah Kumar</div>
              </div>
              <div>
                <div className="text-gray-500">USN</div>
                <div className="font-semibold">1RV22CS001</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-gray-500">CGPA</div>
                <div className="font-semibold">8.7</div>
              </div>
              <div>
                <div className="text-gray-500">Semester</div>
                <div className="font-semibold">6 (CSE)</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500">Projects</div>
              <ul className="list-disc list-inside font-medium mt-1 space-y-1">
                <li>AI Chatbot – Campus Q&A assistant</li>
                <li>Smart Attendance – CV-based attendance system</li>
                <li>DBMS Visualizer – ER to schema tool</li>
              </ul>
            </div>
            <div>
              <div className="text-gray-500">Skills</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {['Python','React','TypeScript','SQL','ML','Docker'].map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Interests</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {['NLP','Recommenders','Full‑stack','Cloud'].map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Career Path</div>
              <div className="font-medium">Currently pursuing: ML Engineer track → internships → research electives</div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={() => setOpen(false)} className="rounded-full">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
