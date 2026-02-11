import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Users, Mail, Phone, Building, Calendar, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Employees = () => {
  const { state, dispatch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', designation: '',
    status: 'Active', joinDate: '', salary: '', address: ''
  });

  const filteredEmployees = state.employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      dispatch({ type: 'UPDATE_EMPLOYEE', payload: { ...formData, id: editingEmployee.id } });
    } else {
      dispatch({ type: 'ADD_EMPLOYEE', payload: formData });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', department: '', designation: '',
      status: 'Active', joinDate: '', salary: '', address: ''
    });
    setEditingEmployee(null);
    setShowModal(false);
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'On-Notice': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Left': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900">Employees</h1>
          <p className="text-neutral-500">View and manage your organization's talent pool.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-500 text-white px-8 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 font-bold"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: state.employees.length, color: 'text-neutral-900' },
          { label: 'Active', value: state.employees.filter(e => e.status === 'Active').length, color: 'text-emerald-500' },
          { label: 'On Notice', value: state.employees.filter(e => e.status === 'On-Notice').length, color: 'text-orange-500' },
          { label: 'Left', value: state.employees.filter(e => e.status === 'Left').length, color: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-neutral-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm min-w-[180px]"
            >
              <option value="">All Departments</option>
              {state.departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-200/40 transition-all group overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-neutral-50">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-primary-500 transition-colors">
                      {employee.name}
                    </h3>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{employee.designation}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3 text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                  <div className="p-1.5 bg-neutral-50 rounded-lg"><Mail size={14} /></div>
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                  <div className="p-1.5 bg-neutral-50 rounded-lg"><Phone size={14} /></div>
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                  <div className="p-1.5 bg-neutral-50 rounded-lg"><Building size={14} /></div>
                  <span>{employee.department}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="flex-1 bg-neutral-50 hover:bg-primary-50 hover:text-primary-600 text-neutral-600 py-2.5 rounded-xl transition-all font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="w-10 bg-neutral-50 hover:bg-rose-50 hover:text-rose-600 text-neutral-400 py-2.5 rounded-xl transition-all flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-100">
            <div className="px-8 py-6 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingEmployee ? 'Update Profile' : 'New Onboarding'}
                </h2>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1">Employee Records</p>
              </div>
              <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                  required
                >
                  <option value="">Select</option>
                  {state.departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
                  required
                />
              </div>

              <div className="col-span-2 flex gap-4 pt-4 border-t border-neutral-50 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-4 rounded-2xl hover:bg-primary-600 transition-all font-bold shadow-lg shadow-primary-500/20"
                >
                  {editingEmployee ? 'Update Profile' : 'Onboard Employee'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 bg-neutral-100 text-neutral-600 py-4 rounded-2xl hover:bg-neutral-200 transition-colors font-bold"
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

export default Employees;