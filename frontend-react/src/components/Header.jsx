import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>🐾 PashuSewa</h1>
      </div>
      <p>Help injured animals by reporting them to nearby rescue services</p>
      <nav>
        <Link to="/" className="nav-link">Report Animal</Link>
        <Link to="/admin" className="nav-link admin-link">NGO Panel</Link>
      </nav>
    </header>
  );
}

export default Header;