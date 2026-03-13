import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swords, ShieldCheck, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <Swords size={22} className="brand-icon" />
          <span className="brand-text">AESIR</span>
          <span className="brand-sub">TOURNAMENT</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            Tournaments
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <ShieldCheck size={16} />
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
