import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p>Enable Notifications</p>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>Enable Dark Mode</p>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;