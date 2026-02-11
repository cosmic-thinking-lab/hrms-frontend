import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Clock, Calendar, DollarSign } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'Cosmic Tech World',
    workingHours: '9:00 AM - 6:00 PM',
    workingDays: 'Monday - Friday',
    casualLeaves: 12,
    sickLeaves: 10,
    basicSalary: 50000
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings & Configuration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Company Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Working Hours</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Hours</label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({...settings, workingHours: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
              <input
                type="text"
                value={settings.workingDays}
                onChange={(e) => setSettings({...settings, workingDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Leave Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Leave Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Casual Leaves</label>
              <input
                type="number"
                value={settings.casualLeaves}
                onChange={(e) => setSettings({...settings, casualLeaves: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Sick Leaves</label>
              <input
                type="number"
                value={settings.sickLeaves}
                onChange={(e) => setSettings({...settings, sickLeaves: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payroll Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Payroll Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Basic Salary</label>
              <input
                type="number"
                value={settings.basicSalary}
                onChange={(e) => setSettings({...settings, basicSalary: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <SettingsIcon size={20} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;