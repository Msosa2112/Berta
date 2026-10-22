import React, { useState, useEffect } from 'react';
import { Mail, Send, MessageSquare, BookOpen, Play, Pause, ChevronRight, PenTool } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const ConectaView = ({ profileSettings, triggerToast }) => {
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'general', message: '' });
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Dame La Letra State
  const [dameFormType, setDameFormType] = useState('pregunta'); // pregunta or historia
  const [dameContent, setDameContent] = useState('');
  const [dameName, setDameName] = useState('');

  // Audio response simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  useEffect(() => {
    let interval;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress(p => {
          if (p >= 105) {
            setIsPlayingAudio(false);
            triggerToast('Respuesta finalizada');
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const formatAudioTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      triggerToast('Por favor completa todos los campos obligatorios');
      return;
    }
    triggerToast('¡Mensaje enviado con éxito!');
    setContactForm({ name: '', email: '', subject: 'general', message: '' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    triggerToast('¡Gracias por suscribirte al boletín!');
    setNewsletterEmail('');
  };

  const handleDameSubmit = (e) => {
    e.preventDefault();
    if (!dameContent.trim()) {
      triggerToast('Escribe tu mensaje antes de enviar.');
      return;
    }
    
    const submittedName = dameName.trim() || 'Anónimo';
    if (dameFormType === 'pregunta') {
      triggerToast(`¡Pregunta de ${submittedName} enviada a Berta!`);
    } else {
      triggerToast(`¡Historia de ${submittedName} compartida con la comunidad!`);
    }
    
    // Save to localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('dame_la_letra_submissions') || '[]');
    storedSubmissions.push({
      id: Date.now(),
      type: dameFormType,
      name: submittedName,
      content: dameContent.trim(),
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('dame_la_letra_submissions', JSON.stringify(storedSubmissions));

    setDameContent('');
    setDameName('');
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      triggerToast('Reproduciendo audio explicativo');
    }
  };

  const socialLinks = {
    facebook: profileSettings?.facebook || 'https://facebook.com',
    instagram: profileSettings?.instagram || 'https://instagram.com',
    linkedin: profileSettings?.linkedin || 'https://linkedin.com',
    youtube: profileSettings?.youtube || 'https://youtube.com',
    website: profileSettings?.website || 'https://conbertaciones.com'
  };

  return (
    <div className="reveal">
      {/* ── Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Conecta & Comunidad</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Únete al debate, envía tus preguntas, comparte testimonios y ponte en contacto con Berta.
        </p>
      </header>

      {/* ── Dame La Letra Segment ── */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card glow-amber" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PenTool size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Dame La Letra</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>En colaboración con Miguel Sosa</p>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            ¡Participa activamente en nuestra comunidad! Envía tus preguntas para Berta o comparte historias inspiradoras. Cada semana seleccionamos una para responderla al aire en el podcast.
          </p>

          {/* Featured Q of the Week */}
          <div className="glass-card" style={{ padding: '16px 20px', background: 'rgba(218, 81, 246, 0.03)', borderLeft: '3px solid var(--accent-purple)', marginBottom: '24px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pregunta de la Semana</span>
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-primary)', margin: '6px 0', lineHeight: 1.45 }}>
              "Berta, ¿cómo logras mantener viva la fe y la motivación cuando enfrentas la barrera del idioma en nuevos proyectos comunitarios?"
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>— Enviado por: Gabriela M., Louisville</div>
          </div>

          {/* Berta's Reply Voice Player */}
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(139, 92, 246, 0.04)', borderColor: 'rgba(139, 92, 246, 0.15)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Respuesta de Berta</span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '6px 0 16px 0', lineHeight: 1.5 }}>
              La barrera del idioma es real, pero el lenguaje del amor y del servicio es universal. Cuando trabajamos con fe, Dios abre los caminos y pone a las personas correctas en nuestro andar. ¡No temas dar el primer paso!
            </p>

            {/* Audio Wave Visualizer Block */}
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-obsidian)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
              onClick={toggleAudio}
            >
              <button style={{ background: 'var(--text-primary)', color: 'var(--bg-obsidian)', width: '28px', height: '28px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {isPlayingAudio ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" style={{ marginLeft: 1 }} />}
              </button>
              
              <div style={{ flex: 1 }}>
                {/* Voice wave bars simulator */}
                <div className={`wave-container ${isPlayingAudio ? 'playing' : ''}`} style={{ height: '24px', margin: 0, justifyContent: 'flex-start' }}>
                  {Array.from({ length: 30 }).map((_, i) => {
                    const h = 4 + Math.abs(Math.sin(i * 0.4)) * 14;
                    return (
                      <div 
                        key={i} 
                        className="wave-bar" 
                        style={{ 
                          height: `${isPlayingAudio ? h : 4}px`, 
                          width: '2px', 
                          background: isPlayingAudio ? 'var(--grad-sunset)' : 'var(--text-disabled)',
                          transition: 'height 0.2s ease',
                          animationDelay: `${i * 0.03}s`
                        }} 
                      />
                    );
                  })}
                </div>
              </div>
              
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {formatAudioTime(audioProgress)} / 1:45
              </span>
            </div>
          </div>

          {/* submission Form */}
          <form onSubmit={handleDameSubmit} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="category-pills" style={{ marginBottom: 0 }}>
              <button 
                type="button" 
                className={`category-pill ${dameFormType === 'pregunta' ? 'active' : ''}`} 
                onClick={() => setDameFormType('pregunta')}
                style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <MessageSquare size={12} />
                <span>Enviar Pregunta</span>
              </button>
              <button 
                type="button" 
                className={`category-pill ${dameFormType === 'historia' ? 'active' : ''}`} 
                onClick={() => setDameFormType('historia')}
                style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <BookOpen size={12} />
                <span>Compartir Historia</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Tu Nombre (Opcional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ingresa tu nombre..." 
                value={dameName}
                onChange={e => setDameName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{dameFormType === 'pregunta' ? 'Tu Pregunta' : 'Tu Historia'}</label>
              <textarea 
                className="form-control" 
                placeholder={dameFormType === 'pregunta' ? 'Escribe aquí tu pregunta para Berta...' : 'Escribe aquí tu historia o testimonio de vida...'}
                value={dameContent}
                onChange={e => setDameContent(e.target.value)}
              />
            </div>

            <InteractiveHoverButton type="submit" style={{ width: '100%' }}>
              Enviar a la Comunidad
            </InteractiveHoverButton>
          </form>
        </div>
      </section>

      {/* ── Redes Sociales ── */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Redes Sociales</h2>
        <div className="social-links-grid">
          {/* FB */}
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1877f2' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          {/* IG */}
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#e1306c' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
          {/* YT */}
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ff0000' }}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
          </a>
          {/* LI */}
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0a66c2' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
      </section>

      {/* ── Contact Form ── */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            <Mail size={18} color="var(--accent-purple)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Envíanos un Mensaje</h3>
          </div>

          <form onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input 
                type="text" 
                required 
                className="form-control" 
                placeholder="Ingresa tu nombre..." 
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input 
                type="email" 
                required 
                className="form-control" 
                placeholder="ejemplo@correo.com" 
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Asunto del Mensaje *</label>
              <select 
                className="form-control" 
                value={contactForm.subject}
                onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                style={{ background: 'var(--bg-space)', color: 'var(--text-primary)' }}
              >
                <option value="general">Consulta General</option>
                <option value="booking_educativa">Agendar Charla Educativa (Estudiantes y educación de hijos)</option>
                <option value="booking_inspiracional">Agendar Charla Inspiracional (Grupos de damas de iglesia / Grupos de fe)</option>
                <option value="booking_empresarial">Agendar Charla para Compañías (Mensaje alentador para empleados)</option>
                <option value="sponsorship">Patrocinio / Promoción Negocios</option>
                <option value="dame_letra">Dame La Letra (Pregunta/Historia)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje *</label>
              <textarea 
                required 
                className="form-control" 
                placeholder="Escribe tu consulta aquí..."
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>

            <InteractiveHoverButton type="submit" style={{ width: '100%' }}>
              Enviar Mensaje
            </InteractiveHoverButton>
          </form>
        </div>
      </section>

      {/* ── Newsletter Subscribe ── */}
      <section style={{ marginBottom: '24px' }}>
        <div className="glass-card glow-purple" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '6px' }}>Suscripción al Boletín</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
            Recibe notificaciones en tu correo cada vez que publiquemos un nuevo episodio de ConBERTAciones o una reflexión bilingüe.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', flexDirection: 'column', smDirection: 'row' }} className="responsive-flex">
            <input 
              type="email" 
              required 
              className="form-control" 
              placeholder="Tu dirección de correo..." 
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <InteractiveHoverButton type="submit">
              Suscribirse
            </InteractiveHoverButton>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ConectaView;
