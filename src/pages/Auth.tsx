import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ConfirmSignUpForm from '../components/auth/ConfirmSignUpForm';

type AuthView = 'login' | 'signup' | 'confirm' | 'forgot-password';

const Auth: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [signUpUsername, setSignUpUsername] = useState('');

  const handleSignUpSuccess = (username: string) => {
    setSignUpUsername(username);
    setCurrentView('confirm');
  };

  const handleConfirmSuccess = () => {
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luna-pink-50 via-white to-luna-lavender-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-luna-lavender-800 mb-2">Her Easy Day</h1>
          <p className="text-luna-lavender-600">Your personal wellness companion</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentView === 'login' && (
            <LoginForm
              onSwitchToSignUp={() => setCurrentView('signup')}
              onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'signup' && (
            <SignUpForm
              onSwitchToLogin={() => setCurrentView('login')}
              onSignUpSuccess={handleSignUpSuccess}
            />
          )}

          {currentView === 'confirm' && (
            <ConfirmSignUpForm
              username={signUpUsername}
              onBackToSignUp={() => setCurrentView('signup')}
              onConfirmSuccess={handleConfirmSuccess}
            />
          )}
        </div>

        <div className="text-center mt-6 text-sm text-luna-lavender-500">
          <p>Track your mood, health, and daily goals with ease</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;