import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowUpRight, Play, Search, RefreshCw, Mic, Clock, Calendar } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { useLanguage } from '../utils/i18n.jsx';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

const SpotifyIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const BlogCard = ({ reflection, activeTab, globalLang, tr, onClick, onPlayAudio }) => {
  const showEnPrimary = (activeTab === 'en' || (activeTab === 'all' && globalLang === 'en')) && reflection.titleEn;
  const title = showEnPrimary
    ? reflection.titleEn
    : (reflection.titleEs || reflection.titleEn || tr('Sin título', 'Untitled'));
  const secondaryTitle = showEnPrimary ? reflection.titleEs : reflection.titleEn;
  const rawContent = showEnPrimary
    ? (reflection.contentEn || reflection.contentEs || '')
    : (reflection.contentEs || reflection.contentEn || '');
  const summary = stripHtml(rawContent).substring(0, 125) + '...';
  const langLabel = reflection.titleEs && reflection.titleEn ? tr('Bilingüe (ES / EN)', 'Bilingual (ES / EN)') : reflection.titleEs ? 'Español' : 'English';
  const duration = showEnPrimary ? (reflection.durationEn || reflection.durationEs) : (reflection.durationEs || reflection.durationEn);
  const spotifyUrl = showEnPrimary ? (reflection.spotifyUrlEn || reflection.spotifyUrlEs) : (reflection.spotifyUrlEs || reflection.spotifyUrlEn);

  return (
    <div 
      className="glass-card glass-card-interactive blog-card" 
      onClick={onClick} 
      style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--glass-border)' }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 'var(--radius-md) var(--radius-md) 0 0' }}>
        <img 
          src={reflection.thumbnail || '/cover_art_games.png'} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--duration-slow) var(--ease-spring)' }}
          className="blog-card-img"
        />
        <span className="news-card-badge" style={{ background: 'rgba(121, 35, 89, 0.85)', color: '#fff', top: '12px', left: '12px', backdropFilter: 'blur(6px)' }}>
          ☂️ {tr('Reflexión', 'Reflection')} · {langLabel}
        </span>
        {duration && (
          <span style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.72)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Clock size={11} /> {duration}
          </span>
        )}
      </div>
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {reflection.releaseDate && (
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={11} /> {reflection.releaseDate}
            </div>
          )}
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.35 }}>{title}</h4>
          {secondaryTitle && activeTab === 'all' && (
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-terracotta)', marginBottom: '8px' }}>
              {showEnPrimary ? `ES: ${secondaryTitle}` : `EN: ${secondaryTitle}`}
            </div>
          )}
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>{summary}</p>
        </div>
        
        <div>
          {/* Audio quick play buttons for ES / EN + Spotify link */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }} onClick={e => e.stopPropagation()}>
            {(reflection.audioEs || reflection.titleEs) && (
              <button
                onClick={() => onPlayAudio && onPlayAudio(reflection, 'es')}
                className="btn-secondary"
                style={{ padding: '5px 10px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                title="Escuchar reflexión en Español"
              >
                <Play size={11} fill="currentColor" /> Audio ES
              </button>
            )}
            {(reflection.audioEn || reflection.titleEn) && (
              <button
                onClick={() => onPlayAudio && onPlayAudio(reflection, 'en')}
                className="btn-secondary"
                style={{ padding: '5px 10px', fontSize: '0.74rem', display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                title="Listen to reflection in English"
              >
                <Play size={11} fill="currentColor" /> Audio EN
              </button>
            )}
            {spotifyUrl && (
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  padding: '5px 9px',
                  fontSize: '0.74rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#1DB954',
                  borderColor: 'rgba(29, 185, 84, 0.3)',
                  textDecoration: 'none',
                  marginLeft: 'auto',
                }}
                title={tr('Abrir reflexión en Spotify', 'Open reflection on Spotify')}
              >
                <SpotifyIcon size={12} /> Spotify
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
            <img src="/berta.jpeg" alt="Berta" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)' }}>Berta Weyenberg</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-disabled)' }}>
                Under the Umbrella · {tr('Reflexión', 'Reflection')}
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
              {tr('Leer →', 'Read →')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedCard = ({ reflection, globalLang, tr, onClick, onPlayAudio }) => {
  const showEn = globalLang === 'en' && reflection.titleEn;
  const title = showEn ? reflection.titleEn : (reflection.titleEs || reflection.titleEn || tr('Sin título', 'Untitled'));
  const secondary = showEn ? reflection.titleEs : reflection.titleEn;
  const rawContent = showEn ? (reflection.contentEn || reflection.contentEs || '') : (reflection.contentEs || reflection.contentEn || '');
  const summary = stripHtml(rawContent).substring(0, 170) + '...';
  const langLabel = reflection.titleEs && reflection.titleEn ? tr('Bilingüe (ES / EN)', 'Bilingual (ES / EN)') : reflection.titleEs ? 'Español' : 'English';

  return (
    <div
      onClick={onClick}
      className="featured-banner bento-col-12 glass-card-interactive"
      style={{ padding: 0, textDecoration: 'none', cursor: 'pointer' }}
    >
      <img 
        src={reflection.thumbnail || '/cover_art_games.png'} 
        alt={title} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }} 
      />

      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to top, rgba(121, 35, 89, 0.96) 0%, rgba(121, 35, 89, 0.55) 60%, rgba(0,0,0,0.2) 100%)' 
        }} 
      />

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', margin: 0 }}>
              ☂️ {tr('Reflexión Más Reciente', 'Latest Reflection')} · {langLabel}
            </span>
            {reflection.releaseDate && (
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                {reflection.releaseDate}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '1.55rem', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
              {title} {secondary ? ` / ${secondary}` : ''}
            </h3>
            <ArrowUpRight className="shrink-0 text-white" style={{ width: '22px', height: '22px', flexShrink: 0, color: '#fff' }} />
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.88)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{summary}</p>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <img src="/berta.jpeg" alt="Berta" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                  {tr('Escrito y narrado por', 'Written and narrated by')}
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Berta Weyenberg</p>
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
                {tr('Sección', 'Section')}
              </p>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>
                Under the Umbrella · {tr('Reflexiones', 'Reflections')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
            {reflection.audioEs && (
              <button
                onClick={() => onPlayAudio && onPlayAudio(reflection, 'es')}
                style={{
                  background: '#fff',
                  color: '#792359',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Play size={12} fill="currentColor" /> Escuchar (ES)
              </button>
            )}
            {reflection.audioEn && (
              <button
                onClick={() => onPlayAudio && onPlayAudio(reflection, 'en')}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Play size={12} fill="currentColor" /> Listen (EN)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UnderTheUmbrellaView = ({
  reflections,
  onOpenPlaylist,
  onOpenReflection,
  onPlayReflectionAudio,
  onNavigate,
  onSyncSpotify,
  isSyncingSpotify,
}) => {
  const { lang, tr } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredReflection = reflections[0];

  // Filter logic
  const filteredReflections = reflections.filter(r => {
    if (activeTab === 'es' && !(r.videoEs || r.contentEs || r.titleEs)) return false;
    if (activeTab === 'en' && !(r.videoEn || r.contentEn || r.titleEn)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEs = (r.titleEs || '').toLowerCase().includes(q) || (r.rawEs || r.contentEs || '').toLowerCase().includes(q);
      const matchEn = (r.titleEn || '').toLowerCase().includes(q) || (r.rawEn || r.contentEn || '').toLowerCase().includes(q);
      return matchEs || matchEn;
    }
    return true;
  });

  const sortedReflections = [...filteredReflections];
  if (sortBy === 'oldest') {
    sortedReflections.reverse();
  }

  return (
    <div className="reveal" style={{ paddingBottom: '40px' }}>
      {/* ── Top Header Section ── */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="editorial-tag" style={{ background: 'rgba(218, 81, 246, 0.14)', color: 'var(--accent-terracotta)', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              ☂️ {tr('Under the Umbrella (Bajo la Sombrilla) · Reflexiones Bilingües', 'Under the Umbrella (Bajo la Sombrilla) · Bilingual Reflections')}
            </span>
            <h1 style={{ fontSize: '2.35rem', marginTop: '4px', marginBottom: '8px' }}>
              {tr('Under the Umbrella: Reflexiones', 'Under the Umbrella: Reflections')}
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: 0 }}>
              {tr(
                'Cápsulas y reflexiones semanales de Berta Weyenberg sobre motivación, paz y fe en Español e Inglés — disponibles para leer y escuchar en audio desde Spotify for Creators.',
                'Weekly capsules and reflections by Berta Weyenberg on motivation, peace, and faith in Spanish and English — available to read and listen to via Spotify for Creators.'
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <InteractiveHoverButton onClick={() => onOpenPlaylist('es')} style={{ height: '40px', fontSize: '0.82rem' }}>
              <Play size={12} fill="currentColor" /> Playlist Español (ES)
            </InteractiveHoverButton>
            <InteractiveHoverButton onClick={() => onOpenPlaylist('en')} style={{ height: '40px', fontSize: '0.82rem' }}>
              <Play size={12} fill="currentColor" /> Playlist English (EN)
            </InteractiveHoverButton>
            {onSyncSpotify && (
              <button
                onClick={onSyncSpotify}
                disabled={isSyncingSpotify}
                className="btn-secondary"
                style={{ height: '40px', padding: '0 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                title={tr('Sincronizar reflexiones con Spotify', 'Sync reflections with Spotify')}
              >
                <RefreshCw size={14} style={{ animation: isSyncingSpotify ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isSyncingSpotify ? tr('Sincronizando...', 'Syncing...') : tr('Actualizar', 'Refresh')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Clear distinction banner between Under the Umbrella (Reflexiones) and ConBERTAciones (Entrevistas) */}
        <div
          className="glass-card"
          style={{
            marginTop: '18px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderLeft: '4px solid var(--accent-purple)',
          }}
        >
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {lang === 'es' ? (
              <>
                <strong>☂️ Under the Umbrella</strong> reúne las <strong>reflexiones cortas bilingües ({reflections.length} reflexiones)</strong>. ¿Buscas las entrevistas largas con invitados?
              </>
            ) : (
              <>
                <strong>☂️ Under the Umbrella</strong> brings together <strong>short bilingual reflections ({reflections.length} reflections)</strong>. Looking for full-length guest interviews?
              </>
            )}
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('podcast')}
              className="category-pill active"
              style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Mic size={13} /> {tr('Ir a ConBERTAciones (Entrevistas)', 'Go to ConBERTAciones (Interviews)')}
            </button>
          )}
        </div>
      </section>

      {/* ── Featured Reflection (Large Banner) ── */}
      {featuredReflection && !searchQuery && (
        <section style={{ marginBottom: '44px' }}>
          <div className="hide-on-mobile">
            <FeaturedCard
              reflection={featuredReflection}
              globalLang={lang}
              tr={tr}
              onClick={() => onOpenReflection(featuredReflection)}
              onPlayAudio={onPlayReflectionAudio}
            />
          </div>
          <div className="hide-on-desktop">
            <BlogCard
              reflection={featuredReflection}
              activeTab={activeTab}
              globalLang={lang}
              tr={tr}
              onClick={() => onOpenReflection(featuredReflection)}
              onPlayAudio={onPlayReflectionAudio}
            />
          </div>
        </section>
      )}

      {/* ── Tabs, Search & Sort Controls ── */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="category-pills" style={{ marginBottom: 0, display: 'flex', gap: '8px', border: 'none', padding: 0 }}>
            {[
              { id: 'all', label: tr(`Todas (${reflections.length})`, `All (${reflections.length})`) },
              { id: 'es', label: 'Español (ES)' },
              { id: 'en', label: 'English (EN)' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`category-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  borderRadius: 0,
                  background: 'none',
                  boxShadow: 'none',
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: activeTab === tab.id ? 'var(--accent-terracotta)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent-terracotta)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-space)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', minWidth: '210px' }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={tr('Buscar reflexión...', 'Search reflection...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.84rem', width: '100%' }}
              />
            </div>

            <select
              aria-label={tr('Ordenar por', 'Sort by')}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{
                background: 'var(--bg-space)',
                color: 'var(--text-primary)',
                borderColor: 'var(--glass-border)',
                fontSize: '0.84rem',
                height: '36px',
                padding: '0 12px',
                cursor: 'pointer',
                width: 'auto',
              }}
            >
              <option value="recent">{tr('Más recientes', 'Most recent')}</option>
              <option value="oldest">{tr('Más antiguas', 'Oldest first')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Grid of Reflections ── */}
      <section style={{ marginBottom: '40px' }}>
        {sortedReflections.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {tr('No se encontraron reflexiones con ese criterio.', 'No reflections found matching that criteria.')}
          </div>
        ) : (
          <div className="directory-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))' }}>
            {sortedReflections.map((ref) => (
              <BlogCard 
                key={ref.id} 
                reflection={ref} 
                activeTab={activeTab}
                globalLang={lang}
                tr={tr}
                onClick={() => onOpenReflection(ref)} 
                onPlayAudio={onPlayReflectionAudio}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UnderTheUmbrellaView;
