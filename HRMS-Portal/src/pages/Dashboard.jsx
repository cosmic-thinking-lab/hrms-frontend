import React from 'react';
import {
  Users, Clock, Calendar, DollarSign, TrendingUp,
  AlertCircle, Award, Target, Activity, Briefcase,
  ArrowRight, BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { state } = useApp();

  const stats = [
    { title: 'Total Employees', value: state.employees.length, icon: Users, color: 'bg-emerald-500', trend: '+12% vs last month' },
    { title: 'Present Today', value: Math.floor(state.employees.length * 0.85), icon: Clock, color: 'bg-blue-500', trend: '92% attendance' },
    { title: 'Pending Leaves', value: state.leaves.filter(l => l.status === 'pending').length, icon: Calendar, color: 'bg-orange-500', trend: '3 urgent requests' },
    { title: 'Active Departments', value: state.departments.length, icon: Briefcase, color: 'bg-purple-500', trend: 'Across 3 locations' }
  ];

  const recentActivities = [
    { id: 1, text: 'John Doe applied for sick leave', time: '2 hours ago', type: 'leave', status: 'Urgent' },
    { id: 2, text: 'New employee Jane Smith onboarded', time: '4 hours ago', type: 'employee', status: 'Done' },
    { id: 3, text: 'Monthly payroll processed successfully', time: '1 day ago', type: 'payroll', status: 'Success' },
    { id: 4, text: 'IT Department meeting scheduled', time: '2 days ago', type: 'notice', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">System Overview</h1>
          <p className="text-neutral-500 font-medium">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-neutral-100 shadow-sm font-bold text-xs uppercase tracking-widest text-neutral-400">
          <div className="px-4 py-2 border-r border-neutral-50">Fiscal Year: 2026-27</div>
          <div className="px-4 py-2 text-primary-500 flex items-center"><TrendingUp size={14} className="mr-2" /> Live Analytics</div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2rem p-8 border border-neutral-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`}></div>
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-neutral-400 font-bold text-10px uppercase tracking-0-2em mb-2">{stat.title}</h3>
            <p className="text-4xl font-black text-neutral-900 mb-2">{stat.value}</p>
            <p className="text-neutral-500 font-bold text-10px">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Payroll Card - Wide */}
          <div className="bg-neutral-900 rounded-2-5rem p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                <span className="px-3 py-1 bg-primary-500-20 text-primary-400 rounded-full text-10px font-black uppercase tracking-widest mb-4 inline-block">Active Cycle</span>
                <h2 className="text-3xl font-black mb-4 leading-tight">Monthly Payroll is <span className="text-primary-500">95% Complete</span></h2>
                <p className="text-neutral-400 font-medium mb-8">Ready to process salaries for Jan 2026. Only 2 pending approvals remain across departments.</p>
                <button className="px-10 py-5 bg-primary-500 text-white font-black rounded-2xl shadow-2xl shadow-primary-500/20 hover:bg-primary-600 transition-all hover:scale-105 flex items-center">
                  Process Now <ArrowRight size={20} className="ml-2" />
                </button>
              </div>
              <div className="flex-1 w-full max-w-[240px]">
                <div className="aspect-square bg-white-5 rounded-full border-8 border-white-5 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-8 border-primary-500 rounded-full border-t-transparent animate-spin duration-[3000ms]"></div>
                  <span className="text-4xl font-black">95%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-white rounded-2-5rem border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-neutral-900">Pending Actions</h2>
              <button className="text-10px font-black text-neutral-400 uppercase tracking-widest hover:text-primary-500 transition-colors">View All Archive</button>
            </div>
            <div className="divide-y divide-neutral-50">
              {recentActivities.map(activity => (
                <div key={activity.id} className="px-10 py-6 hover:bg-neutral-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 font-black group-hover:bg-primary-500 group-hover:text-white transition-all">
                      {activity.type.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 mb-1">{activity.text}</p>
                      <p className="text-10px font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                        <Clock size={12} className="mr-1.5" /> {activity.time}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-neutral-100 text-neutral-500 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-neutral-100">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2-5rem p-10 border border-neutral-100 shadow-sm">
            <h3 className="text-lg font-black text-neutral-900 mb-8">Department Load</h3>
            <div className="space-y-8">
              {[
                { label: 'Engineering', value: 85, color: 'bg-emerald-500' },
                { label: 'Marketing', value: 62, color: 'bg-blue-500' },
                { label: 'Operations', value: 45, color: 'bg-orange-500' }
              ].map((dept, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-neutral-700 text-sm">{dept.label}</span>
                    <span className="text-10px font-black text-neutral-400">{dept.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dept.color} rounded-full transition-all duration-1000`} style={{ width: `${dept.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 p-5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-2xl text-10px font-black uppercase tracking-0-2em transition-all">
              Full Breakdown
            </button>
          </div>

          {/* Announcement Card */}
          <div className="bg-gradient-to-br from-primary-500 to-orange-400 rounded-2-5rem p-10 text-white relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white-10 rounded-full -mr-12 -mb-12 group-hover:scale-125 transition-transform"></div>
            <h3 className="text-xl font-bold mb-4">Policy Update</h3>
            <p className="text-white-80 font-medium mb-8 text-sm leading-relaxed">The new hybrid work policy documentation is now available in your documents portal.</p>
            <button className="flex items-center text-10px font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
              Read Policy <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;