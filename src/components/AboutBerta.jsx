import React from 'react';
import { Award, Users } from 'lucide-react';

const AboutBerta = () => {
  return (
    <section id="about" className="about-section container">
      
      {/* Círculo luminoso detrás de la foto */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
          zIndex: -1, filter: 'blur(40px)'
        }}></div>
        
        <div className="glass-panel about-image">
          <h3>Berta Weyenberg</h3>
          <p>Host & Líder Comunitaria</p>
        </div>
      </div>

      <div className="about-content">
        <h2 className="about-title">
          Voces que inspiran. <br/>
          <span className="text-gradient">Historias que trascienden.</span>
        </h2>
        
        <p className="about-text">
          Originaria de Manzanillo, Cuba, Berta Polo Weyenberg se ha consolidado como una educadora galardonada y figura central en Kentucky. Su misión es simple: conectar a la comunidad hispana a través de diálogos basados en la fe, la resiliencia y la educación.
        </p>
        <p className="about-text">
          Como Coordinadora de Familias Multilingües en las Escuelas Públicas del Condado de Jefferson (JCPS) y ex-presidenta de la Asociación Cubano Americana de Kentucky (ACAK), Berta trae consigo décadas de experiencia fomentando el cambio y la esperanza.
        </p>

        <div className="about-stats">
          <div className="glass-panel stat-card">
            <Award size={28} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
            <h4>Galardonada</h4>
            <p>Premio MOSAIC y Premio WLKY Bell por su impacto social y humanitario.</p>
          </div>
          <div className="glass-panel stat-card">
            <Users size={28} color="var(--accent-purple)" style={{ marginBottom: '12px' }} />
            <h4>Líder Cívica</h4>
            <p>Destacado Miembro del Consejo Asesor Internacional del Alcalde (MIAC).</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBerta;
