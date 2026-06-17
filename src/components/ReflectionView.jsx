import React, { useState, useEffect } from 'react';
import { ChevronLeft, Globe, Share2, Send, MessageSquare } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const ReflectionView = ({ reflection, onClose, triggerToast }) => {
  const [lang, setLang] = useState('es'); // 'es' or 'en'
  const [name, setName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const title = lang === 'es' ? reflection.titleEs : reflection.titleEn;
  const content = lang === 'es' ? reflection.contentEs : reflection.contentEn;
  const videoUrl = lang === 'es' ? reflection.videoEs : reflection.videoEn;

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
    const mockUrl = `${window.location.origin}/reflection/${reflection.id}`;
    navigator.clipboard.writeText(mockUrl)
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
      <div className="editorial-post" style={{ width: '100%', maxWidth: '800px', padding: '32px 20px 120px 20px' }}>
        
        {/* Navigation Top Header inside modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
          <InteractiveHoverButton onClick={onClose}>
            Volver
          </InteractiveHoverButton>
          
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="category-pill active"
            style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}
          >
            <Globe size={13} />
            <span>{lang === 'es' ? 'English (EN)' : 'Español (ES)'}</span>
          </button>
        </div>

        {/* Header Title */}
        <header className="editorial-header">
          <span className="editorial-tag">Under the Umbrella</span>
          <h1 className="editorial-title">{title || (lang === 'es' ? 'Reflexión sin título' : 'Untitled Reflection')}</h1>
          <div className="editorial-meta">
            <img src="/berta.jpeg" alt="Berta" className="editorial-meta-img" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Berta Weyenberg</span>
            <span>·</span>
            <span>Reflexiones de vida</span>
          </div>
        </header>

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
          reflection.thumbnail && (
            <img src={reflection.thumbnail} alt={title} style={{ width: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: '32px', border: '1px solid var(--glass-border)' }} />
          )
        )}

        {/* Content Paragraphs */}
        <article className="glass-card editorial-body" style={{ padding: '32px', marginBottom: '36px' }}>
          <div dangerouslySetInnerHTML={{ __html: content || (lang === 'es' ? 'Comienza a escribir tu reflexión...' : 'Start writing your reflection...') }} />
        </article>

        {/* Share Action */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '56px' }}>
          <InteractiveHoverButton onClick={handleShare}>
            Compartir esta Reflexión
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
