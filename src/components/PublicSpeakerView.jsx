import React, { useState } from 'react';
import { Award, Calendar, Play, Heart, Users, Star, BookOpen, Briefcase, Sparkles, CheckCircle2, X } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { useLanguage } from '../utils/i18n.jsx';

const PublicSpeakerView = ({ onNavigate, triggerToast }) => {
  const { tr } = useLanguage();
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
      badge: tr('Educación & Familia', 'Education & Family'),
      title: tr(
        'Charlas Educativas: Estudiantes y Educación de Hijos',
        'Educational Talks: Student Education & Parenting'
      ),
      icon: <BookOpen size={22} />,
      audience: tr(
        'Escuelas, padres de familia, talleres educativos y asociaciones estudiantiles',
        'Schools, parents, educational workshops, and student associations'
      ),
      desc: tr(
        'Orientación cercana y práctica referente a la educación de los estudiantes, el éxito académico y herramientas para apoyar a los padres en la crianza y formación integral de sus hijos.',
        'Warm, practical guidance regarding student education, academic success, and tools to support parents in raising and nurturing their children.'
      ),
      highlights: [
        tr('Apoyo en la educación y desarrollo de los estudiantes', 'Support in student education and academic growth'),
        tr('Guía práctica para padres sobre la educación de los hijos', 'Practical guidance for parents on raising and educating their children'),
        tr('Puentes entre la familia, la escuela y el futuro bilingüe', 'Building bridges between family, school, and a bilingual future'),
      ],
    },
    {
      id: 'inspiracional',
      badge: tr('Iglesias & Grupos de Fe', 'Churches & Faith Groups'),
      title: tr(
        'Charlas Inspiracionales para Grupos de Damas y Grupos de Fe',
        'Inspirational Talks for Women’s Ministries & Faith Groups'
      ),
      icon: <Heart size={22} />,
      audience: tr(
        'Grupos de damas de iglesia, ministerios, retiros y comunidades de fe',
        'Church women’s groups, ministries, retreats, and faith communities'
      ),
      desc: tr(
        'Mensajes cálidos y edificantes pensados para grupos de damas de iglesia o grupos de fe que se interesen en temas diversos de crecimiento espiritual, propósito, familia y resiliencia.',
        'Warm, uplifting messages crafted for church women’s groups or faith groups interested in diverse topics of spiritual growth, purpose, family, and resilience.'
      ),
      highlights: [
        tr('Encuentros, congresos y desayunos de grupos de damas', 'Conferences, retreats, and women’s ministry gatherings'),
        tr('Grupos de fe interesados en reflexiones sobre temas diversos', 'Faith groups interested in reflections on diverse life topics'),
        tr('Testimonios vivos de fe práctica, paz y esperanza', 'Living testimonies of practical faith, peace, and hope'),
      ],
    },
    {
      id: 'empresarial',
      badge: tr('Empresas & Equipos', 'Companies & Teams'),
      title: tr(
        'Mensajes de Inspiración y Aliento para Compañías y Empleados',
        'Messages of Inspiration & Encouragement for Companies & Employees'
      ),
      icon: <Briefcase size={22} />,
      audience: tr(
        'Dueños de compañías, líderes de negocios y equipos de trabajo',
        'Company owners, business leaders, and corporate teams'
      ),
      desc: tr(
        'Dirigido a cualquier dueño de compañía que desee regalarle a sus empleados un mensaje de inspiración y aliento que renueve el ánimo, el compromiso y el bienestar humano dentro del equipo.',
        'Designed for any company owner who wants to give their employees an inspiring, encouraging message that renews morale, commitment, and human well-being across the team.'
      ),
      highlights: [
        tr('Mensaje alentador y motivacional para empleados y colaboradores', 'Encouraging and motivational message for employees and staff'),
        tr('Fortalecimiento del ánimo, propósito y cultura de equipo', 'Strengthening morale, purpose, and team culture'),
        tr('Disponible en Español e Inglés para equipos diversos', 'Available in both Spanish and English for diverse teams'),
      ],
    },
  ];

  const clips = [
    {
      id: 'c1',
      title: tr('Charla Educativa: Familias y Estudiantes en JCPS', 'Educational Talk: Families & Students at JCPS'),
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80',
      duration: '5:40',
    },
    {
      id: 'c2',
      title: tr('Encuentro Inspiracional de Damas y Grupos de Fe', 'Inspirational Gathering for Women & Faith Groups'),
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80',
      duration: '3:15',
    },
    {
      id: 'c3',
      title: tr('Mensaje de Aliento e Inspiración para Equipos', 'Message of Encouragement & Inspiration for Teams'),
      image: 'https://images.unsplash.com/photo-1460889418202-14ebd4cc3b4b?w=500&q=80',
      duration: '8:50',
    },
  ];

  const testimonials = [
    {
      author: tr('Ana Reyes, Directora Comunitaria', 'Ana Reyes, Community Director'),
      text: tr(
        'Sus charlas educativas para padres e hijos transforman la manera en que nuestras familias se involucran en la educación de los estudiantes.',
        'Her educational talks for parents and children transform how our families engage in student education.'
      ),
      stars: 5,
    },
    {
      author: tr('Ministerio de Damas, Louisville', 'Women’s Ministry, Louisville'),
      text: tr(
        'Berta compartió con nuestro grupo de damas de la iglesia un mensaje inolvidable, lleno de sabiduría, calidez y fe práctica.',
        'Berta shared an unforgettable message with our church women’s group, filled with wisdom, warmth, and practical faith.'
      ),
      stars: 5,
    },
    {
      author: tr('Carlos Aguilera, Dueño de Empresa', 'Carlos Aguilera, Business Owner'),
      text: tr(
        'Invitamos a Berta para dar un mensaje alentador a nuestros empleados y el impacto positivo en todo el equipo fue inmediato.',
        'We invited Berta to share an encouraging message with our employees and the positive impact across the entire team was immediate.'
      ),
      stars: 5,
    },
  ];

  const openBookingModal = (typeId = 'educativa') => {
    setBookingForm(prev => ({ ...prev, type: typeId }));
    setSelectedBookingType(typeId);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
      if (triggerToast) triggerToast(tr('Por favor completa tu nombre y correo electrónico.', 'Please fill in your name and email address.'));
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
      triggerToast(tr('¡Solicitud de charla enviada! Berta se pondrá en contacto contigo pronto.', 'Speaking request sent! Berta will be in touch with you soon.'));
    }
  };

  return (
    <div className="reveal">
      {/* ── Bio Speaker Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <span className="editorial-tag" style={{ background: 'rgba(121, 35, 89, 0.14)', color: 'var(--accent-purple)', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={13} /> {tr('Conferencista & Oradora Bilingüe', 'Bilingual Keynote & Public Speaker')}
        </span>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
          {tr('Agenda a Berta para tu Evento', 'Book Berta for Your Event')}
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '680px' }}>
          {tr(
            'Charlas educativas para estudiantes y padres, mensajes inspiracionales para grupos de damas e iglesias, y conferencias de aliento para empresas y sus empleados.',
            'Educational talks for students and parents, inspirational messages for church women’s groups and faith communities, and encouraging talks for companies and their employees.'
          )}
        </p>
      </header>

      {/* Hero Banner Section */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ position: 'relative', height: '230px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-card)' }}>
          <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" alt="Public Speaking" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(121, 35, 89, 0.94) 0%, rgba(121, 35, 89, 0.35) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '22px', right: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', marginBottom: '6px' }}>
                {tr('Educación · Fe · Liderazgo Empresarial', 'Education · Faith · Corporate Leadership')}
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>
                {tr('Un mensaje con propósito para cada audiencia', 'A purposeful message for every audience')}
              </h3>
            </div>
            <button
              className="btn-primary"
              onClick={() => openBookingModal('educativa')}
              style={{ padding: '10px 20px', fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={15} /> {tr('Agendar Fecha Ahora', 'Book a Date Now')}
            </button>
          </div>
        </div>
      </section>

      {/* Intro Description */}
      <section style={{ marginBottom: '36px' }}>
        <div className="glass-card bio-card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            {tr(
              '¿Para qué tipo de eventos puedes agendar a Berta Weyenberg? Ya sea que busques fortalecer la educación de los estudiantes y la crianza de los hijos, compartir una palabra viva en grupos de damas de iglesia o grupos de fe sobre temas diversos, o seas dueño de una compañía que desea regalarle a sus empleados un mensaje de inspiración y aliento, Berta adapta cada conferencia con calidez, empatía y excelencia bilingüe.',
              'What kind of events can you book Berta Weyenberg for? Whether you want to strengthen student education and parenting, share an uplifting word with church women’s groups or faith groups on diverse topics, or you are a company owner looking to give your employees an inspiring, encouraging message, Berta tailors every talk with warmth, empathy, and bilingual excellence.'
            )}
          </p>
        </div>
      </section>

      {/* ── 3 Main Speaking Pillars ── */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
          {tr('Modalidades de Charlas Disponibles', 'Available Speaking Topics & Formats')}
        </h2>
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
                  {tr('Agendar esta charla', 'Book this talk')}
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
                <strong>{tr('Dirigido a:', 'Ideal for:')}</strong> {srv.audience}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking CTA Button */}
      <section style={{ marginBottom: '44px', textAlign: 'center' }}>
        <div className="glass-card glow-amber" style={{ padding: '28px 24px' }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
            {tr(
              '¿Listo para llevar un mensaje transformador a tu grupo o empresa?',
              'Ready to bring a transformative message to your group or company?'
            )}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 20px auto' }}>
            {tr(
              'Reserva una fecha para tu escuela, grupo de padres, grupo de damas de iglesia, comunidad de fe o equipo de empleados.',
              'Reserve a date for your school, parent group, church women’s ministry, faith community, or employee team.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <InteractiveHoverButton onClick={() => openBookingModal('educativa')}>
              {tr('Solicitar Fecha de Charla', 'Request a Speaking Date')}
            </InteractiveHoverButton>
            <button
              className="btn-secondary"
              onClick={() => onNavigate('conecta')}
              style={{ padding: '10px 20px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {tr('Ir a Formulario de Contacto', 'Go to Contact Form')}
            </button>
          </div>
        </div>
      </section>

      {/* Clips Gallery */}
      <section style={{ marginBottom: '44px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
          {tr('Momentos y Conferencias', 'Speaking Moments & Highlights')}
        </h2>
        <div className="news-row-scroll">
          {clips.map((clip) => (
            <div key={clip.id} className="glass-card glass-card-interactive news-card-horizontal" style={{ padding: 0 }} onClick={() => triggerToast(`${tr('Reproduciendo clip:', 'Playing clip:')} ${clip.title}`)}>
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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
          {tr('Lo que dicen quienes la han invitado', 'What Event Organizers Are Saying')}
        </h2>
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
                <span className="editorial-tag" style={{ marginBottom: '4px' }}>
                  {tr('Solicitud de Invitación', 'Speaking Invitation Request')}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                  {tr('Agendar a Berta Weyenberg', 'Book Berta Weyenberg')}
                </h3>
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
                <label className="form-label">{tr('Tipo de Charla *', 'Type of Talk *')}</label>
                <select
                  className="form-control"
                  value={bookingForm.type}
                  onChange={e => setBookingForm({ ...bookingForm, type: e.target.value })}
                  style={{ background: 'var(--bg-space)', color: 'var(--text-primary)' }}
                >
                  <option value="educativa">
                    {tr(
                      '🎓 Charla Educativa (Educación de estudiantes y crianza de hijos)',
                      '🎓 Educational Talk (Student education & parenting)'
                    )}
                  </option>
                  <option value="inspiracional">
                    {tr(
                      '✨ Charla Inspiracional (Grupos de damas de iglesia / Grupos de fe)',
                      '✨ Inspirational Talk (Church women’s groups / Faith groups)'
                    )}
                  </option>
                  <option value="empresarial">
                    {tr(
                      '💼 Charla para Compañías (Mensaje de inspiración y aliento para empleados)',
                      '💼 Corporate Talk (Inspiring & encouraging message for employees)'
                    )}
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{tr('Tu Nombre Completo *', 'Your Full Name *')}</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder={tr('Ej. María González', 'E.g. Maria Gonzalez')}
                  value={bookingForm.name}
                  onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {tr('Escuela, Iglesia, Grupo de Fe o Compañía', 'School, Church, Faith Group, or Company')}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={tr('Nombre de tu institución, iglesia o empresa...', 'Name of your school, church, or company...')}
                  value={bookingForm.organization}
                  onChange={e => setBookingForm({ ...bookingForm, organization: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">{tr('Correo Electrónico *', 'Email Address *')}</label>
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
                  <label className="form-label">{tr('Fecha Tentativa', 'Tentative Date')}</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingForm.date}
                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {tr('Detalles del Evento o Tema de Interés', 'Event Details or Topic of Interest')}
                </label>
                <textarea
                  className="form-control"
                  placeholder={tr(
                    'Cuéntanos sobre tu audiencia (estudiantes/padres, grupo de damas/fe o empleados de tu compañía) y qué mensaje deseas compartir...',
                    'Tell us about your audience (students/parents, women’s/faith group, or company employees) and the message you would like to share...'
                  )}
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
                  {tr('Cancelar', 'Cancel')}
                </button>
                <InteractiveHoverButton type="submit">
                  {tr('Confirmar Solicitud', 'Confirm Request')}
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
