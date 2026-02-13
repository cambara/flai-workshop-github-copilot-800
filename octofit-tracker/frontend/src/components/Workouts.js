import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/workouts/` 
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API Response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts data:', workoutsData);
        
        setWorkouts(workoutsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading workouts...</p>
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

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'danger'
    };
    return badges[difficulty] || 'secondary';
  };

  return (
    <div className="container mt-4">
      <h2>💪 Suggested Workouts</h2>
      <p className="text-muted mb-4">Personalized workout recommendations for your fitness journey</p>
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No workouts available yet. Check back soon!
        </div>
      ) : (
        <div className="row">
          {workouts.map(workout => (
            <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{workout.name}</h5>
                  <p className="card-text text-muted">{workout.description}</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>🏃 Type:</strong>
                      <span className="badge bg-info ms-2">{workout.workout_type}</span>
                    </li>
                    <li className="list-group-item">
                      <strong>📊 Difficulty:</strong>
                      <span className={`badge bg-${getDifficultyBadge(workout.difficulty_level)} ms-2`}>
                        {workout.difficulty_level}
                      </span>
                    </li>
                    <li className="list-group-item">
                      <strong>⏱️ Duration:</strong> {workout.duration_minutes} min
                    </li>
                    <li className="list-group-item">
                      <strong>🔥 Calories:</strong>
                      <span className="badge bg-warning text-dark ms-2">
                        {workout.estimated_calories} cal
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <button className="btn btn-primary w-100">Start Workout</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3">
        <p className="text-muted">Available Workouts: <strong>{workouts.length}</strong></p>
      </div>
    </div>
  );
}

export default Workouts;
