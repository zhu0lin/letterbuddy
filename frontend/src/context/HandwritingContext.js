'use client';

import { createContext, useContext, useState } from 'react';

const HandwritingContext = createContext();

export function HandwritingProvider({ children }) {
  const [handwritingSamples, setHandwritingSamples] = useState([]);

  const addHandwritingSample = (newSample) => {
    setHandwritingSamples(prev => [newSample, ...prev]);
  };

  const value = {
    handwritingSamples,
    addHandwritingSample,
  };

  return (
    <HandwritingContext.Provider value={value}>
      {children}
    </HandwritingContext.Provider>
  );
}

export function useHandwriting() {
  const context = useContext(HandwritingContext);
  if (!context) {
    throw new Error('useHandwriting must be used within a HandwritingProvider');
  }
  return context;
}
