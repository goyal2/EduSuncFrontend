import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://localhost:7229',
  baseURL: 'https://backendprojectwebapp-c4azccb4dbbchsdc.centralindia-01.azurewebsites.net',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Register a new user
const registerUser = async (userData) => {
  return api.post('/api/UserModels', userData);
};

// Login user
const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/UserModels/login', credentials);
    return response;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

// Get user by ID
const getUserById = async (id) => {
  return api.get(`/api/UserModels/${id}`);
};

// Upload course
const uploadCourse = async (courseData) => {
  try {
    // Create a JSON object with PascalCase property names
    const jsonData = {
      CourseId: courseData.courseId,
      Title: courseData.title,
      Description: courseData.description,
      InstructorId: courseData.instructorId,
      MediaUrl: courseData.mediaUrl || ''
    };

    const response = await api.post('/api/CourseModels', jsonData);
    return response;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};

// Update existing course
const updateCourse = async (courseData) => {
  try {
    // Create a JSON object with PascalCase property names
    const jsonData = {
      CourseId: courseData.courseId,
      Title: courseData.title,
      Description: courseData.description,
      InstructorId: courseData.instructorId,
      MediaUrl: courseData.mediaUrl || ''
    };

    const response = await api.put(`/api/CourseModels/${courseData.courseId}`, jsonData);
    return response;
  } catch (error) {
    console.error('Update failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getCoursesByInstructor = (instructorId) => {
  console.log("Calling API with Instructor ID:", instructorId);
  return api.get(`api/CourseModels`, {
    params: { instructorId }
  });
};

export const createAssessment = (assessment) =>
  api.post(`api/AssessmentModels`, assessment);

export const getAllAssessments = () =>
  api.get(`api/AssessmentModels`);

export const getAssessmentById = (assessmentId) =>
  api.get(`api/AssessmentModels/${assessmentId}`);

export const deleteAssessment = (assessmentId) =>
  api.delete(`api/AssessmentModels/${assessmentId}`);

// Get all courses (for students)
export const getAllCourses = async () => {
  return await api.get('/api/CourseModels');
};

export const submitAssessment = async (submission) => {
  try {
    console.log('API: Submitting assessment with data:', submission);

    // Ensure all required fields are present and in the correct format
    const payload = {
      ResultId: submission.ResultId,
      AssessmentId: submission.AssessmentId,
      UserId: submission.UserId,
      Score: submission.Score,
      MaxScore: submission.MaxScore,
      AttemptDate: submission.AttemptDate,
      AnswersList: submission.AnswersList.map(answer => ({
        ResultId: answer.ResultId,
        QuestionNumber: answer.QuestionNumber,
        Question: answer.Question,
        SelectedAnswer: answer.SelectedAnswer,
        CorrectAnswer: answer.CorrectAnswer,
        Score: answer.Score,
        MaxScore: answer.MaxScore
      }))
    };

    const response = await api.post('/api/ResultModels', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error('API: Assessment submission failed:', {
      error: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      submittedData: submission
    });

    if (error.response?.status === 500) {
      const errorMessage = error.response?.data || 'Could not submit assessment. Please try again.';
      throw new Error(`Server Error: ${errorMessage}`);
    }
    throw error;
  }
};

export const getAllResults = () => {
  return api.get('/api/ResultModels');
};

export const deleteCourse = (courseId) => {
  return api.delete(`api/CourseModels/${courseId}`);
};

export const updateAssessment = async (assessment) => {
  try {
    const response = await api.put(`/api/AssessmentModels/${assessment.assessmentId}`, assessment);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get enrolled courses for a student
export const getEnrolledCourses = (studentId) =>
  api.get(`/api/CourseModels/enrolled/${studentId}`);

// Get completed assessments for a student
export const getCompletedAssessments = (studentId) =>
  api.get(`/api/ResultModels/completed/${studentId}`);

// Get student's average score
export const getStudentAverageScore = (studentId) =>
  api.get(`/api/ResultModels/average/${studentId}`);


export {
  registerUser,
  loginUser,
  getUserById,
  uploadCourse,
  updateCourse
};

export default api;
