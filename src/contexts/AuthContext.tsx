import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signUp, signOut, confirmSignUp, resendSignUpCode, resetPassword, confirmResetPassword, getCurrentUser } from 'aws-amplify/auth';

interface User {
  username: string;
  email: string;
  attributes: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<any>;
  signUp: (username: string, password: string, email: string) => Promise<any>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<any>;
  resendConfirmationCode: (username: string) => Promise<any>;
  forgotPassword: (username: string) => Promise<any>;
  forgotPasswordSubmit: (username: string, code: string, newPassword: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser({
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || '',
        attributes: currentUser
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      const result = await signIn({ username, password });
      await checkAuthState();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (username: string, password: string, email: string) => {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      const result = await confirmSignUp({ username, confirmationCode: code });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleResendConfirmationCode = async (username: string) => {
    try {
      const result = await resendSignUpCode({ username });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleForgotPassword = async (username: string) => {
    try {
      const result = await resetPassword({ username });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleForgotPasswordSubmit = async (username: string, code: string, newPassword: string) => {
    try {
      const result = await confirmResetPassword({ 
        username, 
        confirmationCode: code, 
        newPassword 
      });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    confirmSignUp: handleConfirmSignUp,
    resendConfirmationCode: handleResendConfirmationCode,
    forgotPassword: handleForgotPassword,
    forgotPasswordSubmit: handleForgotPasswordSubmit
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};