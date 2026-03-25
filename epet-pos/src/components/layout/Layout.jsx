import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">EPetHub POS</div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li><a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a></li>
            <li><a href="/products" className="block p-2 hover:bg-gray-700 rounded">Products</a></li>
            <li><a href="/customers" className="block p-2 hover:bg-gray-700 rounded">Customers</a></li>
            <li><a href="/sales" className="block p-2 hover:bg-gray-700 rounded">Sales</a></li>
            <li><a href="/inventory" className="block p-2 hover:bg-gray-700 rounded">Inventory</a></li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm mb-2">{currentUser?.email}</div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default Layout;