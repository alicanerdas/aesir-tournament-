import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Sword, ExternalLink, Calendar } from 'lucide-react';
import useStore from '../store/useStore';
import './Home.css';

const typeConfig = {
  '1v1': { label: '1v1', icon: <Sword size={14} />, cls: 'badge-1v1' },
  '2v2': { label: '2v2', icon: <Users size={14} />, cls: 'badge-2v2' },
  '3v3': { label: '3v3', icon: <Users size={14} />, cls: 'badge-3v3' },
};

function TournamentCard({ tournament, registrations }) {
  const cfg = typeConfig[tournament.type] || typeConfig['1v1'];
  const teamCount = registrations.length;
  const isOpen = tournament.status === 'open';

  return (
    <div className="t-card card fade-up">
      <div className="t-card-header">
        <div className="t-card-title-row">
          <Trophy size={18} className="t-icon" />
          <h2 className="t-name">{tournament.name}</h2>
        </div>
        <div className="t-card-badges">
          <span className={`badge ${cfg.cls}`}>{cfg.icon}{cfg.label}</span>
          <span className={`badge ${isOpen ? 'badge-open' : 'badge-started'}`}>
            {isOpen ? '● Open' : '⚡ Started'}
          </span>
        </div>
      </div>

      <div className="t-card-meta">
        <span className="meta-item">
          <Users size={13} />
          {registrations.length} team{registrations.length !== 1 ? 's' : ''} registered
        </span>
        <span className="meta-item">
          <Calendar size={13} />
          {new Date(tournament.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="t-card-actions">
        {isOpen && (
          <Link to={`/register/${tournament.id}`} className="btn btn-primary">
            Register Now <ExternalLink size={14} />
          </Link>
        )}
        {tournament.status === 'started' && (
          <Link to={`/bracket/${tournament.id}`} className="btn btn-secondary">
            View Bracket
          </Link>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const tournaments = useStore((s) => s.tournaments);
  const allRegistrations = useStore((s) => s.registrations);
  const open = tournaments.filter((t) => t.status === 'open');
  const active = tournaments.filter((t) => t.status === 'started');

  return (
    <main className="home-main">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-badge">
            <Sword size={14} />
            MMORPG Minecraft Server
          </div>
          <h1 className="hero-title">
            Forge Your<br />
            <span className="hero-accent">Legend</span>
          </h1>
          <p className="hero-sub">
            Enter the arena. Battle for glory. Register for 1v1, 2v2, or 3v3
            clan tournaments and prove your dominance.
          </p>
          <div className="hero-cta">
            <a href="#tournaments" className="btn btn-primary btn-lg">
              Browse Tournaments
            </a>
            <Link to="/admin" className="btn btn-secondary btn-lg">
              Admin Panel
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{tournaments.length}</span>
              <span className="hero-stat-label">Total Tournaments</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{open.length}</span>
              <span className="hero-stat-label">Open for Registration</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{active.length}</span>
              <span className="hero-stat-label">Active Brackets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="tournaments-section container" id="tournaments">
        {open.length > 0 && (
          <>
            <h2 className="section-title">Open Tournaments</h2>
            <p className="section-sub">Register your team and compete for victory</p>
            <div className="t-grid">
              {open.map((t) => (
                <TournamentCard key={t.id} tournament={t} registrations={allRegistrations.filter((r) => r.tournamentId === t.id)} />
              ))}
            </div>
            {active.length > 0 && <div className="divider" />}
          </>
        )}

        {active.length > 0 && (
          <>
            <h2 className="section-title">Active Brackets</h2>
            <p className="section-sub">Battles are underway — watch the elimination unfold</p>
            <div className="t-grid">
              {active.map((t) => (
                <TournamentCard key={t.id} tournament={t} registrations={allRegistrations.filter((r) => r.tournamentId === t.id)} />
              ))}
            </div>
          </>
        )}

        {tournaments.length === 0 && (
          <div className="empty-state">
            <Trophy size={64} className="empty-icon" />
            <h3>No tournaments yet</h3>
            <p>An admin needs to create tournaments first.</p>
            <Link to="/admin" className="btn btn-primary" style={{ marginTop: 16 }}>
              Go to Admin Panel
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
