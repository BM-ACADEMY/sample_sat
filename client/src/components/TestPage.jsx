import { useEffect, useState } from 'react';
import axios from 'axios';

// Use VITE_API_URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Phone validation regex (exactly 10 digits)
  const phoneRegex = /^\d{10}$/;

  useEffect(() => {
    axios
      .get(`${API_URL}/questions`)
      .then((res) => setQuestions(res.data))
      .catch(() => alert('Failed to load questions. Please check your backend.'));
  }, []);

  // Validate email on change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Validate phone number (exactly 10 digits)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Allow only digits
    setPhone(value);
    
    if (!value) {
      setPhoneError('Phone number is required');
    } else if (!phoneRegex.test(value)) {
      setPhoneError('Phone number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  const handleOptionChange = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (!email || !phone || emailError || phoneError) {
      alert('Please correct the errors in Email and Phone Number fields.');
      return;
    }

    let score = 0;
    const answerSheet = {};

    questions.forEach((q) => {
      const userAnswer = answers[q._id]?.trim().toLowerCase();
      const correct = q.correctAnswer?.trim().toLowerCase();
      answerSheet[q._id] = answers[q._id] || '';
      if (userAnswer === correct) score++;
    });

    try {
      const res = await axios.post(`${API_URL}/submit-test`, {
        email,
        phone, // Send 10-digit phone number as is
        answers: answerSheet,
        score,
      });

      const data = res.data;

      // Send result to parent
      window.parent.postMessage(
        {
          type: 'testSubmitted',
          score: data.score,
          percentage: data.percentage,
          courses: data.courses,
        },
        '*'
      );

      setSubmitted(true);
    } catch (err) {
      alert('Submission failed. Please check your backend.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Student Test</h2>
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <input
              type="email"
              className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${
                emailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter your Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>
          <div>
            <input
              type="tel"
              className={`border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 ${
                phoneError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Enter 10-digit Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              maxLength={10} // Restrict to 10 digits
              required
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>
        </div>
        <div className="space-y-4 mb-6">
          {questions.map((q) => (
            <div key={q._id} className="border border-gray-200 p-4 rounded bg-gray-50">
              <p className="font-medium mb-2">{q.question}</p>
              {q.options.map((opt, idx) => (
                <label key={idx} className="block mb-1">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={() => handleOptionChange(q._id, opt)}
                    className="mr-2 accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            submitted || emailError || phoneError
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={submitted || emailError || phoneError}
        >
          {submitted ? 'Test Submitted' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
};

export default TestPage;