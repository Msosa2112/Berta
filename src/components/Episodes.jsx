import React from 'react';
import { Play } from 'lucide-react';

const episodes = [
  { id: 'v-3', season: 'V', title: "Jóvenes emprendedores y la fe", guest: "Carlos Aguilera & Mary Rocha (Paix Creations)", date: "Mar 17, 2026" },
  { id: 'v-2', season: 'V', title: "Conversación en profundidad", guest: "Dr. Hector J. Ruiz", date: "Mar 10, 2026" },
  { id: 'v-1', season: 'V', title: "Lanzamiento de Temporada", guest: "Laura J Tlalpachicatl", date: "Mar 2, 2026" },
  { id: 'iv-15', season: 'IV', title: "Historias Reales", guest: "Alejandro Ruiz", date: "Feb 24, 2026" },
  { id: 'iv-14', season: 'IV', title: "Fe y Emprendimiento", guest: "Carlos Aguilera & Mary Rocha", date: "Feb 17, 2026" },
  { id: 'iv-10-12', season: 'IV', title: "Charlas de Luz", guest: "Padre Michael Magat", date: "Ene - Feb 2026" },
];

const Episodes = () => {
  return (
    <section id="episodes" className="episodes-section container">
      <div className="episodes-header">
        <h2 className="episodes-title">Catálogo de <span className="text-gradient">Episodios</span></h2>
        <p className="episodes-desc">
          Explora nuestras últimas conversaciones. Temas profundos con invitados extraordinarios.
        </p>
      </div>

      <div className="episodes-grid">
        {episodes.map((ep) => (
          <div key={ep.id} className="glass-panel episode-card">
            <div className="episode-meta">
              <span className="episode-badge">Temp {ep.season}</span>
              <span className="episode-date">{ep.date}</span>
            </div>
            
            <h3 className="episode-title">{ep.title}</h3>
            
            <div className="episode-footer">
              <div className="episode-guest">
                Con: <strong style={{ color: '#fff' }}>{ep.guest}</strong>
              </div>
              <button className="play-btn">
                <Play size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Episodes;
