// src/components/SatTest.jsx
import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { TestResultContext } from '../context/TestResultContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SatTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { testResult, setTestResult } = useContext(TestResultContext);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleMessage = (event) => {
      if (event.data.type === 'testSubmitted') {
        const { score, percentage, courses, email, phone } = event.data;
        setTestResult({ score, percentage, courses, email, phone });
        setIsModalOpen(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setTestResult]);

  return (
    <section className="py-24 bg-gradient-to-tr from-black via-slate-900 to-black">
      <div className="container mx-auto px-4">
        <div
          className="max-w-3xl mx-auto bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl p-12 text-center"
          data-aos="fade-up"
        >
          <div className="mb-6" data-aos="zoom-in">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          </div>
          <p
            className="text-[#facc15] font-semibold uppercase tracking-widest mb-2"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Free SAT Test
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-gray-200 mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover Your <span className="text-[#facc15]">Potential SAT Score</span>
          </h2>
          <p
            className="text-gray-200 mb-10 text-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Take our quick test and unlock your estimated{' '}
            <span className="font-semibold text-[#facc15]">SAT score</span>.<br className="hidden md:block" />
            Plus, find out if you qualify for{' '}
            <span className="font-semibold text-[#facc15]">exclusive fee reductions</span>!
          </p>
          <div data-aos="zoom-in" data-aos-delay="400">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Take the Free Test
            </button>
          </div>
        </div>

        {/* 🎯 Test Result Section */}
        {testResult && (
          <div
            className="relative mt-12 max-w-3xl mx-auto bg-green-50/ p-8 rounded-xl text-center shadow-xl border border-green-300"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <h3 className="text-2xl font-bold text-green-700 mb-2">🎉 Your SAT Test Result</h3>
            <p className="text-lg font-medium text-gray-800">
              Score: <span className="font-bold">{testResult.score}</span>
            </p>
            <p className="text-lg font-medium text-gray-800">
              Percentage: <span className="font-bold">{testResult.percentage}%</span>
            </p>
          </div>
        )}
      </div>

      {/* 🧪 Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden"
            data-aos="zoom-in"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src="/test"
              className="w-full h-[80vh] rounded-b-xl"
              frameBorder="0"
              title="Quiz"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default SatTest;
