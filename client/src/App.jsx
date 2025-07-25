// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/Home';
import AboutSection from './components/AboutSection';
import PlanSection from './components/PlanSection';
import AICourseTable from './components/AICourseTable';
import ScholarshipSection from './components/ScholarshipSection';
import Testimonials from './components/Reviews';
import Footer from './components/Footer';
import { TestResultProvider } from './context/TestResultContext';
import AdminPage from './components/admin/SatTest';
import TestPage from './components/TestPage';
import SatTest from './components/SatTestSection';

const HomePage = () => (
  <div>
    <HeroSection />
    <AboutSection />
    <SatTest />
    <PlanSection />
    <AICourseTable />
    <ScholarshipSection />
    <Testimonials />
    <Footer />
  </div>
);

const App = () => {
  return (
    <TestResultProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Router>
    </TestResultProvider>
  );
};

export default App;