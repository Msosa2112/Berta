import React from 'react';
import { Mic2, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section container">
      <div className="hero-badge">
        <Mic2 size={14} /> Una experiencia de Podcast
      </div>
      
      <h1 className="hero-title">
        <span style={{ color: '#ffffff' }}>Con</span>
        <span className="text-magenta">BERTA</span>
        <span style={{ color: '#ffffff' }}>ciones</span>
      </h1>
      
      <div className="hero-subtitle">
        Podcast
      </div>
      
      <p className="hero-text">
        #WherePraiseMeetsTalk. Únete a Berta Weyenberg en diálogos profundos sobre fe, comunidad y propósito.
      </p>
      
      <div className="hero-buttons">
        <a href="#episodes" className="btn btn-primary">
          <PlayCircle size={20} />
          Últimos Episodios
        </a>
        <a href="#en-vivo" className="btn btn-secondary">
          Escuchar en Vivo
        </a>
      </div>
    </section>
  );
};

export default Hero;
