import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../components/Dashboard/Dashboard';
import Header from '../components/Common/Header';
import Sidebar from '../components/Common/Sidebar';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
