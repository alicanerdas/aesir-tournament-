import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trophy, Crown, Sword, ChevronRight, ArrowLeft } from 'lucide-react';
import useStore from '../store/useStore';
import './Bracket.css';

function getTeamLabel(reg) {
  if (!reg) return <span className="bye-label">BYE</span>;
  if (reg.clanName) return (
    <span>
      <span className="match-clan">[{reg.clanName}]</span>{' '}
      <span className="match-players">{reg.players.join(' · ')}</span>
    </span>
  );
  return <span className="match-players">{reg.players.join(' · ')}</span>;
}

function MatchCard({ match, roundIndex, matchIndex, onAdvance, isLast }) {
  const team0 = match.teams[0];
  const team1 = match.teams[1];
  const winner = match.winner;

  return (
    <div className="match-card">
      <div
        className={`match-team ${winner === 0 ? 'winner' : winner === 1 ? 'loser' : ''}`}
        onClick={() => team0 && winner === null && onAdvance(roundIndex, matchIndex, 0)}
        title={team0 ? 'Click to advance' : ''}
      >
        {winner === 0 && <Crown size={12} className="crown" />}
        {getTeamLabel(team0)}
      </div>
      <div className="match-vs"><Sword size={10} /> VS</div>
      <div
        className={`match-team ${winner === 1 ? 'winner' : winner === 0 ? 'loser' : ''}`}
        onClick={() => team1 && winner === null && onAdvance(roundIndex, matchIndex, 1)}
        title={team1 ? 'Click to advance' : ''}
      >
        {winner === 1 && <Crown size={12} className="crown" />}
        {getTeamLabel(team1)}
      </div>
    </div>
  );
}

export default function Bracket() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const tournament = useStore((s) => s.tournaments.find((t) => t.id === tournamentId));
  const advanceWinner = useStore((s) => s.advanceWinner);

  if (!tournament) {
    return (
      <div className="bracket-main container">
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <h2>Tournament not found</h2>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (tournament.status !== 'started' || !tournament.bracket) {
    return (
      <div className="bracket-main container">
        <div className="card bracket-pending">
          <Trophy size={48} className="pending-icon" />
          <h2>Bracket Not Started</h2>
          <p>An admin needs to start the matchmaking first.</p>
          <Link to="/admin" className="btn btn-primary" style={{ marginTop: 16 }}>
            Go to Admin
          </Link>
        </div>
      </div>
    );
  }

  const { bracket } = tournament;
  const totalRounds = bracket.length;

  // Check if tournament is complete (last round has a winner)
  const finalMatch = bracket[totalRounds - 1]?.[0];
  const tournamentWinner =
    finalMatch?.winner !== null && finalMatch?.winner !== undefined
      ? finalMatch.teams[finalMatch.winner]
      : null;

  const roundLabels = (round, total) => {
    if (round === total - 1) return 'Final';
    if (round === total - 2) return 'Semifinal';
    if (round === total - 3) return 'Quarterfinal';
    return `Round ${round + 1}`;
  };

  return (
    <div className="bracket-main">
      <div className="bracket-header container">
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="bracket-title-row">
          <Trophy size={22} className="t-icon" />
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            {tournament.name}
          </h1>
          <span className={`badge badge-${tournament.type}`}>{tournament.type}</span>
        </div>
        <p className="bracket-hint">Click a team to advance them to the next round</p>
      </div>

      {tournamentWinner && (
        <div className="champion-banner container fade-up">
          <Crown size={32} className="champion-crown" />
          <div>
            <div className="champion-label">Champion</div>
            <div className="champion-name">
              {tournamentWinner.clanName
                ? `[${tournamentWinner.clanName}] ${tournamentWinner.players.join(' · ')}`
                : tournamentWinner.players.join(' · ')}
            </div>
          </div>
        </div>
      )}

      <div className="bracket-scroll-area">
        <div className="bracket-rounds">
          {bracket.map((round, rIdx) => (
            <div key={rIdx} className="bracket-round">
              <div className="round-label">
                {roundLabels(rIdx, totalRounds)}
                <span className="round-num"> · {round.length} match{round.length !== 1 ? 'es' : ''}</span>
              </div>
              <div className="round-matches">
                {round.map((match, mIdx) => (
                  <div key={mIdx} className="match-wrapper">
                    <MatchCard
                      match={match}
                      roundIndex={rIdx}
                      matchIndex={mIdx}
                      onAdvance={advanceWinner}
                    />
                    {rIdx < bracket.length - 1 && (
                      <ChevronRight size={16} className="connector-arrow" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
