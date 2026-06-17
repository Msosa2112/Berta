import React from 'react';
import { Settings, Check, Globe, ChevronLeft } from 'lucide-react';
import LiquidGlass from './liquid-glass/liquid-glass';

const SocialBtn = ({ href, children, title }) => (
  <a
    href={href || '#'}
    target={href ? '_blank' : '_self'}
    rel="noopener noreferrer"
    className={`social-icon-btn${href ? ' active' : ''}`}
    title={title}
    onClick={!href ? (e) => e.preventDefault() : undefined}
  >
    {children}
  </a>
);

const ProfileView = ({ onOpenAdmin, profileSettings = {}, onClose }) => {
  return (
    <div className="player-view" style={{ background: 'var(--bg-obsidian)' }}>

      {/* TOP BAR */}
      <div className="top-bar" style={{ background: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <button className="icon-btn" onClick={onClose} title="Volver" style={{ color: 'white' }}>
          <ChevronLeft size={24} />
        </button>
        <span className="top-title" style={{ color: 'white', fontFamily: 'var(--font-serif)' }}>Perfil</span>
        <button className="icon-btn" onClick={onOpenAdmin} title="Configuración" style={{ color: 'white' }}>
          <Settings size={20} />
        </button>
      </div>

      {/* Hero gradient backdrop */}
      <div style={{
        height: '220px',
        background: 'var(--grad-purple)',
        position: 'relative',
        borderRadius: '0 0 32px 32px',
        flexShrink: 0,
      }} />

      <div className="discover-view" style={{ transform: 'translateY(-64px)', paddingBottom: '80px' }}>
        <LiquidGlass className="profile-header" cornerRadius={24} blurAmount={0.2} padding="0">
          {/* Avatar ring */}
          <div className="profile-img-outer">
            <div className="profile-img-inner">
              <img src="/berta.jpeg" alt="Berta Weyenberg" />
            </div>
          </div>

          <h2 className="profile-name">
            Berta Weyenberg
            <span className="verified-icon">
              <Check size={11} strokeWidth={3.5} />
            </span>
          </h2>

          <p style={{ color: 'var(--accent-purple)', fontSize: '0.82rem', fontWeight: 700, marginTop: '4px', letterSpacing: '0.02em' }}>
            @ConBERTAciones · Louisville, KY
          </p>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-box">
              <span className="stat-num">50+</span>
              <span className="stat-label">Episodios</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-box">
              <span className="stat-num">12k</span>
              <span className="stat-label">Comunidad</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-box">
              <span className="stat-num">5</span>
              <span className="stat-label">Temporadas</span>
            </div>
          </div>

          {/* Social */}
          <div className="social-row">
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

          <button className="follow-btn">Conectar en Envision Radio</button>
        </LiquidGlass>

        {/* Bio */}
        <LiquidGlass className="profile-bio" cornerRadius={24} blurAmount={0.1} padding="0">
          <h3 className="profile-bio-heading">Bio</h3>
          <p>
            Originaria de Cuba, Berta Polo Weyenberg se ha consolidado como una educadora galardonada
            y figura central en la comunidad de Louisville, Kentucky.
          </p>
          <p>
            Como presentadora de <strong>ConBERTAciones</strong>, su misión es conectar a la comunidad
            hispana a través de diálogos basados en la fe, la resiliencia y la educación bajo{' '}
            <em style={{ color: 'var(--accent-purple)', fontStyle: 'normal', fontWeight: 600 }}>
              #WherePraiseMeetsTalk
            </em>.
          </p>
        </LiquidGlass>
      </div>
    </div>
  );
};

export default ProfileView;
