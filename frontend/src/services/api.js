import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

/* AUTH */
export const loginApi = async (email, password, role) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password, role });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Authentication failed');
    }
    throw new Error('Network error: Unable to reach backend API');
  }
};

/* COURSES */
export const fetchCoursesApi = async () => {
  try {
    const response = await apiClient.get('/courses');
    return response.data;
  } catch (error) {
    console.warn('[API] Could not fetch courses from backend, falling back to local dataset.', error);
    return null;
  }
};

export const fetchCourseByIdApi = async (id) => {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`[API] Could not fetch course ${id} from backend.`, error);
    return null;
  }
};

/* STUDENT DASHBOARD */
export const fetchStudentDashboardApi = async () => {
  try {
    const response = await apiClient.get('/student/dashboard');
    return response.data;
  } catch (error) {
    console.warn('[API] Failed to load student dashboard from backend.', error);
    return null;
  }
};

export const toggleAssignmentApi = async (id) => {
  try {
    const response = await apiClient.patch(`/student/assignments/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.warn(`[API] Failed to toggle assignment ${id}.`, error);
    return null;
  }
};

/* TEACHER DASHBOARD */
export const fetchTeacherDashboardApi = async () => {
  try {
    const response = await apiClient.get('/teacher/dashboard');
    return response.data;
  } catch (error) {
    console.warn('[API] Failed to load teacher dashboard from backend.', error);
    return null;
  }
};

export const addStudentApi = async (studentData) => {
  try {
    const response = await apiClient.post('/teacher/students', studentData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to add student');
    }
    throw error;
  }
};

export const updateStudentApi = async (roll, updates) => {
  try {
    const response = await apiClient.patch(`/teacher/students/${roll}`, updates);
    return response.data;
  } catch (error) {
    console.warn(`[API] Failed to update student ${roll}.`, error);
    return null;
  }
};

export const scheduleExamApi = async (examData) => {
  try {
    const response = await apiClient.post('/teacher/exams', examData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to schedule exam');
    }
    throw error;
  }
};

export const recordAttendanceApi = async (attendanceSheet) => {
  try {
    const response = await apiClient.post('/teacher/attendance', attendanceSheet);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to record attendance');
    }
    throw error;
  }
};

/* ADMIN DASHBOARD */
export const fetchAdminDashboardApi = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.warn('[API] Failed to load admin dashboard from backend.', error);
    return null;
  }
};

export const addDepartmentApi = async (deptData) => {
  try {
    const response = await apiClient.post('/admin/departments', deptData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to add department');
    }
    throw error;
  }
};

export const updateDepartmentApi = async (id, updates) => {
  try {
    const response = await apiClient.patch(`/admin/departments/${id}`, updates);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to update department');
    }
    throw error;
  }
};

export default apiClient;
