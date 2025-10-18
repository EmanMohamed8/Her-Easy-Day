import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import DayDetails from './pages/DayDetails';
import Profile from './pages/Profile';
import awsconfig from './aws-exports';

// Configure Amplify with your Cognito settings (commented out for testing)
// Amplify.configure(awsconfig);

interface AppProps {
  signOut?: () => void;
  user?: any;
}

function App({ signOut, user }: AppProps) {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-luna-pink-50 via-white to-luna-lavender-50">
        <Navigation signOut={signOut} user={user} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/day/:date" element={<DayDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Temporarily export without authentication for testing
// To enable authentication, uncomment the withAuthenticator export below
export default App;

// Export with AWS Cognito authentication wrapper (commented out for testing)
/*
export default withAuthenticator(App, {
  // Customize the authentication UI
  components: {
    Header() {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ 
            color: '#8B5A83', 
            fontSize: '2rem', 
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Her Easy Day 💖
          </h1>
          <p style={{ color: '#A78295' }}>
            Your personal wellness companion
          </p>
        </div>
      );
    },
  },
});
*/