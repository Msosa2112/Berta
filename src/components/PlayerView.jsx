import React, { useMemo } from 'react';
import { ChevronDown, MoreVertical, Play, Pause, RotateCcw, RotateCw, Plus, Repeat, Share2 } from 'lucide-react';

const PlayerView = ({ episode, onClose, isSaved, onToggleSave }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isRepeating, setIsRepeating] = React.useState(false);

  if (!episode) return null;

  // useMemo ensures bars are stable across re-renders
  const waveBars = useMemo(() => {
    return Array.from({ length: 46 }, (_, i) => {
      const progress = i / 46;
      const isPlayed = progress < 0.38;
      // Organic height curve
      const base = 8;
      const variation = Math.sin(i * 0.7) * 10 + Math.sin(i * 0.3) * 8 + Math.sin(i * 1.5) * 5;
      const height = Math.max(6, base + Math.abs(variation));
      return { height, isPlayed };
    });
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (episode.audioUrl && !isPlaying) {
      if (episode.audioUrl.endsWith('.mp3') || episode.audioUrl.endsWith('.wav')) {
        new Audio(episode.audioUrl).play();
      } else if (!episode.audioUrl.includes('iframe')) {
        window.open(episode.audioUrl, '_blank');
      }
    }
  };

  return (
    <div className="player-view">

      {/* Gradient Top Section */}
      <div className="player-top">
        <div className="player-nav-white">
          <button className="icon-btn btn-press" onClick={onClose} style={{ color: 'white' }}>
            <ChevronDown size={26} />
          </button>
          <span className="player-nav-title">Podcast Player</span>
          <button
            className="icon-btn btn-press"
            style={{ color: 'white' }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Album Art with glassmorphism frame */}
        <div className="player-art-frame">
          <img src={episode.art} alt={episode.title} />
        </div>
      </div>

      {/* White Body */}
      <div className="player-body">

        <h1 className="player-p-title">{episode.title}</h1>
        <p className="player-p-host">{episode.host}</p>

        {/* Stable Waveform */}
        <div className="waveform-modern">
          {waveBars.map((bar, i) => (
            <div
              key={i}
              className={`wave-modern${bar.isPlayed ? ' purp' : ''}`}
              style={{ height: `${bar.height}px` }}
            />
          ))}
        </div>

        <div className="time-modern">
          <span>12:45</span>
          <span>{episode.duration}</span>
        </div>

        {/* Controls */}
        <div className="controls-modern">
          <button
            className="ctrl-modern btn-press"
            onClick={() => setIsRepeating(!isRepeating)}
            style={{ color: isRepeating ? 'var(--accent-purple)' : undefined }}
          >
            <Repeat size={20} />
          </button>

          <button className="ctrl-modern btn-press" title="Retroceder 15s">
            <RotateCcw size={22} />
          </button>

          <button className="play-modern btn-press" onClick={handlePlay}>
            {isPlaying
              ? <Pause size={26} fill="currentColor" />
              : <Play size={26} fill="currentColor" style={{ marginLeft: '3px' }} />
            }
          </button>

          <button className="ctrl-modern btn-press" title="Avanzar 15s">
            <RotateCw size={22} />
          </button>

          <button
            className="ctrl-modern btn-press"
            onClick={() => onToggleSave(episode.id)}
            style={{ color: isSaved ? 'var(--accent-purple)' : undefined }}
            title={isSaved ? 'Quitar de favoritos' : 'Guardar episodio'}
          >
            <Plus
              size={22}
              style={{
                transform: isSaved ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </button>
        </div>

        {/* iFrame embed if needed */}
        {episode.audioUrl && episode.audioUrl.includes('iframe') && (
          <div
            dangerouslySetInnerHTML={{ __html: episode.audioUrl }}
            style={{ width: '100%', marginTop: '20px' }}
          />
        )}

        {/* Show Notes (renamed from Lyrics) */}
        <div className="show-notes">
          <h4>Acerca del Episodio</h4>
          <p>
            En este episodio exploraremos las profundidades de combinar fe, negocios y
            las enseñanzas de líderes comunitarios.{' '}
            <br /><br />
            Escucha cómo Berta Weyenberg, educadora y líder multicultural de JCPS,
            profundiza sobre los aspectos vitales del crecimiento personal, mientras
            el Dr. Hector Ruiz provee un panorama inspirador para nuestra audiencia bilingüe.
            Sintoniza y recibe el mensaje semanal — <em>#WherePraiseMeetsTalk</em>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PlayerView;
