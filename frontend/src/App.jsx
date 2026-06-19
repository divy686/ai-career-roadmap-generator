import React, { useState, useEffect } from 'react';
import './App.css';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const App = () => {
  // --- States ---
  const [token, setToken] = useState(localStorage.getItem('user_token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('user_email') || '');
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  
  const [formData, setFormData] = useState({ current_role: '', skills: '', target_role: '', time_commitment: '' });
  const [roadmap, setRoadmap] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch History automatically when user logs in
  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/roadmaps/history?token=${token}`)
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Failed to load history data logs.", err);
    }
  };

  // --- Auth Handlers ---
  const handleAuthChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = authMode === 'login'
  ? 'auth/login'
  : 'auth/register';
    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
      method: 'POST',
      headers: {
     'Content-Type': 'application/json'
  },
  body: JSON.stringify(authForm)
});
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Authentication operation failed.');
      
      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_email', data.email);
      setToken(data.token);
      setUserEmail(data.email);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUserEmail('');
    setRoadmap('');
    setHistory([]);
  };

  const deleteRoadmap = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this roadmap?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/roadmaps/${id}?token=${token}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      fetchHistory();
    }
  } catch (error) {
    console.error("Delete failed:", error);
  }
};

  // --- Generator Handlers ---
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoadmap('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/roadmap-generate?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to start streaming network architecture modules.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setRoadmap((prev) => prev + chunk);
      }
      fetchHistory(); // Reload history sidebar after generation finishes
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Auth Screen Layout ---
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>🚀 CareerPilot AI</h2>
          <p>{authMode === 'login' ? 'Login to access your dashboard' : 'Create an expert cloud platform profile'}</p>
          
          <form onSubmit={handleAuthSubmit}>
            <input type="email" name="email" placeholder="Corporate Email address" value={authForm.email} onChange={handleAuthChange} required />
            <input type="password" name="password" placeholder="Secure Password Key" value={authForm.password} onChange={handleAuthChange} required />
            <button type="submit">{authMode === 'login' ? 'Login Session' : 'Sign Up Profile'}</button>
          </form>

          {error && <p className="auth-error">❌ {error}</p>}
          
          <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? "Don't have an account? Register here" : 'Already have an account? Login here'}
          </span>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Screen Layout ---
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation Context */}
      <aside className="sidebar">
        <div className="sidebar-branding">
          <h3>📂 Saved Roadmaps</h3>
          <span className="user-tag">{userEmail}</span>
        </div>
        <div className="history-list">
          <button onClick={() => setRoadmap('')} className="new-roadmap-btn">+ Fresh Workspace</button>
          {history.map((item) => (
  <div key={item.id} className="history-item">
    <div onClick={() => setRoadmap(item.content)}>
      <h4>{item.target_role}</h4>
      <small>{item.created_at}</small>
    </div>

    <button
      className="delete-btn"
      onClick={() => deleteRoadmap(item.id)}
    >
      🗑 Delete
    </button>
  </div>
))}
        </div>
        <button onClick={handleLogout} className="logout-btn">Session Logout</button>
      </aside>

      {/* Main Execution Work Area */}
      <main className="main-content">
        {!roadmap && !loading ? (
          <div className="form-wrapper">
            <h2>🚀 Create Your Personalized Career Roadmap</h2>
            <form onSubmit={handleFormSubmit} className="form-card">
              <div className="form-group">
                <label>Current Employment Framework</label>
                <select name="current_role" value={formData.current_role} onChange={handleFormChange} required>
                  <option value="">Select Category</option>
                  <option value="Student">University Student</option>
                  <option value="Fresher">Fresh Graduate Trainee</option>
                  <option value="Working Professional">Industry Professional</option>
                </select>
              </div>
              <div className="form-group">
                <label>Current Technical Skills Inventory</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleFormChange} placeholder="e.g. Python, Git, HTML" required />
              </div>
              <div className="form-group">
                <label>Target Dream Destination Role</label>
                <input type="text" name="target_role" value={formData.target_role} onChange={handleFormChange} placeholder="e.g. DevOps Security Engineer" required />
              </div>
              <div className="form-group">
                <label>Weekly Commitment Allocation (Hours)</label>
                <input type="number" name="time_commitment" value={formData.time_commitment} onChange={handleFormChange} placeholder="e.g. 15" min="1" max="168" required />
              </div>
              <button type="submit" className="submit-btn">Run Engine Diagnostics</button>
            </form>
          </div>
        ) : (
          <div className="output-panel">
            <div className="output-controls">
              <button onClick={() => setRoadmap('')} className="back-btn">⬅️ Back to Control Panel</button>
              <button onClick={() => window.print()} className="print-btn">📄 Export PDF Blueprint</button>
            </div>
            {loading && !roadmap && <div className="loading-pulsar">Streaming Live LLM Output Matrix...</div>}
            <div className="markdown-render-body">
              <Markdown remarkPlugins={[remarkGfm]}>{roadmap}</Markdown>
            </div>
          </div>
        )}
        {error && <div className="global-error-box">⚠️ {error}</div>}
      </main>
    </div>
  );
};

export default App;
