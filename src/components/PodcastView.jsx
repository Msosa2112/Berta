import React, { useState } from 'react';
import { Search, Play, Check, Globe, Heart, Clock, RefreshCw, BookOpen, Calendar, Mic } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { CONBERTACIONES_SPOTIFY_URL } from '../utils/spotify';

const SpotifyIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const PodcastView = ({
  episodes,
  guests,
  savedEpisodes,
  onPlay,
  onToggleSave,
  onNavigate,
  onSyncSpotify,
  isSyncingSpotify,
}) => {
  const [activeTab, setActiveTab] = useState('episodios');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuest, setActiveGuest] = useState(null);

  const savedEps = episodes.filter(ep => savedEpisodes.includes(ep.id));
  const filteredEpisodes = episodes.filter(ep =>
    (ep.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ep.host || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ep.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const EpisodeRow = ({ ep }) => {
    const isSaved = savedEpisodes.includes(ep.id);
    const matchingGuest = guests?.find(g => g.name.toLowerCase() === (ep.host || '').toLowerCase());
    const imgSource = ep.art || matchingGuest?.bgPhoto || '/cover_art_games.png';
    const defaultDesc = "Acompáñanos en esta entrevista y conversación inspiradora sobre fe, comunidad, resiliencia y el camino de nuestros líderes en Louisville.";

    return (
      <div className="glass-card glass-card-interactive episode-row-card glow-purple" onClick={() => onPlay(ep)}>
        <div className="episode-art-container">
          <img src={imgSource} alt={ep.title} />
        </div>
        
        <div className="episode-text-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'rgba(121, 35, 89, 0.15)',
              color: 'var(--accent-purple)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Mic size={10} /> Entrevista
            </span>
            {ep.releaseDate && (
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={11} /> {ep.releaseDate}
              </span>
            )}
          </div>
          <h4 className="episode-row-title">{ep.title.split('|')[0]}</h4>
          <div style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' }}>
            <span>{ep.host && ep.host !== 'Berta Weyenberg' ? `Invitado(a): ${ep.host}` : 'Conduce: Berta Weyenberg'}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '4px 0 8px 0', lineHeight: 1.45 }}>
            {ep.description || defaultDesc}
          </p>
          <div className="episode-row-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {ep.duration}</span>
            {ep.spotifyUrl && (
              <a
                href={ep.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#1DB954',
                  textDecoration: 'none',
                }}
              >
                <SpotifyIcon size={12} /> Escuchar en Spotify
              </a>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
          <button 
            className="biz-btn-icon" 
            onClick={() => onPlay(ep)}
            title="Reproducir entrevista en la app"
          >
            <Play size={15} fill="currentColor" />
          </button>
          {ep.spotifyUrl && (
            <a
              href={ep.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="biz-btn-icon"
              title="Abrir episodio en Spotify"
              style={{ color: '#1DB954', textDecoration: 'none' }}
            >
              <SpotifyIcon size={15} />
            </a>
          )}
          <button 
            className="biz-btn-icon" 
            onClick={() => onToggleSave(ep.id)}
            style={{ color: isSaved ? 'var(--accent-rose)' : 'inherit', borderColor: isSaved ? 'rgba(236, 72, 153, 0.3)' : 'inherit' }}
            title={isSaved ? "Quitar de favoritos" : "Guardar entrevista"}
          >
            <Heart size={14} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="reveal">
      {/* ── Top section summary header ── */}
      <header style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="editorial-tag" style={{ background: 'rgba(121, 35, 89, 0.14)', color: 'var(--accent-purple)', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mic size={13} /> Programa de Entrevistas · Spotify for Creators
            </span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>ConBERTAciones: Entrevistas</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: 0 }}>
              Entrevistas en profundidad y diálogos especiales conducidos por Berta Weyenberg con invitados, líderes y voces que inspiran a nuestra comunidad en Louisville.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={CONBERTACIONES_SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#1DB954',
                borderColor: 'rgba(29, 185, 84, 0.35)',
                textDecoration: 'none',
              }}
            >
              <SpotifyIcon size={16} /> Abrir Show en Spotify
            </a>
            {onSyncSpotify && (
              <button
                onClick={onSyncSpotify}
                disabled={isSyncingSpotify}
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 14px', fontSize: '0.82rem', cursor: 'pointer' }}
                title="Sincronizar últimos episodios desde Spotify for Creators"
              >
                <RefreshCw size={14} style={{ animation: isSyncingSpotify ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isSyncingSpotify ? 'Sincronizando...' : 'Actualizar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Clear distinction banner between ConBERTAciones (Entrevistas) and Under the Umbrella (Reflexiones) */}
        <div
          className="glass-card"
          style={{
            marginTop: '18px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderLeft: '4px solid var(--accent-amber)',
          }}
        >
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <strong>🎙️ ConBERTAciones</strong> presenta las <strong>entrevistas y programas completos</strong>. ¿Buscas las cápsulas y reflexiones cortas bilingües (ES/EN)?
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('umbrella')}
              className="category-pill active"
              style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <BookOpen size={13} /> Ir a Under the Umbrella (Reflexiones)
            </button>
          )}
        </div>
      </header>

      {/* ── Tab Pill Navigation ── */}
      <div className="category-pills">
        <button 
          className={`category-pill ${activeTab === 'episodios' ? 'active' : ''}`} 
          onClick={() => setActiveTab('episodios')}
        >
          Entrevistas ({episodes.length})
        </button>
        <button 
          className={`category-pill ${activeTab === 'guardados' ? 'active' : ''}`} 
          onClick={() => setActiveTab('guardados')}
        >
          Guardados ({savedEps.length})
        </button>
        <button 
          className={`category-pill ${activeTab === 'invitados' ? 'active' : ''}`} 
          onClick={() => setActiveTab('invitados')}
        >
          Invitados ({guests.length})
        </button>
      </div>

      {/* ── Main Layout Split View ── */}
      <div className="split-view">
        {/* Left Column Controls */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTab === 'episodios' && (
            <div className="glass-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-obsidian)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <Search size={16} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Buscar entrevistas o invitados..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem', width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* Guest Spotlight Card */}
          {guests[0] && (
            <div className="glass-card glow-amber" style={{ padding: '20px' }}>
              <span className="editorial-tag" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent-amber)', marginBottom: '10px' }}>Invitado Destacado</span>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', margin: '12px 0 16px 0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-amber)', flexShrink: 0 }}>
                  <img src={guests[0]?.bgPhoto || '/berta.jpeg'} alt={guests[0]?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{guests[0]?.name}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{guests[0]?.business}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                {guests[0]?.bio}
              </p>
              <InteractiveHoverButton style={{ width: '100%' }} onClick={() => setActiveGuest(guests[0])}>
                Ver perfil completo
              </InteractiveHoverButton>
            </div>
          )}
        </aside>

        {/* Right Column List Results */}
        <section style={{ minWidth: 0 }}>
          {activeTab === 'episodios' && (
            <div className="episode-card-list">
              {filteredEpisodes.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se encontraron entrevistas.
                </div>
              ) : (
                filteredEpisodes.map(ep => <EpisodeRow key={ep.id} ep={ep} />)
              )}
            </div>
          )}

          {activeTab === 'guardados' && (
            <div className="episode-card-list">
              {savedEps.length === 0 ? (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tienes entrevistas guardadas aún.
                </div>
              ) : (
                savedEps.map(ep => <EpisodeRow key={ep.id} ep={ep} />)
              )}
            </div>
          )}

          {activeTab === 'invitados' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {guests.map(g => (
                <div key={g.id} className="glass-card glass-card-interactive" style={{ padding: '16px 20px' }} onClick={() => setActiveGuest(g)}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-purple)', flexShrink: 0 }}>
                      <img src={g.bgPhoto} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 600, marginTop: '2px' }}>{g.business}</div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{g.bio}</p>
                    </div>
                    <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem', flexShrink: 0 }}>Ver Perfil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Guest Profile Modal Overlay */}
      {activeGuest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setActiveGuest(null)}>
          <div className="glass-card glow-purple" style={{ maxWidth: '440px', width: '100%', padding: '32px 24px', textAlign: 'center', border: '1px solid var(--glass-border-highlight)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', padding: '3px', background: 'var(--grad-sunset)', margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              <img src={activeGuest.bgPhoto} alt={activeGuest.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg-space)' }} />
            </div>
            
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '4px' }}>
              {activeGuest.name}
              <span style={{ width: '18px', height: '18px', background: 'var(--grad-sunset)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-obsidian)' }}>
                <Check size={10} strokeWidth={4} />
              </span>
            </h2>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>{activeGuest.business}</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>{activeGuest.bio}</p>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', justifyContent: 'center' }}>
              {activeGuest.instagram && <a href={activeGuest.instagram} target="_blank" rel="noopener noreferrer" className="social-link-btn" style={{ width: '40px', height: '40px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>}
              {activeGuest.linkedin && <a href={activeGuest.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-btn" style={{ width: '40px', height: '40px' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>}
              {activeGuest.website && <a href={activeGuest.website} target="_blank" rel="noopener noreferrer" className="social-link-btn" style={{ width: '40px', height: '40px' }}><Globe size={18} /></a>}
            </div>
            
            <InteractiveHoverButton style={{ width: '100%' }} onClick={() => setActiveGuest(null)}>
              Cerrar Perfil
            </InteractiveHoverButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PodcastView;
