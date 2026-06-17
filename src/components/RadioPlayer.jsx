import React from 'react';
import { Radio } from 'lucide-react';

const RadioPlayer = () => {
  return (
    <section id="en-vivo" className="player-section container">
      <div className="glass-panel player-box">
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(226, 183, 20, 0.15) 0%, transparent 60%)',
          zIndex: 0
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="player-icon">
            <Radio size={32} color="#fff" />
          </div>
          
          <h2 className="player-title">Transmisión en <span className="text-gradient">Envision Radio</span></h2>
          <p className="player-text">
            Acompáñanos todos los jueves a las 6:00 PM EST (y Miércoles 7:00 PM EST). Sintoniza en vivo para sumergirte en pláticas que alimentan el espíritu.
          </p>
          
          <a 
            href="http://www.envision-radio.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
            style={{ display: 'inline-flex' }}
          >
            Escuchar en Envision Radio
          </a>
        </div>
      </div>
    </section>
  );
};

export default RadioPlayer;
