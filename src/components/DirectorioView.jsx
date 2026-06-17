import React, { useState } from 'react';
import { Search, Phone, Globe, MapPin, X, Star, Theater, Laptop, Home as HomeIcon, Clock } from 'lucide-react';

const CATEGORIES = ['Todos', 'Restaurantes', 'Servicios', 'Salud', 'Legal', 'Medios', 'Educación'];

const CAT_COLORS = {
  'Restaurantes': { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  'Servicios':    { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  'Salud':        { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  'Legal':        { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
  'Medios':       { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  'Educación':    { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
};

const getStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '');
};

const DirectorioView = ({ negocios, triggerToast }) => {
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeBiz, setActiveBiz]           = useState(null);

  const sponsorIcons = {
    theater: <Theater size={24} color="var(--accent-terracotta)" />,
    laptop: <Laptop size={24} color="var(--accent-terracotta)" />,
    home: <HomeIcon size={24} color="var(--accent-terracotta)" />
  };

  const sponsors = [
    { id: 'sp1', name: 'Lexington Comedy Club', logoKey: 'theater', desc: 'Auspiciador oficial de ConBERTAciones.', web: 'https://lexcomedy.com', contact: '(502) 555-0122' },
    { id: 'sp2', name: 'Aguilera Tech Hub', logoKey: 'laptop', desc: 'Soluciones de tecnología bilingüe en Louisville.', web: 'https://aguileratech.com', contact: '(502) 555-9876' },
    { id: 'sp3', name: 'Casa Latina', logoKey: 'home', desc: 'Servicios comunitarios e integración familiar.', web: 'https://casalatinalouisville.org', contact: '(502) 555-0187' }
  ];

  const weeklyFeatured = negocios.find(b => b.destacado) || negocios[0];

  const filtered = negocios.filter(b => {
    const matchCat    = activeCategory === 'Todos' || b.categoria === activeCategory;
    const matchSearch = b.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCat = (cat) => CAT_COLORS[cat] || { bg: 'rgba(255,255,255,0.08)', text: 'var(--text-muted)' };

  return (
    <div className="reveal">
      {/* ── Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Negocios & Promoción</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Apoyando al comercio local y conectando a las familias hispanas de Kentucky con servicios de confianza.
        </p>
      </header>

      {/* ── Sponsors Panel ── */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Patrocinadores Oficiales</h2>
        <div className="news-row-scroll" style={{ paddingBottom: '12px' }}>
          {sponsors.map(sp => (
            <div 
              key={sp.id} 
              className="glass-card glass-card-interactive" 
              style={{ width: '260px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}
              onClick={() => {
                if (sp.web) {
                  window.open(sp.web, '_blank');
                  triggerToast(`Abriendo sitio web de ${sp.name}...`);
                } else {
                  triggerToast(`Contacto: ${sp.contact}`);
                }
              }}
            >
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                {sponsorIcons[sp.logoKey]}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{sp.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{sp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Business of the Week ── */}
      {weeklyFeatured && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Destacado de la Semana</h2>
          
          <div className="glass-card weekly-biz-card glow-amber glass-card-interactive" onClick={() => setActiveBiz(weeklyFeatured)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', mdDirection: 'row' }} className="responsive-flex">
              <div style={{ width: '100%', maxWidth: '240px', height: '150px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={weeklyFeatured.imagen} alt={weeklyFeatured.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="weekly-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="currentColor" /> Destacado
                </span>
                <h3 style={{ fontSize: '1.35rem', margin: '4px 0 8px 0' }}>{weeklyFeatured.nombre}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{weeklyFeatured.categoria}</span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', color: '#fbbf24' }}>
                    <Star size={12} fill="currentColor" style={{ marginRight: '3px' }} /> {weeklyFeatured.rating}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {weeklyFeatured.descripcion}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Directory Section ── */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Directorio Comercial</h2>
        
        {/* Search Input */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-obsidian)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o descripción..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.88rem', width: '100%' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Mostrando {filtered.length} {filtered.length === 1 ? 'negocio' : 'negocios'} {activeCategory !== 'Todos' && `en la categoría ${activeCategory}`}
        </p>

        {/* Directory Grid */}
        <div className="directory-grid">
          {filtered.map(b => {
            const cat = getCat(b.categoria);
            return (
              <div key={b.id} className="glass-card glass-card-interactive biz-card glow-purple" onClick={() => setActiveBiz(b)}>
                <div className="biz-img" style={{ backgroundImage: `url(${b.imagen})` }} />
                <div className="biz-body">
                  <div>
                    <span className="biz-cat-badge" style={{ background: cat.bg, color: cat.text }}>
                      {b.categoria}
                    </span>
                    <h4 className="biz-name">{b.nombre}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: '#fbbf24', margin: '4px 0 12px 0' }}>
                      <span>{getStars(b.rating)}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{b.rating}</span>
                    </div>
                    <p className="biz-desc">{b.descripcion}</p>
                  </div>
                  
                  <div className="biz-footer-actions" onClick={e => e.stopPropagation()}>
                    <a href={`tel:${b.telefono}`} className="biz-btn-icon" title="Llamar al negocio">
                      <Phone size={14} />
                    </a>
                    {b.web && (
                      <a href={b.web} target="_blank" rel="noopener noreferrer" className="biz-btn-icon" title="Visitar web">
                        <Globe size={14} />
                      </a>
                    )}
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(b.direccion)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="biz-btn-icon" 
                      title="Ver en Google Maps"
                    >
                      <MapPin size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No se encontraron resultados en esta categoría.
          </div>
        )}
      </section>

      {/* Business Details Modal */}
      {activeBiz && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setActiveBiz(null)}>
          <div className="glass-card glow-purple" style={{ maxWidth: '440px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '180px', backgroundImage: `url(${activeBiz.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(121,35,89,0.85) 0%, transparent 60%)' }} />
              <button 
                onClick={() => setActiveBiz(null)} 
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {(() => { const cat = getCat(activeBiz.categoria); return (
                <span className="biz-cat-badge" style={{ background: cat.bg, color: cat.text, marginBottom: '8px' }}>
                  {activeBiz.categoria}
                </span>
              ); })()}

              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '4px' }}>{activeBiz.nombre}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fbbf24', marginBottom: '16px' }}>
                <span>{getStars(activeBiz.rating)}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{activeBiz.rating}</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {activeBiz.descripcion}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <MapPin size={14} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
                  <span>{activeBiz.direccion}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={14} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
                  <span>{activeBiz.telefono}</span>
                </div>
                {activeBiz.horario && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <Clock size={14} color="var(--accent-terracotta)" style={{ flexShrink: 0 }} />
                    <span>{activeBiz.horario}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`tel:${activeBiz.telefono}`} className="btn-primary" style={{ flex: 1, padding: '12px', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Llamar
                </a>
                {activeBiz.web && (
                  <a href={activeBiz.web} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: '48px', height: '48px', padding: 0, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={18} />
                  </a>
                )}
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(activeBiz.direccion)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary" 
                  style={{ width: '48px', height: '48px', padding: 0, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MapPin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorioView;
