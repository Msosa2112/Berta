import React from 'react';
import { Settings, Check, Globe, ChevronLeft, MapPin, Mic, Award, ShieldCheck } from 'lucide-react';
import { useLanguage, useAutoTranslated } from '../utils/i18n.jsx';

/* ── Social icon button ── */
const SocialBtn = ({ href, children, title }) => (
  <a
    href={href || '#'}
    target={href ? '_blank' : '_self'}
    rel="noopener noreferrer"
    title={title}
    onClick={!href ? (e) => e.preventDefault() : undefined}
    style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: href ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.05)',
      border: `1.5px solid ${href ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
      color: href ? 'var(--accent-purple)' : 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      cursor: href ? 'pointer' : 'default',
      flexShrink: 0,
    }}
  >
    {children}
  </a>
);

/* ── Stat box ── */
const StatBox = ({ value, label }) => (
  <div style={{ textAlign: 'center', flex: 1 }}>
    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
      {label}
    </div>
  </div>
);

/* ── Divider ── */
const VDivider = () => (
  <div style={{ width: '1px', height: '32px', background: 'var(--glass-border)', flexShrink: 0 }} />
);

/* ── Main component ── */
const ProfileView = ({ onOpenAdmin, profileSettings = {}, onClose }) => {
  const { lang, tr } = useLanguage();
  const avatarUrl = profileSettings.avatar || '/berta.jpeg';
  const heroName = profileSettings.heroName || 'Berta Weyenberg';
  const locationText = profileSettings.location || 'Louisville, Kentucky';
  const bioParagraph = useAutoTranslated(
    profileSettings.bioEs ||
      'Originaria de Cuba, Berta Polo Weyenberg es educadora galardonada y figura central de la comunidad hispana en Kentucky. A través de sus entrevistas en ConBERTAciones y sus reflexiones bilingües en Under the Umbrella (Bajo la Sombrilla), comparte mensajes de fe, esperanza, educación y propósito.',
    profileSettings.bioEn ||
      'Originally from Cuba, Berta Polo Weyenberg is an award-winning educator and central voice in Kentucky’s Hispanic community. Through her interviews on ConBERTAciones and her bilingual reflections on Under the Umbrella (Bajo la Sombrilla), she shares messages of faith, hope, education, and purpose.',
    lang
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      background: 'var(--bg-obsidian)',
      overflowY: 'auto',
      paddingBottom: '40px',
    }}>

      {/* ── Hero gradient banner ── */}
      <div style={{
        position: 'relative',
        height: '165px',
        background: 'linear-gradient(135deg, #792359 0%, #c026d3 55%, #d97706 100%)',
        flexShrink: 0,
      }}>
        {/* Top bar overlaid on hero */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          zIndex: 10,
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
            }}
            title={tr('Volver', 'Back')}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
            {tr('Perfil de Berta', "Berta's Profile")}
          </span>
          <button
            onClick={() => onOpenAdmin('dashboard')}
            style={{
              background: 'rgba(255,255,255,0.22)',
              border: '1px solid rgba(255,255,255,0.45)',
              borderRadius: '999px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
            title={tr('Abrir Configuración y Panel Admin Unificado', 'Open Settings & Unified Admin Panel')}
          >
            <Settings size={16} />
            <span>{tr('Admin / Settings', 'Admin / Settings')}</span>
          </button>
        </div>
      </div>

      {/* ── Profile card (overlaps hero) ── */}
      <div style={{
        margin: '0 16px',
        marginTop: '-56px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '20px',
        zIndex: 5,
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }}>

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            border: '3px solid var(--bg-obsidian)',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(121,35,89,0.35)',
          }}>
            <img src={avatarUrl} alt={heroName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ paddingBottom: '4px', minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {heroName}
              </h2>
              <span style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: 'var(--accent-purple)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Check size={10} strokeWidth={3.5} color="white" />
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 600, marginTop: '2px' }}>
              @ConBERTAciones
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <MapPin size={11} color="var(--accent-amber)" />
              <span>{locationText}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(121,35,89,0.05)',
          borderRadius: '12px',
          padding: '14px 8px',
          marginBottom: '16px',
        }}>
          <StatBox value={profileSettings.statsEpisodes || '50+'} label={tr('Episodios', 'Episodes')} />
          <VDivider />
          <StatBox value={profileSettings.statsCommunity || '12k'} label={tr('Comunidad', 'Community')} />
          <VDivider />
          <StatBox value={profileSettings.statsSeasons || '5'} label={tr('Temporadas', 'Seasons')} />
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <SocialBtn href={profileSettings.facebook} title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </SocialBtn>
          <SocialBtn href={profileSettings.instagram} title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </SocialBtn>
          <SocialBtn href={profileSettings.linkedin} title="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          </SocialBtn>
          <SocialBtn href={profileSettings.youtube} title="YouTube">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </SocialBtn>
          <SocialBtn href={profileSettings.website} title={tr('Sitio Web', 'Website')}>
            <Globe size={18} />
          </SocialBtn>
        </div>

        {/* Unified Admin Panel primary button inside profile */}
        <button
          onClick={() => onOpenAdmin('dashboard')}
          style={{
            width: '100%',
            padding: '13px 16px',
            background: 'linear-gradient(135deg, #792359, #c026d3)',
            border: 'none',
            borderRadius: '14px',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px rgba(121, 35, 89, 0.25)',
          }}
        >
          <Settings size={17} />
          <span>{tr('Abrir Panel de Administración (Todo en Uno)', 'Open Unified Admin Panel (All-in-One)')}</span>
        </button>
      </div>

      {/* ── Quick Admin Shortcuts Card ── */}
      <div style={{
        margin: '16px 16px 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldCheck size={17} color="var(--accent-purple)" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {tr('Accesos Rápidos de Administración', 'Quick Admin Shortcuts')}
          </h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 0, marginBottom: '14px' }}>
          {tr(
            'Gestiona todo el sitio desde un solo lugar: el contenido de Inicio, Blog de Berta, The Weyenberg Statement, ConBERTAciones y Under the Umbrella.',
            'Manage the entire website from one single place: Home content, Berta’s Blog, The Weyenberg Statement, ConBERTAciones, and Under the Umbrella.'
          )}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <button
            onClick={() => onOpenAdmin('inicio')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            🏠 {tr('Editar Inicio', 'Edit Home')}
          </button>
          <button
            onClick={() => onOpenAdmin('statements')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            ⚖️ Weyenberg Statement
          </button>
          <button
            onClick={() => onOpenAdmin('noticias')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            ✍️ {tr('Blog de Berta', "Berta's Blog")}
          </button>
          <button
            onClick={() => onOpenAdmin('episodios')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            🎙️ ConBERTAciones
          </button>
          <button
            onClick={() => onOpenAdmin('reflexiones')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            ☂️ Under the Umbrella
          </button>
          <button
            onClick={() => onOpenAdmin('perfil')}
            className="btn-secondary"
            style={{ padding: '10px 12px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
          >
            🌐 {tr('Redes y Perfil', 'Social & Profile')}
          </button>
        </div>
      </div>

      {/* ── Bio card ── */}
      <div style={{
        margin: '16px 16px 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Mic size={16} color="var(--accent-terracotta)" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bio</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 10px 0' }}>
          {bioParagraph}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
          {tr(
            'Como presentadora de ConBERTAciones, su misión es conectar a la comunidad hispana a través de diálogos basados en la fe, la resiliencia y la educación bajo ',
            'As host of ConBERTAciones, her mission is to connect the Hispanic community through dialogues grounded in faith, resilience, and education under '
          )}
          <em style={{ color: 'var(--accent-purple)', fontStyle: 'normal', fontWeight: 600 }}>
            #WherePraiseMeetsTalk
          </em>.
        </p>
      </div>

      {/* ── Highlights card ── */}
      <div style={{
        margin: '16px 16px 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={16} color="var(--accent-amber)" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {tr('Reconocimientos', 'Awards & Recognition')}
          </h3>
        </div>
        {[
          { icon: '🏆', text: tr('Premio MOSAIC de Impacto Social', 'MOSAIC Social Impact Award') },
          { icon: '🏆', text: tr('Premio WLKY Bell Humanitario', 'WLKY Bell Humanitarian Award') },
          { icon: '🎙️', text: tr('Coordinadora de Familias Multilingües – JCPS', 'Multilingual Family Coordinator – JCPS') },
          { icon: '📻', text: tr('Host de ConBERTAciones & Under the Umbrella', 'Host of ConBERTAciones & Under the Umbrella') },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'rgba(121,35,89,0.04)',
            borderRadius: '10px',
            marginBottom: i < 3 ? '8px' : 0,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileView;
