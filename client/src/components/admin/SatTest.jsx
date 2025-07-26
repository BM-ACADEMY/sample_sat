// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PlusCircle,
  Info,
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
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[600px] overflow-y-auto transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center">
        <PlusCircle className="mr-2 text-blue-600" size={24} /> {editingId ? 'Edit Question' : 'Add Question'}
      </h2>
      <form onSubmit={handleQuestionSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <Info className="mr-2 text-blue-500" size={18} /> Question
          </label>
          <textarea
            name="question"
            value={questionFormData.question}
            onChange={handleQuestionFormChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            rows="4"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <List className="mr-2 text-blue-500" size={18} /> Add Option
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            <button
              type="button"
              onClick={() => {
                addOption(optionInput);
                setOptionInput('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <PlusCircle className="mr-2" size={18} /> Add
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {optionsArray.map((opt, index) => (
              <li key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {opt}
                <button
                  onClick={() => setOptionsArray(optionsArray.filter((_, i) => i !== index))}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <CheckCircle className="mr-2 text-blue-500" size={18} /> Correct Answer
          </label>
          <input
            type="text"
            name="correctAnswer"
            value={questionFormData.correctAnswer}
            onChange={handleQuestionFormChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={18} /> Submit
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderCourseForm = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[600px] overflow-y-auto transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center">
        <BookOpen className="mr-2 text-blue-600" size={24} /> {editingId ? 'Edit Course' : 'Add Course'}
      </h2>
      <form onSubmit={handleCourseSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <BookOpen className="mr-2 text-blue-500" size={18} /> Course Name
          </label>
          <input
            type="text"
            name="courseName"
            value={courseFormData.courseName}
            onChange={handleCourseFormChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <span className="mr-2">₹</span> Fee (INR)
          </label>
          <input
            type="number"
            name="fee"
            value={courseFormData.fee}
            onChange={handleCourseFormChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={18} /> Submit
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderDiscountForm = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[600px] overflow-y-auto transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center">
        <Percent className="mr-2 text-blue-600" size={24} /> {editingId ? 'Edit Discount' : 'Add Discount'}
      </h2>
      <form onSubmit={handleDiscountSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <Percent className="mr-2 text-blue-500" size={18} /> Min Score (%)
          </label>
          <input
            type="number"
            name="minScore"
            value={discountFormData.minScore}
            onChange={handleDiscountFormChange}
            min="0"
            max="100"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <Percent className="mr-2 text-blue-500" size={18} /> Max Score (%)
          </label>
          <input
            type="number"
            name="maxScore"
            value={discountFormData.maxScore}
            onChange={handleDiscountFormChange}
            min="0"
            max="100"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 flex items-center">
            <Percent className="mr-2 text-blue-500" size={18} /> Discount (%)
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={discountFormData.discountPercentage}
            onChange={handleDiscountFormChange}
            min="0"
            max="100"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={18} /> Submit
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderQuestionTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4 text-left text-sm font-semibold">Question</th>
            <th className="p-4 text-left text-sm font-semibold">Options</th>
            <th className="p-4 text-left text-sm font-semibold">Correct Answer</th>
            <th className="p-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q._id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}>
              <td className="p-4 text-gray-700">{q.question}</td>
              <td className="p-4 text-gray-700">{q.options.join(', ')}</td>
              <td className="p-4 text-gray-700">{q.correctAnswer}</td>
              <td className="p-4">
                <button
                  onClick={() => editQuestion(q._id)}
                  className="text-yellow-600 hover:text-yellow-700 mr-3 transition duration-200"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => deleteQuestion(q._id)}
                  className="text-red-600 hover:text-red-700 transition duration-200"
                >
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
          <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left text-sm font-semibold">Email</th>
                <th className="p-4 text-left text-sm font-semibold">Phone</th>
                <th className="p-4 text-left text-sm font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedTests.map((test, index) => (
                  <tr
                    key={test._id}
                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
                  >
                    <td className="p-4 text-gray-700">{test.email || 'N/A'}</td>
                    <td className="p-4 text-gray-700">{test.phone || 'N/A'}</td>
                    <td className="p-4 text-gray-700">{test.score ?? '0'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {tests.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition duration-200`}
            >
              <ChevronLeft className="mr-2" size={18} /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-4 py-2 rounded-lg ${
                  page === currentPage ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition duration-200`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition duration-200`}
            >
              Next <ChevronRight className="ml-2" size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCoursesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4 text-left text-sm font-semibold">Course</th>
            <th className="p-4 text-left text-sm font-semibold">Fee (INR)</th>
            <th className="p-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No courses available
              </td>
            </tr>
          ) : (
            courses.map((c, index) => (
              <tr
                key={c._id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
              >
                <td className="p-4 text-gray-700">{c.courseName}</td>
                <td className="p-4 text-gray-700">₹{c.fee.toFixed(2)}</td>
                <td className="p-4">
                  <button
                    onClick={() => editCourse(c._id)}
                    className="text-yellow-600 hover:text-yellow-700 mr-3 transition duration-200"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteCourse(c._id)}
                    className="text-red-600 hover:text-red-700 transition duration-200"
                  >
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
      <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4 text-left text-sm font-semibold">Min Score (%)</th>
            <th className="p-4 text-left text-sm font-semibold">Max Score (%)</th>
            <th className="p-4 text-left text-sm font-semibold">Discount (%)</th>
            <th className="p-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No discounts available
              </td>
            </tr>
          ) : (
            discounts.map((d, index) => (
              <tr
                key={d._id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
              >
                <td className="p-4 text-gray-700">{d.minScore}</td>
                <td className="p-4 text-gray-700">{d.maxScore}</td>
                <td className="p-4 text-gray-700">{d.discountPercentage}</td>
                <td className="p-4">
                  <button
                    onClick={() => editDiscount(d._id)}
                    className="text-yellow-600 hover:text-yellow-700 mr-3 transition duration-200"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteDiscount(d._id)}
                    className="text-red-600 hover:text-red-700 transition duration-200"
                  >
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex justify-center">
      {notification.show && (
        <div
          className="fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300 animate-slide-down"
          style={{ backgroundColor: notification.color, color: '#fff' }}
        >
          {notification.message}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl w-full">
        <div className="lg:w-1/3 min-w-[320px]">
          {currentTab === 'questions' || currentTab === 'students' ? renderQuestionForm() : currentTab === 'courses' ? renderCourseForm() : renderDiscountForm()}
        </div>
        <div className="lg:w-2/3 bg-white rounded-xl shadow-2xl p-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { tab: 'questions', icon: Info, label: 'Questions' },
              { tab: 'students', icon: User, label: 'Attended Students' },
              { tab: 'courses', icon: BookOpen, label: 'Courses' },
              { tab: 'discounts', icon: Percent, label: 'Discounts' },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 flex items-center justify-center ${
                  currentTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2" size={18} /> {label}
              </button>
            ))}
          </div>
          <div className="transition-all duration-300">
            {currentTab === 'questions' && renderQuestionTable()}
            {currentTab === 'students' && renderStudentsTable()}
            {currentTab === 'courses' && renderCoursesTable()}
            {currentTab === 'discounts' && renderDiscountsTable()}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;