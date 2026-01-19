import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skillFilter, setSkillFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/profile`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setProjects(data.data.projects);
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Error connecting to API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProjectsBySkill = async () => {
    if (!skillFilter.trim()) {
      alert('Please enter a skill to filter');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/projects?skill=${encodeURIComponent(skillFilter)}`);
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
        setSearchResults(null);
      } else {
        setError(data.message || 'Failed to filter projects');
      }
    } catch (err) {
      setError('Error filtering projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        setProjects([]);
      } else {
        setError(data.message || 'Search failed');
      }
    } catch (err) {
      setError('Error searching: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSkillFilter('');
    setSearchQuery('');
    setSearchResults(null);
    if (profile) {
      setProjects(profile.projects);
    }
  };

  if (loading && !profile) {
    return <div style={styles.container}><h2>Loading...</h2></div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Me-API Playground</h1>
        <p>Minimal frontend to test profile APIs</p>
      </header>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Search and Filter Controls */}
      <section style={styles.section}>
        <h2>Search & Filter</h2>
        
        <div style={styles.filterGroup}>
          <label>
            <strong>Filter by Skill:</strong>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g., Python, React"
              style={styles.input}
            />
          </label>
          <button onClick={filterProjectsBySkill} style={styles.button}>
            Filter Projects
          </button>
        </div>

        <div style={styles.filterGroup}>
          <label>
            <strong>Search All:</strong>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., MongoDB, AWS"
              style={styles.input}
            />
          </label>
          <button onClick={performSearch} style={styles.button}>
            Search
          </button>
        </div>

        <button onClick={resetFilters} style={{...styles.button, backgroundColor: '#666'}}>
          Reset Filters
        </button>
      </section>

      {/* Profile Display */}
      {profile && !searchResults && (
        <section style={styles.section}>
          <h2>Profile</h2>
          <div style={styles.profileInfo}>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            
            <div>
              <strong>Skills ({profile.skills.length}):</strong>
              <div style={styles.tags}>
                {profile.skills.map((skill, idx) => (
                  <span key={idx} style={styles.tag}>{skill}</span>
                ))}
              </div>
            </div>

            <div>
              <strong>Education:</strong>
              <ul>
                {profile.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Work Experience:</strong>
              <ul>
                {profile.work.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Links:</strong>
              <ul>
                {profile.links.github && <li><a href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>}
                {profile.links.linkedin && <li><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>}
                {profile.links.portfolio && <li><a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer">Portfolio</a></li>}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Projects Display */}
      {projects.length > 0 && !searchResults && (
        <section style={styles.section}>
          <h2>Projects ({projects.length})</h2>
          <div style={styles.projectsGrid}>
            {projects.map((project, idx) => (
              <div key={idx} style={styles.projectCard}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.links && project.links.length > 0 && (
                  <div>
                    <strong>Links:</strong>
                    <ul>
                      {project.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Results Display */}
      {searchResults && (
        <section style={styles.section}>
          <h2>Search Results for "{searchQuery}"</h2>
          
          {searchResults.skills.length > 0 && (
            <div>
              <h3>Skills ({searchResults.skills.length})</h3>
              <div style={styles.tags}>
                {searchResults.skills.map((skill, idx) => (
                  <span key={idx} style={styles.tag}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {searchResults.projects.length > 0 && (
            <div>
              <h3>Projects ({searchResults.projects.length})</h3>
              <div style={styles.projectsGrid}>
                {searchResults.projects.map((project, idx) => (
                  <div key={idx} style={styles.projectCard}>
                    <h4>{project.title}</h4>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.education.length > 0 && (
            <div>
              <h3>Education ({searchResults.education.length})</h3>
              <ul>
                {searchResults.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            </div>
          )}

          {searchResults.work.length > 0 && (
            <div>
              <h3>Work Experience ({searchResults.work.length})</h3>
              <ul>
                {searchResults.work.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {Object.values(searchResults).every(arr => arr.length === 0) && (
            <p>No results found.</p>
          )}
        </section>
      )}
    </div>
  );
}

// Minimal inline styles (no focus on styling per requirements)
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  section: {
    marginBottom: '30px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  error: {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    color: '#c00'
  },
  filterGroup: {
    marginBottom: '15px'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    marginBottom: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  },
  profileInfo: {
    lineHeight: '1.6'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '5px'
  },
  tag: {
    backgroundColor: '#e0e0e0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px'
  },
  projectsGrid: {
    display: 'grid',
    gap: '15px'
  },
  projectCard: {
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9'
  }
};

export default App;
