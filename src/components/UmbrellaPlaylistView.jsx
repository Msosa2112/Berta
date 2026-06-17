import React from 'react';
import { ChevronLeft, Play, LayoutList, MoreVertical } from 'lucide-react';

const UmbrellaPlaylistView = ({ reflections, language, onClose, onPlayVideo }) => {
  const isEn = language === 'en';
  const headerTitle = isEn ? 'Under the Umbrella' : 'Bajo la Sombrilla';
  
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'var(--bg-obsidian)', color: 'var(--text-primary)', zIndex: 100, display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 20px 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'var(--bg-space)', borderBottom: '1px solid var(--glass-border)'
      }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <ChevronLeft size={28} />
        </button>
        <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>{headerTitle}</div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Search size={22} />
        </button>
      </div>

      {/* Playlist Hero */}
      <div style={{ padding: '24px 16px', background: 'linear-gradient(to bottom, var(--accent-sand-glow), var(--bg-obsidian))' }}>
        <img src={reflections[0]?.thumbnail || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80'} 
             style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px', boxShadow: 'var(--shadow-ambient)' }} 
             alt="Playlist cover" />
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{headerTitle}</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Berta Weyenberg • {reflections.length} videos
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent-purple)', color: '#FFFFFF', padding: '10px', borderRadius: '24px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px var(--accent-terracotta-glow)' }}>
            <Play size={18} fill="currentColor" /> Reproducir todo
          </button>
        </div>
      </div>

      {/* Video List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 100px' }}>
        {reflections.map((ref, index) => {
          const title = isEn ? ref.titleEn : ref.titleEs;
          
          return (
            <div key={ref.id} onClick={() => onPlayVideo(ref)} style={{ display: 'flex', gap: '12px', marginBottom: '16px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <div style={{ fontWeight: 500, color: 'var(--text-muted)', width: '16px', marginTop: '16px', textAlign: 'center' }}>
                {index + 1}
              </div>
              <div style={{ position: 'relative', width: '140px', flexShrink: 0 }}>
                <img src={ref.thumbnail || 'https://via.placeholder.com/160x90'} style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', objectFit: 'cover' }} alt={title} />
                <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '11px', padding: '2px 4px', borderRadius: '4px' }}>
                  Text / Vid
                </span>
              </div>
              <div style={{ flex: 1, padding: '4px 0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Berta Weyenberg</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '4px', alignSelf: 'flex-start', cursor: 'pointer' }}>
                <MoreVertical size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Search = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export default UmbrellaPlaylistView;
