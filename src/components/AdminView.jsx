import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Eye, EyeOff, Plus, Edit2, Trash2, 
  UploadCloud, Link as LinkIcon, CheckCircle, 
  AlertTriangle, XCircle, Download, Upload, 
  Bold, Italic, Underline, List as ListIcon, 
  Home, Mic, BookOpen, Briefcase, User, Save,
  LayoutDashboard, LogOut, Newspaper
} from 'lucide-react';

const AdminView = ({ 
  episodes, guests, profileSettings, onUpdateProfile,
  reflections, onUpdateReflections,
  noticias, onAddNoticia, onUpdateNoticia, onDeleteNoticia,
  onImportBackup,
  onAdd, onUpdate, onDelete, 
  onAddGuest, onUpdateGuest, onDeleteGuest, 
  onClose, triggerToast
}) => {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard'); // dashboard, episodios, reflexiones, noticias, negocios, perfil, backup
  
  const [editingEp, setEditingEp] = useState(null); 
  const [editingGuest, setEditingGuest] = useState(null);
  const [editingNoticia, setEditingNoticia] = useState(null);
  
  const [formData, setFormData] = useState({ id: '', title: '', host: '', duration: '', color: 'purple', art: '', audioUrl: '', audioFile: null, audioFileName: '', description: '' });
  const [guestData, setGuestData] = useState({ id: '', name: '', business: '', bio: '', bgPhoto: '', facebook: '', instagram: '', linkedin: '', youtube: '', website: '' });
  const [noticiaData, setNoticiaData] = useState({ id: '', tipo: 'noticia', titulo: '', excerpt: '', contenido: '', imagen: '', categoria: 'Comunidad', autor: 'Berta Weyenberg', fecha: '', lectura: 3 });
  
  // Reflection Editing State (Uses the first element for the MVP)
  const [reflectionData, setReflectionData] = useState(reflections[0] || { id: '1', titleEn: '', titleEs: '', contentEn: '', contentEs: '', videoEn: '', videoEs: '', thumbnail: '' });
  
  const [localProfile, setLocalProfile] = useState(profileSettings || { facebook: '', instagram: '', linkedin: '', youtube: '', website: '' });
  
  // Custom Toast State
  const [adminToast, setAdminToast] = useState(null); // { message, type: 'success' | 'error' | 'warning' }
  const triggerAdminToast = (message, type = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => setAdminToast(null), 3000);
  };

  // --- HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.user === 'admin' && loginForm.password === 'berta') {
      setIsAuthenticated(true);
      triggerAdminToast('Bienvenida, Berta', 'success');
    } else {
      triggerAdminToast('Credenciales incorrectas', 'error');
    }
  };

  const handleImageUpload = (e, target) => {
    const file = e.files ? e.files[0] : e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'ep') setFormData({ ...formData, art: reader.result });
        if (target === 'guest') setGuestData({ ...guestData, bgPhoto: reader.result });
        if (target === 'reflection') setReflectionData({ ...reflectionData, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEp = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.host) return triggerAdminToast('Título e Invitado son requeridos', 'warning');
    if (editingEp === 'new') { onAdd({ ...formData, id: Date.now().toString() }); triggerAdminToast('Episodio Añadido', 'success'); } 
    else { onUpdate(formData); triggerAdminToast('Episodio Actualizado', 'success'); }
    setEditingEp(null);
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();
    if (!guestData.name) return triggerAdminToast('Nombre es requerido', 'warning');
    if (editingGuest === 'new') { onAddGuest({ ...guestData, id: 'g_' + Date.now().toString() }); triggerAdminToast('Invitado Añadido', 'success'); }
    else { onUpdateGuest(guestData); triggerAdminToast('Invitado Actualizado', 'success'); }
    setEditingGuest(null);
  };

  const handleSaveReflection = () => {
    // For MVPs: we just update the first item in the reflections array
    const updatedArray = [...reflections];
    updatedArray[0] = reflectionData;
    onUpdateReflections(updatedArray);
    triggerAdminToast('Tus listas de YouTube han sido actualizadas', 'success');
  };

  const executeBackup = () => {
    const serializableEpisodes = episodes.map(({ audioFile, ...rest }) => rest);
    const data = {
      episodes: serializableEpisodes, guests, profileSettings, reflections, noticias
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conbertaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    triggerAdminToast('Backup descargado (excluye archivos de audio locales)', 'success');
  };

  // --- UI RENDERERS ---
  if (!isAuthenticated) return (
    <div className="admin-login-layout">
      <AdminStyles />
      <div className="admin-login-card">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '24px' }}>ConBERTAciones Admin</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label className="admin-label">Usuario o Correo</label>
            <input type="text" className="admin-input" value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})} placeholder="Ej. admin" />
          </div>
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label className="admin-label">Contraseña</label>
            <input type={showPassword ? 'text' : 'password'} className="admin-input" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '34px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" className="admin-btn-primary">Ingresar</button>
        </form>
      </div>
      {/* TOAST SYSTEM (Shared) */}
      {adminToast && <Toast message={adminToast.message} type={adminToast.type} />}
    </div>
  );

  return (
    <div className="admin-app-layout">
      <AdminStyles />
      {/* 1. TOP HEADER */}
      <header className="admin-header">
        <button onClick={() => setIsSidebarOpen(true)} className="admin-icon-btn"><Menu size={24} color="#4B5563" /></button>
        <span className="admin-header-title">
          {activeMenu === 'dashboard' && 'Dashboard'}
          {activeMenu === 'episodios' && 'Episodios'}
          {activeMenu === 'reflexiones' && 'Under the Umbrella'}
          {activeMenu === 'noticias' && 'Noticias & Blog'}
          {activeMenu === 'negocios' && 'Directorio'}
          {activeMenu === 'perfil' && 'Perfil'}
          {activeMenu === 'backup' && 'Respaldos'}
        </span>
        <div style={{ width: '32px', height: '32px', background: '#DBEAFE', color: '#1E3A8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>B</div>
      </header>

      {/* 2. SIDEBAR (Drawer) */}
      <div className={`admin-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeMenu === 'dashboard'} onClick={() => {setActiveMenu('dashboard'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<Mic size={20} />} label="ConBERTAciones" active={activeMenu === 'episodios'} onClick={() => {setActiveMenu('episodios'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<BookOpen size={20} />} label="Under the Umbrella" active={activeMenu === 'reflexiones'} onClick={() => {setActiveMenu('reflexiones'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<Newspaper size={20} />} label="Noticias & Blog" active={activeMenu === 'noticias'} onClick={() => {setActiveMenu('noticias'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<User size={20} />} label="Directorio (Invitados)" active={activeMenu === 'negocios'} onClick={() => {setActiveMenu('negocios'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<Briefcase size={20} />} label="Perfil & Speaker" active={activeMenu === 'perfil'} onClick={() => {setActiveMenu('perfil'); setIsSidebarOpen(false)}} />
          <SidebarItem icon={<Save size={20} />} label="Respaldos" active={activeMenu === 'backup'} onClick={() => {setActiveMenu('backup'); setIsSidebarOpen(false)}} />
          
          <div style={{ flex: 1 }}></div>
          <SidebarItem icon={<LogOut size={20} />} label="Cerrar Admin" active={false} onClick={onClose} />
        </div>
      </div>

      {/* 4. MAIN WORKSPACE */}
      <main className="admin-main">
        
        {/* VIEW: DASHBOARD */}
        {activeMenu === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="responsive-flex">
              <StatCard title="Episodios" value={episodes.length} icon={<Mic size={24} color="#2563EB" />} />
              <StatCard title="Invitados" value={guests.length} icon={<User size={24} color="#10B981" />} />
              <StatCard title="Noticias/Blog" value={noticias.length} icon={<Newspaper size={24} color="#EC4899" />} />
            </div>
            <button className="admin-btn-primary" onClick={() => {setFormData({ id: '', title: '', host: 'Berta Weyenberg', duration: '0:00', color: 'purple', art: '', audioUrl: '', audioFile: null, audioFileName: '', description: '' }); setEditingEp('new'); setActiveMenu('episodios');}} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '56px', fontSize: '18px' }}>
              <Plus size={24} /> Nuevo Episodio
            </button>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Estado del Sistema</h3>
              <p style={{ fontSize: '14px', color: '#4B5563' }}>Todo funcionando correctamente. Tu contenido se guarda en tu dispositivo local.</p>
            </div>
          </div>
        )}

        {/* VIEW: EPISODES (List) */}
        {activeMenu === 'episodios' && !editingEp && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">Gestión de Episodios</h2>
              <button className="admin-btn-primary" style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => { setFormData({ id: '', title: '', host: 'Berta Weyenberg', duration: '0:00', color: 'purple', art: '', audioUrl: '', audioFile: null, audioFileName: '', description: '' }); setEditingEp('new'); }}>
                <Plus size={18} /> Nuevo
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {episodes.map(ep => (
                <div key={ep.id} className="admin-item-card">
                  <img src={ep.art || 'https://via.placeholder.com/64'} className="admin-item-img" alt={ep.title} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{ep.title}</h4>
                    <span className="admin-item-subtitle">{ep.host} • {ep.duration}</span>
                    <span className="admin-badge-success">Publicado</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-action-btn" onClick={() => { setFormData(ep); setEditingEp(ep.id); }}><Edit2 size={18} color="#4B5563" /></button>
                    <button className="admin-action-btn error" onClick={() => { if(window.confirm('¿Borrar episodio?')) { onDelete(ep.id); triggerAdminToast('Eliminado', 'error'); } }}><Trash2 size={18} color="#EF4444" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: EPISODE FORM (Crear/Editar) */}
        {activeMenu === 'episodios' && editingEp && (
          <form className="admin-form-card" onSubmit={handleSaveEp}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>{editingEp === 'new' ? 'Nuevo Episodio' : 'Editar Episodio'}</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Título</label>
              <input type="text" className="admin-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. La fuerza de la resiliencia" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Nombre del Invitado</label>
              <input type="text" className="admin-input" required value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} placeholder="Nombre y Apellido" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Miniatura del Episodio</label>
              {formData.art ? (
                <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                  <img src={formData.art} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portada" />
                  <button type="button" onClick={() => setFormData({...formData, art: ''})} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                </div>
              ) : (
                <label className="admin-dropzone">
                  <UploadCloud size={24} color="#9CA3AF" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Toca para subir una imagen</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'ep')} />
                </label>
              )}
              <input type="text" className="admin-input" style={{ marginTop: '8px' }} value={formData.art} onChange={e => setFormData({...formData, art: e.target.value})} placeholder="O pega un enlace de imagen (HTTP)" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Archivo de Audio Local (Dispositivo)</label>
              {formData.audioFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px', color: '#1E40AF', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    🎵 {formData.audioFileName || 'Archivo de audio cargado'}
                  </span>
                  <button type="button" onClick={() => setFormData({...formData, audioFile: null, audioFileName: '', duration: '0:00'})} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><X size={18}/></button>
                </div>
              ) : (
                <label className="admin-dropzone" style={{ height: '80px', padding: '10px' }}>
                  <UploadCloud size={20} color="#9CA3AF" style={{ marginBottom: '4px' }} />
                  <span style={{ fontSize: '13px', color: '#6B7280' }}>Subir archivo de audio (MP3, WAV, etc.)</span>
                  <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, audioFile: file, audioFileName: file.name, duration: 'Calculando...' });
                      const audio = new Audio();
                      audio.src = URL.createObjectURL(file);
                      audio.addEventListener('loadedmetadata', () => {
                        const mins = Math.floor(audio.duration / 60);
                        const secs = Math.floor(audio.duration % 60);
                        const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                        setFormData(prev => ({ ...prev, audioFile: file, audioFileName: file.name, duration: durStr }));
                      });
                    }
                  }} />
                </label>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Enlace del Audio (Alternativo/Streaming)</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={20} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input type="text" className="admin-input" style={{ paddingLeft: '40px' }} value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} placeholder="URL MP3 o Embed Spotify (Ej. si no subes archivo)" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Descripción</label>
              <textarea className="admin-textarea" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Escribe de qué trata el episodio..."></textarea>
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingEp(null)}>Cancelar</button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>Guardar Episodio</button>
            </div>
          </form>
        )}

        {/* VIEW: UNDER THE UMBRELLA (Dual Editor) */}
        {activeMenu === 'reflexiones' && (
          <div className="admin-form-card">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Under the Umbrella (Playlists)</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>
              Configura los videos y textos. Esta sección se mostrará como listas de reproducción estilo YouTube en el inicio.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label className="admin-label">Miniatura Principal de la Lista</label>
              {reflectionData.thumbnail ? (
                <div style={{ position: 'relative', width: '160px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                  <img src={reflectionData.thumbnail} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb" />
                  <button type="button" onClick={() => setReflectionData({...reflectionData, thumbnail: ''})} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                </div>
              ) : (
                <label className="admin-dropzone" style={{ height: '90px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Sube la portada de la playlist</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'reflection')} />
                </label>
              )}
            </div>
            
            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>🇬🇧 Playlist Version (English)</h3>
              
              <label className="admin-label">YouTube Video URL (Opcional)</label>
              <input type="text" className="admin-input" style={{ marginBottom: '16px' }} value={reflectionData.videoEn} onChange={e => setReflectionData({...reflectionData, videoEn: e.target.value})} placeholder="https://youtu.be/..." />

              <label className="admin-label">Título del Texto</label>
              <input type="text" className="admin-input" style={{ marginBottom: '12px' }} value={reflectionData.titleEn} onChange={e => setReflectionData({...reflectionData, titleEn: e.target.value})} placeholder="Title in English" />
              
              <div className="admin-wysiwyg-toolbar">
                <button type="button"><Bold size={16}/></button><button type="button"><Italic size={16}/></button><button type="button"><Underline size={16}/></button><button type="button"><ListIcon size={16}/></button>
              </div>
              {/* Note for logic correctness: contentEditable is uncontrolled visually in this MVP implementation, but for robust React code it needs onInput handling. Adding an onChange workaround for raw text */}
              <textarea className="admin-wysiwyg-content" style={{width:'100%', display:'block', minHeight:'120px', resize: 'vertical'}} placeholder="Write your reflection here..." value={reflectionData.contentEn} onChange={e => setReflectionData({...reflectionData, contentEn: e.target.value})} />
            </div>

            <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>🇪🇸 Versión Lista (Español)</h3>
              
              <label className="admin-label">URL del Video en YouTube (Opcional)</label>
              <input type="text" className="admin-input" style={{ marginBottom: '16px' }} value={reflectionData.videoEs} onChange={e => setReflectionData({...reflectionData, videoEs: e.target.value})} placeholder="https://youtu.be/..." />

              <label className="admin-label">Título del Texto</label>
              <input type="text" className="admin-input" style={{ marginBottom: '12px' }} value={reflectionData.titleEs} onChange={e => setReflectionData({...reflectionData, titleEs: e.target.value})} placeholder="Título en Español" />
              
              <div className="admin-wysiwyg-toolbar">
                <button type="button"><Bold size={16}/></button><button type="button"><Italic size={16}/></button><button type="button"><Underline size={16}/></button><button type="button"><ListIcon size={16}/></button>
              </div>
              <textarea className="admin-wysiwyg-content" style={{width:'100%', display:'block', minHeight:'120px', resize: 'vertical'}} placeholder="Escribe tu reflexión aquí..." value={reflectionData.contentEs} onChange={e => setReflectionData({...reflectionData, contentEs: e.target.value})} />
            </div>
            
            <button className="admin-btn-primary" onClick={handleSaveReflection}>Guardar Listas de Reproducción</button>
          </div>
        )}

        {/* VIEW: NOTICIAS & BLOG (List) */}
        {activeMenu === 'noticias' && !editingNoticia && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">Gestión de Noticias & Blog</h2>
              <button className="admin-btn-primary" style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => { setNoticiaData({ id: '', tipo: 'noticia', titulo: '', excerpt: '', contenido: '', imagen: '', categoria: 'Comunidad', autor: 'Berta Weyenberg', fecha: new Date().toISOString().split('T')[0], lectura: 3 }); setEditingNoticia('new'); }}>
                <Plus size={18} /> Nuevo Artículo
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {noticias && noticias.map(n => (
                <div key={n.id} className="admin-item-card">
                  <img src={n.imagen || 'https://via.placeholder.com/64'} className="admin-item-img" alt={n.titulo} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{n.titulo}</h4>
                    <span className="admin-item-subtitle">{n.autor} • {n.fecha} • {n.categoria}</span>
                    <span className="admin-badge-success" style={{ background: n.tipo === 'blog' ? '#FCE7F3' : '#EFF6FF', color: n.tipo === 'blog' ? '#DB2777' : '#2563EB' }}>
                      {n.tipo === 'blog' ? 'Blog de Berta' : 'Noticia'}
                    </span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-action-btn" onClick={() => { setNoticiaData(n); setEditingNoticia(n.id); }}><Edit2 size={18} color="#4B5563" /></button>
                    <button className="admin-action-btn error" onClick={() => { if(window.confirm('¿Borrar este artículo?')) { onDeleteNoticia(n.id); triggerAdminToast('Artículo eliminado', 'error'); } }}><Trash2 size={18} color="#EF4444" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: NOTICIAS & BLOG FORM (Crear/Editar) */}
        {activeMenu === 'noticias' && editingNoticia && (
          <form className="admin-form-card" onSubmit={(e) => {
            e.preventDefault();
            if (!noticiaData.titulo || !noticiaData.contenido) {
              return triggerAdminToast('Título y Contenido son requeridos', 'warning');
            }
            if (editingNoticia === 'new') {
              onAddNoticia(noticiaData);
              triggerAdminToast('Artículo añadido', 'success');
            } else {
              onUpdateNoticia(noticiaData);
              triggerAdminToast('Artículo actualizado', 'success');
            }
            setEditingNoticia(null);
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
              {editingNoticia === 'new' ? 'Nuevo Artículo' : 'Editar Artículo'}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Título</label>
              <input type="text" className="admin-input" required value={noticiaData.titulo} onChange={e => setNoticiaData({...noticiaData, titulo: e.target.value})} placeholder="Ej. JCPS Expande Programa Bilingüe" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="admin-label">Tipo</label>
                <select className="admin-input" value={noticiaData.tipo} onChange={e => setNoticiaData({...noticiaData, tipo: e.target.value})}>
                  <option value="noticia">Noticia</option>
                  <option value="blog">Blog</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Categoría</label>
                <select className="admin-input" value={noticiaData.categoria} onChange={e => setNoticiaData({...noticiaData, categoria: e.target.value})}>
                  <option value="Comunidad">Comunidad</option>
                  <option value="Educación">Educación</option>
                  <option value="Salud">Salud</option>
                  <option value="Blog">Blog</option>
                  <option value="Cultura">Cultura</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }} className="responsive-flex">
              <div>
                <label className="admin-label">Autor</label>
                <input type="text" className="admin-input" value={noticiaData.autor} onChange={e => setNoticiaData({...noticiaData, autor: e.target.value})} placeholder="Ej. Berta Weyenberg" />
              </div>
              <div>
                <label className="admin-label">Fecha</label>
                <input type="date" className="admin-input" value={noticiaData.fecha} onChange={e => setNoticiaData({...noticiaData, fecha: e.target.value})} />
              </div>
              <div>
                <label className="admin-label">Tiempo de Lectura (min)</label>
                <input type="number" className="admin-input" min="1" value={noticiaData.lectura} onChange={e => setNoticiaData({...noticiaData, lectura: parseInt(e.target.value) || 1})} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Imagen de Portada</label>
              {noticiaData.imagen ? (
                <div style={{ position: 'relative', width: '200px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                  <img src={noticiaData.imagen} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Portada" />
                  <button type="button" onClick={() => setNoticiaData({...noticiaData, imagen: ''})} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                </div>
              ) : (
                <label className="admin-dropzone" style={{ height: '120px' }}>
                  <UploadCloud size={24} color="#9CA3AF" style={{ marginBottom: '8px' }} />
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Sube una imagen de portada</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNoticiaData({ ...noticiaData, imagen: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
                </label>
              )}
              <input type="text" className="admin-input" style={{ marginTop: '8px' }} value={noticiaData.imagen} onChange={e => setNoticiaData({...noticiaData, imagen: e.target.value})} placeholder="O pega un enlace de imagen (HTTP)" />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Resumen / Copete</label>
              <textarea className="admin-textarea" style={{ minHeight: '60px' }} value={noticiaData.excerpt} onChange={e => setNoticiaData({...noticiaData, excerpt: e.target.value})} placeholder="Resumen corto del artículo..." />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="admin-label">Contenido completo (HTML permitido)</label>
              <div className="admin-wysiwyg-toolbar">
                <button type="button" onClick={() => {
                  setNoticiaData(prev => ({ ...prev, contenido: prev.contenido + '<b>Texto en negrita</b>' }));
                }}><Bold size={16}/></button>
                <button type="button" onClick={() => {
                  setNoticiaData(prev => ({ ...prev, contenido: prev.contenido + '<i>Texto en cursiva</i>' }));
                }}><Italic size={16}/></button>
                <button type="button" onClick={() => {
                  setNoticiaData(prev => ({ ...prev, contenido: prev.contenido + '<p>Párrafo nuevo</p>' }));
                }}><Underline size={16}/></button>
                <button type="button" onClick={() => {
                  setNoticiaData(prev => ({ ...prev, contenido: prev.contenido + '<ul><li>Ítem</li></ul>' }));
                }}><ListIcon size={16}/></button>
              </div>
              <textarea className="admin-wysiwyg-content" style={{ width: '100%', minHeight: '250px', resize: 'vertical' }} placeholder="Escribe el contenido aquí en HTML..." value={noticiaData.contenido} onChange={e => setNoticiaData({...noticiaData, contenido: e.target.value})} />
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingNoticia(null)}>Cancelar</button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>Guardar Artículo</button>
            </div>
          </form>
        )}

        {/* VIEW: BUSINESS DIRECTORY (Guests) */}
        {activeMenu === 'negocios' && !editingGuest && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">Directorio de Negocios</h2>
              <button className="admin-btn-primary" style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={() => { setGuestData({ id: '', name: '', business: '', bio: '', bgPhoto: '', facebook: '', instagram: '', linkedin: '', youtube: '', website: '' }); setEditingGuest('new'); }}>
                <Plus size={18} /> Nuevo
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guests.map(g => (
                <div key={g.id} className="admin-item-card">
                  <img src={g.bgPhoto || 'https://via.placeholder.com/64'} className="admin-item-img" style={{ borderRadius: '50%' }} alt={g.name} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{g.name}</h4>
                    <span className="admin-item-subtitle">{g.business || 'Sin Negocio'}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-action-btn" onClick={() => { setGuestData(g); setEditingGuest(g.id); }}><Edit2 size={18} color="#4B5563" /></button>
                    <button className="admin-action-btn error" onClick={() => { if(window.confirm('¿Borrar invitado?')) { onDeleteGuest(g.id); triggerAdminToast('Eliminado', 'error'); } }}><Trash2 size={18} color="#EF4444" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: GUEST FORM */}
        {activeMenu === 'negocios' && editingGuest && (
          <form className="admin-form-card" onSubmit={handleSaveGuest}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>{editingGuest === 'new' ? 'Nuevo Perfil o Negocio' : 'Editar Perfil'}</h3>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Nombre</label>
              <input type="text" className="admin-input" required value={guestData.name} onChange={e => setGuestData({...guestData, name: e.target.value})} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Negocio / Cargo</label>
              <input type="text" className="admin-input" value={guestData.business} onChange={e => setGuestData({...guestData, business: e.target.value})} placeholder="Ej. CEO de Envision Radio" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Logo / Fotografía</label>
              {guestData.bgPhoto ? (
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginBottom: '8px' }}>
                  <img src={guestData.bgPhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                  <button type="button" onClick={() => setGuestData({...guestData, bgPhoto: ''})} style={{ position: 'absolute', top: '28px', left: '28px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14}/></button>
                </div>
              ) : (
                <label className="admin-dropzone" style={{ height: '80px', padding: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Subir Foto</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'guest')} />
                </label>
              )}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Biografía</label>
              <textarea className="admin-textarea" style={{ minHeight: '80px' }} value={guestData.bio} onChange={e => setGuestData({...guestData, bio: e.target.value})}></textarea>
            </div>
            
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '24px', marginBottom: '8px', color: '#374151' }}>Enlaces</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input type="text" className="admin-input" placeholder="Instragram URL" value={guestData.instagram} onChange={e => setGuestData({...guestData, instagram: e.target.value})} />
              <input type="text" className="admin-input" placeholder="LinkedIn URL" value={guestData.linkedin} onChange={e => setGuestData({...guestData, linkedin: e.target.value})} />
            </div>
            <input type="text" className="admin-input" style={{ marginBottom: '24px' }} placeholder="Sitio Web" value={guestData.website} onChange={e => setGuestData({...guestData, website: e.target.value})} />
            
            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingGuest(null)}>Cancelar</button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>Guardar</button>
            </div>
          </form>
        )}

        {/* VIEW: PROFILE */}
        {activeMenu === 'perfil' && (
          <div className="admin-form-card">
            <h2 className="admin-section-title">Perfil & Public Speaker</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Actualiza tus redes sociales públicas. Estos enlaces aparecerán en tu tarjeta de presentación móvil.</p>
            
            {['instagram', 'linkedin', 'facebook', 'youtube', 'website'].map(net => (
              <div key={net} style={{ marginBottom: '16px' }}>
                <label className="admin-label" style={{ textTransform: 'capitalize' }}>{net}</label>
                <input type="text" className="admin-input" value={localProfile[net] || ''} onChange={e => setLocalProfile({...localProfile, [net]: e.target.value})} placeholder={`https://${net}.com/...`} />
              </div>
            ))}
            
            <button className="admin-btn-primary" style={{ marginTop: '16px' }} onClick={() => { onUpdateProfile(localProfile); triggerAdminToast('Perfil Publicado', 'success'); }}>Guardar Perfil</button>
          </div>
        )}

        {/* VIEW: BACKUP */}
        {activeMenu === 'backup' && (
          <div className="admin-form-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '64px', height: '64px', background: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Download size={32} color="#2563EB" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Copia de Seguridad</h2>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '32px' }}>Toda la información se guarda de forma segura en tu dispositivo. Descarga un archivo con todos tus datos (episodios, invitados, configuración) para tener respaldo.</p>
            
            <button className="admin-btn-primary" onClick={executeBackup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <Download size={20} /> Exportar Mis Datos (JSON)
            </button>
            <label className="admin-btn-secondary" style={{ width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
              <Upload size={20} /> Importar Datos Anteriores (JSON)
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = async (evt) => {
                    try {
                      const data = JSON.parse(evt.target.result);
                      if (data.episodes && data.guests && data.reflections) {
                        if (window.confirm('Esto reemplazará todos tus datos actuales. ¿Deseas continuar?')) {
                          if (onImportBackup) {
                            await onImportBackup(data);
                            triggerAdminToast('Datos importados con éxito', 'success');
                          }
                        }
                      } else {
                        triggerAdminToast('El archivo no parece ser un backup válido', 'error');
                      }
                    } catch (err) {
                      triggerAdminToast('Error al leer el archivo de backup', 'error');
                    }
                  };
                  reader.readAsText(file);
                }
              }} />
            </label>
          </div>
        )}

      </main>

      {/* TOAST SYSTEM */}
      {adminToast && <Toast message={adminToast.message} type={adminToast.type} />}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button className={`admin-sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="admin-sidebar-icon">{icon}</span>
    <span className="admin-sidebar-text">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon }) => (
  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: 500 }}>{title}</span>
      {icon}
    </div>
    <span style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>{value}</span>
  </div>
);

const Toast = ({ message, type }) => {
  const Icon = type === 'success' ? CheckCircle : type === 'warning' ? AlertTriangle : XCircle;
  const color = type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#EF4444';
  
  return (
    <div className="admin-toast">
      <Icon size={20} color={color} />
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{message}</span>
    </div>
  );
};

// --- CSS IN JS (Scoped) ---

const AdminStyles = () => (
  <style>{`
    .admin-login-layout {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #F9FAFB; z-index: 9999;
      display: flex; justify-content: center; align-items: center; padding: 20px;
      font-family: 'Inter', sans-serif;
    }
    .admin-login-card {
      width: 100%; max-width: 400px; background: #FFFFFF;
      border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      padding: 32px 24px; text-align: left;
    }
    
    .admin-app-layout {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #F9FAFB; z-index: 1000;
      display: flex; flex-direction: column;
      font-family: 'Inter', sans-serif;
    }

    .admin-header {
      height: 64px; width: 100%; background: #ffffff;
      position: fixed; top: 0; left: 0; right: 0;
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); z-index: 40;
    }
    @media(min-width: 600px) {
      .admin-header { position: absolute; border-top-left-radius: 32px; border-top-right-radius: 32px; }
    }
    .admin-header-title { font-size: 18px; font-weight: 600; color: #111827; }
    .admin-icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; }

    .admin-sidebar {
      position: fixed; top: 0; bottom: 0; left: 0; width: 280px;
      background: #FFFFFF; box-shadow: 20px 0 25px -5px rgba(0,0,0,0.1);
      transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 50; display: flex; flex-direction: column;
    }
    .admin-sidebar.open { transform: translateX(0); }
    @media(min-width: 600px) {
      .admin-sidebar { position: absolute; border-top-left-radius: 32px; border-bottom-left-radius: 32px; }
    }
    .admin-sidebar-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.4); z-index: 45; opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    @media(min-width: 600px) {
      .admin-sidebar-overlay { position: absolute; }
    }
    .admin-sidebar-overlay.open { opacity: 1; pointer-events: auto; }
    
    .admin-sidebar-item {
      width: 100%; height: 48px; display: flex; align-items: center; gap: 12px;
      padding-left: 16px; background: none; border: none; cursor: pointer;
      border-radius: 6px; border-left: 4px solid transparent; transition: all 0.2s;
    }
    .admin-sidebar-item.active { background: #EFF6FF; border-left-color: #2563EB; }
    .admin-sidebar-text { font-size: 15px; font-weight: 500; color: #374151; }
    .admin-sidebar-icon { color: #6B7280; display: flex; align-items: center; }
    .admin-sidebar-item.active .admin-sidebar-text, .admin-sidebar-item.active .admin-sidebar-icon { color: #2563EB; }

    .admin-main { flex: 1; margin-top: 64px; padding: 16px; overflow-y: auto; padding-bottom: 80px; }

    .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .admin-section-title { font-size: 20px; font-weight: 700; color: #111827; }

    .admin-item-card {
      width: 100%; background: #ffffff; border-radius: 8px; border: 1px solid #E5E7EB;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); padding: 16px;
      display: flex; align-items: flex-start;
    }
    .admin-item-img { width: 64px; height: 64px; border-radius: 6px; object-fit: cover; margin-right: 16px; background: #E5E7EB; flex-shrink: 0; }
    .admin-item-info { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .admin-item-title { font-size: 16px; font-weight: 600; color: #111827; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 4px; }
    .admin-item-subtitle { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
    .admin-badge-success { background: #D1FAE5; color: #065F46; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 9999px; display: inline-block; width: fit-content; }
    
    .admin-item-actions { display: flex; flex-direction: column; gap: 8px; margin-left: 8px; }
    .admin-action-btn { width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; background: none; border: none; cursor: pointer; border-radius: 6px; }
    .admin-action-btn:hover { background: #F3F4F6; }
    .admin-action-btn.error:hover { background: #FEE2E2; }

    .admin-form-card { background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

    .admin-label { display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 6px; text-transform: none; }
    .admin-input {
      width: 100%; height: 44px; background: #ffffff; border: 1px solid #D1D5DB;
      padding: 0 12px; font-size: 16px; border-radius: 6px; outline: none; transition: 0.2s; font-family: 'Inter', sans-serif;
    }
    .admin-input:focus, .admin-textarea:focus { border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
    
    .admin-textarea {
      width: 100%; min-height: 120px; background: #ffffff; border: 1px solid #D1D5DB;
      padding: 12px; font-size: 16px; border-radius: 6px; outline: none; resize: vertical; transition: 0.2s; font-family: 'Inter', sans-serif;
    }

    .admin-dropzone {
      width: 100%; height: 120px; border: 2px dashed #D1D5DB; border-radius: 8px;
      background: #F9FAFB; display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; transition: 0.2s;
    }
    .admin-dropzone:hover { background: #F3F4F6; border-color: #9CA3AF; }

    .admin-btn-primary {
      width: 100%; height: 44px; background: #2563EB; color: white;
      border-radius: 6px; font-weight: 600; font-size: 16px; border: none; cursor: pointer; transition: 0.15s;
    }
    .admin-btn-primary:hover { background: #1D4ED8; }
    .admin-btn-secondary {
      width: 100%; height: 44px; background: transparent; color: #4B5563;
      border-radius: 6px; font-weight: 500; font-size: 16px; border: 1px solid #D1D5DB; cursor: pointer; transition: 0.15s;
    }
    .admin-btn-secondary:hover { background: #F3F4F6; }

    .admin-sticky-bottom {
      display: flex; justify-content: flex-end; gap: 12px; padding-top: 24px; border-top: 1px solid #E5E7EB; margin-top: 24px;
    }

    .admin-separator { position: relative; width: 100%; height: 1px; background: #E5E7EB; margin: 32px 0; text-align: center; }
    .admin-separator span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #ffffff; padding: 0 8px; font-size: 12px; color: #6B7280; font-weight: 500; }

    .admin-wysiwyg-toolbar {
      display: flex; height: 40px; background: #F3F4F6; border: 1px solid #D1D5DB; border-bottom: none; border-radius: 6px 6px 0 0; align-items: center; padding: 0 4px;
    }
    .admin-wysiwyg-toolbar button {
      width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; background: none; border: none; cursor: pointer; border-radius: 4px; color: #4B5563;
    }
    .admin-wysiwyg-toolbar button:hover { background: #E5E7EB; }
    .admin-wysiwyg-content {
      min-height: 200px; border: 1px solid #D1D5DB; border-radius: 0 0 6px 6px; padding: 16px; font-size: 16px; line-height: 1.6; outline: none; background: #ffffff;
    }
    .admin-wysiwyg-content:empty:before { content: attr(placeholder); color: #9CA3AF; pointer-events: none; }

    .admin-toast {
      position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10000;
      background: #1F2937; color: white; padding: 12px 16px; border-radius: 8px;
      display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      animation: toastSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @media(min-width: 600px) {
      .admin-toast { position: absolute; }
    }
    @keyframes toastSlideUp {
      from { transform: translate(-50%, 30px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    @media(max-width: 600px) {
      .responsive-flex {
        grid-template-columns: 1fr !important;
      }
    }
  `}</style>
);

export default AdminView;
