import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, ExternalLink, X, Plus } from 'lucide-react';

const TIPO_COLORS = {
  'Cultural':   { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  'Familia':    { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
  'Educación':  { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  'Negocios':   { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
  'Salud':      { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
};

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES   = ['D','L','M','M','J','V','S'];

const EventosView = ({ eventos, triggerToast }) => {
  const [currentDate, setCurrentDate]   = useState(new Date(2026, 3, 1)); // April 2026
  const [activeEvento, setActiveEvento] = useState(null);
  const [selectedDay, setSelectedDay]   = useState(null);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthEvents = eventos.filter(e => {
    const d = new Date(e.fecha + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const eventDays    = new Set(monthEvents.map(e => new Date(e.fecha + 'T00:00:00').getDate()));
  const displayEvents = selectedDay
    ? monthEvents.filter(e => new Date(e.fecha + 'T00:00:00').getDate() === selectedDay)
    : monthEvents;

  const getTipo = (t) => TIPO_COLORS[t] || { bg: 'rgba(255,255,255,0.08)', text: 'var(--text-muted)' };

  const formatLong = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const openMaps = (dir) => window.open(`https://maps.google.com/?q=${encodeURIComponent(dir)}`, '_blank');

  return (
    <div className="reveal">
      {/* ── Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Eventos Comunitarios</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Mantente al tanto de ferias, charlas, talleres y eventos culturales de nuestra comunidad en Louisville.
        </p>
      </header>

      {/* ── Calendar Grid Section ── */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Calendar Picker Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button className="biz-btn-icon" onClick={() => { setSelectedDay(null); setCurrentDate(new Date(year, month - 1, 1)); }}>
              <ChevronLeft size={18} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {MONTH_NAMES[month]} {year}
            </h3>
            <button className="biz-btn-icon" onClick={() => { setSelectedDay(null); setCurrentDate(new Date(year, month + 1, 1)); }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Week Day Titles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {DAY_NAMES.map((d, i) => <span key={i}>{d}</span>)}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const hasEvent = eventDays.has(day);
              const isSelected = selectedDay === day;
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={{
                    background: isSelected 
                      ? 'var(--accent-purple)' 
                      : isToday 
                        ? 'rgba(139, 92, 246, 0.15)' 
                        : 'rgba(255,255,255,0.02)',
                    border: isToday ? '1px solid var(--accent-purple)' : '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    height: '42px',
                    color: isSelected ? '#fff' : isToday ? 'var(--accent-purple)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.88rem',
                    fontWeight: isToday || isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                  className="btn-press"
                >
                  <span>{day}</span>
                  {hasEvent && (
                    <span style={{
                      position: 'absolute',
                      bottom: '4px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: isSelected ? '#fff' : 'var(--accent-amber)',
                      boxShadow: isSelected ? 'none' : '0 0 6px var(--accent-amber)'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Event List Results ── */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>
            {selectedDay
              ? `Eventos del ${selectedDay} de ${MONTH_NAMES[month]}`
              : `Todos los Eventos de ${MONTH_NAMES[month]}`}
          </h2>
          {selectedDay && (
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }} onClick={() => setSelectedDay(null)}>
              Ver todos
            </button>
          )}
        </div>

        {displayEvents.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No hay eventos programados para esta fecha.
          </div>
        ) : (
          <div className="event-grid">
            {displayEvents.map(ev => {
              const tipo = getTipo(ev.tipo);
              return (
                <div key={ev.id} className="glass-card glass-card-interactive event-card glow-purple" onClick={() => setActiveEvento(ev)}>
                  <div className="event-banner" style={{ backgroundImage: `url(${ev.imagen})` }} />
                  <div className="event-card-body">
                    <div>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <span className="biz-cat-badge" style={{ background: tipo.bg, color: tipo.text, margin: 0 }}>{ev.tipo}</span>
                        {ev.gratis && <span className="biz-cat-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', margin: 0 }}>Gratis</span>}
                      </div>
                      <h3 className="event-title" style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>{ev.nombre}</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Clock size={12} color="var(--accent-purple)" />
                        <span>{formatLong(ev.fecha)} · {ev.hora}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <MapPin size={12} color="var(--accent-purple)" />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.lugar}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Event Details Modal */}
      {activeEvento && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setActiveEvento(null)}>
          <div className="glass-card glow-purple" style={{ maxWidth: '440px', width: '100%', padding: '0', overflow: 'hidden', border: '1px solid var(--glass-border-highlight)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '170px', backgroundImage: `url(${activeEvento.imagen})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(121, 35, 89, 0.75) 0%, transparent 60%)' }} />
              <button 
                onClick={() => setActiveEvento(null)} 
                style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {(() => { const t = getTipo(activeEvento.tipo); return (
                <div style={{ display: 'flex', gap: 6, marginBottom: '10px' }}>
                  <span className="biz-cat-badge" style={{ background: t.bg, color: t.text, margin: 0 }}>{activeEvento.tipo}</span>
                  {activeEvento.gratis && <span className="biz-cat-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', margin: 0 }}>Gratis</span>}
                </div>
              ); })()}

              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '14px', lineHeight: 1.3 }}>{activeEvento.nombre}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Clock size={14} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{formatLong(activeEvento.fecha)} · {activeEvento.hora}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <MapPin size={14} color="var(--accent-purple)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{activeEvento.lugar}<br /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeEvento.direccion}</span></span>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                {activeEvento.descripcion}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Organiza: <strong style={{ color: 'var(--text-primary)' }}>{activeEvento.organizador}</strong>
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, gap: 6 }} 
                  onClick={() => { triggerToast('¡Evento guardado con éxito!'); setActiveEvento(null); }}
                >
                  <Plus size={16} />
                  <span>Guardar Evento</span>
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ width: '48px', height: '48px', padding: 0, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                  onClick={() => openMaps(activeEvento.direccion)}
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventosView;
