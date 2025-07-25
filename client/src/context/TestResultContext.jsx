// src/context/TestResultContext.jsx
import React, { createContext, useState } from 'react';

export const TestResultContext = createContext();

export const TestResultProvider = ({ children }) => {
  const [testResult, setTestResult] = useState(null); // will store: score, percentage, courses, email, phone

  return (
    <TestResultContext.Provider value={{ testResult, setTestResult }}>
      {children}
    </TestResultContext.Provider>
  );
};
