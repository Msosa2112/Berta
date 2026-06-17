import React, { useState } from 'react';
import { Play, BookOpen, ChevronRight, MapPin, Calendar, Newspaper, Clock, ArrowRight, Mic, Star, Award, Briefcase, Mail, ChevronDown } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const CAT_COLORS = {
  'Comunidad': { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  'Educación':  { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  'Salud':      { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  'Blog':       { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6' },
  'Cultura':    { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
};

const TIPO_COLORS = {
  'Cultural':   { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  'Familia':    { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  'Educación':  { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  'Negocios':   { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const BentoGrid = ({ children }) => {
  return <div className="magic-bento-grid reveal">{children}</div>;
};

const BentoCard = ({ Icon, name, description, cta, className, background, children, onClick }) => {
  return (
    <div className={`magic-bento-card ${className || ''}`} onClick={onClick}>
      {background && <div className="magic-bento-bg">{background}</div>}
      <div className="magic-bento-info">
        {Icon && <Icon className="magic-bento-card-icon" size={24} />}
        <h3 className="magic-bento-title">{name}</h3>
        <p className="magic-bento-desc">{description}</p>
        {children}
        {cta && (
          <span className="magic-bento-cta">
            {cta} <ArrowRight size={14} />
          </span>
        )}
      </div>
    </div>
  );
};

const HomeView = ({
  episodes, reflections, noticias, eventos, negocios,
  onPlay, onOpenPlaylist, onOpenArticle, onNavigate,
  savedEpisodes, onToggleSave, triggerToast,
}) => {
  const featuredEp   = episodes[0];
  const recentNews   = noticias.slice(0, 4);
  const nextEvents   = eventos.slice(0, 3);
  const featuredBiz  = negocios.filter(b => b.destacado).slice(0, 3);
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <div className="reveal" style={{ paddingBottom: '40px' }}>
      <BentoGrid>
        {/* Card 1: Bio / Presentación (Span 12) */}
        <div className="magic-bento-card magic-bento-col-12" style={{ cursor: 'default', minHeight: 'auto' }}>
          <div className="bio-card-inner">
            {/* Top row: avatar + name — tappable on mobile to toggle expand */}
            <div
              className="bio-section-inner bio-toggle-header"
              onClick={() => setBioExpanded(prev => !prev)}
              role="button"
              aria-expanded={bioExpanded}
              style={{ cursor: 'pointer' }}
            >
              <div className="bio-avatar">
                <img src="/berta.jpeg" alt="Berta Weyenberg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="bio-text-block">
                <h2 className="bio-name">Berta Weyenberg</h2>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-terracotta)', letterSpacing: '0.05em', margin: '4px 0 8px 0' }}>
                  Host &amp; Líder Comunitaria
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                  <MapPin size={12} color="var(--accent-amber)" />
                  <span>Louisville, Kentucky</span>
                </div>
              </div>
              {/* Chevron icon — only visible on mobile */}
              <div className="bio-chevron" style={{ transform: bioExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                <ChevronDown size={18} color="var(--text-muted)" />
              </div>
            </div>

            {/* Collapsible body */}
            <div className={`bio-collapsible-body${bioExpanded ? ' bio-collapsible-open' : ''}`}>
              <p className="bio-description bio-description-full">
                Originaria de Cuba, Berta Polo Weyenberg es educadora galardonada y figura central de la comunidad hispana en Kentucky. Como Coordinadora de Familias Multilingües en JCPS, su misión es conectar y empoderar a través de diálogos basados en la fe, la resiliencia y la educación.
              </p>
              <div className="bio-quote">
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={16} color="var(--accent-terracotta)" />
                  ¿Por qué ConBERTAciones?
                </strong>
                <p style={{ marginTop: '4px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Nace de la unión de <em>Berta</em> y <em>Conversaciones</em>. Es un espacio de encuentro para amplificar las voces latinas, compartir historias de fe y superación, y construir puentes de apoyo y visibilidad dentro de nuestra comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: ConBERTAciones Podcast (Span 8) */}
        <BentoCard
          Icon={Mic}
          name="ConBERTAciones Podcast"
          description={featuredEp ? `Último Episodio: ${featuredEp.title.split('|')[0]}` : "Diálogos inspiradores con líderes y miembros de la comunidad."}
          cta="Escuchar ahora"
          className="magic-bento-col-8 glow-purple"
          onClick={() => featuredEp && onPlay(featuredEp)}
          background={
            featuredEp && (
              <div style={{
                position: 'absolute',
                right: '-20px',
                bottom: '-20px',
                width: '240px',
                height: '240px',
                backgroundImage: `url(${featuredEp.art || '/cover_art_games.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 'var(--radius-md)',
                maskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 80%)',
                opacity: 0.5,
              }} />
            )
          }
        >
          {featuredEp && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', marginBottom: '16px', zIndex: 10, pointerEvents: 'auto' }}>
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }} onClick={(e) => { e.stopPropagation(); onPlay(featuredEp); }}>
                <Play size={14} fill="currentColor" />
                <span>{featuredEp.duration}</span>
              </button>
              <div className="wave-container">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>
          )}
        </BentoCard>

        {/* Card 3: Bajo la Sombrilla / Reflections (Span 4) */}
        <BentoCard
          Icon={BookOpen}
          name="Bajo la Sombrilla"
          description="Mensajes semanales en dos idiomas para inspirar tu fe y resiliencia en el día a día."
          cta="Ver reflexiones"
          className="magic-bento-col-4 glow-amber"
          onClick={() => onNavigate('umbrella')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginBottom: '16px', pointerEvents: 'auto', zIndex: 10 }}>
            <InteractiveHoverButton style={{ width: '100%', justifyContent: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onOpenPlaylist('es'); }}>
              Bajo la Sombrilla (ES)
            </InteractiveHoverButton>
            <InteractiveHoverButton style={{ width: '100%', justifyContent: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onOpenPlaylist('en'); }}>
              Under the Umbrella (EN)
            </InteractiveHoverButton>
          </div>
        </BentoCard>

        {/* Card 4: Noticias y Blog (Span 8) */}
        <BentoCard
          Icon={Newspaper}
          name="Noticias y Blog"
          description="Mantente al día con lo último sobre educación, salud y cultura de nuestra comunidad."
          cta="Ver Blog completo"
          className="magic-bento-col-8"
          onClick={() => onNavigate('noticias')}
        >
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px', marginBottom: '16px', overflowX: 'auto', pointerEvents: 'auto', width: '100%', zIndex: 10 }} className="no-scrollbar">
            {recentNews.slice(0, 2).map((n) => {
              const cat = CAT_COLORS[n.categoria] || { bg: 'rgba(255,255,255,0.08)', text: 'var(--text-muted)' };
              return (
                <div key={n.id} className="glass-card news-card-horizontal" style={{ width: '220px', padding: 0, minHeight: 'auto', border: '1px solid rgba(255,255,255,0.04)' }} onClick={(e) => { e.stopPropagation(); onOpenArticle(n); }}>
                  <div style={{ height: '90px', backgroundImage: `url(${n.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', position: 'relative' }}>
                    <span className="news-card-badge" style={{ background: cat.bg, color: cat.text, top: '8px', left: '8px', padding: '2px 8px', fontSize: '0.62rem' }}>
                      {n.categoria}
                    </span>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px', color: 'var(--text-primary)', margin: 0 }}>
                      {n.titulo}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>

        {/* Card 5: Directorio de Negocios (Span 4) */}
        <BentoCard
          Icon={Briefcase}
          name="Directorio Comercial"
          description="Encuentra y apoya negocios y servicios hispanos locales en Louisville."
          cta="Explorar directorio"
          className="magic-bento-col-4 glow-amber"
          onClick={() => onNavigate('negocios')}
        >
          <div className="bento-marquee-container">
            <div className="bento-marquee-track">
              {[...featuredBiz, ...featuredBiz].map((b, idx) => (
                <div key={idx} className="bento-marquee-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{b.nombre}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--accent-amber)' }}>
                    ★ {b.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '70px' }}></div>
        </BentoCard>

        {/* Card 6: Próximos Eventos (Span 8) */}
        <BentoCard
          Icon={Calendar}
          name="Próximos Eventos"
          description="Acompáñanos en los talleres, ferias y festivales de nuestra comunidad latina."
          cta="Ver calendario de eventos"
          className="magic-bento-col-8"
          onClick={() => onNavigate('eventos')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', marginBottom: '16px', pointerEvents: 'auto', zIndex: 10 }}>
            {nextEvents.slice(0, 2).map((ev) => {
              return (
                <div key={ev.id} className="glass-card" style={{ padding: '10px 14px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.02)' }} onClick={(e) => { e.stopPropagation(); onNavigate('eventos'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{ev.nombre}</h4>
                    {ev.gratis && <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>GRATIS</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{formatDate(ev.fecha)}</span>
                    <span>·</span>
                    <span>{ev.hora}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>

        {/* Card 7: Public Speaker (Span 4) */}
        <BentoCard
          Icon={Award}
          name="Public Speaker"
          description="Berta Weyenberg es conferencista internacional y panelista destacada."
          cta="Ver trayectoria cívica"
          className="magic-bento-col-4"
          onClick={() => onNavigate('speaker')}
          background={
            <div style={{
              position: 'absolute',
              right: '-10px',
              bottom: '-25px',
              fontSize: '110px',
              opacity: 0.04,
              color: 'var(--text-primary)',
              fontFamily: 'serif',
              fontWeight: 'bold',
              userSelect: 'none',
            }}>
              🎙️
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: '14px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--accent-amber)' }}>🏆</span>
              <span>Premio MOSAIC de Impacto Social</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--accent-amber)' }}>🏆</span>
              <span>Premio WLKY Bell Humanitario</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 8: Conecta (Span 12) */}
        <BentoCard
          Icon={Mail}
          name="Conecta con Nosotros"
          description="¿Tienes alguna propuesta de colaboración, duda u opinión? Estaremos encantados de escucharte."
          cta="Ir a Conecta"
          className="magic-bento-col-12 glow-purple"
          onClick={() => onNavigate('conecta')}
        >
          <div style={{ display: 'flex', gap: '24px', marginTop: '8px', marginBottom: '12px', flexWrap: 'wrap', zIndex: 10 }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📍</span> Louisville, Kentucky
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✉️</span> info@conbertaciones.com
            </div>
          </div>
        </BentoCard>
      </BentoGrid>
    </div>
  );
};

export default HomeView;
