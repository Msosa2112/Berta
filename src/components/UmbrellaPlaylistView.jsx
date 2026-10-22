import React, { useState } from 'react';
import { ChevronLeft, Play, Search, BookOpen, Clock } from 'lucide-react';

const SpotifyIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const UmbrellaPlaylistView = ({ reflections, language, onClose, onPlayVideo, onPlayReflectionAudio }) => {
  const isEn = language === 'en';
  const headerTitle = isEn ? 'Under the Umbrella · Reflections (EN)' : 'Bajo la Sombrilla · Reflexiones (ES)';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = reflections.filter(ref => {
    const title = (isEn ? ref.titleEn : ref.titleEs) || '';
    const text = (isEn ? (ref.rawEn || ref.contentEn) : (ref.rawEs || ref.contentEs)) || '';
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return title.toLowerCase().includes(q) || text.toLowerCase().includes(q);
  });

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-obsidian)', color: 'var(--text-primary)', zIndex: 105, display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 20px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'var(--bg-space)', borderBottom: '1px solid var(--glass-border)', gap: '12px'
      }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <ChevronLeft size={24} />
          <span>Volver</span>
        </button>
        <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>{headerTitle}</div>
        <div style={{ width: '60px' }} />
      </div>

      {/* Scrollable Body */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '120px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {/* Playlist Hero */}
          <div style={{ padding: '24px 20px', background: 'linear-gradient(to bottom, var(--accent-sand-glow), var(--bg-obsidian))' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <img
                src={reflections[0]?.thumbnail || '/cover_art_games.png'}
                style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', boxShadow: 'var(--shadow-ambient)' }}
                alt="Playlist cover"
              />
              <div style={{ flex: 1, minWidth: '220px' }}>
                <span className="editorial-tag" style={{ marginBottom: '6px' }}>
                  ☂️ Playlist de Reflexiones · Spotify for Creators
                </span>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{headerTitle}</h1>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Berta Weyenberg • {reflections.length} {isEn ? 'audio & text reflections' : 'reflexiones en audio y lectura'}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => filtered[0] && onPlayReflectionAudio && onPlayReflectionAudio(filtered[0], language)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'var(--accent-purple)',
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '24px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px var(--accent-terracotta-glow)',
                    }}
                  >
                    <Play size={16} fill="currentColor" /> {isEn ? 'Play Latest Audio' : 'Reproducir más reciente'}
                  </button>
                </div>
              </div>
            </div>

            {/* Search bar inside playlist */}
            <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-space)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={isEn ? 'Search reflections in English...' : 'Buscar reflexiones en español...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem', width: '100%' }}
              />
            </div>
          </div>

          {/* Reflection List */}
          <div style={{ padding: '0 20px' }}>
            {filtered.map((ref, index) => {
              const title = isEn ? (ref.titleEn || ref.titleEs) : (ref.titleEs || ref.titleEn);
              const duration = isEn ? (ref.durationEn || ref.durationEs) : (ref.durationEs || ref.durationEn);
              const spotifyUrl = isEn ? (ref.spotifyUrlEn || ref.spotifyUrlEs) : (ref.spotifyUrlEs || ref.spotifyUrlEn);

              return (
                <div
                  key={ref.id}
                  onClick={() => onPlayVideo(ref)}
                  className="glass-card glass-card-interactive"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-muted)', width: '24px', textAlign: 'center', fontSize: '0.82rem' }}>
                    {index + 1}
                  </div>
                  <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                    <img
                      src={ref.thumbnail || '/cover_art_games.png'}
                      style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
                      alt={title}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {title}
                    </h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>{ref.releaseDate || 'Berta Weyenberg'}</span>
                      {duration && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} /> {duration}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                    <button
                      className="biz-btn-icon"
                      onClick={() => onPlayReflectionAudio && onPlayReflectionAudio(ref, language)}
                      title={isEn ? 'Play Audio' : 'Escuchar Audio'}
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                    <button
                      className="biz-btn-icon"
                      onClick={() => onPlayVideo(ref)}
                      title={isEn ? 'Read Reflection' : 'Leer Reflexión'}
                    >
                      <BookOpen size={14} />
                    </button>
                    {spotifyUrl && (
                      <a
                        href={spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="biz-btn-icon"
                        style={{ color: '#1DB954', textDecoration: 'none' }}
                        title="Abrir en Spotify"
                      >
                        <SpotifyIcon size={14} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UmbrellaPlaylistView;
