import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Trash2, Play, Copy, Trophy, Users, ChevronDown, ChevronUp,
  ShieldCheck, Link2,
} from 'lucide-react';
import useStore from '../store/useStore';
import { useToast } from '../components/ToastProvider';
import './Admin.css';

const TYPES = ['1v1', '2v2', '3v3'];

export default function Admin() {
  const toast = useToast();
  const tournaments = useStore((s) => s.tournaments);
  const registrations = useStore((s) => s.registrations);
  const addTournament = useStore((s) => s.addTournament);
  const deleteTournament = useStore((s) => s.deleteTournament);
  const deleteClan = useStore((s) => s.deleteClan);
  const startMatchmaking = useStore((s) => s.startMatchmaking);

  const [name, setName] = useState('');
  const [type, setType] = useState('1v1');
  const [expanded, setExpanded] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addTournament(name.trim(), type);
    setName('');
    toast(`✅ Tournament "${name.trim()}" created!`);
  };

  const handleCopy = (id) => {
    const url = `${window.location.origin}/register/${id}`;
    navigator.clipboard.writeText(url);
    toast('📋 Registration link copied!');
  };

  const handleStart = (id) => {
    const teamsCount = registrations.filter((r) => r.tournamentId === id).length;
    if (teamsCount < 2) {
      toast('⚠️ Need at least 2 teams to start!');
      return;
    }
    startMatchmaking(id);
    toast('⚡ Bracket generated!');
  };

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="admin-main container">
      <div className="admin-header">
        <ShieldCheck size={28} className="admin-header-icon" />
        <div>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Admin Panel</h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>
            Create and manage tournaments
          </p>
        </div>
      </div>

      {/* Create Form */}
      <div className="card admin-create-card fade-up">
        <h2 className="create-title"><Plus size={16} /> Create Tournament</h2>
        <form onSubmit={handleCreate} className="create-form">
          <div className="form-group">
            <label className="form-label" htmlFor="t-name">Tournament Name</label>
            <input
              id="t-name"
              className="form-input"
              placeholder="e.g. Clan Wars Season 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="t-type">Format</label>
            <select
              id="t-type"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t} Tournament</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} /> Create
          </button>
        </form>
      </div>

      {/* Tournament List */}
      <div className="tournaments-list">
        <h2 className="section-title" style={{ marginBottom: 24 }}>
          All Tournaments
        </h2>

        {tournaments.length === 0 && (
          <div className="empty-state card">
            <Trophy size={40} className="empty-icon" />
            <h3>No tournaments created yet</h3>
            <p>Use the form above to create your first tournament.</p>
          </div>
        )}

        {tournaments.map((t) => {
          const teams = registrations.filter((r) => r.tournamentId === t.id);
          const isOpen = t.status === 'open';
          const isExpanded = expanded[t.id];

          return (
            <div key={t.id} className="admin-t-card card fade-up">
              <div className="admin-t-header">
                <div className="admin-t-info">
                  <div className="admin-t-title-row">
                    <Trophy size={16} className="t-icon" />
                    <span className="admin-t-name">{t.name}</span>
                    <span className={`badge badge-${t.type}`}>{t.type}</span>
                    <span className={`badge ${isOpen ? 'badge-open' : 'badge-started'}`}>
                      {isOpen ? 'Open' : 'Started'}
                    </span>
                  </div>
                  <span className="admin-t-meta">
                    <Users size={13} /> {teams.length} team{teams.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="admin-t-actions">
                  {isOpen && (
                    <>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopy(t.id)}
                        title="Copy registration link"
                      >
                        <Link2 size={14} /> Link
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStart(t.id)}
                        title="Start matchmaking"
                      >
                        <Play size={14} /> Start
                      </button>
                    </>
                  )}
                  {!isOpen && (
                    <Link
                      to={`/bracket/${t.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      View Bracket
                    </Link>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteTournament(t.id);
                      toast(`🗑️ Tournament deleted`);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggle(t.id)}
                    title="Toggle teams"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Registration Link */}
              {isOpen && (
                <div className="reg-link-box">
                  <Link2 size={13} />
                  <span className="reg-link-text">
                    {window.location.origin}/register/{t.id}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCopy(t.id)}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              )}

              {/* Teams */}
              {isExpanded && (
                <div className="teams-list">
                  <div className="divider" style={{ margin: '16px 0' }} />
                  <h4 className="teams-heading">
                    <Users size={14} /> Registered Teams
                  </h4>
                  {teams.length === 0 ? (
                    <p className="no-teams">No teams registered yet.</p>
                  ) : (
                    teams.map((reg) => (
                      <div key={reg.id} className="team-row">
                        <div className="team-info">
                          {reg.clanName && (
                            <span className="team-clan">{reg.clanName}</span>
                          )}
                          <span className="team-players">
                            {reg.players.join(' · ')}
                          </span>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            deleteClan(reg.id);
                            toast('🗑️ Team removed');
                          }}
                          title="Delete team"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
