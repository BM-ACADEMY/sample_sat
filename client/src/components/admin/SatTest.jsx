import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CreditCard,
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const AdminPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('courses');
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ message: '', color: '', show: false });
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showNotification = (message, color = '#4caf50') => {
    setNotification({ message, color, show: true });
    setTimeout(() => setNotification({ message: '', color: '', show: false }), 3000);
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
    if (!payload.courseName || isNaN(payload.fee)) {
      return showNotification('Course name and valid fee are required', '#f44336');
    }
    try {
      const url = editingId ? `${API_BASE_URL}/courses/${editingId}` : `${API_BASE_URL}/courses`;
      const method = editingId ? 'put' : 'post';
      const response = await axios[method](url, payload);
      showNotification(editingId ? 'Course updated successfully' : 'Course added successfully', editingId ? '#2196f3' : '#4caf50');
      setCourseFormData({ courseName: '', fee: '' });
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error('Course submit error:', err.response?.data || err.message);
      showNotification(`Failed to submit course: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  // Question Form State and Handlers
  const [questionFormData, setQuestionFormData] = useState({
    mainHeading: '',
    questions: [{ questionText: '', options: [], correctAnswer: '' }],
  });
  const [optionInput, setOptionInput] = useState('');

  const handleQuestionFormChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'mainHeading') {
      setQuestionFormData({ ...questionFormData, mainHeading: value });
    } else {
      const updatedQuestions = [...questionFormData.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
      setQuestionFormData({ ...questionFormData, questions: updatedQuestions });
    }
  };

  const addOption = (index, option) => {
    if (option.trim()) {
      const updatedQuestions = [...questionFormData.questions];
      updatedQuestions[index].options = [...updatedQuestions[index].options, option.trim()];
      setQuestionFormData({ ...questionFormData, questions: updatedQuestions });
      setOptionInput('');
    } else {
      showNotification('Please enter a valid option', '#f44336');
    }
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questionFormData.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestionFormData({ ...questionFormData, questions: updatedQuestions });
  };

  const addQuestionEntry = () => {
    setQuestionFormData({
      ...questionFormData,
      questions: [...questionFormData.questions, { questionText: '', options: [], correctAnswer: '' }],
    });
  };

  const removeQuestionEntry = (index) => {
    setQuestionFormData({
      ...questionFormData,
      questions: questionFormData.questions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      mainHeading: questionFormData.mainHeading.trim(),
      questions: questionFormData.questions.map(q => ({
        questionText: q.questionText.trim(),
        options: q.options,
        correctAnswer: q.correctAnswer.trim(),
      })),
    };

    if (!payload.mainHeading) return showNotification('Main heading is required', '#f44336');
    if (payload.questions.length === 0) return showNotification('At least one question is required', '#f44336');
    for (const q of payload.questions) {
      if (!q.questionText) return showNotification('Question text is required', '#f44336');
      if (q.options.length === 0) return showNotification('At least one option is required', '#f44336');
      if (!q.correctAnswer) return showNotification('Correct answer is required', '#f44336');
      if (!q.options.includes(q.correctAnswer)) return showNotification('Correct answer must be one of the options', '#f44336');
    }

    try {
      const url = editingId ? `${API_BASE_URL}/questions/${editingId}` : `${API_BASE_URL}/questions`;
      const method = editingId ? 'put' : 'post';
      await axios[method](url, payload);
      showNotification(editingId ? 'Question set updated successfully' : 'Question set added successfully', editingId ? '#2196f3' : '#4caf50');
      setQuestionFormData({ mainHeading: '', questions: [{ questionText: '', options: [], correctAnswer: '' }] });
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      console.error('Question submit error:', err.response?.data || err.message);
      showNotification(`Failed to submit question set: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  // Discount Form State and Handlers
  const [discountFormData, setDiscountFormData] = useState({
    courseId: '',
    minPercentage: '',
    maxPercentage: '',
    fixedAmount: '',
  });

  const handleDiscountFormChange = (e) => {
    const { name, value } = e.target;
    setDiscountFormData({ ...discountFormData, [name]: value });
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      courseId: discountFormData.courseId,
      minPercentage: parseFloat(discountFormData.minPercentage),
      maxPercentage: parseFloat(discountFormData.maxPercentage),
      fixedAmount: parseFloat(discountFormData.fixedAmount),
    };
    if (!payload.courseId || isNaN(payload.minPercentage) || isNaN(payload.maxPercentage) || isNaN(payload.fixedAmount)) {
      return showNotification('All discount fields are required and must be valid numbers', '#f44336');
    }
    if (payload.minPercentage > payload.maxPercentage) {
      return showNotification('Min percentage cannot be greater than max percentage', '#f44336');
    }
    try {
      const url = editingId ? `${API_BASE_URL}/discounts/${editingId}` : `${API_BASE_URL}/discounts`;
      const method = editingId ? 'put' : 'post';
      await axios[method](url, payload);
      showNotification(editingId ? 'Discount updated successfully' : 'Discount added successfully', editingId ? '#2196f3' : '#4caf50');
      setDiscountFormData({ courseId: '', minPercentage: '', maxPercentage: '', fixedAmount: '' });
      setEditingId(null);
      fetchDiscounts();
    } catch (err) {
      console.error('Discount submit error:', err.response?.data || err.message);
      showNotification(`Failed to submit discount: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  // Fetch Data Functions
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error('Fetch courses error:', err.message);
      showNotification(`Failed to fetch courses: ${err.message}`, '#f44336');
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/questions`);
      setQuestions(res.data);
    } catch (err) {
      console.error('Fetch questions error:', err.message);
      showNotification(`Failed to fetch questions: ${err.message}`, '#f44336');
    }
  };

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discounts`);
      const validDiscounts = res.data.filter(d => 
        d && d.courseId && typeof d.fixedAmount === 'number' && !isNaN(d.fixedAmount)
      );
      setDiscounts(validDiscounts);
      if (validDiscounts.length < res.data.length) {
        showNotification('Some discounts were filtered due to invalid data', '#f39c12');
      }
    } catch (err) {
      console.error('Fetch discounts error:', err.message);
      showNotification(`Failed to fetch discounts: ${err.message}`, '#f44336');
      setDiscounts([]);
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
      console.error('Fetch tests error:', err.message);
      showNotification(`Failed to fetch student data: ${err.message}`, '#f44336');
      setTests([]);
    }
  };

  // Edit and Delete Handlers
  const editCourse = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/courses/${id}`);
      const course = res.data;
      setCourseFormData({
        courseName: course.courseName || '',
        fee: course.fee ? course.fee.toString() : '',
      });
      setEditingId(id);
      setCurrentTab('courses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Edit course error:', err.response?.data || err.message);
      showNotification(`Failed to load course for editing: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/courses/${id}`);
      showNotification('Course deleted successfully', '#f44336');
      fetchCourses();
    } catch (err) {
      console.error('Delete course error:', err.response?.data || err.message);
      showNotification(`Failed to delete course: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  const editQuestion = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/questions/${id}`);
      setQuestionFormData({
        mainHeading: res.data.mainHeading || '',
        questions: res.data.questions.map(q => ({
          questionText: q.questionText || '',
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
        })),
      });
      setEditingId(id);
      setCurrentTab('questions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Edit question error:', err.response?.data || err.message);
      showNotification(`Failed to load question set for editing: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/questions/${id}`);
      showNotification('Question set deleted successfully', '#f44336');
      fetchQuestions();
    } catch (err) {
      console.error('Delete question error:', err.response?.data || err.message);
      showNotification(`Failed to delete question set: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  const editDiscount = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/discounts/${id}`);
      const discount = res.data;
      setDiscountFormData({
        courseId: discount.courseId?._id || discount.courseId || '',
        minPercentage: discount.minPercentage ? discount.minPercentage.toString() : '',
        maxPercentage: discount.maxPercentage ? discount.maxPercentage.toString() : '',
        fixedAmount: discount.fixedAmount ? discount.fixedAmount.toString() : '',
      });
      setEditingId(id);
      setCurrentTab('discounts');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Edit discount error:', err.response?.data || err.message);
      showNotification(`Failed to load discount for editing: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  const deleteDiscount = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/discounts/${id}`);
      showNotification('Discount deleted successfully', '#f44336');
      fetchDiscounts();
    } catch (err) {
      console.error('Delete discount error:', err.response?.data || err.message);
      showNotification(`Failed to delete discount: ${err.response?.data?.error || err.message}`, '#f44336');
    }
  };

  // Initialize
  useEffect(() => {
    fetchCourses();
  }, []);

  // Tab Switch Handler
  const switchTab = (tabName) => {
    setCurrentTab(tabName);
    setEditingId(null);
    setCourseFormData({ courseName: '', fee: '' });
    setQuestionFormData({ mainHeading: '', questions: [{ questionText: '', options: [], correctAnswer: '' }] });
    setDiscountFormData({ courseId: '', minPercentage: '', maxPercentage: '', fixedAmount: '' });
    if (tabName === 'courses') fetchCourses();
    else if (tabName === 'questions') fetchQuestions();
    else if (tabName === 'discounts') fetchDiscounts();
    else if (tabName === 'students') fetchTests(1);
  };

  // Pagination
  const changePage = (page) => {
    if (page < 1) return;
    const totalPages = Math.ceil(tests.length / itemsPerPage);
    if (page > totalPages) return;
    setCurrentPage(page);
  };

  // Navigation to Payment History
  const navigateToPaymentHistory = () => {
    navigate('/admin/payment-history');
  };

  const renderCourseForm = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[600px] overflow-y-auto transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center">
        <BookOpen className="mr-2 text-blue-600" size={24} /> {editingId ? 'Edit Course' : 'Add Course'}
      </h2>
      <form onSubmit={handleCourseSubmit} className="space-y-5">
        <div>
          <label className="mb-2 font-medium text-gray-700 flex items-center">
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
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <span className="mr-2">₹</span> Fee (INR)
          </label>
          <input
            type="number"
            name="fee"
            value={courseFormData.fee}
            onChange={handleCourseFormChange}
            required
            min="0"
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
            onClick={() => {
              setCourseFormData({ courseName: '', fee: '' });
              setEditingId(null);
            }}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const renderQuestionForm = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[600px] overflow-y-auto transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 flex items-center justify-center">
        <Info className="mr-2 text-blue-600" size={24} /> {editingId ? 'Edit Question Set' : 'Add Question Set'}
      </h2>
      <form onSubmit={handleQuestionSubmit} className="space-y-5">
        <div>
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <Info className="mr-2 text-blue-500" size={18} /> Main Heading
          </label>
          <input
            type="text"
            name="mainHeading"
            value={questionFormData.mainHeading}
            onChange={(e) => handleQuestionFormChange(e)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        {questionFormData.questions.map((q, index) => (
          <div key={index} className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Question {index + 1}</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-2 font-medium text-gray-700 flex items-center">
                  <Info className="mr-2 text-blue-500" size={18} /> Question
                </label>
                <textarea
                  name="questionText"
                  value={q.questionText}
                  onChange={(e) => handleQuestionFormChange(e, index)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  rows="3"
                />
              </div>
              <div>
                <label className="mb-2 font-medium text-gray-700 flex items-center">
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
                    onClick={() => addOption(index, optionInput)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                  >
                    <PlusCircle className="mr-2" size={18} /> Add
                  </button>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {q.options.map((opt, optIndex) => (
                    <li key={optIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      {opt}
                      <button
                        onClick={() => removeOption(index, optIndex)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="mb-2 font-medium text-gray-700 flex items-center">
                  <CheckCircle className="mr-2 text-blue-500" size={18} /> Correct Answer
                </label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionFormChange(e, index)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              {questionFormData.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestionEntry(index)}
                  className="text-red-600 hover:text-red-700 flex items-center"
                >
                  <Trash2 size={18} className="mr-1" /> Remove Question
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestionEntry}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center mt-4"
        >
          <PlusCircle className="mr-2" size={18} /> Add Another Question
        </button>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={18} /> Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setQuestionFormData({ mainHeading: '', questions: [{ questionText: '', options: [], correctAnswer: '' }] });
              setEditingId(null);
            }}
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
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <BookOpen className="mr-2 text-blue-500" size={18} /> Course
          </label>
          <select
            name="courseId"
            value={discountFormData.courseId}
            onChange={handleDiscountFormChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <Percent className="mr-2 text-blue-500" size={18} /> Min Percentage (%)
          </label>
          <input
            type="number"
            name="minPercentage"
            value={discountFormData.minPercentage}
            onChange={handleDiscountFormChange}
            min="0"
            max="100"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <Percent className="mr-2 text-blue-500" size={18} /> Max Percentage (%)
          </label>
          <input
            type="number"
            name="maxPercentage"
            value={discountFormData.maxPercentage}
            onChange={handleDiscountFormChange}
            min="0"
            max="100"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="mb-2 font-medium text-gray-700 flex items-center">
            <span className="mr-2">₹</span> Fixed Amount (INR)
          </label>
          <input
            type="number"
            name="fixedAmount"
            value={discountFormData.fixedAmount}
            onChange={handleDiscountFormChange}
            min="0"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="mr-2" size={18} /> Submit
          </button>
          <button
            type="button"
            onClick={() => {
              setDiscountFormData({ courseId: '', minPercentage: '', maxPercentage: '', fixedAmount: '' });
              setEditingId(null);
            }}
            className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
          >
            <X className="mr-2" size={18} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );

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

  const renderQuestionsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-4 text-left text-sm font-semibold">Main Heading</th>
            <th className="p-4 text-left text-sm font-semibold">Questions Count</th>
            <th className="p-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No question sets available
              </td>
            </tr>
          ) : (
            questions.map((q, index) => (
              <tr
                key={q._id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
              >
                <td className="p-4 text-gray-700">{q.mainHeading}</td>
                <td className="p-4 text-gray-700">{q.questions.length}</td>
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
            <th className="p-4 text-left text-sm font-semibold">Course</th>
            <th className="p-4 text-left text-sm font-semibold">Min %</th>
            <th className="p-4 text-left text-sm font-semibold">Max %</th>
            <th className="p-4 text-left text-sm font-semibold">Fixed Amount (INR)</th>
            <th className="p-4 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No discounts available
              </td>
            </tr>
          ) : (
            discounts.map((d, index) => (
              <tr
                key={d._id}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
              >
                <td className="p-4 text-gray-700">{d.courseId?.courseName || 'N/A'}</td>
                <td className="p-4 text-gray-700">{d.minPercentage ?? 'N/A'}</td>
                <td className="p-4 text-gray-700">{d.maxPercentage ?? 'N/A'}</td>
                <td className="p-4 text-gray-700">
                  {typeof d.fixedAmount === 'number' && !isNaN(d.fixedAmount) 
                    ? `₹${d.fixedAmount.toFixed(2)}` 
                    : 'N/A'}
                </td>
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

// AdminPage.js

const renderStudentsTable = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4 text-left text-sm font-semibold">Email</th>
              <th className="p-4 text-left text-sm font-semibold">Phone</th>
              <th className="p-4 text-left text-sm font-semibold">Test Name</th>
              <th className="p-4 text-left text-sm font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              tests.map((test, index) => (
                <tr
                  key={test._id || index}
                  className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition duration-150`}
                >
                  <td className="p-4 text-gray-700">{test.email || 'N/A'}</td>
                  <td className="p-4 text-gray-700">{test.phone || 'N/A'}</td>
                  <td className="p-4 text-gray-700">{test.questionSetId?.mainHeading || 'N/A'}</td>
                  <td className="p-4 text-gray-700">{test.score ?? '0'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


  const renderFormContainer = () => {
    if (currentTab === 'courses') return renderCourseForm();
    if (currentTab === 'questions') return renderQuestionForm();
    if (currentTab === 'discounts') return renderDiscountForm();
    if (currentTab === 'students') return null;
  };

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
          {renderFormContainer()}
        </div>
        <div className={`lg:w-2/3 bg-white rounded-xl shadow-2xl p-8 ${currentTab === 'students' ? 'w-full lg:w-full' : ''}`}>
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { tab: 'courses', icon: BookOpen, label: 'Courses' },
              { tab: 'questions', icon: Info, label: 'Questions' },
              { tab: 'discounts', icon: Percent, label: 'Discounts' },
              { tab: 'students', icon: User, label: 'Attendance' },
              { tab: 'payment-history', icon: CreditCard, label: 'Payment' },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => tab === 'payment-history' ? navigateToPaymentHistory() : switchTab(tab)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition duration-200 flex items-center justify-center ${
                  currentTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2" size={18} /> {label}
              </button>
            ))}
          </div>
          <div className="transition-all duration-300">
            {currentTab === 'courses' && renderCoursesTable()}
            {currentTab === 'questions' && renderQuestionsTable()}
            {currentTab === 'discounts' && renderDiscountsTable()}
            {currentTab === 'students' && renderStudentsTable()}
          </div>
        </div>
      </div>
      <style jsx="true">{`
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-20px) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;