// src/components/PlanSection.jsx
import { useEffect, useState, useContext } from 'react';
import { CheckCircle, User, Download, FileText, CreditCard } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { TestResultContext } from '../context/TestResultContext';

const courses = [
  {
    title: 'Digital Marketing Pro Course',
    price: 14999,
    duration: '2 Months | Live + Recorded',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience:
      'College students, small business owners, influencers, freelancers & anyone looking to earn part-time/full-time via digital marketing.',
  },
  {
    title: 'Full Stack Development Course',
    price: 18999,
    duration: '3 Months',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience:
      'College students, freshers, aspiring web developers, and freelancers aiming for high-demand developer jobs.',
  },
  {
    title: 'Video Editing + YouTube Content Creation',
    price: 9999,
    duration: '1.5 Months',
    mode: 'Online / Offline',
    language: 'Tamil & English',
    audience:
      'Aspiring creators, influencers, freelancers, and students looking to make money through video and content platforms.',
  },
];

export default function PlanSection() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { testResult } = useContext(TestResultContext);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const alertComingSoon = (msg) => () => alert(msg);

  // Merge test results with course data
  const updatedCourses = courses.map((course) => {
    if (testResult && testResult.courses) {
      const matchedCourse = testResult.courses.find((c) => c.course.trim() === course.title.trim());
      if (matchedCourse) {
        return {
          ...course,
          originalPrice: matchedCourse.originalFee,
          discountedPrice: matchedCourse.discountedFee,
          discount: matchedCourse.discount,
        };
      }
    }
    return { ...course, originalPrice: course.price, discountedPrice: course.price, discount: '0%' };
  });

  return (
    <section
      id="plan"
      className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-tl from-black via-slate-900 to-black"
    >
      <div className="container max-w-screen-xl px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white">
            Course Details – <span className="text-yellow-400">Scholarship Based</span>
          </h1>
          {testResult && (
            <div className="mt-4 text-green-400">
              <p className="text-xl font-bold">Your Score: {testResult.score}</p>
              <p>Percentage: {testResult.percentage}%</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {updatedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-gradient-to-tr from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm flex flex-col shadow-xl transition-transform"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-center border-b border-gray-700 pb-4 mb-4">
                <h3 className="text-xl font-bold text-white min-h-[50px] mb-4">{course.title}</h3>
                <div className="flex flex-wrap justify-center gap-2 items-center">
                  <span className="text-3xl font-extrabold text-yellow-400">
                    ₹{course.discountedPrice.toFixed(2)}
                  </span>
                  {course.discount !== '0%' && (
                    <span className="text-lg line-through text-red-400">
                      ₹{course.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {course.discount !== '0%' && (
                    <span className="text-sm text-green-400">({course.discount} off)</span>
                  )}
                </div>
              </div>
              <ul className="text-gray-300 space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Duration: {course.duration}</span>
                </li>
                {course.mode && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-400 mt-1" size={18} />
                    <span>Mode: {course.mode}</span>
                  </li>
                )}
                {course.language && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-400 mt-1" size={18} />
                    <span>Language: {course.language}</span>
                  </li>
                )}
              </ul>
              <div className="flex items-start gap-2 text-gray-400 text-sm mb-6">
                <User className="mt-1" size={18} />
                <div>
                  <strong className="block text-white">Who is this for?</strong>
                  {course.audience}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={alertComingSoon('Download Brochure coming soon!')}
                  className="w-full border border-gray-600 text-gray-300 rounded-md py-2 hover:bg-yellow-100/10 hover:border-yellow-300 hover:text-yellow-300 transition"
                >
                  <Download size={16} className="inline-block mr-2" />
                  View Brochure
                </button>
                <button
                  onClick={alertComingSoon('Syllabus will be available soon!')}
                  className="w-full border border-gray-600 text-gray-300 rounded-md py-2 hover:bg-yellow-100/10 hover:border-yellow-300 hover:text-yellow-300 transition"
                >
                  <FileText size={16} className="inline-block mr-2" />
                  View Syllabus
                </button>
                <button
                  onClick={alertComingSoon('Payment link coming soon!')}
                  className="w-full bg-gray-700 text-white font-semibold rounded-md py-2 hover:bg-gray-600 transition"
                >
                  <CreditCard size={16} className="inline-block mr-2" />
                  Pay via UPI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}