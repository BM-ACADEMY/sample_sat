// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusCircle,
  Info ,
  List,
  CheckCircle,
  Send,
  X,
  Edit,
  Trash2,
  User,
  BookOpen,
  Percent,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState('questions');
  const [editingId, setEditingId] = useState(null);
  const [optionsArray, setOptionsArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [notification, setNotification] = useState({ message: '', color: '', show: false });
  const itemsPerPage = 5;

  const showNotification = (message, color = '#4caf50') => {
    setNotification({ message, color, show: true });
    setTimeout(() => setNotification({ message: '', color: '', show: false }), 3000);
  };

  const addOption = (option) => {
    if (option.trim()) {
      setOptionsArray([...optionsArray, option.trim()]);
    } else {
      showNotification('Please enter a valid option', '#f44336');
    }
  };

  const resetForm = () => {
    setOptionsArray([]);
    setEditingId(null);
    setQuestionFormData({ question: '', correctAnswer: '' });
    setCourseFormData({ courseName: '', fee: '' });
    setDiscountFormData({ minScore: '', maxScore: '', discountPercentage: '' });
  };

  // Question Form State and Handlers
  const [questionFormData, setQuestionFormData] = useState({ question: '', correctAnswer: '' });
  const [optionInput, setOptionInput] = useState('');

  const handleQuestionFormChange = (e) => {
    setQuestionFormData({ ...questionFormData, [e.target.name]: e.target.value });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      question: questionFormData.question.trim(),
      options: [...optionsArray],
      correctAnswer: questionFormData.correctAnswer.trim(),
    };

    if (!payload.question) return showNotification('Question is required', '#f44336');
    if (payload.options.length === 0) return showNotification('Please add at least one option', '#f44336');
    if (!payload.correctAnswer) return showNotification('Correct answer is required', '#f44336');
    if (!payload.options.includes(payload.correctAnswer))
      return showNotification('Correct answer must be one of the options', '#f44336');

    try {
      const url = editingId ? `${API_BASE_URL}/questions/${editingId}` : `${API_BASE_URL}/questions`;
      const method = editingId ? 'put' : 'post';
      const res = await axios[method](url, payload);
      showNotification(editingId ? 'Question updated successfully' : 'Question added successfully', editingId ? '#2196f3' : '#4caf50');
      setEditingId(null);
      setOptionsArray([]);
      setQuestionFormData({ question: '', correctAnswer: '' });
      setOptionInput('');
      fetchQuestions();
    } catch (err) {
      console.error('Error submitting question:', err);
      showNotification(`Failed to submit question: ${err.message}`, '#f44336');
    }
  };

  // Course Form State and Handlers
  const [courseFormData, setCourseFormData] = useState({ courseName: '', fee: '' });

  const handleCourseFormChange = (e) => {
    setCourseFormData({ ...courseFormData, [e.target.name]: e.target.value });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      courseName: courseFormData.courseName.trim(),
      fee: parseFloat(courseFormData.fee),
    };
    try {
      const url = editingId ? `${API_BASE_URL}/courses/${editingId}` : `${API_BASE_URL}/courses`;
      const method = editingId ? 'put' : 'post';
      const res = await axios[method](url, payload);
      showNotification(editingId ? 'Course updated successfully' : 'Course added successfully', editingId ? '#2196f3' : '#4caf50');
      setEditingId(null);
      setCourseFormData({ courseName: '', fee: '' });
      fetchCourses();
    } catch (err) {
      console.error('Error submitting course:', err);
      showNotification(`Failed to submit course: ${err.message}`, '#f44336');
    }
  };

  // Discount Form State and Handlers
  const [discountFormData, setDiscountFormData] = useState({ minScore: '', maxScore: '', discountPercentage: '' });

  const handleDiscountFormChange = (e) => {
    setDiscountFormData({ ...discountFormData, [e.target.name]: e.target.value });
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      minScore: parseFloat(discountFormData.minScore),
      maxScore: parseFloat(discountFormData.maxScore),
      discountPercentage: parseFloat(discountFormData.discountPercentage),
    };
    try {
      const url = editingId ? `${API_BASE_URL}/discounts/${editingId}` : `${API_BASE_URL}/discounts`;
      const method = editingId ? 'put' : 'post';
      const res = await axios[method](url, payload);
      showNotification(editingId ? 'Discount updated successfully' : 'Discount added successfully', editingId ? '#2196f3' : '#4caf50');
      setEditingId(null);
      setDiscountFormData({ minScore: '', maxScore: '', discountPercentage: '' });
      fetchDiscounts();
    } catch (err) {
      console.error('Error submitting discount:', err);
      showNotification(`Failed to submit discount: ${err.message}`, '#f44336');
    }
  };

  // Fetch Data Functions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/questions`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions:', err);
      showNotification(`Failed to fetch questions: ${err.message}`, '#f44336');
    }
  };

  const fetchTests = async (page = 1) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tests`);
      setTests(res.data);
      setCurrentPage(page);
      if (res.data.length === 0) {
        showNotification('No student data available', '#f39c12');
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      showNotification(`Failed to fetch student data: ${err.message}`, '#f44336');
      setTests([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      showNotification(`Failed to fetch courses: ${err.message}`, '#f44336');
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discounts`);
      setDiscounts(res.data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      showNotification(`Failed to fetch discounts: ${err.message}`, '#f44336');
    }
  };

  // Edit and Delete Handlers
  const editQuestion = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/questions/${id}`);
      setQuestionFormData({ question: res.data.question, correctAnswer: res.data.correctAnswer });
      setOptionsArray(res.data.options || []);
      setEditingId(id);
      setCurrentTab('questions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error editing question:', err);
      showNotification(`Failed to load question for editing: ${err.message}`, '#f44336');
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/questions/${id}`);
      showNotification('Question deleted successfully', '#f44336');
      fetchQuestions();
    } catch (err) {
      console.error('Error deleting question:', err);
      showNotification(`Failed to delete question: ${err.message}`, '#f44336');
    }
  };

  const editCourse = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses/${id}`);
      setCourseFormData({ courseName: res.data.courseName, fee: res.data.fee });
      setEditingId(id);
      setCurrentTab('courses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error editing course:', err);
      showNotification(`Failed to load course for editing: ${err.message}`, '#f44336');
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${id}`);
      showNotification('Course deleted successfully', '#f44336');
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      showNotification(`Failed to delete course: ${err.message}`, '#f44336');
    }
  };

  const editDiscount = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discounts/${id}`);
      setDiscountFormData({
        minScore: res.data.minScore,
        maxScore: res.data.maxScore,
        discountPercentage: res.data.discountPercentage,
      });
      setEditingId(id);
      setCurrentTab('discounts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error editing discount:', err);
      showNotification(`Failed to load discount for editing: ${err.message}`, '#f44336');
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/discounts/${id}`);
      showNotification('Discount deleted successfully', '#f44336');
      fetchDiscounts();
    } catch (err) {
      console.error('Error deleting discount:', err);
      showNotification(`Failed to delete discount: ${err.message}`, '#f44336');
    }
  };

  // Initialize
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Tab Switch Handler
  const switchTab = (tabName) => {
    setCurrentTab(tabName);
    setEditingId(null);
    setOptionsArray([]);
    setQuestionFormData({ question: '', correctAnswer: '' });
    setCourseFormData({ courseName: '', fee: '' });
    setDiscountFormData({ minScore: '', maxScore: '', discountPercentage: '' });
    if (tabName === 'questions') fetchQuestions();
    else if (tabName === 'students') fetchTests(1);
    else if (tabName === 'courses') fetchCourses();
    else if (tabName === 'discounts') fetchDiscounts();
  };

  // Pagination
  const changePage = (page) => {
    if (page < 1) return;
    setCurrentPage(page);
    fetchTests(page);
  };

  const renderQuestionForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 flex items-center justify-center">
        <PlusCircle className="mr-2" /> {editingId ? 'Edit Question' : 'Add Question'}
      </h2>
      <form onSubmit={handleQuestionSubmit}>
        <label className=" mb-2 font-bold text-gray-700 flex items-center">
          <Info  className="mr-2" /> Question:
        </label>
        <textarea
          name="question"
          value={questionFormData.question}
          onChange={handleQuestionFormChange}
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <label className=" mt-4 mb-2 font-bold text-gray-700 flex items-center">
          <List className="mr-2" /> Add Option:
        </label>
        <input
          type="text"
          value={optionInput}
          onChange={(e) => setOptionInput(e.target.value)}
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => {
            addOption(optionInput);
            setOptionInput('');
          }}
          className="mt-2 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          <PlusCircle className="inline mr-2" /> Add Option
        </button>
        <ul className="mt-2 flex flex-wrap gap-2">
          {optionsArray.map((opt, index) => (
            <li key={index} className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              {opt}
            </li>
          ))}
        </ul>
        <label className=" mt-4 mb-2 font-bold text-gray-700 flex items-center">
          <CheckCircle className="mr-2" /> Correct Answer:
        </label>
        <input
          type="text"
          name="correctAnswer"
          value={questionFormData.correctAnswer}
          onChange={handleQuestionFormChange}
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
          <Send className="inline mr-2" /> Submit
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          <X className="inline mr-2" /> Cancel
        </button>
      </form>
    </div>
  );

  const renderCourseForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 flex items-center justify-center">
        <BookOpen className="mr-2" /> {editingId ? 'Edit Course' : 'Add Course'}
      </h2>
      <form onSubmit={handleCourseSubmit}>
        <label className=" mb-2 font-bold text-gray-700 flex items-center">
          <BookOpen className="mr-2" /> Course Name:
        </label>
        <input
          type="text"
          name="courseName"
          value={courseFormData.courseName}
          onChange={handleCourseFormChange}
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <label className=" mt-4 mb-2 font-bold text-gray-700 flex items-center">
          <span className="mr-2">₹</span> Fee (INR):
        </label>
        <input
          type="number"
          name="fee"
          value={courseFormData.fee}
          onChange={handleCourseFormChange}
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
          <Send className="inline mr-2" /> Submit
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          <X className="inline mr-2" /> Cancel
        </button>
      </form>
    </div>
  );

  const renderDiscountForm = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 flex items-center justify-center">
        <Percent className="mr-2" /> {editingId ? 'Edit Discount' : 'Add Discount'}
      </h2>
      <form onSubmit={handleDiscountSubmit}>
        <label className=" mb-2 font-bold text-gray-700 flex items-center">
          <Percent className="mr-2" /> Min Score (%):
        </label>
        <input
          type="number"
          name="minScore"
          value={discountFormData.minScore}
          onChange={handleDiscountFormChange}
          min="0"
          max="100"
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <label className=" mt-4 mb-2 font-bold text-gray-700 flex items-center">
          <Percent className="mr-2" /> Max Score (%):
        </label>
        <input
          type="number"
          name="maxScore"
          value={discountFormData.maxScore}
          onChange={handleDiscountFormChange}
          min="0"
          max="100"
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <label className=" mt-4 mb-2 font-bold text-gray-700 flex items-center">
          <Percent className="mr-2" /> Discount (%):
        </label>
        <input
          type="number"
          name="discountPercentage"
          value={discountFormData.discountPercentage}
          onChange={handleDiscountFormChange}
          min="0"
          max="100"
          required
          className="w-full p-2 border rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">
          <Send className="inline mr-2" /> Submit
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="mt-2 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          <X className="inline mr-2" /> Cancel
        </button>
      </form>
    </div>
  );

  const renderQuestionTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 text-left">Question</th>
            <th className="p-3 text-left">Options</th>
            <th className="p-3 text-left">Correct Answer</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q._id} className="bg-gray-50 border-b">
              <td className="p-3">{q.question}</td>
              <td className="p-3">{q.options.join(', ')}</td>
              <td className="p-3">{q.correctAnswer}</td>
              <td className="p-3">
                <button onClick={() => editQuestion(q._id)} className="text-yellow-500 mr-2">
                  <Edit size={20} />
                </button>
                <button onClick={() => deleteQuestion(q._id)} className="text-red-500">
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStudentsTable = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedTests = tests.slice(start, end);
    const totalPages = Math.ceil(tests.length / itemsPerPage);

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center bg-white">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedTests.map((test) => (
                  <tr key={test._id} className="bg-gray-50 border-b">
                    <td className="p-3">{test.email || 'N/A'}</td>
                    <td className="p-3">{test.phone || 'N/A'}</td>
                    <td className="p-3">{test.score ?? '0'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {tests.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <ChevronLeft className="inline" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-4 py-2 mx-1 rounded ${
                  page === currentPage ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              Next <ChevronRight className="inline" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCoursesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Fee (INR)</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-3 text-center bg-white">
                No courses available
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr key={c._id} className="bg-gray-50 border-b">
                <td className="p-3">{c.courseName}</td>
                <td className="p-3">₹{c.fee.toFixed(2)}</td>
                <td className="p-3">
                  <button onClick={() => editCourse(c._id)} className="text-yellow-500 mr-2">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => deleteCourse(c._id)} className="text-red-500">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderDiscountsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-3 text-left">Min Score (%)</th>
            <th className="p-3 text-left">Max Score (%)</th>
            <th className="p-3 text-left">Discount (%)</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center bg-white">
                No discounts available
              </td>
            </tr>
          ) : (
            discounts.map((d) => (
              <tr key={d._id} className="bg-gray-50 border-b">
                <td className="p-3">{d.minScore}</td>
                <td className="p-3">{d.maxScore}</td>
                <td className="p-3">{d.discountPercentage}</td>
                <td className="p-3">
                  <button onClick={() => editDiscount(d._id)} className="text-yellow-500 mr-2">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => deleteDiscount(d._id)} className="text-red-500">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-purple-200 p-5 flex justify-center items-start">
      {notification.show && (
        <div
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all"
          style={{ backgroundColor: notification.color }}
        >
          {notification.message}
        </div>
      )}
      <div className="flex flex-wrap gap-5 max-w-6xl w-full">
        <div className="flex-1 min-w-[300px]">
          {currentTab === 'questions' || currentTab === 'students' ? renderQuestionForm() : currentTab === 'courses' ? renderCourseForm() : renderDiscountForm()}
        </div>
        <div className="flex-1 min-w-[300px] bg-white rounded-2xl shadow-lg p-6">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => switchTab('questions')}
              className={`px-4 py-2 rounded-md font-bold ${currentTab === 'questions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Info  className="inline mr-2" /> Questions
            </button>
            <button
              onClick={() => switchTab('students')}
              className={`px-4 py-2 rounded-md font-bold ${currentTab === 'students' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <User className="inline mr-2" /> Attended Students
            </button>
            <button
              onClick={() => switchTab('courses')}
              className={`px-4 py-2 rounded-md font-bold ${currentTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <BookOpen className="inline mr-2" /> Courses
            </button>
            <button
              onClick={() => switchTab('discounts')}
              className={`px-4 py-2 rounded-md font-bold ${currentTab === 'discounts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              <Percent className="inline mr-2" /> Discounts
            </button>
          </div>
          <div className={currentTab}>
            {currentTab === 'questions' && renderQuestionTable()}
            {currentTab === 'students' && renderStudentsTable()}
            {currentTab === 'courses' && renderCoursesTable()}
            {currentTab === 'discounts' && renderDiscountsTable()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;