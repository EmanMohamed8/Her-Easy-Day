import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ConfirmSignUpFormProps {
  username: string;
  onBackToSignUp: () => void;
  onConfirmSuccess: () => void;
}

const ConfirmSignUpForm: React.FC<ConfirmSignUpFormProps> = ({ 
  username, 
  onBackToSignUp, 
  onConfirmSuccess 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { confirmSignUp, resendConfirmationCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmSignUp(username, code);
      setSuccess('Email confirmed successfully! You can now sign in.');
      setTimeout(() => {
        onConfirmSuccess();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to confirm email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');
    setSuccess('');

    try {
      await resendConfirmationCode(username);
      setSuccess('Confirmation code sent! Check your email.');
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-luna-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-luna-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-luna-lavender-800 mb-2">Check Your Email</h2>
        <p className="text-luna-lavender-600">
          We sent a confirmation code to <strong>{username}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Confirmation Code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 border border-luna-lavender-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent text-center text-lg tracking-widest"
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-luna-pink-500 text-white py-3 px-4 rounded-lg hover:bg-luna-pink-600 focus:ring-2 focus:ring-luna-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Confirming...' : 'Confirm Email'}
        </button>

        <div className="text-center space-y-3">
          <p className="text-luna-lavender-600 text-sm">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-luna-pink-600 hover:text-luna-pink-700 font-medium disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          </p>
          
          <button
            type="button"
            onClick={onBackToSignUp}
            className="flex items-center justify-center space-x-2 text-luna-lavender-600 hover:text-luna-lavender-700 text-sm mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign up</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmSignUpForm;