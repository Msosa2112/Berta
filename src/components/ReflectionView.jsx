import React, { useState, useEffect } from 'react';
import { Globe, MessageSquare, Play, Clock, Calendar } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const SpotifyIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const ReflectionView = ({ reflection, onClose, onPlayReflectionAudio, triggerToast }) => {
  const initialLang = reflection.titleEs || reflection.contentEs ? 'es' : 'en';
  const [lang, setLang] = useState(initialLang);
  const [name, setName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const hasEs = Boolean(reflection.titleEs || reflection.contentEs || reflection.audioEs);
  const hasEn = Boolean(reflection.titleEn || reflection.contentEn || reflection.audioEn);

  const title = lang === 'es' ? (reflection.titleEs || reflection.titleEn) : (reflection.titleEn || reflection.titleEs);
  const content = lang === 'es' ? (reflection.contentEs || reflection.contentEn) : (reflection.contentEn || reflection.contentEs);
  const videoUrl = lang === 'es' ? reflection.videoEs : reflection.videoEn;
  const audioUrl = lang === 'es' ? (reflection.audioEs || reflection.audioEn) : (reflection.audioEn || reflection.audioEs);
  const duration = lang === 'es' ? (reflection.durationEs || reflection.durationEn) : (reflection.durationEn || reflection.durationEs);
  const spotifyUrl = lang === 'es' ? (reflection.spotifyUrlEs || reflection.spotifyUrlEn) : (reflection.spotifyUrlEn || reflection.spotifyUrlEs);

  // Load comments on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`reflection_comments_${reflection.id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        const mock = [
          { id: 'c1', name: 'Miguel Sosa', text: lang === 'es' ? 'Una reflexión maravillosa, Berta. ¡Gracias por compartir!' : 'A wonderful reflection, Berta. Thanks for sharing!', time: 'Hace 2 días' },
          { id: 'c2', name: 'María Elena', text: lang === 'es' ? 'Me llegó al corazón. La fe siempre es nuestro refugio.' : 'This touched my heart. Faith is always our refuge.', time: 'Hace 1 día' }
        ];
        setComments(mock);
        localStorage.setItem(`reflection_comments_${reflection.id}`, JSON.stringify(mock));
      }
    } catch (e) {
      console.error(e);
    }
  }, [reflection.id, lang]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
    else if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('<iframe')) {
      const srcMatch = url.match(/src="([^"]+)"/);
      return srcMatch ? srcMatch[1] : null;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  const handleShare = () => {
    const shareTarget = spotifyUrl || `${window.location.origin}/reflection/${reflection.id}`;
    navigator.clipboard.writeText(shareTarget)
      .then(() => {
        if (triggerToast) triggerToast('¡Enlace de reflexión copiado!');
      })
      .catch(() => {
        if (triggerToast) triggerToast('No se pudo copiar el enlace.');
      });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !newComment.trim()) {
      if (triggerToast) triggerToast('Por favor completa los campos.');
      return;
    }

    const added = {
      id: Date.now().toString(),
      name: name.trim(),
      text: newComment.trim(),
      time: 'Hace un momento'
    };

    const updated = [added, ...comments];
    setComments(updated);
    localStorage.setItem(`reflection_comments_${reflection.id}`, JSON.stringify(updated));
    
    setName('');
    setNewComment('');
    if (triggerToast) triggerToast('¡Comentario publicado!');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--glass-bg-dense)', backdropFilter: 'blur(30px)',
      zIndex: 110, display: 'flex', justifyContent: 'center',
      overflowY: 'auto'
    }} className="reveal">
      <div className="editorial-post" style={{ width: '100%', maxWidth: '800px', padding: '32px 20px 140px 20px' }}>
        
        {/* Navigation Top Header inside modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <InteractiveHoverButton onClick={onClose}>
            Volver a Reflexiones
          </InteractiveHoverButton>
          
          {hasEs && hasEn && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setLang('es')}
                className={`category-pill ${lang === 'es' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}
              >
                <Globe size={13} />
                <span>Español (ES)</span>
              </button>
              <button
                onClick={() => setLang('en')}
                className={`category-pill ${lang === 'en' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}
              >
                <Globe size={13} />
                <span>English (EN)</span>
              </button>
            </div>
          )}
        </div>

        {/* Header Title */}
        <header className="editorial-header">
          <span className="editorial-tag">☂️ Under the Umbrella · Reflexión</span>
          <h1 className="editorial-title">{title || (lang === 'es' ? 'Reflexión sin título' : 'Untitled Reflection')}</h1>
          <div className="editorial-meta" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <img src="/berta.jpeg" alt="Berta" className="editorial-meta-img" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Berta Weyenberg</span>
            <span>·</span>
            <span>{lang === 'es' ? 'Reflexión en Español' : 'English Reflection'}</span>
            {reflection.releaseDate && (
              <>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {reflection.releaseDate}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Native Audio Player Action Card + Spotify Link */}
        {audioUrl && (
          <div
            className="glass-card glow-purple"
            style={{
              padding: '18px 22px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              border: '1px solid var(--glass-border-highlight)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={reflection.thumbnail || '/cover_art_games.png'}
                alt={title}
                style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-purple)', letterSpacing: '0.04em' }}>
                  {lang === 'es' ? 'Audio narrado por Berta (ES)' : 'Narrated Audio by Berta (EN)'}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {title}
                </div>
                {duration && (
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Clock size={11} /> Duración: {duration}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => onPlayReflectionAudio && onPlayReflectionAudio(reflection, lang)}
                style={{ padding: '10px 18px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <Play size={15} fill="currentColor" />
                <span>{lang === 'es' ? 'Escuchar en la App' : 'Listen in App'}</span>
              </button>
              {spotifyUrl && (
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: '#1DB954',
                    borderColor: 'rgba(29, 185, 84, 0.35)',
                    textDecoration: 'none',
                  }}
                >
                  <SpotifyIcon size={15} />
                  <span>Spotify</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Media Block (Embedded Video or Image) */}
        {embedUrl ? (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', marginBottom: '32px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
            <iframe 
              src={embedUrl} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        ) : (
          reflection.thumbnail && !audioUrl && (
            <img src={reflection.thumbnail} alt={title} style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: '32px', border: '1px solid var(--glass-border)' }} />
          )
        )}

        {/* Content Paragraphs */}
        <article className="glass-card editorial-body" style={{ padding: '32px', marginBottom: '36px' }}>
          <div dangerouslySetInnerHTML={{ __html: content || (lang === 'es' ? 'Comienza a escribir tu reflexión...' : 'Start writing your reflection...') }} />
        </article>

        {/* Share Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '56px' }}>
          <InteractiveHoverButton onClick={handleShare}>
            {lang === 'es' ? 'Compartir esta Reflexión' : 'Share this Reflection'}
          </InteractiveHoverButton>
        </div>

        {/* Comments Section */}
        <section className="comments-container">
          <h3 className="comments-title">
            <MessageSquare size={18} style={{ color: 'var(--accent-purple)', verticalAlign: 'middle', marginRight: '8px' }} />
            <span>Conversación ({comments.length})</span>
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="glass-card" style={{ padding: '20px', marginBottom: '32px' }}>
            <div className="form-group">
              <label className="form-label">Tu Nombre</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ingresa tu nombre..." 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Comentario</label>
              <textarea 
                className="form-control" 
                placeholder="Comparte tu opinión o reflexión..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <InteractiveHoverButton type="submit">
                Publicar comentario
              </InteractiveHoverButton>
            </div>
          </form>

          {/* Comments List Feed */}
          <div className="comments-timeline">
            {comments.map((c) => (
              <div key={c.id} className="comment-card">
                <div className="comment-avatar">
                  {c.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="comment-body">
                  <div className="comment-header">
                    <span className="comment-user">{c.name}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                  <p className="comment-content">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ReflectionView;
