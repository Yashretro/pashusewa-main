import { useState, useEffect } from 'react';
import { calculateDistance, filterReportsByRadius, sortReportsByDistance, filterReportsByStatus } from '../utils/location';
import { fetchReports as fetchReportsAPI, updateStatus as updateStatusAPI } from '../utils/api';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userLat, setUserLat] = useState(null);
  const [userLon, setUserLon] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  const [radiusKm, setRadiusKm] = useState(10);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortByDistance, setSortByDistance] = useState(true);

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, userLat, userLon, radiusKm, statusFilter, sortByDistance]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLon(position.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Could not get your location. Distance calculations unavailable.');
        }
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReportsAPI();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...reports];

    result = filterReportsByStatus(result, statusFilter);

    if (userLat !== null && userLon !== null) {
      result = filterReportsByRadius(result, userLat, userLon, radiusKm);
    }

    if (sortByDistance && userLat !== null && userLon !== null) {
      result = sortReportsByDistance(result, userLat, userLon);
    }

    setFilteredReports(result);
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await updateStatusAPI(reportId, newStatus);
      {
        const updatedReports = reports.map(report =>
          report.id === reportId ? { ...report, status: newStatus } : report
        );
        setReports(updatedReports);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading reports...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>🏢 NGO Management Dashboard</h2>
      <p>Manage animal rescue reports in your area</p>

      {locationError && (
        <div className="location-alert">
          ⚠️ {locationError}
        </div>
      )}

      <div className="admin-filters">
        <div className="filter-group">
          <label>Status Filter:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Radius: {radiusKm}km</label>
          <input
            type="range"
            min="1"
            max="50"
            value={radiusKm}
            onChange={(e) => setRadiusKm(parseInt(e.target.value))}
            className="filter-slider"
            disabled={userLat === null}
          />
        </div>

        <div className="filter-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={sortByDistance}
              onChange={(e) => setSortByDistance(e.target.checked)}
              disabled={userLat === null}
            />
            Sort by distance
          </label>
        </div>

        <button 
          onClick={fetchReports}
          className="btn-refresh-reports"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="results-summary">
        Showing {filteredReports.length} of {reports.length} reports
        {userLat && ` • Your location: ${userLat.toFixed(4)}, ${userLon.toFixed(4)}`}
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : filteredReports.length === 0 ? (
        <div className="no-reports">No reports found in this radius.</div>
      ) : (
        <div className="admin-reports-grid">
          {filteredReports.map((report) => (
            <AdminReportCard
              key={report.id}
              report={report}
              userLat={userLat}
              userLon={userLon}
              onStatusChange={updateReportStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminReportCard({ report, userLat, userLon, onStatusChange }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const distance = userLat && userLon
    ? calculateDistance(userLat, userLon, report.latitude, report.longitude)
    : null;

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    await onStatusChange(report.id, newStatus);
    setUpdatingStatus(false);
  };

  const statusClass = `status-${report.status.toLowerCase().replace(' ', '-')}`;

  return (
    <div className="admin-report-card">
      {report.image && (
        <div className="admin-report-image">
          <img src={report.image} alt="Animal" />
        </div>
      )}

      <div className="admin-report-content">
        <div className="admin-status-badge" style={getStatusStyle(report.status)}>
          {report.status}
        </div>

        {distance !== null && (
          <div className="admin-distance">
            📍 {distance}km away
          </div>
        )}

        <div className="admin-location">
          {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
        </div>

        {report.note && (
          <div className="admin-note">
            <strong>Note:</strong> {report.note}
          </div>
        )}

        <div className="admin-date">
          {new Date(report.created_at).toLocaleString()}
        </div>

        <div className="admin-actions">
          <button
            onClick={() => handleStatusChange('Pending')}
            className={`status-btn ${report.status === 'Pending' ? 'active' : ''}`}
            disabled={updatingStatus}
          >
            Pending
          </button>
          <button
            onClick={() => handleStatusChange('In Progress')}
            className={`status-btn ${report.status === 'In Progress' ? 'active' : ''}`}
            disabled={updatingStatus}
          >
            In Progress
          </button>
          <button
            onClick={() => handleStatusChange('Resolved')}
            className={`status-btn ${report.status === 'Resolved' ? 'active' : ''}`}
            disabled={updatingStatus}
          >
            Resolved
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusStyle(status) {
  const colors = {
    'Pending': { backgroundColor: '#fff3cd', color: '#856404' },
    'In Progress': { backgroundColor: '#cfe2ff', color: '#084298' },
    'Resolved': { backgroundColor: '#d1e7dd', color: '#0a3622' },
  };
  return colors[status] || colors['Pending'];
}

export default AdminDashboard;
