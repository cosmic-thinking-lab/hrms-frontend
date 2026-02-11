import React, { useState } from 'react';
import { DollarSign, Download, Calculator, FileText, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Payroll = () => {
  const { state } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const generatePayslip = (employee) => {
    const baseSalary = 50000; // Base salary
    const hra = baseSalary * 0.4; // 40% HRA
    const allowances = 5000;
    const grossSalary = baseSalary + hra + allowances;
    const tax = grossSalary * 0.1; // 10% tax
    const pf = baseSalary * 0.12; // 12% PF
    const totalDeductions = tax + pf;
    const netSalary = grossSalary - totalDeductions;

    return {
      employee,
      month: selectedMonth,
      basic: baseSalary,
      hra,
      allowances,
      grossSalary,
      tax,
      pf,
      totalDeductions,
      netSalary
    };
  };

  const handleViewPayslip = (employee) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  const downloadPayslip = (payslip) => {
    // Simple text-based payslip download
    const content = `
PAYSLIP - ${payslip.month}
Employee: ${payslip.employee.name}
Department: ${payslip.employee.department}

EARNINGS:
Basic Salary: ₹${payslip.basic.toLocaleString()}
HRA: ₹${payslip.hra.toLocaleString()}
Allowances: ₹${payslip.allowances.toLocaleString()}
Gross Salary: ₹${payslip.grossSalary.toLocaleString()}

DEDUCTIONS:
Tax: ₹${payslip.tax.toLocaleString()}
PF: ₹${payslip.pf.toLocaleString()}
Total Deductions: ₹${payslip.totalDeductions.toLocaleString()}

NET SALARY: ₹${payslip.netSalary.toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${payslip.employee.name}-${payslip.month}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const payrollStats = {
    totalEmployees: state.employees.length,
    totalPayroll: state.employees.length * 55000, // Average salary
    avgSalary: 55000,
    processed: state.employees.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700">
            <Calculator size={20} />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{payrollStats.totalEmployees}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">₹{payrollStats.totalPayroll.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-blue-600">₹{payrollStats.avgSalary.toLocaleString()}</p>
            </div>
            <Calculator className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-purple-600">{payrollStats.processed}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Payroll for {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.employees.map(employee => {
                const payslip = generatePayslip(employee);
                return (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payslip.basic.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payslip.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payslip.totalDeductions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{payslip.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayslip(employee)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => downloadPayslip(payslip)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Structure */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Standard Salary Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Earnings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span>₹50,000</span>
              </div>
              <div className="flex justify-between">
                <span>HRA (40%):</span>
                <span>₹20,000</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances:</span>
                <span>₹5,000</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Gross Salary:</span>
                <span>₹75,000</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Deductions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Income Tax (10%):</span>
                <span>₹7,500</span>
              </div>
              <div className="flex justify-between">
                <span>PF (12%):</span>
                <span>₹6,000</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Tax:</span>
                <span>₹200</span>
              </div>
              <div className="flex justify-between font-medium border-t pt-2">
                <span>Total Deductions:</span>
                <span>₹13,700</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Net Salary:</span>
            <span className="text-2xl font-bold text-green-600">₹61,300</span>
          </div>
        </div>
      </div>

      {/* Payslip Modal */}
      {showPayslipModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">PAYSLIP</h2>
              <p className="text-gray-600">{new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            
            {(() => {
              const payslip = generatePayslip(selectedEmployee);
              return (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900">{payslip.employee.name}</h3>
                    <p className="text-sm text-gray-600">{payslip.employee.department}</p>
                    <p className="text-sm text-gray-600">{payslip.employee.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Earnings</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span>₹{payslip.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA:</span>
                        <span>₹{payslip.hra.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Allowances:</span>
                        <span>₹{payslip.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Gross Salary:</span>
                        <span>₹{payslip.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Deductions</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Income Tax:</span>
                        <span>₹{payslip.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PF:</span>
                        <span>₹{payslip.pf.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total Deductions:</span>
                        <span>₹{payslip.totalDeductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Net Salary:</span>
                      <span className="text-xl font-bold text-green-600">₹{payslip.netSalary.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => downloadPayslip(payslip)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setShowPayslipModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;