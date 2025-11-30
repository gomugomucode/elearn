// src/pages/admin/AdminLogs.jsx
import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getAdminLogs } from '../../services/api';
import './AdminDashboard.css';

const AdminLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = await getAdminLogs(token);
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchLogs();
    }
  }, [user?.role]);

  if (loading) return <div className="admin-loading">Loading logs...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-logs">
      <div className="logs-header">
        <h2><FaHistory /> Activity Logs</h2>
      </div>
      <div className="logs-list">
        {logs.map((log, idx) => (
          <div key={idx} className="log-item">
            <div className="log-time">{new Date(log.timestamp).toLocaleString()}</div>
            <div className="log-user">{log.user_name}</div>
            <div className="log-action">{log.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLogs;