import React from 'react';
import { ChevronLeft, Clock, User, Share2 } from 'lucide-react';

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

const ArticleView = ({ article, onClose }) => {
  if (!article) return null;
  const cat = CAT_COLORS[article.categoria] || { bg: '#f3f4f6', text: '#6b7280' };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.titulo, text: article.excerpt, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="article-view">
      {/* Hero */}
      <div className="article-hero" style={{ backgroundImage: `url(${article.imagen})` }}>
        <div className="article-hero-overlay" />
        <div className="article-hero-nav">
          <button
            className="icon-btn"
            onClick={onClose}
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="icon-btn"
            onClick={handleShare}
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="article-content">
        <span
          className="category-badge"
          style={{ background: cat.bg, color: cat.text, display: 'inline-block', marginBottom: '14px' }}
        >
          {article.categoria}
        </span>

        <h1 className="article-content-title">{article.titulo}</h1>

        <div className="article-content-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <User size={12} /> {article.autor}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} /> {article.lectura} min de lectura
          </span>
          <span>{formatDate(article.fecha)}</span>
        </div>

        <div
          className="article-content-body"
          dangerouslySetInnerHTML={{ __html: article.contenido }}
        />

        {/* CTA */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(218, 81, 246, 0.04)',
          borderRadius: '16px',
          border: '1px solid var(--glass-border-highlight)',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 600 }}>
            ¿Te gustó este artículo?
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
            Escucha el episodio relacionado en ConBERTAciones o comparte con tu comunidad.
          </p>
          <button className="follow-btn" style={{ margin: 0 }} onClick={handleShare}>
            Compartir Artículo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
