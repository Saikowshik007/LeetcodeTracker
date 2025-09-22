import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={user ? <Navigate to="/" replace /> : <AuthPage />}
          />
          <Route
            path="/"
            element={user ? <MainApp user={user} /> : <Navigate to="/auth" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;