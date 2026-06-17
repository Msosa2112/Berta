import React, { useState } from 'react';
import { BookOpen, ArrowUpRight, Play, Globe } from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
};

const BlogCard = ({ reflection, onClick }) => {
  const title = reflection.titleEs || reflection.titleEn || "Sin título";
  const rawContent = reflection.contentEs || reflection.contentEn || "";
  const summary = stripHtml(rawContent).substring(0, 110) + "...";
  const lang = reflection.titleEs && reflection.titleEn ? "Bilingüe" : reflection.titleEs ? "Español" : "English";
  
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
        <span className="news-card-badge" style={{ background: 'rgba(218, 81, 246, 0.15)', color: 'var(--accent-terracotta)', top: '12px', left: '12px' }}>
          {lang}
        </span>
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.35 }}>{title}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>{summary}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '14px', marginTop: '12px' }}>
          <img src="/berta.jpeg" alt="Berta" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>Berta Weyenberg</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-disabled)' }}>Reflexión</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedCard = ({ reflection, onClick }) => {
  const title = reflection.titleEs || reflection.titleEn || "Sin título";
  const rawContent = reflection.contentEs || reflection.contentEn || "";
  const summary = stripHtml(rawContent).substring(0, 160) + "...";
  const lang = reflection.titleEs && reflection.titleEn ? "Bilingüe" : reflection.titleEs ? "Español" : "English";

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="featured-banner bento-col-12 glass-card-interactive"
      style={{ padding: 0, textDecoration: 'none' }}
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
          background: 'linear-gradient(to top, rgba(121, 35, 89, 0.95) 0%, rgba(121, 35, 89, 0.4) 60%, transparent 100%)' 
        }} 
      />

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', alignSelf: 'flex-start', margin: 0 }}>
            Destacado · {lang}
          </span>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '1.55rem', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>{title}</h3>
            <ArrowUpRight className="shrink-0 text-white" style={{ width: '22px', height: '22px', flexShrink: 0, color: '#fff' }} />
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.85)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{summary}</p>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '12px', marginTop: '12px', display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <img src="/berta.jpeg" alt="Berta" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.3)' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Escrito por</p>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Berta Weyenberg</p>
            </div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Sección</p>
            <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#fff' }}>Reflexiones de Fe</p>
          </div>
        </div>
      </div>
    </a>
  );
};

const UnderTheUmbrellaView = ({ reflections, onOpenPlaylist, onOpenReflection }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const featuredReflection = reflections[0];

  // Filter logic
  const filteredReflections = reflections.filter(r => {
    if (activeTab === 'es') return r.videoEs || r.contentEs;
    if (activeTab === 'en') return r.videoEn || r.contentEn;
    return true;
  });

  // Sort logic (simulated since we don't have popular stats, but can invert or keep order)
  const sortedReflections = [...filteredReflections];
  if (sortBy === 'popular') {
    // Just reverse order to simulate popular sorting
    sortedReflections.reverse();
  }

  return (
    <div className="reveal" style={{ paddingBottom: '40px' }}>
      {/* ── Top Header Section ── */}
      <section style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="text-sm font-semibold text-brand-secondary" style={{ color: 'var(--accent-terracotta)', fontSize: '0.9rem', fontWeight: 600 }}>Under the Umbrella</span>
            <h1 style={{ fontSize: '2.5rem', marginTop: '4px', marginBottom: '8px' }}>Reflexiones y Artículos</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: 0 }}>
              Mensajes semanales de Berta Weyenberg, con reflexiones de motivación, paz y fe en inglés y español.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <InteractiveHoverButton onClick={() => onOpenPlaylist('es')} style={{ height: '40px', fontSize: '0.82rem' }}>
              <Play size={12} fill="currentColor" /> Playlist (ES)
            </InteractiveHoverButton>
            <InteractiveHoverButton onClick={() => onOpenPlaylist('en')} style={{ height: '40px', fontSize: '0.82rem' }}>
              <Play size={12} fill="currentColor" /> Playlist (EN)
            </InteractiveHoverButton>
          </div>
        </div>
      </section>

      {/* ── Featured Reflection (Large Banner) ── */}
      {featuredReflection && (
        <section style={{ marginBottom: '56px' }}>
          <div className="hide-on-mobile">
            <FeaturedCard reflection={featuredReflection} onClick={() => onOpenReflection(featuredReflection)} />
          </div>
          <div className="hide-on-desktop">
            <BlogCard reflection={featuredReflection} onClick={() => onOpenReflection(featuredReflection)} />
          </div>
        </section>
      )}

      {/* ── Tabs & Sort Controls ── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="flex flex-col items-end gap-8 md:flex-row" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0px', width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="category-pills" style={{ marginBottom: 0, display: 'flex', gap: '12px', border: 'none', padding: 0 }}>
            {[
              { id: 'all', label: 'Ver todas' },
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
                  padding: '12px 18px',
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
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '180px', marginBottom: '8px' }}>
            <select
              aria-label="Ordenar por"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
              style={{
                background: 'var(--bg-space)',
                color: 'var(--text-primary)',
                borderColor: 'var(--glass-border)',
                fontSize: '0.85rem',
                height: '38px',
                padding: '0 12px',
                cursor: 'pointer'
              }}
            >
              <option value="recent">Más recientes</option>
              <option value="popular">Más populares</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Grid of Reflections ── */}
      <section style={{ marginBottom: '40px' }}>
        {sortedReflections.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron reflexiones en esta categoría.
          </div>
        ) : (
          <div className="directory-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {sortedReflections.map((ref) => (
              <BlogCard 
                key={ref.id} 
                reflection={ref} 
                onClick={() => onOpenReflection(ref)} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UnderTheUmbrellaView;
