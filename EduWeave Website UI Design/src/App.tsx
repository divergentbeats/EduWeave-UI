import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import Login from "../pages/login";
import StudentEntry from "../pages/student-entry";
import { AppSidebar } from "./components/dashboard/AppSidebar";
import { TopBar } from "./components/dashboard/TopBar";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ProjectsSkillsPage } from "./components/pages/ProjectsSkillsPage";
import { AIInsightsPage } from "./components/pages/AIInsightsPage";
import { PredictivePathPage } from "./components/pages/PredictivePathPage";
import { AIEchoPage } from "./components/pages/AIEchoPage";
import { AchievementsPage } from "./components/pages/AchievementsPage";
import { CommunityHubPage } from "./components/pages/CommunityHubPage";
import { SettingsPage } from "./components/pages/SettingsPage";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardPage />;
      case "projects":
        return <ProjectsSkillsPage />;
      case "insights":
        return <AIInsightsPage />;
      case "path":
        return <PredictivePathPage />;
      case "echo":
        return <AIEchoPage />;
      case "achievements":
        return <AchievementsPage />;
      case "community":
        return <CommunityHubPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex">
      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-entry" element={<StudentEntry />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
