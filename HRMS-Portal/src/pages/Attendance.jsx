import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Attendance = () => {
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('Present');

  const attendanceData = state.attendance.filter(att => att.date === selectedDate);

  const handleMarkAttendance = (e) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    const employee = state.employees.find(emp => emp.id === parseInt(selectedEmployee));
    const existingAttendance = attendanceData.find(att => att.employeeId === parseInt(selectedEmployee));

    if (existingAttendance) {
      alert('Attendance already marked for this employee today');
      return;
    }

    const attendanceRecord = {
      id: Date.now(),
      employeeId: parseInt(selectedEmployee),
      employeeName: employee.name,
      date: selectedDate,
      status: attendanceStatus,
      checkIn: attendanceStatus === 'Present' ? '09:00' : null,
      checkOut: attendanceStatus === 'Present' ? '18:00' : null,
      markedBy: 'Admin'
    };

    dispatch({ type: 'ADD_ATTENDANCE', payload: attendanceRecord });
    setSelectedEmployee('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Absent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Half-day': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Leave': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  const todayStats = [
    { label: 'Present', value: attendanceData.filter(att => att.status === 'Present').length, color: 'text-emerald-500' },
    { label: 'Absent', value: attendanceData.filter(att => att.status === 'Absent').length, color: 'text-rose-500' },
    { label: 'Half Day', value: attendanceData.filter(att => att.status === 'Half-day').length, color: 'text-orange-500' },
    { label: 'On Leave', value: attendanceData.filter(att => att.status === 'Leave').length, color: 'text-blue-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-900">Attendance</h1>
          <p className="text-neutral-500">Track and manage daily attendance records.</p>
        </div>
        <div className="flex items-center bg-white border border-neutral-100 rounded-xl p-1 shadow-sm">
          <div className="p-2 text-neutral-400 border-r border-neutral-50">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-transparent focus:outline-none font-bold text-sm text-neutral-700"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {todayStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Attendance Form */}
        <div className="bg-neutral-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12"></div>
          <h2 className="text-xl font-bold mb-6">Mark Attendance</h2>
          <form onSubmit={handleMarkAttendance} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:bg-white/20 focus:outline-none font-bold text-sm text-white"
                required
              >
                <option value="" className="text-neutral-900">Select Employee</option>
                {state.employees.map(emp => (
                  <option key={emp.id} value={emp.id} className="text-neutral-900">{emp.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Status</label>
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl focus:bg-white/20 focus:outline-none font-bold text-sm text-white"
              >
                <option value="Present" className="text-neutral-900">Present</option>
                <option value="Absent" className="text-neutral-900">Absent</option>
                <option value="Half-day" className="text-neutral-900">Half Day</option>
                <option value="Leave" className="text-neutral-900">On Leave</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 text-white py-4 rounded-2xl hover:bg-primary-600 transition-all font-bold shadow-lg shadow-primary-500/20 mt-4"
            >
              Mark Now
            </button>
          </form>
        </div>

        {/* Today's Attendance */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-50">
            <h2 className="text-xl font-bold text-neutral-900">Daily Logs</h2>
          </div>
          <div className="divide-y divide-neutral-50 overflow-y-auto max-h-[400px]">
            {attendanceData.length === 0 ? (
              <div className="px-8 py-12 text-center">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-neutral-300" size={32} />
                </div>
                <p className="text-neutral-400 font-bold text-sm uppercase tracking-widest">No records found</p>
              </div>
            ) : (
              attendanceData.map(record => (
                <div key={record.id} className="px-8 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-800 font-bold">
                      {record.employeeName.substring(0, 1)}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{record.employeeName}</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        {record.checkIn && record.checkOut ?
                          `${record.checkIn} — ${record.checkOut}` :
                          'Entry pending'
                        }
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Monthly Summary Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-neutral-50">
          <h2 className="text-xl font-bold text-neutral-900">Performance Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 text-left">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Employee</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Present</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Absent</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {state.employees.map(employee => {
                const empAttendance = state.attendance.filter(att => att.employeeId === employee.id);
                const presentDays = empAttendance.filter(att => att.status === 'Present').length;
                const absentDays = empAttendance.filter(att => att.status === 'Absent').length;
                const totalDays = empAttendance.length || 1;
                const attendancePercentage = Math.round((presentDays / totalDays) * 100);

                return (
                  <tr key={employee.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-neutral-900 group-hover:text-primary-500 transition-colors">{employee.name}</div>
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{employee.department}</div>
                    </td>
                    <td className="px-8 py-5 font-bold text-neutral-700">{presentDays}d</td>
                    <td className="px-8 py-5 font-bold text-rose-500">{absentDays}d</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 w-24 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${attendancePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-neutral-900">{attendancePercentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;