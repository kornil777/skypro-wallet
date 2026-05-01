import React, { createContext, useContext, useState } from 'react';

const PageNameContext = createContext();

export const PageNameProvider = ({ children }) => {
  const [pageNameInNav, setPageNameInNav] = useState('Мои расходы');

  return (
    <PageNameContext.Provider value={{ pageNameInNav, setPageNameInNav }}>
      {children}
    </PageNameContext.Provider>
  );
};

export const usePageName = () => {
  const context = useContext(PageNameContext);
  if (!context) {
    throw new Error('usePageName must be used within a PageNameProvider');
  }
  return context;
};