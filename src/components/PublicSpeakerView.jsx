import React from 'react';
import { Award, Calendar, Play, Heart, Users, Star, MessageSquare } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const PublicSpeakerView = ({ onNavigate, triggerToast }) => {
  const topics = [
    { title: 'Fe Práctica', icon: <Heart size={20} />, desc: 'Cómo vivir la fe en las decisiones diarias y superar retos personales con convicción.' },
    { title: 'Motivación', icon: <Award size={20} />, desc: 'Claves para el desarrollo personal, la perseverancia y la superación de la adversidad.' },
    { title: 'Reflexión de Vida', icon: <MessageSquare size={20} />, desc: 'Historias íntimas de resiliencia y el poder transformador de detenerse a reflexionar.' },
    { title: 'Comunidad', icon: <Users size={20} />, desc: 'El impacto de la organización, el voluntariado y el liderazgo cívico entre familias latinas.' }
  ];

  const clips = [
    { id: 'c1', title: 'Conferencia de Liderazgo JCPS 2025', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80', duration: '5:40' },
    { id: 'c2', title: 'Charla Motivacional en Casa Latina', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80', duration: '3:15' },
    { id: 'c3', title: 'Entrevista WLKY Bell Awards', image: 'https://images.unsplash.com/photo-1460889418202-14ebd4cc3b4b?w=500&q=80', duration: '8:50' }
  ];

  const testimonials = [
    { author: 'Ana Reyes, Dir. Casa Latina', text: 'Berta transmite una energía y fe inigualables. Su charla en nuestro centro inspiró a decenas de familias latinas.', stars: 5 },
    { author: 'Carlos Aguilera, Emprendedor', text: 'Una oradora excepcional que habla directo al corazón. Su historia de vida es un verdadero testimonio de resiliencia.', stars: 5 }
  ];

  const handleBookingClick = () => {
    if (triggerToast) triggerToast('Redirigiendo al formulario de contacto...');
    setTimeout(() => {
      onNavigate('conecta');
    }, 400);
  };

  return (
    <div className="reveal">
      {/* ── Bio Speaker Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Berta Public Speaker</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Mensajes de fe, resiliencia y empoderamiento comunitario en conferencias locales e internacionales.
        </p>
      </header>

      {/* Hero Banner Section */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
          <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" alt="Public Speaking" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(121, 35, 89, 0.9) 0%, rgba(121, 35, 89, 0.3) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
            <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', marginBottom: '4px' }}>Oradora & Conferencista</span>
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Inspira a tu Audiencia</h3>
          </div>
        </div>
      </section>

      {/* Intro Description */}
      <section style={{ marginBottom: '36px' }}>
        <div className="glass-card bio-card">
          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Berta Weyenberg es una reconocida líder cívica y educadora galardonada en Kentucky. Con un estilo cálido, auténtico y basado en su propia historia de superación, comparte mensajes de fe, liderazgo y fortaleza comunitaria en eventos locales e internacionales, inspirando a la audiencia a actuar y transformar su entorno.
          </p>
        </div>
      </section>

      {/* Booking CTA Button */}
      <section style={{ marginBottom: '44px', textAlign: 'center' }}>
        <InteractiveHoverButton style={{ width: '100%', maxWidth: '360px' }} onClick={handleBookingClick}>
          Agendar a Berta para un Evento
        </InteractiveHoverButton>
      </section>

      {/* Topics Section */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Temas Disponibles</h2>
        <div className="bento-grid">
          {topics.map((t) => (
            <div key={t.title} className="glass-card bento-col-6 glow-purple" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t.title}</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clips Gallery */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Videos y Clips Cortos</h2>
        <div className="news-row-scroll">
          {clips.map((clip) => (
            <div key={clip.id} className="glass-card glass-card-interactive news-card-horizontal" style={{ padding: 0 }} onClick={() => triggerToast(`Reproduciendo clip: ${clip.title}`)}>
              <div style={{ position: 'relative', height: '140px', backgroundImage: `url(${clip.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', color: 'var(--bg-obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                  {clip.duration}
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>{clip.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Testimonios</h2>
        <div className="bento-grid">
          {testimonials.map((test, idx) => (
            <div key={idx} className="glass-card testimonial-card bento-col-6 glow-amber">
              <div className="testimonial-quote">"{test.text}"</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{test.author}</span>
                <span style={{ display: 'flex', gap: '2px', color: 'var(--accent-amber)' }}>
                  {Array(test.stars).fill(null).map((_, i) => <Star key={i} size={11} fill="currentColor" />)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PublicSpeakerView;
