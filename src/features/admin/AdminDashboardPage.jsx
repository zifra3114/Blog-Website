import { useState } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

const AdminDashboardPage = () => {
  useDocumentTitle('Admin Dashboard');
  const [activeTab, setActiveTab] = useState('overview');

  // Placeholder — admin features need dedicated backend endpoints
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-500 mb-8">
        Manage your platform and monitor activity.
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
        {['overview', 'users', 'posts', 'reports'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '—', color: 'blue' },
            { label: 'Total Posts', value: '—', color: 'green' },
            { label: 'Active Today', value: '—', color: 'yellow' },
            { label: 'Reports', value: '—', color: 'red' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Admin Features Coming Soon
        </h3>
        <p className="text-sm text-gray-500">
          User management, content moderation, and analytics endpoints need to be
          added to the backend.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
