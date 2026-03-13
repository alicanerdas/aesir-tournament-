import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, Shield, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { useToast } from '../components/ToastProvider';
import './Registration.css';

function PlayerInput({ index, value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={`player-${index}`}>
        Player {index + 1}
      </label>
      <input
        id={`player-${index}`}
        className="form-input"
        placeholder={`Player ${index + 1} IGN`}
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        required
      />
    </div>
  );
}

export default function Registration() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const tournament = useStore((s) => s.tournaments.find((t) => t.id === tournamentId));
  const addRegistration = useStore((s) => s.addRegistration);
  const allRegistrations = useStore((s) => s.registrations);
  const existingRegs = allRegistrations.filter((r) => r.tournamentId === tournamentId);

  const playerCount =
    tournament?.type === '3v3' ? 3 : tournament?.type === '2v2' ? 2 : 1;

  const [players, setPlayers] = useState(Array(playerCount).fill(''));
  const [clanName, setClanName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePlayerChange = (i, val) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (players.some((p) => !p.trim())) return;

    addRegistration(tournamentId, players.map((p) => p.trim()), clanName.trim());
    setSubmitted(true);
    toast('🎉 Successfully registered!');
  };

  if (!tournament) {
    return (
      <div className="reg-main container">
        <div className="card reg-not-found">
          <h2>Tournament not found</h2>
          <p>This tournament may have been deleted or never existed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (tournament.status !== 'open') {
    return (
      <div className="reg-main container">
        <div className="card reg-closed">
          <h2>Registration Closed</h2>
          <p>This tournament has already started. Registration is no longer available.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="reg-main container">
        <div className="card reg-success fade-up">
          <CheckCircle size={56} className="success-icon" />
          <h2>You're In!</h2>
          <p>Your team has been registered for <strong>{tournament.name}</strong>.</p>
          <p className="reg-players-summary">
            {clanName && <span className="clan-highlight">[{clanName}]</span>}{' '}
            {players.join(' · ')}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-main container">
      <div className="card reg-card fade-up">
        <div className="reg-header">
          <UserPlus size={24} className="reg-icon" />
          <div>
            <h1 className="section-title" style={{ marginBottom: 2 }}>
              Register
            </h1>
            <p className="reg-tournament-name">{tournament.name}</p>
          </div>
          <span className={`badge badge-${tournament.type}`}>
            {tournament.type}
          </span>
        </div>

        <p className="reg-team-count">
          <Shield size={13} /> {existingRegs.length} team{existingRegs.length !== 1 ? 's' : ''} registered so far
        </p>

        <form onSubmit={handleSubmit} className="reg-form">
          {/* Players */}
          <div className="reg-players-grid">
            {players.map((p, i) => (
              <PlayerInput key={i} index={i} value={p} onChange={handlePlayerChange} />
            ))}
          </div>

          {/* Clan Name (only for 2v2 and 3v3) */}
          {playerCount > 1 && (
            <div className="form-group">
              <label className="form-label" htmlFor="clan-name">Clan Name</label>
              <input
                id="clan-name"
                className="form-input"
                placeholder="Your clan tag (e.g. AESIR)"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            <UserPlus size={18} /> Confirm Registration
          </button>
        </form>
      </div>
    </div>
  );
}
