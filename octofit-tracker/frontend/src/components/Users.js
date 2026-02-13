import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // Default sort by name
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        
        // Determine ordering parameter based on sort selection
        // Only name can be handled by backend ordering
        // team and activity_date will be sorted client-side after fetch
        const orderingParam = 'name'; // Always use name for consistent pagination
        
        const baseUrl = codespaceName 
          ? `https://${codespaceName}-8000.app.github.dev/api/users/` 
          : 'http://localhost:8000/api/users/';
        
        const apiUrl = `${baseUrl}?page=${currentPage}&ordering=${orderingParam}`;
        
        console.log('Fetching users from:', apiUrl, 'with client-side sort:', sortBy);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users API Response:', data);
        
        // Handle paginated response
        const usersData = data.results || data;
        console.log('Processed users data:', usersData);
        
        setUsers(usersData);
        setTotalCount(data.count || usersData.length);
        setTotalPages(Math.ceil((data.count || usersData.length) / pageSize));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading users...</p>
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

  // Sort users based on selected option
  // All sorting is done client-side on the current page of results
  const sortedUsers = (() => {
    const usersCopy = [...users];
    
    switch (sortBy) {
      case 'name':
        return usersCopy.sort((a, b) => {
          return (a.name || '').localeCompare(b.name || '');
        });
      
      case 'team':
        return usersCopy.sort((a, b) => {
          return (a.team_name || '').localeCompare(b.team_name || '');
        });
      
      case 'activity_date':
        return usersCopy.sort((a, b) => {
          // Get the most recent activity date for each user
          const getLatestActivityDate = (user) => {
            if (!user.activities || !Array.isArray(user.activities) || user.activities.length === 0) {
              return new Date(0); // Return epoch for users with no activities
            }
            const dates = user.activities
              .filter(activity => activity && activity.date)
              .map(activity => new Date(activity.date));
            return dates.length > 0 ? new Date(Math.max(...dates)) : new Date(0);
          };
          
          const dateA = getLatestActivityDate(a);
          const dateB = getLatestActivityDate(b);
          return dateB - dateA; // Most recent first
        });
      
      default:
        return usersCopy;
    }
  })();

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mt-4" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0f4f8 0%, #e8eef3 100%)'
    }}>
      <h2>👥 Users</h2>
      <p className="text-muted mb-4">View all registered users in the OctoFit community</p>
      
      {/* Sort Menu */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3">
          <label htmlFor="sortSelect" className="form-label mb-0 fw-bold">
            Sort by:
          </label>
          <select 
            id="sortSelect"
            className="form-select" 
            style={{ 
              maxWidth: '250px',
              cursor: 'pointer',
              border: '2px solid #0d6efd',
              boxShadow: '0 2px 4px rgba(13, 110, 253, 0.1)'
            }}
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="team">Team (A-Z)</option>
            <option value="activity_date">Most Recent Activity</option>
          </select>
        </div>
      </div>
      
      {users.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No users found
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {sortedUsers.map(user => {
            // Determine team icon
            const isMarvel = user.team_name && user.team_name.toLowerCase().includes('marvel');
            const isDC = user.team_name && user.team_name.toLowerCase().includes('dc');
            
            return (
              <div key={user.id} className="col">
                <div 
                  className="card h-100 position-relative" 
                  style={{ 
                    overflow: 'visible',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                    border: '1px solid #dee2e6',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Team Icon Badge */}
                  {(isMarvel || isDC) && (
                    <div 
                      className="position-absolute" 
                      style={{ 
                        top: '-10px', 
                        right: '-10px', 
                        zIndex: 10,
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: isMarvel ? '#ed1d24' : '#0476f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                        border: '4px solid white'
                      }}
                    >
                      <span style={{ 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '20px',
                        textAlign: 'center',
                        lineHeight: '1'
                      }}>
                        {isMarvel ? 'M' : 'DC'}
                      </span>
                    </div>
                  )}
                  
                  <div className="card-body">
                    <h5 className="card-title text-primary">{user.name || 'N/A'}</h5>
                    <div className="card-text">
                      <p className="mb-2">
                        <strong>Email:</strong> {user.email || 'N/A'}
                      </p>
                      <p className="mb-2">
                        <strong>Username:</strong> {user.email ? user.email.split('@')[0] : 'N/A'}
                      </p>
                      
                      {/* Display Recent Activities */}
                      <div className="mt-3">
                        <h6 className="fw-bold mb-3">Recent Activities:</h6>
                        {user.activities && Array.isArray(user.activities) && user.activities.length > 0 ? (
                          <div className="activity-list">
                            {user.activities.map((activity, index) => {
                              if (!activity) return null;
                              return (
                                <div 
                                  key={activity.id || index} 
                                  className="activity-card mb-3 p-2 rounded"
                                  style={{ 
                                    background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                                    border: '1px solid #bbdefb',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.12)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span 
                                      className="badge text-white" 
                                      style={{ 
                                        backgroundColor: '#17a2b8',
                                        fontSize: '0.85rem',
                                        padding: '0.4rem 0.6rem'
                                      }}
                                    >
                                      {activity.activity_type || 'N/A'}
                                    </span>
                                    <span 
                                      className="badge" 
                                      style={{ 
                                        backgroundColor: '#ffc107',
                                        color: '#000',
                                        fontSize: '0.9rem',
                                        padding: '0.4rem 0.6rem',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {activity.calories || 0} cal
                                    </span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                      {activity.duration || 0} min
                                      {activity.distance ? ` • ${activity.distance.toFixed(2)} km` : ''}
                                    </small>
                                    <small className="text-muted">
                                      {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
                                    </small>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-muted mt-2 mb-0"><small>No activities yet</small></p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            &laquo; Previous
          </button>
          
          <div className="d-flex gap-2">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Show first, last, current, and adjacent pages
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`btn ${pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      minWidth: '40px',
                      fontWeight: pageNum === currentPage ? 'bold' : 'normal'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="px-2">...</span>;
              }
              return null;
            })}
          </div>
          
          <button
            className="btn btn-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next &raquo;
          </button>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-muted">
          Showing {users.length > 0 ? ((currentPage - 1) * pageSize + 1) : 0} - {Math.min(currentPage * pageSize, totalCount)} of <strong>{totalCount}</strong> users
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
      </div>
    </div>
  );
}

export default Users;
