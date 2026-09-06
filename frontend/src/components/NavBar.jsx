import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/">AEGIS-TWIN</Link>
      </div>
      <div className="nav-links">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/history" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          History
        </NavLink>
        <NavLink 
          to="/profiles" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Network Profiles
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
