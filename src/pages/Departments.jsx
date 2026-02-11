import React, { useState } from 'react';
import { Plus, Building2, Users, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Departments = () => {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', head: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeCount = state.employees.filter(emp => emp.department === formData.name).length;
    dispatch({ 
      type: 'ADD_DEPARTMENT', 
      payload: { ...formData, employeeCount } 
    });
    setFormData({ name: '', head: '', description: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900">
                  <Edit size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Head: {dept.head}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users size={16} className="mr-1" />
              <span>{dept.employeeCount} employees</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Department</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Department Head"
                value={formData.head}
                onChange={(e) => setFormData({...formData, head: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Add Department
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

export default Departments;