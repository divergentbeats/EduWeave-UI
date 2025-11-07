import { Bell, Menu, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes@0.4.6";

interface TopBarProps {
  onMenuToggle: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

export function TopBar({ onMenuToggle, onProfileClick, onSettingsClick, onLogoutClick }: TopBarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0b0b12]/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-input/50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1"></div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-input/50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-700 dark:text-indigo-100" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-input/50 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                JD
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold">Jane Doe</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#12121b] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                <button onClick={() => { onProfileClick(); setShowProfileMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-input/50 transition-colors">
                  Profile
                </button>
                <button onClick={() => { onSettingsClick(); setShowProfileMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-input/50 transition-colors">
                  Settings
                </button>
                <button onClick={() => { onLogoutClick(); setShowProfileMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-input/50 transition-colors border-t border-gray-200 dark:border-gray-800 text-red-600">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-input/50 rounded-lg transition-colors"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
