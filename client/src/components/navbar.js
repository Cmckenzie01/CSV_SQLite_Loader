import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <Link to="/" className="navbar-brand ms-3">SQLite</Link>
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
        <li className="navbar-item ms-3">
            <Link to="/csv" className="nav-link">CSV</Link>
          </li>
          <li className="navbar-item ms-3">
            <Link to="/companies" className="nav-link">Companies</Link>
          </li>
          <li className="navbar-item ms-3">
            <Link to="/financials" className="nav-link">Financials</Link>
          </li>
          <li className="navbar-item ms-3">
            <Link to="/queries" className="nav-link">Queries</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
