import { useState, useEffect } from 'react';
import { createReport } from '../utils/api';

function ReportForm() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationText, setLocationText] = useState('Fetching your location...');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setLocationText('Getting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setLocationText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          setLocationText('Could not get location. Try again.');
          console.error(error);
        }
      );
    } else {
      setLocationText('Geolocation not supported');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { image, latitude, longitude, note };
      await createReport(payload);
      setSubmitted(true);
      setTimeout(() => {
        setImage(null);
        setImagePreview(null);
        setNote('');
        setSubmitted(false);
        getLocation();
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="confirmation">
        <div className="success-icon">✓</div>
        <h2>Report Submitted Successfully!</h2>
        <p>Thank you for helping an animal in need. Local rescue teams have been notified.</p>
      </div>
    );
  }

  return (
    <div className="report-form">
      <h2>Report Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="imageUpload">Upload or Take Photo:</label>
          <input 
            type="file" 
            id="imageUpload" 
            accept="image/*" 
            capture
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Location:</label>
          <div className="location-display">
            <input type="text" value={locationText} readOnly />
            <button 
              type="button" 
              onClick={getLocation}
              className="btn-refresh"
            >
              Refresh Location
            </button>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="note">Additional Notes (Optional):</label>
          <textarea 
            id="note" 
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the animal's condition, exact location details, etc."
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-submit"
          disabled={loading || !image || !latitude}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;