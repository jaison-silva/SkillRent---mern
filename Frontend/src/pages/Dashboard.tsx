import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import UserDashboardPage from '../features/user/pages/userDashboardPage';
import ProviderDashboardPage from '../features/provider/pages/providerDashboardPage';
import AdminDashboardPage from '../features/admin/pages/adminDashboardPage';
import UserProfilePage from '../features/user/pages/userProfilePage';
import ProviderProfilePage from '../features/provider/pages/providerProfilePage';
import { useState } from 'react';

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');

  if (!user) {
    return <div className="p-20 text-center text-gray-500">Please sign in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Top Banner (Optional generic nav) */}
      {/* Top Banner & Navigation */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-12">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">SkillRent WorkSpace</h1>
            
            {user.role !== 'admin' && (
              <nav className="hidden md:flex space-x-8">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`text-sm font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 mb:-mb-5' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`text-sm font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 mb:-mb-5' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  My Profile
                </button>
              </nav>
            )}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest">{user.role} Account</span>
        </div>
      </div>

      {/* Conditional Dashboard Rendering */}
      <main className="p-4">
        {user.role === 'admin' && <AdminDashboardPage />}
        
        {user.role === 'provider' && activeTab === 'dashboard' && <ProviderDashboardPage />}
        {user.role === 'provider' && activeTab === 'profile' && <ProviderProfilePage />}

        {user.role === 'user' && activeTab === 'dashboard' && <UserDashboardPage />}
        {user.role === 'user' && activeTab === 'profile' && <UserProfilePage />}
      </main>
    </div>
  );
}
