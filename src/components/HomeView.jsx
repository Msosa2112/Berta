import React, { useState } from 'react';
import { Play, BookOpen, MapPin, ArrowRight, Mic, Award, Mail, ChevronDown, Calendar, Scale, PenTool } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { useLanguage } from '../utils/i18n.jsx';

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
  episodes,
  reflections,
  noticias = [],
  statements = [],
  onPlay,
  onOpenPlaylist,
  onOpenReflection,
  onPlayReflectionAudio,
  onNavigate,
}) => {
  const { lang, tr } = useLanguage();
  const featuredEp = episodes[0];
  const recentInterviews = episodes.slice(0, 3);
  const recentReflections = reflections.slice(0, 4);
  const latestBlog = noticias[0];
  const latestStatement = statements[0];
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <div className="reveal" style={{ paddingBottom: '40px' }}>
      <BentoGrid>
        {/* Card 1: Bio / Presentación (Span 12) */}
        <div className="magic-bento-card magic-bento-col-12" style={{ cursor: 'default', minHeight: 'auto' }}>
          <div className="bio-card-inner">
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
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-terracotta)', letterSpacing: '0.03em', margin: '4px 0 8px 0' }}>
                  {tr(
                    'Host de ConBERTAciones · Reflexiones & Conferencista',
                    'Host of ConBERTAciones · Reflections & Public Speaker'
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                  <MapPin size={12} color="var(--accent-amber)" />
                  <span>Louisville, Kentucky</span>
                </div>
              </div>
              <div className="bio-chevron" style={{ transform: bioExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                <ChevronDown size={18} color="var(--text-muted)" />
              </div>
            </div>

            <div className={`bio-collapsible-body${bioExpanded ? ' bio-collapsible-open' : ''}`}>
              {lang === 'es' ? (
                <p className="bio-description bio-description-full">
                  Originaria de Cuba, Berta Polo Weyenberg es educadora galardonada y figura central de la comunidad hispana en Kentucky. A través de sus entrevistas en <strong>ConBERTAciones</strong> y sus reflexiones bilingües en <strong>Under the Umbrella (Bajo la Sombrilla)</strong>, comparte mensajes de fe, esperanza, educación y propósito.
                </p>
              ) : (
                <p className="bio-description bio-description-full">
                  Originally from Cuba, Berta Polo Weyenberg is an award-winning educator and central voice in Kentucky’s Hispanic community. Through her interviews on <strong>ConBERTAciones</strong> and her bilingual reflections on <strong>Under the Umbrella (Bajo la Sombrilla)</strong>, she shares messages of faith, hope, education, and purpose.
                </p>
              )}
              <div className="bio-quote">
                <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Mic size={16} color="var(--accent-terracotta)" />
                  {tr('Dos espacios pensados para ti:', 'Two spaces designed for you:')}
                </strong>
                {lang === 'es' ? (
                  <p style={{ marginTop: '4px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>🎙️ ConBERTAciones:</strong> nuestro espacio de entrevistas profundas y conversaciones con invitados especiales.<br />
                    <strong>☂️ Under the Umbrella:</strong> cápsulas y reflexiones cortas en Español e Inglés para inspirar tu día a día.
                  </p>
                ) : (
                  <p style={{ marginTop: '4px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>🎙️ ConBERTAciones:</strong> our space for in-depth interviews and meaningful conversations with special guests.<br />
                    <strong>☂️ Under the Umbrella:</strong> short capsules and reflections in Spanish and English to inspire your everyday life.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: ConBERTAciones · Entrevistas (Span 8) */}
        <BentoCard
          Icon={Mic}
          name={tr('ConBERTAciones · Entrevistas', 'ConBERTAciones · Interviews')}
          description={
            featuredEp
              ? tr(
                  `Entrevistas y diálogos con invitados · Última: ${featuredEp.title.split('|')[0]}`,
                  `Interviews and dialogues with guests · Latest: ${featuredEp.title.split('|')[0]}`
                )
              : tr(
                  'Programa de entrevistas y conversaciones profundas con invitados especiales.',
                  'In-depth interviews and inspiring conversations with special guests.'
                )
          }
          cta={tr('Ver todas las entrevistas', 'View all interviews')}
          className="magic-bento-col-8 glow-purple"
          onClick={() => onNavigate('podcast')}
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
                opacity: 0.45,
              }} />
            )
          }
        >
          {featuredEp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', marginBottom: '16px', zIndex: 10, pointerEvents: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }} onClick={(e) => { e.stopPropagation(); onPlay(featuredEp); }}>
                  <Play size={14} fill="currentColor" />
                  <span>{tr(`Escuchar última entrevista (${featuredEp.duration})`, `Listen to latest interview (${featuredEp.duration})`)}</span>
                </button>
                <div className="wave-container">
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              </div>

              {/* Mini list of recent interviews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {recentInterviews.slice(0, 3).map((ep) => (
                  <div
                    key={ep.id}
                    className="glass-card"
                    style={{
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255,255,255,0.45)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(ep);
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        🎙️ {ep.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {ep.host && ep.host !== 'Berta Weyenberg' ? `${tr('Invitado(a)', 'Guest')}: ${ep.host} · ` : ''}{ep.duration}
                      </div>
                    </div>
                    <button
                      className="biz-btn-icon"
                      style={{ width: '30px', height: '30px', flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay(ep);
                      }}
                      title={tr('Reproducir entrevista', 'Play interview')}
                    >
                      <Play size={12} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </BentoCard>

        {/* Card 3: Under the Umbrella / Reflections (Span 4) */}
        <BentoCard
          Icon={BookOpen}
          name={tr('Under the Umbrella · Reflexiones', 'Under the Umbrella · Reflections')}
          description={tr(
            `Cápsulas y reflexiones cortas bilingües (${reflections.length} episodios ES/EN) en lectura y audio para tu día a día.`,
            `Short bilingual capsules and reflections (${reflections.length} ES/EN episodes) in text and audio for your daily life.`
          )}
          cta={tr('Ver todas las reflexiones', 'View all reflections')}
          className="magic-bento-col-4 glow-amber"
          onClick={() => onNavigate('umbrella')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', marginBottom: '16px', pointerEvents: 'auto', zIndex: 10 }}>
            <InteractiveHoverButton style={{ width: '100%', justifyContent: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onOpenPlaylist('es'); }}>
              ☂️ Playlist en Español (ES)
            </InteractiveHoverButton>
            <InteractiveHoverButton style={{ width: '100%', justifyContent: 'flex-start' }} onClick={(e) => { e.stopPropagation(); onOpenPlaylist('en'); }}>
              ☂️ Playlist in English (EN)
            </InteractiveHoverButton>
          </div>
        </BentoCard>

        {/* Card 4: Últimas Reflexiones Bilingües (Span 8) */}
        <BentoCard
          Icon={BookOpen}
          name={tr('Últimas Reflexiones (Bajo la Sombrilla)', 'Latest Reflections (Under the Umbrella)')}
          description={tr(
            'Lee o escucha las reflexiones más recientes publicadas en Español e Inglés.',
            'Read or listen to the most recent reflections published in Spanish and English.'
          )}
          cta={tr('Explorar archivo completo de reflexiones', 'Explore full reflections archive')}
          className="magic-bento-col-8"
          onClick={() => onNavigate('umbrella')}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginTop: '10px', marginBottom: '16px', pointerEvents: 'auto', width: '100%', zIndex: 10 }}>
            {recentReflections.map((ref) => {
              const primaryTitle = lang === 'en' ? (ref.titleEn || ref.titleEs) : (ref.titleEs || ref.titleEn);
              const secondaryTitle = lang === 'en' ? ref.titleEs : ref.titleEn;
              return (
                <div
                  key={ref.id}
                  className="glass-card glass-card-interactive"
                  style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px', border: '1px solid var(--glass-border)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenReflection) onOpenReflection(ref);
                    else onNavigate('umbrella');
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>☂️ ES / EN</span>
                      {ref.releaseDate && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={10} /> {ref.releaseDate}
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                      {primaryTitle}
                    </h4>
                    {secondaryTitle && secondaryTitle !== primaryTitle && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
                        {secondaryTitle}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }} onClick={e => e.stopPropagation()}>
                    {ref.audioEs && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => onPlayReflectionAudio && onPlayReflectionAudio(ref, 'es')}
                      >
                        <Play size={10} fill="currentColor" /> ES ({ref.durationEs})
                      </button>
                    )}
                    {ref.audioEn && (
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                        onClick={() => onPlayReflectionAudio && onPlayReflectionAudio(ref, 'en')}
                      >
                        <Play size={10} fill="currentColor" /> EN ({ref.durationEn})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </BentoCard>

        {/* Card 5: Public Speaker (Span 4) */}
        <BentoCard
          Icon={Award}
          name={tr('Agenda una Charla', 'Book a Speaking Event')}
          description={tr(
            'Invita a Berta como conferencista para tu escuela, grupo de fe o empresa.',
            'Invite Berta as a speaker for your school, faith group, or company.'
          )}
          cta={tr('Agendar charla con Berta', 'Book Berta as a speaker')}
          className="magic-bento-col-4 glow-amber"
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '14px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🎓</span>
              <span>{tr('Educación de estudiantes e hijos', 'Student & parenting education')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✨</span>
              <span>{tr('Grupos de damas y grupos de fe', "Women's ministries & faith groups")}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💼</span>
              <span>{tr('Mensaje alentador para empresas', 'Encouraging message for companies')}</span>
            </div>
          </div>
        </BentoCard>

        {/* Card 6: The Weyenberg Statement (Span 6) */}
        <BentoCard
          Icon={Scale}
          name="The Weyenberg Statement"
          description={tr(
            'Statements de la familia Weyenberg basados en conceptos bíblicos, analizando fenómenos de la actualidad con un lente bíblico.',
            'Statements by the Weyenberg family grounded in biblical concepts, analyzing current phenomena through a biblical lens.'
          )}
          cta={tr('Leer todos los Statements', 'Read all Statements')}
          className="magic-bento-col-6 glow-purple"
          onClick={() => onNavigate('statement')}
        >
          {latestStatement && (
            <div
              className="glass-card"
              style={{
                padding: '12px 14px',
                marginTop: '8px',
                marginBottom: '14px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.5)',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-terracotta)', letterSpacing: '0.03em' }}>
                  {latestStatement.categoria || tr('Cosmovisión Bíblica', 'Biblical Worldview')}
                </span>
                {latestStatement.versiculo && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                    📖 {(lang === 'en' && latestStatement.versiculoEn ? latestStatement.versiculoEn : latestStatement.versiculo).split('—')[0]}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'en' && latestStatement.tituloEn ? latestStatement.tituloEn : latestStatement.titulo}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {lang === 'en' && latestStatement.resumenEn ? latestStatement.resumenEn : latestStatement.resumen}
              </div>
            </div>
          )}
        </BentoCard>

        {/* Card 7: Blog de Berta · Reflexiones e Imágenes (Span 6) */}
        <BentoCard
          Icon={PenTool}
          name={tr('Blog de Berta · Reflexiones', "Berta's Blog · Reflections")}
          description={tr(
            'Reflexiones escritas, enseñanzas para la familia y galerías de imágenes compartidas por Berta.',
            'Written reflections, family teachings, and image galleries shared by Berta.'
          )}
          cta={tr('Ir al Blog de Berta', "Go to Berta's Blog")}
          className="magic-bento-col-6 glow-amber"
          onClick={() => onNavigate('noticias')}
        >
          {latestBlog && (
            <div
              className="glass-card"
              style={{
                padding: '12px 14px',
                marginTop: '8px',
                marginBottom: '14px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.5)',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.03em' }}>
                  ✍️ {latestBlog.categoria || tr('Reflexiones', 'Reflections')}
                </span>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {lang === 'en' && latestBlog.tituloEn ? latestBlog.tituloEn : latestBlog.titulo}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {lang === 'en' && latestBlog.excerptEn ? latestBlog.excerptEn : latestBlog.excerpt}
              </div>
            </div>
          )}
        </BentoCard>

        {/* Card 8: Conecta (Span 12) */}
        <BentoCard
          Icon={Mail}
          name={tr('Conecta con Berta', 'Connect with Berta')}
          description={tr(
            'Envía tus preguntas para el segmento Dame La Letra, comparte tu testimonio o agenda una conferencia.',
            'Send your questions for the Dame La Letra segment, share your testimony, or book a speaking event.'
          )}
          cta={tr('Ir a Conecta', 'Go to Connect')}
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
