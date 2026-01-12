import ReportForm from '../components/ReportForm';
import ReportList from '../components/ReportList';

function HomePage() {
  return (
    <div className="home-page">
      <h2>Report an Injured Animal</h2>
      <p>Your report helps local rescue teams save lives</p>
      
      <ReportForm />
      <ReportList />
    </div>
  );
}

export default HomePage;
