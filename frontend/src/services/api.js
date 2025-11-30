
// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');


// // set default base if backend on different port
// axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true; // if you use cookies for auth

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if 401 (Unauthorized)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ======================
// AUTH API
// ======================
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// ======================
// ADMIN APIs
// ======================
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};


export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await api.post('/admin/users', userData);
  return response.data;
};

export const updateAdminUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getAdminLogs = async () => {
  const response = await api.get('/admin/logs');
  return response.data;
};

// Get all courses (for admin)
export const getAdminCourses = async () => {
  const response = await api.get('/admin/courses');
  return response.data;
};

// Delete a course
export const deleteAdminCourse = async (courseId) => {
  const response = await api.delete(`/admin/courses/${courseId}`);
  return response.data;
};

// Get admin profile
export const getAdminProfile = async (adminId) => {
  const response = await api.get(`/admin/profile/${adminId}`);
  return response.data;
};

// Update admin profile
export const updateAdminProfile = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data;
};

// ======================
// TEACHER APIs
// ======================



// ======================
// TEACHER APIs
// ======================

const handleResponse = async (res) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.message || res.statusText);
    return data;
  } catch {
    if (!res.ok) throw new Error(text || res.statusText);
    return text;
  }
};

// Get all teacher courses
export const getTeacherCourses = async () => {
  const res = await fetch(`${API_BASE}/teacher/courses`, { 
    headers: { Authorization: `Bearer ${getToken()}` } 
  });
  const data = await handleResponse(res);

  if (Array.isArray(data)) {
    return data.map((course, index) => ({
      id: course.id ?? index,
      title: course.title,
      description: course.description,
      ...course,
    }));
  }

  return Array.isArray(data.courses) ? data.courses.map((course, index) => ({
    id: course.id ?? index,
    title: course.title,
    description: course.description,
    ...course,
  })) : [];
};

// Update a teacher course (text + optional files)
export const updateTeacherCourse = async (id, courseData) => {
  // courseData must be FormData
  const res = await fetch(`${API_BASE}/teacher/courses/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`, // DO NOT set Content-Type
    },
    body: courseData,
  });
  return handleResponse(res);
};

// Create a new course
export const createTeacherCourse = async (formData) => {
  const res = await fetch(`${API_BASE}/teacher/courses`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
};

// Delete a course
export const deleteTeacherCourse = async (id) => {
  const res = await fetch(`${API_BASE}/teacher/courses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
};


// Assignments
export const getTeacherAssignments = async () => {
  const res = await fetch(`${API_BASE}/teacher/assignments`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : data.assignments || [];
};

export const createTeacherAssignment = async (assignment) => {
  const res = await fetch(`${API_BASE}/teacher/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(assignment),
  });
  return handleResponse(res);
};

export const deleteTeacherAssignment = async (id) => {
  const res = await fetch(`${API_BASE}/teacher/assignments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
  return handleResponse(res);
};



export const updateTeacherAssignment = async (id, assignment) => {
  const res = await fetch(`${API_BASE}/teacher/assignments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(assignment),
  });
  return handleResponse(res);
};




// // Quizzes
// export const getTeacherQuizzes = async () => {
//   const res = await fetch(`${API_BASE}/teacher/quizzes`, { headers: { Authorization: `Bearer ${getToken()}` } });
//   const data = await handleResponse(res);
//   return Array.isArray(data) ? data : data.quizzes || [];
// };


// // export const createTeacherQuiz = async (quiz) => {
// //   const res = await fetch(`${API_BASE}/teacher/quizzes`, {
// //     method: 'POST',
// //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
// //     body: JSON.stringify(quiz),
// //   });
// //   return handleResponse(res);
// // };

// // services/api.js
// export const createTeacherQuiz = async (quizForm) => {
//   try {
//     const response = await fetch("/api/teacher/quizzes", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//       body: JSON.stringify({
//         course_id: quizForm.course_id,
//         title: quizForm.title,
//         time_limit: quizForm.time_limit,
//         questions: quizForm.questions.map(q => ({
//           question_text: q.question_text,
//           options: q.options,      // Array of strings, backend will JSON.stringify
//           correct_answer: q.correct_answer,
//         })),
//       }),
//     });

//     if (!response.ok) throw new Error("Failed to create quiz");

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };


// export const deleteTeacherQuiz = async (id) => {
//   const res = await fetch(`${API_BASE}/teacher/quizzes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
//   return handleResponse(res);
// };
// // services/api.js
// export const getQuizById = async (id) => {
//   const res = await fetch(`/api/teacher/quizzes/${id}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
//   if (!res.ok) throw new Error("Failed to fetch quiz");
//   return res.json();
// };


// Submissions
export const getTeacherSubmissions = async () => {
  const res = await fetch(`${API_BASE}/teacher/submissions`, { headers: { Authorization: `Bearer ${getToken()}` } });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : data.submissions || [];
};

export const evaluateSubmission = async (id, payload) => {
  const res = await fetch(`${API_BASE}/teacher/submissions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};


export const gradeTeacherSubmission = async (id, data) => {
  const res = await api.put(`/teacher/submissions/${id}/grade`, data);
  return res.data;
};


// // src/services/api.js

// export const gradeTeacherSubmission = async (id, payload) => {
//   const res = await fetch(`${API_BASE}/teacher/submissions/${id}/grade`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//     body: JSON.stringify(payload),
//   });
//   return handleResponse(res);
// };

// Get all teacher quizzes
export const getTeacherQuizzes = async () => {
  const res = await fetch(`${API_BASE}/teacher/quizzes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await handleResponse(res);
  return Array.isArray(data) ? data : data.quizzes || [];
};

// Create new quiz
export const createTeacherQuiz = async (quizForm) => {
  const res = await fetch(`${API_BASE}/teacher/quizzes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(quizForm),
  });
  return handleResponse(res);
};

// Get quiz by ID (for edit)
export const getQuizById = async (id) => {
  const res = await fetch(`${API_BASE}/teacher/quizzes/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
};

// Update quiz
export const updateTeacherQuiz = async (id, quizForm) => {
  const res = await fetch(`${API_BASE}/teacher/quizzes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(quizForm),
  });
  return handleResponse(res);
};

// Delete quiz
export const deleteTeacherQuiz = async (id) => {
  const res = await fetch(`${API_BASE}/teacher/quizzes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
};



// Profile
export const getTeacherProfile = async () => {
  const res = await fetch(`${API_BASE}/teacher/profile`, { headers: { Authorization: `Bearer ${getToken()}` } });
  return handleResponse(res);
};

export const updateTeacherProfile = async (profile) => {
  const res = await fetch(`${API_BASE}/teacher/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(profile),
  });
  return handleResponse(res);
};

// Dashboard
export const getTeacherDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/teacher/dashboard`, { headers: { Authorization: `Bearer ${getToken()}` } });
  return handleResponse(res);
};





// =================== STUDENT APIs ===================

// --------------------------------------------
// STUDENT DASHBOARD
// --------------------------------------------
export const fetchDashboard = async () => {
  const res = await api.get("/student/dashboard");
  return res.data;
};

// --------------------------------------------
// STUDENT COURSES
// --------------------------------------------
export const fetchMyCourses = async () => {
  const res = await api.get("/student/my-courses");
  return res.data;
};


// --------------------------------------------
// COURSE DETAILS (materials, assignments, quizzes)
// --------------------------------------------
export const fetchCourseDetail = async (courseId) => {
  const res = await api.get(`/student/courses/${courseId}`);
  return res.data;
};

// --------------------------------------------
// QUIZ DETAILS
// --------------------------------------------
export const fetchQuiz = async (quizId) => {
  const res = await api.get(`/student/quiz/${quizId}`);
  return res.data;
};

// --------------------------------------------
// SUBMIT QUIZ
// --------------------------------------------
export const submitQuiz = async (quizId, answers) => {
  const res = await api.post(`/student/quiz/${quizId}/submit`, { answers });
  return res.data;
};

// --------------------------------------------
// SUBMIT ASSIGNMENT (FILE UPLOAD)
// --------------------------------------------
export const submitAssignment = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/student/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};

async function loadAssignments() {
  return axios.get('/api/student/assignments').then(r => r.data);
}

async function loadQuizzes() {
  return axios.get('/api/student/quiz').then(r => r.data);
}



export async function apiFetch(url, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const token = localStorage.getItem('token');
  const init = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  };
  if (body && typeof body !== 'string') init.body = JSON.stringify(body);
  else if (body) init.body = body;

  const res = await fetch(url, init);
  if (res.status === 401) {
    // Auth failed - do not silently navigate to home; allow app to handle it (logout + redirect to login)
    // Optionally: call logout() here if you import it from AuthContext, or let caller handle
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    let data = null;
    try { data = await res.json(); } catch {}
    const msg = data?.message || res.statusText || 'Request failed';
    const err = new Error(msg);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  try { return await res.json(); } catch { return null; }
}


// Export axios instance for direct use if needed
export default api;