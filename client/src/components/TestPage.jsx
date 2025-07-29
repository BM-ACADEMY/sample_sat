import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { TestResultContext } from "../context/TestResultContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const TestPage = () => {
  const { setTestResult } = useContext(TestResultContext);
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState("");
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email") || "",
    phone: localStorage.getItem("phone") || ""
  });
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState({
    isValid: false,
    messages: []
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/questions`)
      .then((res) => {
        const sets = Array.isArray(res.data) ? res.data : [];
        setQuestionSets(sets);
        if (sets.length > 0) {
          setSelectedSetId(sets[0]._id); // Select the first set by default
        }
      })
      .catch(() => {
        toast.error("Failed to load questions. Please try refreshing the page.");
        setQuestionSets([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? value.replace(/[^\d]/g, "") : value
    }));
  };

  const handleOptionChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSetChange = (e) => {
    setSelectedSetId(e.target.value);
    setAnswers({}); // Reset answers when changing question set
  };

  const validateForm = () => {
    const messages = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.email) {
      messages.push("Email is required");
    } else if (!emailRegex.test(formData.email)) {
      messages.push("Please enter a valid email address");
    }

    if (!formData.phone) {
      messages.push("Phone number is required");
    } else if (!phoneRegex.test(formData.phone)) {
      messages.push("Phone number must be exactly 10 digits");
    }

    if (!selectedSetId) {
      messages.push("Please select a question set");
    }

    const isValid = messages.length === 0;
    setValidation({ isValid, messages });
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      validation.messages.forEach((msg) => toast.warning(msg));
      return;
    }

    const selectedSet = questionSets.find((set) => set._id === selectedSetId);
    if (!selectedSet) {
      toast.error("Selected question set not found.");
      return;
    }

    const answerSheet = {};
    selectedSet.questions.forEach((q) => {
      answerSheet[q._id] = answers[q._id] || "";
    });

    try {
      const res = await axios.post(`${API_URL}/submit-test`, {
        email: formData.email,
        phone: formData.phone,
        answers: answerSheet,
        questionSetId: selectedSetId // Send questionSetId
      });

      localStorage.setItem("email", formData.email);
      localStorage.setItem("phone", formData.phone);

      setTestResult({
        score: res.data.score,
        percentage: res.data.percentage,
        courses: res.data.courses,
        email: formData.email,
        phone: formData.phone,
        questionSet: res.data.questionSet
      });

      window.parent.postMessage(
        {
          type: "testSubmitted",
          score: res.data.score,
          percentage: res.data.percentage,
          courses: res.data.courses,
          email: formData.email,
          phone: formData.phone,
          questionSet: res.data.questionSet
        },
        "*"
      );

      toast.success(`Test submitted successfully! Score: ${res.data.score}/100`);
      setSubmitted(true);

      // Clear the form and answers
      setFormData({ email: "", phone: "" });
      setAnswers({});
      localStorage.removeItem("email");
      localStorage.removeItem("phone");
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Submission failed. Please try again."
      );
    }
  };

  const selectedQuestionSet = questionSets.find((set) => set._id === selectedSetId) || {
    questions: [],
    mainHeading: ""
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-3xl font-bold text-center">Scholastic Assessment Test</h2>
          {/* <p className="text-center text-blue-100 mt-2">
            Select a question set and answer all questions to complete the 100-mark test
          </p> */}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Question Set
              </label>
              <select
                value={selectedSetId}
                onChange={handleSetChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select a question set
                </option>
                {questionSets.map((set) => (
                  <option key={set._id} value={set._id}>
                    {set.mainHeading}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  required
                />
              </div>
            </div>
          </div>

          {selectedSetId && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedQuestionSet.mainHeading}
              </h3>
              {selectedQuestionSet.questions.map((q, qIndex) => (
                <div
                  key={q._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow mb-4"
                >
                  <p className="font-semibold text-lg text-gray-800 mb-3">
                    <span className="text-blue-600 mr-2">Q{qIndex + 1}:</span>
                    {q.questionText}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                          answers[q._id] === opt
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q._id}
                          value={opt}
                          checked={answers[q._id] === opt}
                          onChange={() => handleOptionChange(q._id, opt)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitted || !selectedSetId}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${
              submitted || !selectedSetId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {submitted ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing Results...
              </span>
            ) : (
              "Submit Assessment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;