import React, { useState } from 'react';
import { Plus, Bell, Calendar, Users, Pin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Notices = () => {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', type: 'General', priority: 'Normal', targetDepartment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_NOTICE',
      payload: {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        read: false
      }
    });
    setFormData({ title: '', content: '', type: 'General', priority: 'Normal', targetDepartment: '' });
    setShowModal(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notices & Announcements</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Create Notice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {state.notices.map(notice => (
          <div key={notice.id} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                  {notice.priority}
                </span>
              </div>
              <Pin className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{notice.content}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar size={12} />
                <span>{notice.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={12} />
                <span>{notice.targetDepartment || 'All'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Notice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Notice Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Notice Content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="General">General</option>
                <option value="HR">HR</option>
                <option value="Policy">Policy</option>
                <option value="Event">Event</option>
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={formData.targetDepartment}
                onChange={(e) => setFormData({...formData, targetDepartment: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {state.departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Create Notice
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;