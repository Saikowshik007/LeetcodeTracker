import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../firebase/config';
import '../styles/Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document for new users
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          solvedProblems: {}
        });
      }

      // Clear form
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result._tokenResponse?.isNewUser;

      if (isNewUser) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          createdAt: serverTimestamp(),
          solvedProblems: {}
        });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>LeetCode Pattern Tracker</h1>

        <div className="auth-form-container">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleEmailAuth}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="social-auth">
            <p>Or {isLogin ? 'login' : 'sign up'} with:</p>
            <div className="social-buttons">
              <button
                className="btn btn-social btn-google"
                onClick={() => handleSocialAuth(googleProvider)}
                disabled={loading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                Google
              </button>
              <button
                className="btn btn-social btn-github"
                onClick={() => handleSocialAuth(githubProvider)}
                disabled={loading}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg" alt="GitHub" />
                GitHub
              </button>
            </div>
          </div>

          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="link-button"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;