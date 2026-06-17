import React from 'react';
import { Settings, Check, Globe, ChevronLeft, MapPin, Mic, Award, BookOpen } from 'lucide-react';

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
        height: '160px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea7c2e 100%)',
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
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>Perfil</span>
          <button
            onClick={onOpenAdmin}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <Settings size={18} />
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
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>

        {/* Avatar row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            border: '3px solid var(--bg-obsidian)',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(139,92,246,0.4)',
          }}>
            <img src="/berta.jpeg" alt="Berta Weyenberg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ paddingBottom: '4px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Berta Weyenberg
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
              <span>Louisville, Kentucky</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px',
          padding: '14px 8px',
          marginBottom: '16px',
        }}>
          <StatBox value="50+" label="Episodios" />
          <VDivider />
          <StatBox value="12k" label="Comunidad" />
          <VDivider />
          <StatBox value="5" label="Temporadas" />
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
          <SocialBtn href={profileSettings.website} title="Sitio Web">
            <Globe size={18} />
          </SocialBtn>
        </div>

        {/* Connect button */}
        <button style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          letterSpacing: '0.02em',
        }}>
          Conectar en Envision Radio
        </button>
      </div>

      {/* ── Bio card ── */}
      <div style={{
        margin: '16px 16px 0',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Mic size={16} color="var(--accent-terracotta)" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Bio</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 10px 0' }}>
          Originaria de Cuba, Berta Polo Weyenberg se ha consolidado como una educadora galardonada
          y figura central en la comunidad de Louisville, Kentucky.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
          Como presentadora de <strong style={{ color: 'var(--text-primary)' }}>ConBERTAciones</strong>, su misión es conectar a la comunidad
          hispana a través de diálogos basados en la fe, la resiliencia y la educación bajo{' '}
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
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={16} color="var(--accent-amber)" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reconocimientos</h3>
        </div>
        {[
          { icon: '🏆', text: 'Premio MOSAIC de Impacto Social' },
          { icon: '🏆', text: 'Premio WLKY Bell Humanitario' },
          { icon: '🎙️', text: 'Coordinadora de Familias Multilingües – JCPS' },
          { icon: '📻', text: 'Host en Envision Radio' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '10px',
            marginBottom: i < 3 ? '8px' : 0,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* ── Admin shortcut ── */}
      <div style={{ margin: '16px 16px 0' }}>
        <button
          onClick={onOpenAdmin}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(139,92,246,0.1)',
            border: '1px dashed rgba(139,92,246,0.3)',
            borderRadius: '14px',
            color: 'var(--accent-purple)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Settings size={16} />
          Panel de Administración
        </button>
      </div>

    </div>
  );
};

export default ProfileView;
