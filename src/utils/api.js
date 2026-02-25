export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status} (Endpoint: admin/employees/${id})` };
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    return { success: true, ...result };
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
    const response = await fetch(`${BASE_URL}/user/${employeeId}/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status} (Endpoint: user/${employeeId}/attendance)` };
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return { success: true, records: data.attendance || data.records || (Array.isArray(data) ? data : []), pagination: data.pagination };
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
    if (!response.ok) return { success: false, message: `Error: ${response.status} (Endpoint: admin/attendance/mark)` };
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    return { success: true, ...(result.attendance ? { data: result.attendance } : result) };
  },
  getByUser: async (token, employeeId) => {
    return attendanceAPI.getByEmployeeId(token, employeeId);
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
  submitWithFiles: async (token, { education, experience, kycFile, resumeFile, extraFiles = [] }) => {
    const formData = new FormData();
    if (education) formData.append("education", JSON.stringify(education));
    if (experience) formData.append("experience", JSON.stringify(experience));
    if (kycFile) formData.append("files", kycFile);
    if (resumeFile) formData.append("files", resumeFile);
    extraFiles.forEach(({ name, file }) => {
      if (file) {
        // Rename the file with the custom name so the backend stores it with that label
        const renamed = new File([file], `${name || 'document'}.pdf`, { type: file.type });
        formData.append("files", renamed);
      }
    });
    const response = await fetch(`${BASE_URL}/user/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) return { success: false, message: `Error: ${response.status}` };
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    return { success: true, ...result };
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
