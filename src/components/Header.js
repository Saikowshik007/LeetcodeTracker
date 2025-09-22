import React from 'react';

const Header = ({ user, onLogout, showPopulateBtn, onShowPopulate }) => {
  return (
    <header className="app-header">
      <div className="container">
        <h1>LeetCode Pattern Tracker</h1>
        <div className="user-info">
          <span className="user-email">{user.email}</span>
          {showPopulateBtn && (
            <button
              className="btn btn-small btn-secondary"
              onClick={onShowPopulate}
            >
              Populate DB
            </button>
          )}
          <button
            className="btn btn-small"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;