import React, { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { fetchPatternData, countTotalProblems, countSolvedProblems, loadUserData } from '../services/dataService';
import { isAdmin } from '../utils/auth';
import Header from './Header';
import StatsContainer from './StatsContainer';
import PatternsContainer from './PatternsContainer';
import PopulateDatabase from './PopulateDatabase';
import LoadingSpinner from './LoadingSpinner';
import '../styles/MainApp.css';

const MainApp = ({ user }) => {
  const [patterns, setPatterns] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState({});
  const [totalProblems, setTotalProblems] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopulate, setShowPopulate] = useState(false);

  const updateStatistics = useCallback(async () => {
    try {
      const total = await countTotalProblems();
      const solved = await countSolvedProblems(user.uid);

      setTotalProblems(total);
      setSolvedCount(solved);
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  }, [user.uid]);

  const initializeApp = useCallback(async () => {
    try {
      setLoading(true);

      // Load user data
      const userData = await loadUserData(user.uid);
      setSolvedProblems(userData.solvedProblems || {});

      // Load patterns
      const patternsData = await fetchPatternData();
      setPatterns(patternsData);

      // Update statistics
      await updateStatistics();
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setLoading(false);
    }
  }, [user.uid, updateStatistics]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProblemToggle = (problemId, isSolved) => {
    setSolvedProblems(prev => ({
      ...prev,
      [problemId]: isSolved
    }));

    // Update solved count immediately for better UX
    setSolvedCount(prev => isSolved ? prev + 1 : prev - 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="main-app">
      <Header
        user={user}
        onLogout={handleLogout}
        showPopulateBtn={isAdmin(user.email)}
        onShowPopulate={() => setShowPopulate(true)}
      />

      <div className="container">
        <StatsContainer
          totalProblems={totalProblems}
          solvedProblems={solvedCount}
        />

        <PatternsContainer
          patterns={patterns}
          solvedProblems={solvedProblems}
          onProblemToggle={handleProblemToggle}
          userId={user.uid}
        />
      </div>

      {showPopulate && (
        <PopulateDatabase
          onClose={() => setShowPopulate(false)}
          onComplete={initializeApp}
        />
      )}
    </div>
  );
};

export default MainApp;