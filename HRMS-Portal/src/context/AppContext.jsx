import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: { id: 1, name: 'Admin User', role: 'admin', email: 'admin@company.com' },
  employees: [
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'IT', designation: 'Developer', status: 'Active', phone: '123-456-7890', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'HR', designation: 'Manager', status: 'Active', phone: '123-456-7891', joinDate: '2022-03-20' }
  ],
  departments: [
    { id: 1, name: 'IT', head: 'John Doe', employeeCount: 15 },
    { id: 2, name: 'HR', head: 'Jane Smith', employeeCount: 5 },
    { id: 3, name: 'Sales', head: 'Mike Johnson', employeeCount: 10 }
  ],
  designations: [
    { id: 1, name: 'Intern', department: 'IT' },
    { id: 2, name: 'Developer', department: 'IT' },
    { id: 3, name: 'Manager', department: 'HR' }
  ],
  attendance: [],
  leaves: [],
  payroll: [],
  notices: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_EMPLOYEE':
      return { ...state, employees: state.employees.map(emp => emp.id === action.payload.id ? action.payload : emp) };
    case 'DELETE_EMPLOYEE':
      return { ...state, employees: state.employees.filter(emp => emp.id !== action.payload) };
    case 'ADD_DEPARTMENT':
      return { ...state, departments: [...state.departments, { ...action.payload, id: Date.now() }] };
    case 'ADD_LEAVE':
      return { ...state, leaves: [...state.leaves, { ...action.payload, id: Date.now() }] };
    case 'UPDATE_LEAVE':
      return { ...state, leaves: state.leaves.map(leave => leave.id === action.payload.id ? action.payload : leave) };
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [...state.attendance, action.payload] };
    case 'ADD_NOTICE':
      return { ...state, notices: [...state.notices, { ...action.payload, id: Date.now() }] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};