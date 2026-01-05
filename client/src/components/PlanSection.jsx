import { useEffect, useState, useContext } from 'react';
import { CheckCircle, Download, FileText, CreditCard, X } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { TestResultContext } from '../context/TestResultContext';
import ReactConfetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

const courses = [
  {
    title: 'Digital Marketing Pro Course',
    price: 14999,
    duration: '2 Months | Live + Recorded',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience: 'College students, small business owners, influencers, freelancers & anyone looking to earn part-time/full-time via digital marketing.',
  },
  {
    title: 'Full Stack Development Course',
    price: 18999,
    duration: '3 Months',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience: 'College students, freshers, aspiring web developers, and freelancers aiming for high-demand developer jobs.',
  },
  {
    title: 'Video Editing + YouTube Content Creation',
    price: 9999,
    duration: '1.5 Months',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience: 'Aspiring creators, influencers, freelancers, and students who want to earn via video editing & content platforms.',
  },
];

export default function PlanSection() {
  const { testResult } = useContext(TestResultContext);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { width, height } = useWindowSize();
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(null); // State for loading animation

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const notify = (message, type = 'error') => {
    toast[type](message, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const alertComingSoon = (msg) => () => notify(msg, 'info');

  const handlePayment = async (course) => {
    if (!testResult?.email || !testResult?.phone) {
      notify('Please complete the Test first to proceed with payment.');
      return;
    }

    setLoadingCourse(course.title); // Activate loading animation

    try {
      const response = await axios.post(`${API_URL}/create-order`, {
        email: testResult.email,
        phone: testResult.phone,
        courseName: course.title,
        amount: course.fixedAmount,
      });

      const { orderId, amount, currency, key } = response.data;

      const options = {
        key,
        amount,
        currency,
        name: 'Course Enrollment',
        description: `Payment for ${course.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${API_URL}/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.status === 'success') {
              setPaymentInfo({
                course: course.title,
                amount: course.fixedAmount,
                email: testResult.email,
                phone: testResult.phone,
                paymentId: response.razorpay_payment_id,
              });
              setShowSuccessModal(true);
              setIsConfettiActive(true);
              setLoadingCourse(null); // Deactivate loading animation on success
              setTimeout(() => {
                setIsConfettiActive(false);
                window.location.href = 'https://wa.me/919944940051?text=Payment%20successful%20for%20' + encodeURIComponent(course.title);
              }, 8000);
            } else {
              notify('Payment verification failed.');
              setLoadingCourse(null); // Deactivate loading on failure
            }
          } catch (err) {
            notify('Payment verification failed. Please contact support.');
            setLoadingCourse(null); // Deactivate loading on error
          }
        },
        prefill: {
          email: testResult.email,
          contact: testResult.phone,
        },
        theme: { color: '#F4D03F' },
        modal: {
          ondismiss: function () {
            setLoadingCourse(null); // Deactivate loading if user closes modal
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setLoadingCourse(null); // Deactivate loading on explicit payment failure
      });
      rzp.open();
    } catch (err) {
      notify('Failed to initiate payment. Please try again.');
      setLoadingCourse(null); // Deactivate loading on initial API error
    }
  };

  const updatedCourses = courses.map((course) => {
    if (testResult?.courses) {
      const matchedCourse = testResult.courses.find(
        (c) => c.course.trim() === course.title.trim()
      );
      if (matchedCourse) {
        return {
          ...course,
          originalPrice: matchedCourse.originalFee,
          fixedAmount: matchedCourse.fixedAmount,
          discountApplied: matchedCourse.discountApplied,
        };
      }
    }
    return {
      ...course,
      originalPrice: course.price,
      fixedAmount: course.price,
      discountApplied: false,
    };
  });

  return (
    <section
      id="plan"
      className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-tl from-black via-slate-900 to-black relative"
    >
      <ToastContainer />
      <div className="container max-w-screen-xl px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white">
            Course Details – <span className="text-yellow-400">Scholarship Based</span>
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {updatedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-center border-b border-gray-700 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white mb-4">{course.title}</h3>
                <div className="flex justify-center gap-2 items-center">
                  <span className="text-3xl font-extrabold text-yellow-400">
                    ₹{course.fixedAmount.toFixed(2)}
                  </span>
                  {course.discountApplied && (
                    <>
                      <span className="line-through text-red-400 text-lg">
                        ₹{course.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-green-400">({testResult.percentage}%)</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="text-gray-300 space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Duration: {course.duration}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Mode: {course.mode}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Language: {course.language}</span>
                </li>
              </ul>

              <div className="text-sm text-gray-400 mb-6">
                <strong className="block text-white">“Ideal For:”</strong>
                {course.audience}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={alertComingSoon('Brochure coming soon!')}
                  className="w-full border border-gray-600 text-gray-300 rounded-md py-2 hover:bg-yellow-100/10 hover:border-yellow-300 hover:text-yellow-300 transition flex items-center justify-center"
                >
                  <Download size={16} className="mr-2" />
                  View Brochure
                </button>
                <button
                  onClick={alertComingSoon('Syllabus will be available soon!')}
                  className="w-full border border-gray-600 text-gray-300 rounded-md py-2 hover:bg-yellow-100/10 hover:border-yellow-300 hover:text-yellow-300 transition flex items-center justify-center"
                >
                  <FileText size={16} className="mr-2" />
                  View Syllabus
                </button>
                <button
                  onClick={() => handlePayment(course)}
                  disabled={loadingCourse === course.title}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-md py-2 hover:opacity-90 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loadingCourse === course.title ? (
                    <>
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} className="mr-2" />
                      Enroll Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSuccessModal && (
        <>
          {isConfettiActive && (
            <ReactConfetti
              width={width}
              height={height}
              numberOfPieces={800}
              recycle={false}
              style={{
                position: 'fixed',
                zIndex: 100,
                pointerEvents: 'none'
              }}
              onConfettiComplete={() => setIsConfettiActive(false)}
            />
          )}
          <div
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full relative overflow-hidden pointer-events-auto"
              data-aos="zoom-in"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-400/10 rounded-full blur-xl"></div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-400" size={48} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-300 mb-6">
                  You're now enrolled in <span className="text-yellow-400 font-medium">{paymentInfo?.course}</span>
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Amount Paid:</span>
                    <span className="font-medium text-gray-200">₹{paymentInfo?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-green-400 font-mono text-sm">{paymentInfo?.paymentId}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                >
                  Continue to Dashboard
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  We've sent the details to {paymentInfo?.email}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
