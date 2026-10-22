import React, { useState } from 'react';
import { Award, Calendar, Play, Heart, Users, Star, BookOpen, Briefcase, Sparkles, CheckCircle2, X } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const PublicSpeakerView = ({ onNavigate, triggerToast }) => {
  const [selectedBookingType, setSelectedBookingType] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    date: '',
    type: 'educativa',
    message: '',
  });

  const speakingServices = [
    {
      id: 'educativa',
      badge: 'Educación & Familia',
      title: 'Charlas Educativas: Estudiantes y Educación de Hijos',
      icon: <BookOpen size={22} />,
      audience: 'Escuelas, padres de familia, talleres educativos y asociaciones estudiantiles',
      desc: 'Orientación cercana y práctica referente a la educación de los estudiantes, el éxito académico y herramientas para apoyar a los padres en la crianza y formación integral de sus hijos.',
      highlights: [
        'Apoyo en la educación y desarrollo de los estudiantes',
        'Guía práctica para padres sobre la educación de los hijos',
        'Puentes entre la familia, la escuela y el futuro bilingüe',
      ],
    },
    {
      id: 'inspiracional',
      badge: 'Iglesias & Grupos de Fe',
      title: 'Charlas Inspiracionales para Grupos de Damas y Grupos de Fe',
      icon: <Heart size={22} />,
      audience: 'Grupos de damas de iglesia, ministerios, retiros y comunidades de fe',
      desc: 'Mensajes cálidos y edificantes pensados para grupos de damas de iglesia o grupos de fe que se interesen en temas diversos de crecimiento espiritual, propósito, familia y resiliencia.',
      highlights: [
        'Encuentros, congresos y desayunos de grupos de damas',
        'Grupos de fe interesados en reflexiones sobre temas diversos',
        'Testimonios vivos de fe práctica, paz y esperanza',
      ],
    },
    {
      id: 'empresarial',
      badge: 'Empresas & Equipos',
      title: 'Mensajes de Inspiración y Aliento para Compañías y Empleados',
      icon: <Briefcase size={22} />,
      audience: 'Dueños de compañías, líderes de negocios y equipos de trabajo',
      desc: 'Dirigido a cualquier dueño de compañía que desee regalarle a sus empleados un mensaje de inspiración y aliento que renueve el ánimo, el compromiso y el bienestar humano dentro del equipo.',
      highlights: [
        'Mensaje alentador y motivacional para empleados y colaboradores',
        'Fortalecimiento del ánimo, propósito y cultura de equipo',
        'Disponible en Español e Inglés para equipos diversos',
      ],
    },
  ];

  const clips = [
    { id: 'c1', title: 'Charla Educativa: Familias y Estudiantes en JCPS', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80', duration: '5:40' },
    { id: 'c2', title: 'Encuentro Inspiracional de Damas y Grupos de Fe', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80', duration: '3:15' },
    { id: 'c3', title: 'Mensaje de Aliento e Inspiración para Equipos', image: 'https://images.unsplash.com/photo-1460889418202-14ebd4cc3b4b?w=500&q=80', duration: '8:50' }
  ];

  const testimonials = [
    { author: 'Ana Reyes, Directora Comunitaria', text: 'Sus charlas educativas para padres e hijos transforman la manera en que nuestras familias se involucran en la educación de los estudiantes.', stars: 5 },
    { author: 'Ministerio de Damas, Louisville', text: 'Berta compartió con nuestro grupo de damas de la iglesia un mensaje inolvidable, lleno de sabiduría, calidez y fe práctica.', stars: 5 },
    { author: 'Carlos Aguilera, Dueño de Empresa', text: 'Invitamos a Berta para dar un mensaje alentador a nuestros empleados y el impacto positivo en todo el equipo fue inmediato.', stars: 5 }
  ];

  const openBookingModal = (typeId = 'educativa') => {
    setBookingForm(prev => ({ ...prev, type: typeId }));
    setSelectedBookingType(typeId);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
      if (triggerToast) triggerToast('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    const stored = JSON.parse(localStorage.getItem('berta_speaker_bookings') || '[]');
    stored.push({
      id: Date.now(),
      ...bookingForm,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('berta_speaker_bookings', JSON.stringify(stored));

    setSelectedBookingType(null);
    setBookingForm({
      name: '',
      organization: '',
      email: '',
      phone: '',
      date: '',
      type: 'educativa',
      message: '',
    });
    if (triggerToast) {
      triggerToast('¡Solicitud de charla enviada! Berta se pondrá en contacto contigo pronto.');
    }
  };

  return (
    <div className="reveal">
      {/* ── Bio Speaker Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <span className="editorial-tag" style={{ background: 'rgba(121, 35, 89, 0.14)', color: 'var(--accent-purple)', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={13} /> Conferencista & Oradora Bilingüe
        </span>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Agenda a Berta para tu Evento</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px' }}>
          Charlas educativas para estudiantes y padres, mensajes inspiracionales para grupos de damas e iglesias, y conferencias de aliento para empresas y sus empleados.
        </p>
      </header>

      {/* Hero Banner Section */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative', height: '230px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
          <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" alt="Public Speaking" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(121, 35, 89, 0.94) 0%, rgba(121, 35, 89, 0.35) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', marginBottom: '6px' }}>Educación · Fe · Liderazgo Empresarial</span>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Un mensaje con propósito para cada audiencia</h3>
            </div>
            <button
              className="btn-primary"
              onClick={() => openBookingModal('educativa')}
              style={{ padding: '10px 20px', fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={15} /> Agendar Fecha Ahora
            </button>
          </div>
        </div>
      </section>

      {/* Intro Description */}
      <section style={{ marginBottom: '36px' }}>
        <div className="glass-card bio-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            <strong>¿Para qué tipo de eventos puedes agendar a Berta Weyenberg?</strong> Ya sea que busques fortalecer la <strong>educación de los estudiantes y la crianza de los hijos</strong>, compartir una palabra viva en <strong>grupos de damas de iglesia o grupos de fe</strong> sobre temas diversos, o seas <strong>dueño de una compañía</strong> que desea regalarle a sus empleados un <strong>mensaje de inspiración y aliento</strong>, Berta adapta cada conferencia con calidez, empatía y excelencia bilingüe.
          </p>
        </div>
      </section>

      {/* ── 3 Main Speaking Pillars ── */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Modalidades de Charlas Disponibles</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {speakingServices.map((srv) => (
            <div
              key={srv.id}
              className="glass-card glow-purple"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(121, 35, 89, 0.14)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {srv.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-terracotta)' }}>
                      {srv.badge}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                      {srv.title}
                    </h3>
                  </div>
                </div>

                <InteractiveHoverButton onClick={() => openBookingModal(srv.id)} style={{ fontSize: '0.82rem' }}>
                  Agendar esta charla
                </InteractiveHoverButton>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {srv.desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(121, 35, 89, 0.04)', padding: '14px 16px', borderRadius: 'var(--radius-sm)' }}>
                {srv.highlights.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={15} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Dirigido a:</strong> {srv.audience}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA Button */}
      <section style={{ marginBottom: '44px', textAlign: 'center' }}>
        <div className="glass-card glow-amber" style={{ padding: '28px 24px' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>¿Listo para llevar un mensaje transformador a tu grupo o empresa?</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 20px auto' }}>
            Reserva una fecha para tu escuela, grupo de padres, grupo de damas de iglesia, comunidad de fe o equipo de empleados.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <InteractiveHoverButton onClick={() => openBookingModal('educativa')}>
              Solicitar Fecha de Charla
            </InteractiveHoverButton>
            <button
              className="btn-secondary"
              onClick={() => onNavigate('conecta')}
              style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Ir a Formulario de Contacto
            </button>
          </div>
        </div>
      </section>

      {/* Clips Gallery */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Momentos y Conferencias</h2>
        <div className="news-row-scroll">
          {clips.map((clip) => (
            <div key={clip.id} className="glass-card glass-card-interactive news-card-horizontal" style={{ padding: 0 }} onClick={() => triggerToast(`Reproduciendo clip: ${clip.title}`)}>
              <div style={{ position: 'relative', height: '140px', backgroundImage: `url(${clip.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', color: 'var(--bg-obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <Play size={16} fill="currentColor" style={{ marginLeft: 2 }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 'bold' }}>
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Lo que dicen quienes la han invitado</h2>
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

      {/* ── Booking Modal Overlay ── */}
      {selectedBookingType && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setSelectedBookingType(null)}
        >
          <div
            className="glass-card glow-purple"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '28px 24px',
              border: '1px solid var(--glass-border-highlight)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="editorial-tag" style={{ marginBottom: '4px' }}>Solicitud de Invitación</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>Agendar a Berta Weyenberg</h3>
              </div>
              <button
                onClick={() => setSelectedBookingType(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Tipo de Charla *</label>
                <select
                  className="form-control"
                  value={bookingForm.type}
                  onChange={e => setBookingForm({ ...bookingForm, type: e.target.value })}
                  style={{ background: 'var(--bg-space)', color: 'var(--text-primary)' }}
                >
                  <option value="educativa">🎓 Charla Educativa (Educación de estudiantes y crianza de hijos)</option>
                  <option value="inspiracional">✨ Charla Inspiracional (Grupos de damas de iglesia / Grupos de fe)</option>
                  <option value="empresarial">💼 Charla para Compañías (Mensaje de inspiración y aliento para empleados)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tu Nombre Completo *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Ej. María González"
                  value={bookingForm.name}
                  onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Escuela, Iglesia, Grupo de Fe o Compañía</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de tu institución, iglesia o empresa..."
                  value={bookingForm.organization}
                  onChange={e => setBookingForm({ ...bookingForm, organization: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={bookingForm.email}
                    onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha Tentativa</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detalles del Evento o Tema de Interés</label>
                <textarea
                  className="form-control"
                  placeholder="Cuéntanos sobre tu audiencia (estudiantes/padres, grupo de damas/fe o empleados de tu compañía) y qué mensaje deseas compartir..."
                  value={bookingForm.message}
                  onChange={e => setBookingForm({ ...bookingForm, message: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedBookingType(null)}
                  style={{ padding: '10px 16px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <InteractiveHoverButton type="submit">
                  Confirmar Solicitud
                </InteractiveHoverButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicSpeakerView;
