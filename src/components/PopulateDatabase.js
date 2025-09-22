import React, { useState } from 'react';
import { populateDatabase } from '../services/populateService';

const PopulateDatabase = ({ onClose, onComplete }) => {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePopulate = async () => {
    if (!rawData.trim()) {
      setMessage('Please enter the pattern data.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await populateDatabase(rawData);
      setMessage('Database populated successfully!');
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Populate Firebase Database</h2>

        <textarea
          value={rawData}
          onChange={(e) => setRawData(e.target.value)}
          placeholder="Paste the raw LeetCode pattern data here..."
          rows={15}
          disabled={loading}
        />

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="popup-buttons">
          <button
            className="btn btn-primary"
            onClick={handlePopulate}
            disabled={loading}
          >
            {loading ? 'Populating...' : 'Populate Database'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopulateDatabase;