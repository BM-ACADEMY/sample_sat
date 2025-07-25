// src/components/SatTest.jsx
import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { TestResultContext } from '../context/TestResultContext';

const SatTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setTestResult } = useContext(TestResultContext);

  useEffect(() => {
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
        <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl p-12 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          </div>
          <p className="text-[#facc15] font-semibold uppercase tracking-widest mb-2">
            Free SAT Test
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-200 mb-4">
            Discover Your <span className="text-[#facc15]">Potential SAT Score</span>
          </h2>
          <p className="text-gray-200 mb-10 text-lg">
            Take our quick test and unlock your estimated{' '}
            <span className="font-semibold text-[#facc15]">SAT score</span>.
            <br className="hidden md:block" />
            Plus, find out if you qualify for{' '}
            <span className="font-semibold text-[#facc15]">exclusive fee reductions</span>!
          </p>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Take the Free Test
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden">
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