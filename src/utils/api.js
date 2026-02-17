export const BASE_URL = "http://64.227.146.144:3001/api/v1";

export const employeeAPI = {
  getAll: async (token, search = "", role = "", page = 1, limit = 10) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    params.append("page", page);
    params.append("limit", limit);

    const response = await fetch(`${BASE_URL}/admin/employees?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  create: async (token, data) => {
    const response = await fetch(`${BASE_URL}/admin/employees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  update: async (token, id, data) => {
    const response = await fetch(`${BASE_URL}/admin/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  delete: async (token, id) => {
    const response = await fetch(`${BASE_URL}/admin/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  },
  getById: async (token, id) => {
    const response = await fetch(`${BASE_URL}/admin/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
  getProfile: async (token, employeeId) => {
    const response = await fetch(`${BASE_URL}/user/${employeeId}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const data = await response.json();
    return { success: true, ...data };
  },
};

export const attendanceAPI = {
  getByEmployeeId: async (token, employeeId) => {
    const response = await fetch(`${BASE_URL}/admin/attendance/employee/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
  mark: async (token, data) => {
    const response = await fetch(`${BASE_URL}/admin/attendance/mark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
  getByUser: async (token, employeeId) => {
    const response = await fetch(`${BASE_URL}/user/${employeeId}/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return { success: true, ...(Array.isArray(data) ? { records: data } : data) };
  },
};

export const configAPI = {
  updateLeavePolicy: async (token, content) => {
    const response = await fetch(`${BASE_URL}/admin/config/leave-policy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
};

export const onboardingAPI = {
  submit: async (token, data) => {
    const response = await fetch(`${BASE_URL}/user/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
};

export const payrollAPI = {
  upload: async (token, formData) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/payroll/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({ message: "Failed to parse JSON response" }));

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Upload failed with status ${response.status}`,
          status: response.status
        };
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('API Upload Error:', error);
      return { success: false, message: error.message || "Network error during upload" };
    }
  },
  getByEmployeeId: async (token, employeeId) => {
    const response = await fetch(`${BASE_URL}/user/${employeeId}/salary-slips`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
  getBySelf: async (token, employeeId) => {
    const response = await fetch(`${BASE_URL}/user/${employeeId}/salary-slips`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },
};
