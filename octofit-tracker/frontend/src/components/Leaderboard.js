import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/` 
          : 'http://localhost:8000/api/leaderboard/';
        
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard data:', leaderboardData);
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading leaderboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-badge rank-1';
    if (index === 1) return 'rank-badge rank-2';
    if (index === 2) return 'rank-badge rank-3';
    return 'rank-badge rank-other';
  };

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  return (
    <div className="container mt-4">
      <h2>🏅 Leaderboard</h2>
      <p className="text-muted mb-4">Top performers in the OctoFit community</p>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th width="80">Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Total Points</th>
              <th>Activities</th>
              <th>Calories Burned</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No leaderboard data available yet
                </td>
              </tr>
            ) : (
              leaderboard.map((entry, index) => (
                <tr key={entry.id}>
                  <td>
                    <div className={getRankBadgeClass(index)}>
                      {getRankEmoji(index)}
                    </div>
                  </td>
                  <td><strong>{entry.user_username || 'N/A'}</strong></td>
                  <td>
                    {entry.team_name ? (
                      <span className="badge bg-primary">{entry.team_name}</span>
                    ) : (
                      <span className="badge bg-secondary">No Team</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-success">{entry.total_points} pts</span>
                  </td>
                  <td>{entry.total_activities}</td>
                  <td>
                    <span className="badge bg-warning text-dark">{entry.total_calories} cal</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3">
        <p className="text-muted">Total Participants: <strong>{leaderboard.length}</strong></p>
      </div>
    </div>
  );
}

export default Leaderboard;
