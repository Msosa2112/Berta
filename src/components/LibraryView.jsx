import React, { useState } from 'react';
import { Play, Bookmark, Search } from 'lucide-react';

const LibraryView = ({ episodes, savedEpisodes, onPlay }) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const filteredEpisodes = episodes.filter(ep => savedEpisodes.includes(ep.id));

  return (
    <>
      <div className="top-bar">
        <div style={{ width: 36 }} />
        <span className="top-title">Biblioteca</span>
        <button className="icon-btn" title="Buscar">
          <Search size={20} />
        </button>
      </div>

      <div className="discover-view">

        <div className="library-tabs">
          <button
            className={`library-tab${activeTab === 'downloads' ? ' active' : ''}`}
            onClick={() => setActiveTab('downloads')}
          >
            Descargas (0)
          </button>
          <button
            className={`library-tab${activeTab === 'favorites' ? ' active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favoritos ({filteredEpisodes.length})
          </button>
        </div>

        <div className="podcast-list">
          {filteredEpisodes.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '56px 0',
              color: 'var(--text-gray)',
            }}>
              <Bookmark size={36} strokeWidth={1.2} color="var(--border-mid)" />
              <p style={{ fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.5 }}>
                No tienes episodios<br />favoritos guardados aún.
              </p>
            </div>
          ) : (
            filteredEpisodes.map(ep => (
              <div key={ep.id} className="podcast-card" onClick={() => onPlay(ep)}>
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
                        style={{ color: 'var(--accent-purple)', background: 'var(--accent-purple-soft)' }}
                        title="Guardado"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
};

export default LibraryView;
