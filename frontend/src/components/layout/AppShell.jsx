import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppShell = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div className="app-container">{children}</div>;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-viewport">
        <Navbar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};
