import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const courses = [
  {
    title: 'AI for School Students',
    audience: '8th–12th Std Students',
    original: '₹1,499',
    offer: '₹749',
    mode: 'Online/Offline',
  },
  {
    title: 'AI for College Students',
    audience: 'Final Year Students & Tech Learners',
    original: '₹1,999',
    offer: '₹999',
    mode: 'Online/Offline',
  },
  {
    title: 'AI for Job Seekers',
    audience: 'Freshers & Job Hunters',
    original: '₹1,999',
    offer: '₹999',
    mode: 'Online/Offline',
  },
  {
    title: 'AI for Entrepreneurs',
    audience: 'Startup Founders & Solo Business Owners',
    original: '₹2,499',
    offer: '₹1,299',
    mode: 'Online/Offline',
  },
  {
    title: 'AI for Digital Marketers',
    audience: 'Marketers, Freelancers & Media Teams',
    original: '₹2,499',
    offer: '₹1,299',
    mode: 'Online/Offline',
  },
];

const AICourseTable = () => {
  const [userDetails, setUserDetails] = useState({ email: '', phone: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load Razorpay script only once when the component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle WhatsApp redirect after 8 seconds in a new tab
  useEffect(() => {
    let timer;
    if (paymentId && selectedCourse) {
      timer = setTimeout(() => {
        const message = `Payment successful for ${selectedCourse.title}! Payment ID: ${paymentId}`;
        const whatsappUrl = `https://wa.me/+919944940051?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }, 8000);
    }
    return () => clearTimeout(timer);
  }, [paymentId, selectedCourse]);

  // Modified handlePayClick to clear userDetails every time the form is opened
  const handlePayClick = (course) => {
    setSelectedCourse(course);
    setUserDetails({ email: '', phone: '' }); // Clear input fields
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userDetails.email || !userDetails.phone) {
      toast.error('Please provide both email and phone number.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const amount = parseInt(selectedCourse.offer.replace('₹', ''));
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        email: userDetails.email,
        phone: userDetails.phone,
        courseName: selectedCourse.title,
        amount,
      });

      const data = response.data;
      if (!data.key || !data.orderId) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'AI Course Series',
        description: `Payment for ${selectedCourse.title}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verifyData = verifyResponse.data;
            if (verifyData.status === 'success') {
              setPaymentId(response.razorpay_payment_id);
              setShowForm(false);
              // Save user details to localStorage for next time (optional, as you want to clear on open)
              localStorage.setItem('userEmail', userDetails.email);
              localStorage.setItem('userPhone', userDetails.phone);
              // userDetails is already cleared by handlePayClick for the next open, but good to ensure here too if needed
              setUserDetails({ email: '', phone: '' });

              toast.success(
                <div>
                  <h2 className="text-lg font-semibold">Payment Successful!</h2>
                </div>,
                {
                  position: 'top-center',
                  autoClose: 8000,
                  closeOnClick: false,
                  draggable: false,
                  className: 'bg-white/90 backdrop-blur-sm',
                }
              );
            } else {
              toast.error('Payment verification failed. Please contact support.', {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Error verifying payment. Please contact support.', {
              position: 'top-right',
              autoClose: 3000,
            });
          } finally {
            setIsLoading(false); // End loading
          }
        },
        prefill: {
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#F4D03F',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false); // End loading
    }
  };

  return (
    <section className="bg-gradient-to-tr from-black via-slate-900 to-black py-12">
      <div className="container mx-auto px-6">
        <div className="header-text text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            AI Course Series –{' '}
            <span className="text-yellow-400">Pay & Join Instantly</span>
          </h1>
        </div>

        {/* Toast Container */}
        <ToastContainer />

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Enter Details for <span className="text-blue-600">{selectedCourse.title}</span>
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="tel"
                    autoComplete="tel"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition relative"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
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
                      </span>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white/10 rounded-lg shadow-xl p-6 backdrop-blur">
          <table className="min-w-full course-table text-sm text-gray-800">
            <thead>
              <tr className="bg-indigo-600 text-white uppercase text-sm leading-normal">
                <th className="py-4 px-6 text-left">Course</th>
                <th className="py-4 px-6 text-left">WHO IS IT FOR</th>
                <th className="py-4 px-6 text-left">ORIGINAL PRICE</th>
                <th className="py-4 px-6 text-left">OFFER PRICE</th>
                <th className="py-4 px-6 text-left">Mode</th>
                <th className="py-4 px-6 text-center">Brochure</th>
                <th className="py-4 px-6 text-center">PAY NOW</th>
                <th className="py-4 px-6 text-center">Syllabus</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-medium">
              {courses.map((course, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-200 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-indigo-600">
                    {course.title}
                  </td>
                  <td className="py-4 px-6">{course.audience}</td>
                  <td className="py-4 px-6 text-red-500 line-through">
                    {course.original}
                  </td>
                  <td className="py-4 px-6 text-green-500 font-bold">
                    {course.offer}
                  </td>
                  <td className="py-4 px-6">{course.mode}</td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href="#"
                      className="action-link text-blue-500 hover:text-blue-700"
                    >
                      📥 Download
                    </a>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handlePayClick(course)}
                      className="action-link text-green-500 hover:text-green-700"
                    >
                      💳 Pay
                    </button>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href="#"
                      className="action-link text-blue-500 hover:text-blue-700"
                    >
                      📄 View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AICourseTable;
