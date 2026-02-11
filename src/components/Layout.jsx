import React, { useState, useEffect } from 'react';
import {
  Users, Building2, Clock, Calendar, DollarSign,
  BarChart3, Bell, FileText, Settings, Menu, X,
  ChevronRight, ChevronDown, Globe, LogOut, Zap,
  Target, Plane, ShieldQuestion, Briefcase, Heart, ClipboardList
} from 'lucide-react';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const landingNav = [
    {
      label: 'HR Management',
      items: [
        { id: 'employees', label: 'Core HR', icon: Users, desc: 'Manage Employee records' },
        { id: 'onboarding', label: 'Onboarding', icon: Zap, desc: 'Seamless new hire flows' },
        { id: 'attendance', label: 'Attendance', icon: Clock, desc: 'Track time & location' },
        { id: 'payroll', label: 'Payroll Management', icon: DollarSign, desc: 'Auto salaries & tax' },
        { id: 'recruitment', label: 'Recruitment', icon: Target, desc: 'Applicant tracking' },
        { id: 'leaves', label: 'Leave Management', icon: Calendar, desc: 'Holiday & sick leave' },
        { id: 'performance', label: 'Performance', icon: Heart, desc: 'Reviews & goals' },
        { id: 'travel', label: 'Travel Management', icon: Plane, desc: 'Expenses & bookings' },
        { id: 'tasks', label: 'Task Management', icon: FileText, desc: 'Project collaboration' },
        { id: 'help', label: 'Help & Support', icon: ShieldQuestion, desc: '24/7 technical help' },
      ]
    },
    {
      label: 'Recruitment & Onboarding', items: [
        { id: 'recruitment', label: 'Recruitment', icon: Target },
        { id: 'onboarding', label: 'Onboarding', icon: Zap }
      ]
    },
    { label: 'Resources', isLink: true },
    { label: 'Pricing', isLink: true },
    { label: 'About', isLink: true }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'employees', label: 'People', icon: Users },
    { id: 'departments', label: 'Business Units', icon: Building2 },
    { id: 'attendance', label: 'Absence & Timing', icon: Clock },
    { id: 'leaves', label: 'Leave Requests', icon: Calendar },
    { id: 'payroll', label: 'Payroll & Tax', icon: DollarSign },
    { id: 'notices', label: 'Announcements', icon: Bell },
  ];

  if (currentPage === 'home') {
    return (
      <div className="bg-white min-h-screen">
        <nav
          className="fixed top-0 left-0 right-0 z-60 bg-white shadow-md h-24 flex items-center border-b border-neutral-100"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <BarChart3 size={24} />
              </div>
              <span className="text-2xl font-black text-neutral-900 tracking-tight">Cosmic<span className="text-primary-500">HR</span></span>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {landingNav.map((nav, i) => (
                <div key={i} className="relative">
                  <button
                    onMouseEnter={() => setActiveDropdown(nav.label)}
                    className={`flex items-center text-11px font-black uppercase tracking-widest transition-colors ${activeDropdown === nav.label ? 'text-primary-500' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                  >
                    {nav.label}
                    {!nav.isLink && <ChevronDown size={14} className={`ml-1 transition-transform ${activeDropdown === nav.label ? 'rotate-180' : ''}`} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mega Dropdown */}
          {activeDropdown && landingNav.find(n => n.label === activeDropdown)?.items && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-100 shadow-2xl animate-fade-in origin-top">
              <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-3 gap-y-8 gap-x-12">
                  {landingNav.find(n => n.label === activeDropdown).items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setActiveDropdown(null);
                      }}
                      className="flex items-start space-x-5 group cursor-pointer hover:bg-neutral-50 p-4 rounded-3xl transition-all"
                    >
                      <div className="w-12 h-12 bg-primary-50 text-primary-500 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-neutral-900 text-sm mb-1">{item.label}</h4>
                        <p className="text-xs text-neutral-400 font-bold leading-relaxed">{item.desc || 'Comprehensive HR solutions'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-neutral-50 py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <p className="text-10px font-black text-neutral-400 uppercase tracking-0-2em">Scale your global team with Cosmic Enterprise</p>
                  <button className="text-primary-500 text-10px font-black uppercase tracking-widest flex items-center hover:translate-x-2 transition-transform">
                    Explore all features <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-400 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-neutral-100 flex flex-col`}>
        <div className="flex flex-col justify-center h-32 px-8 border-b border-neutral-50 bg-[#fdfdfd]">
          <div className="flex items-center space-x-3 cursor-pointer mb-2" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-primary-500" />
            </div>
            <h1 className="text-xl font-black text-neutral-900 tracking-tighter">Cosmic<span className="text-primary-500">HR</span></h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-10px font-black text-neutral-400 uppercase tracking-widest">Enterprise Cloud</span>
          </div>
        </div>

        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <p className="px-4 text-10px font-black text-neutral-300 uppercase tracking-widest mb-4">Internal Tools</p>
          <div className="space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center px-4 py-3.5 text-left rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-900/20 translate-x-1'
                    : 'text-neutral-50 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                >
                  <div className={`p-2 rounded-xl mr-3 transition-colors ${isActive ? 'text-primary-500' : 'text-neutral-400 group-hover:text-primary-500'
                    }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`font-bold text-xs tracking-wide ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 bg-white border-t border-neutral-100">
          <div className="flex items-center space-x-3 p-3 bg-neutral-900 rounded-2xl shadow-xl">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-black">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-11px font-black text-white truncate">Administrator</p>
              <p className="text-9px text-neutral-500 font-bold uppercase tracking-widest">Global Sec</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-neutral-100 h-20 flex-shrink-0">
          <div className="flex items-center justify-between px-10 h-full">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-sm font-black text-neutral-900 uppercase tracking-0-2em">{currentPage}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-neutral-900/5 px-4 py-2 rounded-full border border-neutral-100 text-neutral-500 space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-10px font-black uppercase tracking-widest">Status: Ready</span>
              </div>
              <button className="relative p-2.5 rounded-xl bg-white border border-neutral-100 text-neutral-400 hover:text-primary-500 transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-50">
          <div className="max-w-[1600px] mx-auto p-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;