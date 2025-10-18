import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Calendar, label: 'Calendar' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-luna-pink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Moon className="w-8 h-8 text-luna-pink-500" />
            <h1 className="text-xl font-bold text-luna-lavender-800">Her Easy Day</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-luna-pink-500 text-white'
                    : 'text-luna-lavender-700 hover:bg-luna-pink-50 hover:text-luna-pink-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-luna-pink-100">
              <span className="text-sm text-luna-lavender-600">
                {user?.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-3 py-2 text-luna-lavender-700 hover:bg-luna-pink-50 hover:text-luna-pink-600 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;