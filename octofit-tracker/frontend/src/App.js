import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
        <h1>🏃‍♂️ Welcome to OctoFit Tracker</h1>
        <p className="lead">Track your fitness activities, compete with your team, and achieve your goals!</p>
      </div>
      
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{fontSize: '3rem'}}>📊</div>
              <h5 className="card-title mt-3">Track Activities</h5>
              <p className="card-text">Log your daily workouts and monitor your progress</p>
              <Link to="/activities" className="btn btn-primary btn-sm">View Activities</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{fontSize: '3rem'}}>👥</div>
              <h5 className="card-title mt-3">Join Teams</h5>
              <p className="card-text">Create or join teams and work together</p>
              <Link to="/teams" className="btn btn-primary btn-sm">Browse Teams</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{fontSize: '3rem'}}>🏆</div>
              <h5 className="card-title mt-3">Compete</h5>
              <p className="card-text">Check rankings and compete with others</p>
              <Link to="/leaderboard" className="btn btn-primary btn-sm">View Leaderboard</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div style={{fontSize: '3rem'}}>💪</div>
              <h5 className="card-title mt-3">Get Workouts</h5>
              <p className="card-text">Personalized workout recommendations</p>
              <Link to="/workouts" className="btn btn-primary btn-sm">Get Workouts</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="card bg-light">
            <div className="card-body">
              <h3 className="text-center mb-4">🚀 Get Started</h3>
              <p className="text-center">Use the navigation menu above to explore different sections of the app.</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                <Link to="/users" className="btn btn-outline-primary">View Users</Link>
                <Link to="/teams" className="btn btn-outline-primary">Explore Teams</Link>
                <Link to="/activities" className="btn btn-outline-primary">Track Activities</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">OctoFit Tracker</Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">Workouts</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
