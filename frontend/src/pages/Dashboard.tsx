import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Your Dashboard</h2>
          <p className="mt-2 text-gray-600">This is your protected dashboard. Expense management features will be built here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;