import { useState, useEffect } from 'react';
import { fetchReports as fetchReportsAPI } from '../utils/api';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

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

  if (loading) return <div className="loading">Loading recent reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="reports-section">
      <h2>Recent Reports</h2>
      <div className="reports-grid">
        {reports.length === 0 ? (
          <p className="no-reports">No reports yet. Be the first to help!</p>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </div>
    </section>
  );
}

function ReportCard({ report }) {
  return (
    <div className="report-card">
      {report.image && (
        <img src={report.image} alt="Animal" className="report-image" />
      )}
      <div className="report-info">
        <p className={`report-status status-${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</p>
        <p className="report-note">{report.note || 'No additional notes'}</p>
        <p className="report-location">
          📍 {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
        </p>
        <p className="report-map">
          <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
        </p>
        <p className="report-date">
          {new Date(report.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ReportList;