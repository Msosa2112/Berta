import React, { useState } from 'react';
import { Search, ChevronLeft, Play, Check, Globe } from 'lucide-react';
import LiquidGlass from './liquid-glass/liquid-glass';

const DiscoverView = ({ episodes, guests, onPlay, savedEpisodes, onToggleSave }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuest, setActiveGuest] = useState(null);

  const filteredEpisodes = episodes.filter(ep =>
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="icon-btn" style={{ opacity: 0, pointerEvents: 'none' }}>
          <ChevronLeft size={24} />
        </button>
        <span className="top-title">Descubrir</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="discover-view">

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar episodios, invitados..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Popular Guests Slider */}
        {searchQuery === '' && (
          <>
            <div className="section-header">
              <h2 className="section-title">Invitados Especiales</h2>
            </div>

            <div className="author-slider">
              {guests.map(g => (
                <div
                  key={g.id}
                  className="author-card"
                  onClick={() => setActiveGuest(g)}
                >
                  <div className="author-img-wrap">
                    <img
                      className="author-img"
                      src={g.bgPhoto || 'https://via.placeholder.com/100'}
                      alt={g.name}
                    />
                  </div>
                  <span className="author-name">{g.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Episode List */}
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery ? 'Resultados' : 'Tendencias'}
          </h2>
          {!searchQuery && <span className="see-all">Ver todo</span>}
        </div>

        <div className="podcast-list">
          {filteredEpisodes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--text-gray)',
              padding: '48px 0',
              fontSize: '0.88rem',
            }}>
              No se encontraron episodios
            </div>
          ) : (
            filteredEpisodes.map(ep => (
              <LiquidGlass key={ep.id} className="podcast-card" onClick={() => onPlay(ep)} cornerRadius={16} blurAmount={0.1} padding="0">
                <div className="podcast-img-container">
                  <img src={ep.art} alt={ep.title} className="podcast-img" />
                </div>
                <div className="podcast-info">
                  <h4 className="podcast-title">{ep.title}</h4>
                  <div className="podcast-host">{ep.host}</div>
                  <div className="podcast-duration">{ep.duration}</div>
                  <div className="podcast-actions">
                    <button
                      className="play-btn-outline"
                      onClick={e => { e.stopPropagation(); onPlay(ep); }}
                    >
                      <Play size={10} fill="currentColor" /> Play
                    </button>
                    <div className="action-icons">
                      <button
                        className="icon-btn"
                        style={{
                          color: savedEpisodes.includes(ep.id) ? 'var(--accent-purple)' : undefined,
                          background: savedEpisodes.includes(ep.id) ? 'var(--accent-purple-soft)' : undefined,
                        }}
                        onClick={e => { e.stopPropagation(); onToggleSave(ep.id); }}
                        title="Guardar episodio"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={savedEpisodes.includes(ep.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </LiquidGlass>
            ))
          )}
        </div>
      </div>

      {/* Guest Bottom Sheet Modal */}
      {activeGuest && (
        <div className="bottom-sheet" onClick={() => setActiveGuest(null)}>
          <LiquidGlass className="sheet-content" onClick={e => e.stopPropagation()} cornerRadius={28} blurAmount={0.2} padding="0">

            {/* Drag Handle */}
            <div className="sheet-handle" />

            {/* Avatar */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              padding: '3px',
              background: 'var(--grad-sunset)',
              marginBottom: '16px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <img
                src={activeGuest.bgPhoto}
                alt={activeGuest.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid white',
                  display: 'block',
                }}
              />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.3rem',
              fontWeight: 800,
              textAlign: 'center',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '4px',
            }}>
              {activeGuest.name}
              <span style={{
                width: '18px', height: '18px',
                background: 'var(--grad-sunset)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}>
                <Check size={10} strokeWidth={3} />
              </span>
            </h2>

            <p style={{
              color: 'var(--accent-purple)',
              fontWeight: 700,
              fontSize: '0.8rem',
              marginBottom: '14px',
              textAlign: 'center',
            }}>
              {activeGuest.business}
            </p>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              padding: '0 12px',
              marginBottom: '24px',
            }}>
              {activeGuest.bio || 'Invitado especial de ConBERTAciones.'}
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'center' }}>
              {activeGuest.instagram && (
                <a href={activeGuest.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-btn active">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              )}
              {activeGuest.linkedin && (
                <a href={activeGuest.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn active">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              )}
              {activeGuest.website && (
                <a href={activeGuest.website} target="_blank" rel="noopener noreferrer" className="social-icon-btn active">
                  <Globe size={18} />
                </a>
              )}
            </div>

            <button className="follow-btn" onClick={() => setActiveGuest(null)}>
              Cerrar Perfil
            </button>
          </LiquidGlass>
        </div>
      )}
    </>
  );
};

export default DiscoverView;
