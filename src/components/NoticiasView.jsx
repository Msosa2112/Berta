import React, { useState } from 'react';
import { Clock, User, Newspaper, PenTool } from 'lucide-react';

const CAT_COLORS = {
  'Comunidad': { bg: '#ede9fe', text: '#6E4BFA' },
  'Educación':  { bg: '#dbeafe', text: '#2563eb' },
  'Salud':      { bg: '#d1fae5', text: '#059669' },
  'Blog':       { bg: '#fce7f3', text: '#db2777' },
  'Cultura':    { bg: '#fef3c7', text: '#d97706' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const NoticiasView = ({ noticias, onOpenArticle }) => {
  const [activeTab, setActiveTab] = useState('noticias');

  const filtered = noticias.filter(n =>
    activeTab === 'noticias' ? n.tipo === 'noticia' : n.tipo === 'blog'
  );

  return (
    <>
      <div className="top-bar">
        <div style={{ width: 36 }} />
        <span className="top-title">Noticias & Blog</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="discover-view" style={{ padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="library-tabs">
            <button
              className={`library-tab${activeTab === 'noticias' ? ' active' : ''}`}
              onClick={() => setActiveTab('noticias')}
            >
              <Newspaper size={14} />
              <span>Noticias</span>
            </button>
            <button
              className={`library-tab${activeTab === 'blog' ? ' active' : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              <PenTool size={14} />
              <span>Blog de Berta</span>
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron artículos en esta sección.
          </div>
        ) : (
          <div className="noticias-grid">
            {filtered.map(n => {
              const cat = CAT_COLORS[n.categoria] || { bg: '#f3f4f6', text: '#6b7280' };
              return (
                <div key={n.id} className="article-card" onClick={() => onOpenArticle(n)}>
                  <div className="article-img-container">
                    <span className="category-badge" style={{ background: cat.bg, color: cat.text }}>
                      {n.categoria}
                    </span>
                    <img
                      src={n.imagen || '/cover_art_games.png'}
                      alt={n.titulo}
                      className="article-img"
                    />
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{n.titulo}</h3>
                    <p className="article-excerpt">{n.excerpt}</p>
                    <div className="article-meta">
                      <span>
                        <User size={12} /> {n.autor}
                      </span>
                      <span>
                        <Clock size={12} /> {n.lectura} min
                      </span>
                      <span>{formatDate(n.fecha)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default NoticiasView;
