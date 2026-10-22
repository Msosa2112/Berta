import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  UploadCloud,
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Upload,
  Home,
  Mic,
  BookOpen,
  Briefcase,
  User,
  Save,
  LayoutDashboard,
  LogOut,
  Scale,
  PenTool,
  Award,
  MessageSquare,
  Image as ImageIcon,
  Lock,
  Sparkles,
  ChevronLeft,
  Calendar,
} from 'lucide-react';

const STATEMENT_CATEGORIES = [
  'Actualidad & Fe',
  'Familia & Sociedad',
  'Cultura & Verdad Bíblica',
  'Educación & Valores',
];

const BLOG_CATEGORIES = [
  'Fe & Esperanza',
  'Familia & Educación',
  'Reflexiones',
  'Vida & Propósito',
  'Comunidad',
];

const stripHtml = (html = '') =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const formatParagraphsToHtml = (text = '') => {
  if (!text) return '';
  if (text.includes('<p>') || text.includes('<h3>') || text.includes('<blockquote>')) {
    return text;
  }
  return text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('');
};

const htmlToPlainText = (html = '') => {
  if (!html) return '';
  return html
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const DEFAULT_HOME_SETTINGS = {
  avatar: '/berta.jpeg',
  heroName: 'Berta Weyenberg',
  heroRoleEs: 'Host de ConBERTAciones · Reflexiones & Conferencista',
  heroRoleEn: 'Host of ConBERTAciones · Reflections & Public Speaker',
  location: 'Louisville, Kentucky',
  contactEmail: 'info@conbertaciones.com',
  bioEs:
    'Originaria de Cuba, Berta Polo Weyenberg es educadora galardonada y figura central de la comunidad hispana en Kentucky. A través de sus entrevistas en ConBERTAciones y sus reflexiones bilingües en Under the Umbrella (Bajo la Sombrilla), comparte mensajes de fe, esperanza, educación y propósito.',
  bioEn:
    'Originally from Cuba, Berta Polo Weyenberg is an award-winning educator and central voice in Kentucky’s Hispanic community. Through her interviews on ConBERTAciones and her bilingual reflections on Under the Umbrella (Bajo la Sombrilla), she shares messages of faith, hope, education, and purpose.',
  spacesTitleEs: 'Dos espacios pensados para ti:',
  spacesTitleEn: 'Two spaces designed for you:',
  space1DescEs: 'nuestro espacio de entrevistas profundas y conversaciones con invitados especiales.',
  space1DescEn: 'our space for in-depth interviews and meaningful conversations with special guests.',
  space2DescEs: 'cápsulas y reflexiones cortas en Español e Inglés para inspirar tu día a día.',
  space2DescEn: 'short capsules and reflections in Spanish and English to inspire your everyday life.',
  cardPodcastTitleEs: 'ConBERTAciones · Entrevistas',
  cardPodcastTitleEn: 'ConBERTAciones · Interviews',
  cardPodcastDescEs: '',
  cardPodcastDescEn: '',
  cardUmbrellaTitleEs: 'Under the Umbrella · Reflexiones',
  cardUmbrellaTitleEn: 'Under the Umbrella · Reflections',
  cardUmbrellaDescEs: '',
  cardUmbrellaDescEn: '',
  cardSpeakerTitleEs: 'Agenda una Charla',
  cardSpeakerTitleEn: 'Book a Speaking Event',
  cardSpeakerDescEs: 'Invita a Berta como conferencista para tu escuela, grupo de fe o empresa.',
  cardSpeakerDescEn: 'Invite Berta as a speaker for your school, faith group, or company.',
  speakerBullet1Es: 'Educación de estudiantes e hijos',
  speakerBullet1En: 'Student & parenting education',
  speakerBullet2Es: 'Grupos de damas y grupos de fe',
  speakerBullet2En: "Women's ministries & faith groups",
  speakerBullet3Es: 'Mensaje alentador para empresas',
  speakerBullet3En: 'Encouraging message for companies',
  cardStatementTitle: 'The Weyenberg Statement',
  cardStatementDescEs:
    'Statements de la familia Weyenberg basados en conceptos bíblicos, analizando fenómenos de la actualidad con un lente bíblico.',
  cardStatementDescEn:
    'Statements by the Weyenberg family grounded in biblical concepts, analyzing current phenomena through a biblical lens.',
  cardBlogTitleEs: 'Blog de Berta · Reflexiones',
  cardBlogTitleEn: "Berta's Blog · Reflections",
  cardBlogDescEs:
    'Reflexiones escritas, enseñanzas para la familia y galerías de imágenes compartidas por Berta.',
  cardBlogDescEn:
    'Written reflections, family teachings, and image galleries shared by Berta.',
  cardConectaTitleEs: 'Conecta con Berta',
  cardConectaTitleEn: 'Connect with Berta',
  cardConectaDescEs:
    'Envía tus preguntas para el segmento Dame La Letra, comparte tu testimonio o agenda una conferencia.',
  cardConectaDescEn:
    'Send your questions for the Dame La Letra segment, share your testimony, or book a speaking event.',
  statsEpisodes: '50+',
  statsCommunity: '12k',
  statsSeasons: '5',
};

const AdminView = ({
  initialSection = 'dashboard',
  episodes = [],
  guests = [],
  profileSettings = {},
  onUpdateProfile,
  reflections = [],
  onUpdateReflections,
  noticias = [],
  onAddNoticia,
  onUpdateNoticia,
  onDeleteNoticia,
  statements = [],
  onAddStatement,
  onUpdateStatement,
  onDeleteStatement,
  onImportBackup,
  onAdd,
  onUpdate,
  onDelete,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  onSyncSpotify,
  isSyncingSpotify,
  onClose,
  triggerToast,
}) => {
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('weyenberg_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [loginForm, setLoginForm] = useState({ user: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(initialSection || 'dashboard');

  useEffect(() => {
    if (initialSection) setActiveMenu(initialSection);
  }, [initialSection]);

  // --- EDITING STATES ---
  const [editingEp, setEditingEp] = useState(null);
  const [editingReflection, setEditingReflection] = useState(null);
  const [editingGuest, setEditingGuest] = useState(null);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [editingStatement, setEditingStatement] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    host: 'Berta Weyenberg',
    duration: '0:00',
    color: 'purple',
    art: '',
    audioUrl: '',
    spotifyUrl: '',
    audioFile: null,
    audioFileName: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  const [reflectionForm, setReflectionForm] = useState({
    id: '',
    titleEs: '',
    titleEn: '',
    contentEsRaw: '',
    contentEnRaw: '',
    audioEs: '',
    audioEn: '',
    durationEs: '3:00',
    durationEn: '3:00',
    spotifyUrlEs: '',
    spotifyUrlEn: '',
    videoEs: '',
    videoEn: '',
    thumbnail: '/cover_art_games.png',
    releaseDate: new Date().toISOString().split('T')[0],
  });

  const [guestData, setGuestData] = useState({
    id: '',
    name: '',
    business: '',
    businessEn: '',
    bio: '',
    bioEn: '',
    bgPhoto: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    website: '',
  });

  const [noticiaData, setNoticiaData] = useState({
    id: '',
    tipo: 'blog',
    titulo: '',
    fraseDestacada: '',
    excerpt: '',
    contenidoRaw: '',
    imagen: '/berta.jpeg',
    galeria: [],
    categoria: 'Fe & Esperanza',
    autor: 'Berta Weyenberg',
    fecha: new Date().toISOString().split('T')[0],
    lectura: 4,
  });

  const [statementData, setStatementData] = useState({
    id: '',
    titulo: '',
    categoria: 'Actualidad & Fe',
    versiculo: '',
    autor: 'Familia Weyenberg',
    fecha: new Date().toISOString().split('T')[0],
    resumen: '',
    contenidoRaw: '',
    imagen: '/berta.jpeg',
    imagenes: [],
    facebookUrl: '',
  });

  // Home & Profile Settings Form
  const [localProfile, setLocalProfile] = useState(() => ({
    ...DEFAULT_HOME_SETTINGS,
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
    website: '',
    ...profileSettings,
  }));

  useEffect(() => {
    setLocalProfile(prev => ({
      ...DEFAULT_HOME_SETTINGS,
      ...prev,
      ...profileSettings,
    }));
  }, [profileSettings]);

  // Community Inbox (Bookings + Dame La Letra)
  const [speakerBookings, setSpeakerBookings] = useState([]);
  const [dameSubmissions, setDameSubmissions] = useState([]);

  useEffect(() => {
    try {
      setSpeakerBookings(JSON.parse(localStorage.getItem('berta_speaker_bookings') || '[]'));
    } catch {}
    try {
      setDameSubmissions(JSON.parse(localStorage.getItem('dame_la_letra_submissions') || '[]'));
    } catch {}
  }, [activeMenu]);

  // Toast
  const [adminToast, setAdminToast] = useState(null);
  const triggerAdminToast = (message, type = 'success') => {
    setAdminToast({ message, type });
    if (triggerToast) triggerToast(message);
    setTimeout(() => setAdminToast(null), 3000);
  };

  // --- LOGIN / LOGOUT ---
  const handleLogin = (e) => {
    e.preventDefault();
    const u = loginForm.user.trim().toLowerCase();
    const p = loginForm.password.trim();
    if (
      (u === 'weyenberg' && p === 'statement2026') ||
      (u === 'admin' && (p === 'berta' || p === 'statement2026')) ||
      (u === 'berta' && (p === 'berta' || p === 'statement2026'))
    ) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('weyenberg_admin_auth', 'true');
      } catch {}
      triggerAdminToast('¡Bienvenida al Panel de Administración, Berta!', 'success');
    } else {
      triggerAdminToast('Usuario o contraseña incorrectos', 'error');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('weyenberg_admin_auth');
    } catch {}
    if (onClose) onClose();
  };

  // --- IMAGE UPLOAD HELPERS ---
  const handleSingleImageUpload = (e, callback) => {
    const file = e.files ? e.files[0] : e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImagesUpload = (e, callback) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // --- SAVE HANDLERS ---
  const handleSaveHomeAndProfile = async (e) => {
    if (e) e.preventDefault();
    await onUpdateProfile(localProfile);
    triggerAdminToast('¡Contenido de Inicio y Perfil actualizado con éxito!', 'success');
  };

  const handleResetHomeDefaults = async () => {
    if (window.confirm('¿Deseas restaurar los textos de Inicio a sus valores originales?')) {
      const reset = {
        ...localProfile,
        ...DEFAULT_HOME_SETTINGS,
      };
      setLocalProfile(reset);
      await onUpdateProfile(reset);
      triggerAdminToast('Textos de Inicio restaurados a los valores por defecto', 'success');
    }
  };

  const handleSaveStatement = async (e) => {
    e.preventDefault();
    if (!statementData.titulo.trim() || !statementData.contenidoRaw.trim()) {
      return triggerAdminToast('Por favor ingresa el título y el contenido del Statement', 'warning');
    }
    const htmlContent = formatParagraphsToHtml(statementData.contenidoRaw);
    const autoResumen = statementData.resumen.trim() || stripHtml(htmlContent).substring(0, 170) + '...';
    const payload = {
      id: editingStatement === 'new' ? 'ws_' + Date.now().toString() : editingStatement,
      titulo: statementData.titulo.trim(),
      categoria: statementData.categoria,
      versiculo: statementData.versiculo.trim(),
      autor: statementData.autor.trim() || 'Familia Weyenberg',
      fecha: statementData.fecha || new Date().toISOString().split('T')[0],
      resumen: autoResumen,
      contenido: htmlContent,
      imagen: statementData.imagen || '/berta.jpeg',
      imagenes: statementData.imagenes || [],
      facebookUrl: statementData.facebookUrl.trim(),
    };
    if (editingStatement === 'new') {
      if (onAddStatement) await onAddStatement(payload);
      triggerAdminToast('¡Nuevo Statement publicado!', 'success');
    } else {
      if (onUpdateStatement) await onUpdateStatement(payload);
      triggerAdminToast('¡Statement actualizado!', 'success');
    }
    setEditingStatement(null);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!noticiaData.titulo.trim() || !noticiaData.contenidoRaw.trim()) {
      return triggerAdminToast('Título y contenido de la reflexión son obligatorios', 'warning');
    }
    const htmlContent = formatParagraphsToHtml(noticiaData.contenidoRaw);
    const autoExcerpt = noticiaData.excerpt.trim() || stripHtml(htmlContent).substring(0, 160) + '...';
    const payload = {
      id: editingNoticia === 'new' ? 'b_' + Date.now().toString() : editingNoticia,
      tipo: 'blog',
      titulo: noticiaData.titulo.trim(),
      categoria: noticiaData.categoria || 'Reflexiones',
      fraseDestacada: noticiaData.fraseDestacada.trim(),
      autor: noticiaData.autor.trim() || 'Berta Weyenberg',
      fecha: noticiaData.fecha || new Date().toISOString().split('T')[0],
      excerpt: autoExcerpt,
      contenido: htmlContent,
      imagen: noticiaData.imagen || '/berta.jpeg',
      galeria: noticiaData.galeria || [],
      lectura: Number(noticiaData.lectura) || 4,
    };
    if (editingNoticia === 'new') {
      if (onAddNoticia) await onAddNoticia(payload);
      triggerAdminToast('¡Reflexión publicada en el Blog de Berta!', 'success');
    } else {
      if (onUpdateNoticia) await onUpdateNoticia(payload);
      triggerAdminToast('¡Reflexión del Blog actualizada!', 'success');
    }
    setEditingNoticia(null);
  };

  const handleSaveEp = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.host) {
      return triggerAdminToast('Título e Invitado son requeridos', 'warning');
    }
    if (editingEp === 'new') {
      onAdd({ ...formData, id: Date.now().toString() });
      triggerAdminToast('Entrevista añadida', 'success');
    } else {
      onUpdate(formData);
      triggerAdminToast('Entrevista actualizada', 'success');
    }
    setEditingEp(null);
  };

  const handleSaveReflectionItem = async (e) => {
    e.preventDefault();
    if (!reflectionForm.titleEs && !reflectionForm.titleEn) {
      return triggerAdminToast('Ingresa al menos un título en Español o Inglés', 'warning');
    }
    const payload = {
      id: editingReflection === 'new' ? 'ref_' + Date.now().toString() : editingReflection,
      titleEs: reflectionForm.titleEs.trim(),
      titleEn: reflectionForm.titleEn.trim(),
      contentEs: formatParagraphsToHtml(reflectionForm.contentEsRaw),
      contentEn: formatParagraphsToHtml(reflectionForm.contentEnRaw),
      rawEs: reflectionForm.contentEsRaw.trim(),
      rawEn: reflectionForm.contentEnRaw.trim(),
      audioEs: reflectionForm.audioEs.trim(),
      audioEn: reflectionForm.audioEn.trim(),
      durationEs: reflectionForm.durationEs || '3:00',
      durationEn: reflectionForm.durationEn || '3:00',
      spotifyUrlEs: reflectionForm.spotifyUrlEs.trim(),
      spotifyUrlEn: reflectionForm.spotifyUrlEn.trim(),
      videoEs: reflectionForm.videoEs.trim(),
      videoEn: reflectionForm.videoEn.trim(),
      thumbnail: reflectionForm.thumbnail || '/cover_art_games.png',
      releaseDate: reflectionForm.releaseDate || new Date().toISOString().split('T')[0],
    };

    let updatedList;
    if (editingReflection === 'new') {
      updatedList = [payload, ...reflections];
    } else {
      updatedList = reflections.map(r => (r.id === payload.id ? { ...r, ...payload } : r));
    }
    await onUpdateReflections(updatedList);
    triggerAdminToast('¡Reflexión de Under the Umbrella guardada!', 'success');
    setEditingReflection(null);
  };

  const handleDeleteReflectionItem = async (id) => {
    if (window.confirm('¿Eliminar esta reflexión de Under the Umbrella?')) {
      const updatedList = reflections.filter(r => r.id !== id);
      await onUpdateReflections(updatedList);
      triggerAdminToast('Reflexión eliminada', 'error');
    }
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();
    if (!guestData.name) return triggerAdminToast('El nombre del invitado es obligatorio', 'warning');
    if (editingGuest === 'new') {
      onAddGuest({ ...guestData, id: 'g_' + Date.now().toString() });
      triggerAdminToast('Invitado añadido', 'success');
    } else {
      onUpdateGuest(guestData);
      triggerAdminToast('Invitado actualizado', 'success');
    }
    setEditingGuest(null);
  };

  const executeBackup = () => {
    const serializableEpisodes = episodes.map(({ audioFile, ...rest }) => rest);
    const data = {
      episodes: serializableEpisodes,
      guests,
      profileSettings: localProfile,
      reflections,
      noticias,
      statements,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conbertaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    triggerAdminToast('Copia de seguridad completa descargada', 'success');
  };

  const navSections = [
    { id: 'dashboard', label: 'Resumen General', icon: <LayoutDashboard size={18} /> },
    { id: 'inicio', label: 'Contenido de Inicio', icon: <Home size={18} /> },
    { id: 'statements', label: 'The Weyenberg Statement', icon: <Scale size={18} /> },
    { id: 'noticias', label: 'Blog de Berta', icon: <PenTool size={18} /> },
    { id: 'episodios', label: 'ConBERTAciones (Entrevistas)', icon: <Mic size={18} /> },
    { id: 'reflexiones', label: 'Under the Umbrella', icon: <BookOpen size={18} /> },
    { id: 'negocios', label: 'Invitados del Podcast', icon: <User size={18} /> },
    { id: 'comunidad', label: 'Charlas & Dame La Letra', icon: <MessageSquare size={18} /> },
    { id: 'perfil', label: 'Perfil & Redes Sociales', icon: <Briefcase size={18} /> },
    { id: 'backup', label: 'Respaldos (Backup)', icon: <Save size={18} /> },
  ];

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="admin-login-layout">
        <AdminStyles />
        <div className="admin-login-card">
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #792359, #c026d3)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: '0 8px 20px rgba(121, 35, 89, 0.25)',
              }}
            >
              <Lock size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F2937', margin: '0 0 6px 0' }}>
              ConBERTAciones · Admin
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#6B7280', margin: 0 }}>
              Panel unificado para administrar Inicio, Blog, The Weyenberg Statement, Podcast y Perfil.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label className="admin-label">Usuario</label>
              <input
                type="text"
                required
                className="admin-input"
                value={loginForm.user}
                onChange={e => setLoginForm({ ...loginForm, user: e.target.value })}
                placeholder="weyenberg o admin"
              />
            </div>
            <div style={{ marginBottom: '22px', position: 'relative' }}>
              <label className="admin-label">Contraseña</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="admin-input"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '34px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="submit" className="admin-btn-primary">
              Entrar al Panel de Administración
            </button>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-secondary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              Volver al Perfil
            </button>
          </form>
        </div>
        {adminToast && <Toast message={adminToast.message} type={adminToast.type} />}
      </div>
    );
  }

  return (
    <div className="admin-app-layout">
      <AdminStyles />

      {/* 1. TOP HEADER */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setIsSidebarOpen(true)} className="admin-icon-btn" title="Menú de secciones">
            <Menu size={22} color="#792359" />
          </button>
          <button
            onClick={onClose}
            className="admin-btn-secondary"
            style={{ height: '36px', padding: '0 12px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
          >
            <ChevronLeft size={16} /> Volver al Sitio
          </button>
        </div>

        <span className="admin-header-title">
          {navSections.find(s => s.id === activeMenu)?.label || 'Panel de Administración'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleLogout}
            className="admin-btn-secondary"
            style={{ height: '36px', padding: '0 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Cerrar sesión"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      {/* Horizontal Quick Navigation Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '12px 16px',
          background: '#FFFFFF',
          borderBottom: '1px solid #F3E8FF',
        }}
      >
        {navSections.map(sec => {
          const isActive = activeMenu === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveMenu(sec.id);
                setEditingEp(null);
                setEditingReflection(null);
                setEditingGuest(null);
                setEditingNoticia(null);
                setEditingStatement(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: isActive ? 'none' : '1px solid #E5E7EB',
                background: isActive ? 'linear-gradient(135deg, #792359, #c026d3)' : '#F9FAFB',
                color: isActive ? '#FFFFFF' : '#374151',
                fontWeight: isActive ? 700 : 600,
                fontSize: '13px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {sec.icon}
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. SIDEBAR DRAWER */}
      <div className={`admin-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '6px', height: '100%', overflowY: 'auto' }}>
          <div style={{ padding: '0 12px 12px 12px', borderBottom: '1px solid #F3E8FF', marginBottom: '8px' }}>
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#792359' }}>ConBERTAciones</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Panel de Administración Unificado</div>
          </div>

          {navSections.map(sec => (
            <SidebarItem
              key={sec.id}
              icon={sec.icon}
              label={sec.label}
              active={activeMenu === sec.id}
              onClick={() => {
                setActiveMenu(sec.id);
                setIsSidebarOpen(false);
              }}
            />
          ))}

          <div style={{ flex: 1 }}></div>
          <SidebarItem icon={<LogOut size={18} />} label="Volver al Perfil" active={false} onClick={onClose} />
        </div>
      </div>

      {/* 3. MAIN WORKSPACE */}
      <main className="admin-main">
        {/* ══════════════════════════════════════════════════════════════════
            VIEW 1: DASHBOARD (RESUMEN GENERAL)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #792359 0%, #c026d3 100%)',
                color: '#FFFFFF',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 10px 28px rgba(121, 35, 89, 0.2)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.9 }}>
                ✨ Panel Todo-en-Uno · Berta Weyenberg
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0 8px 0' }}>
                Bienvenida a tu Centro de Control de ConBERTAciones
              </h2>
              <p style={{ fontSize: '14px', margin: 0, opacity: 0.92, lineHeight: 1.5 }}>
                Desde aquí puedes editar todo el contenido de la página de <strong>Inicio</strong>, publicar en <strong>The Weyenberg Statement</strong> y en el <strong>Blog de Berta</strong>, administrar episodios de <strong>ConBERTAciones</strong> y <strong>Under the Umbrella</strong>, y revisar mensajes de tu comunidad.
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '14px' }}>
              <StatCard
                title="Entrevistas (ConBERTAciones)"
                value={episodes.length}
                icon={<Mic size={22} color="#792359" />}
                onClick={() => setActiveMenu('episodios')}
              />
              <StatCard
                title="Under the Umbrella"
                value={reflections.length}
                icon={<BookOpen size={22} color="#C026D3" />}
                onClick={() => setActiveMenu('reflexiones')}
              />
              <StatCard
                title="The Weyenberg Statement"
                value={statements.length}
                icon={<Scale size={22} color="#D97706" />}
                onClick={() => setActiveMenu('statements')}
              />
              <StatCard
                title="Blog de Berta"
                value={noticias.length}
                icon={<PenTool size={22} color="#2563EB" />}
                onClick={() => setActiveMenu('noticias')}
              />
              <StatCard
                title="Invitados"
                value={guests.length}
                icon={<User size={22} color="#10B981" />}
                onClick={() => setActiveMenu('negocios')}
              />
            </div>

            {/* Quick Action Cards */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', color: '#111827' }}>
                Acciones Rápidas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <button
                  type="button"
                  className="admin-btn-primary"
                  style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setActiveMenu('inicio')}
                >
                  <Home size={18} /> Editar Contenido de Inicio
                </button>

                <button
                  type="button"
                  className="admin-btn-primary"
                  style={{ height: '48px', background: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => {
                    setStatementData({
                      id: '',
                      titulo: '',
                      categoria: 'Actualidad & Fe',
                      versiculo: '',
                      autor: 'Familia Weyenberg',
                      fecha: new Date().toISOString().split('T')[0],
                      resumen: '',
                      contenidoRaw: '',
                      imagen: '/berta.jpeg',
                      imagenes: [],
                      facebookUrl: '',
                    });
                    setEditingStatement('new');
                    setActiveMenu('statements');
                  }}
                >
                  <Plus size={18} /> Nuevo Weyenberg Statement
                </button>

                <button
                  type="button"
                  className="admin-btn-primary"
                  style={{ height: '48px', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => {
                    setNoticiaData({
                      id: '',
                      tipo: 'blog',
                      titulo: '',
                      fraseDestacada: '',
                      excerpt: '',
                      contenidoRaw: '',
                      imagen: '/berta.jpeg',
                      galeria: [],
                      categoria: 'Fe & Esperanza',
                      autor: 'Berta Weyenberg',
                      fecha: new Date().toISOString().split('T')[0],
                      lectura: 4,
                    });
                    setEditingNoticia('new');
                    setActiveMenu('noticias');
                  }}
                >
                  <Plus size={18} /> Nueva Reflexión en el Blog
                </button>

                {onSyncSpotify && (
                  <button
                    type="button"
                    onClick={onSyncSpotify}
                    disabled={isSyncingSpotify}
                    className="admin-btn-primary"
                    style={{ height: '48px', background: '#1DB954', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <UploadCloud size={18} />
                    {isSyncingSpotify ? 'Sincronizando Spotify...' : 'Sincronizar Spotify for Creators'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 2: CONTENIDO DE INICIO (HOME EDITOR)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'inicio' && (
          <form className="admin-form-card" onSubmit={handleSaveHomeAndProfile}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h2 className="admin-section-title">Administrar Contenido de Inicio (Home)</h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Personaliza la foto principal, biografía y los textos de cada tarjeta que ven los visitantes al entrar a ConBERTAciones.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="admin-btn-secondary" onClick={handleResetHomeDefaults}>
                  Restaurar por Defecto
                </button>
                <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 22px' }}>
                  Guardar Cambios de Inicio
                </button>
              </div>
            </div>

            {/* 1. Tarjeta Principal de Bienvenida / Bio */}
            <div className="admin-subcard">
              <h3 className="admin-subtitle">1. Tarjeta Principal: Foto, Nombre, Rol y Biografía</h3>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
                <img
                  src={localProfile.avatar || '/berta.jpeg'}
                  alt="Avatar Berta"
                  style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #792359' }}
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <label className="admin-label">Foto Principal de Berta (Inicio y Perfil)</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label className="admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', height: '38px' }}>
                      <ImageIcon size={15} /> Subir Nueva Foto
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleSingleImageUpload(e, res => setLocalProfile({ ...localProfile, avatar: res }))}
                      />
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      style={{ flex: 1, minWidth: '180px' }}
                      value={localProfile.avatar || ''}
                      onChange={e => setLocalProfile({ ...localProfile, avatar: e.target.value })}
                      placeholder="/berta.jpeg o URL de imagen"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Nombre Principal</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.heroName || ''}
                    onChange={e => setLocalProfile({ ...localProfile, heroName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Ubicación y Correo de Contacto</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Louisville, Kentucky"
                      value={localProfile.location || ''}
                      onChange={e => setLocalProfile({ ...localProfile, location: e.target.value })}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="info@conbertaciones.com"
                      value={localProfile.contactEmail || ''}
                      onChange={e => setLocalProfile({ ...localProfile, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginTop: '14px' }}>
                <div>
                  <label className="admin-label">Subtítulo / Rol (🇪🇸 Español)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.heroRoleEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, heroRoleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Subtítulo / Rol (🇺🇸 Inglés)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.heroRoleEn || ''}
                    onChange={e => setLocalProfile({ ...localProfile, heroRoleEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginTop: '14px' }}>
                <div>
                  <label className="admin-label">Biografía de Inicio (🇪🇸 Español)</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={localProfile.bioEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, bioEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Biografía de Inicio (🇺🇸 Inglés)</label>
                  <textarea
                    className="admin-textarea"
                    rows={4}
                    value={localProfile.bioEn || ''}
                    onChange={e => setLocalProfile({ ...localProfile, bioEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginTop: '14px' }}>
                <div>
                  <label className="admin-label">Descripción corta de ConBERTAciones en Bio (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.space1DescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, space1DescEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Descripción corta de Under the Umbrella en Bio (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.space2DescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, space2DescEs: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 2. Tarjetas de Podcast y Reflexiones en Inicio */}
            <div className="admin-subcard">
              <h3 className="admin-subtitle">2. Tarjetas de Podcast (ConBERTAciones) y Reflexiones (Under the Umbrella)</h3>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Título Tarjeta Podcast (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardPodcastTitleEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardPodcastTitleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Título Tarjeta Podcast (🇺🇸 EN)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardPodcastTitleEn || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardPodcastTitleEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginTop: '12px' }}>
                <div>
                  <label className="admin-label">Título Tarjeta Under the Umbrella (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardUmbrellaTitleEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardUmbrellaTitleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Título Tarjeta Under the Umbrella (🇺🇸 EN)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardUmbrellaTitleEn || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardUmbrellaTitleEn: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3. Tarjeta de Charlas / Conferencista en Inicio */}
            <div className="admin-subcard">
              <h3 className="admin-subtitle">3. Tarjeta "Agenda una Charla" en Inicio</h3>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Título de Tarjeta Charlas (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardSpeakerTitleEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardSpeakerTitleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Descripción de Tarjeta Charlas (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardSpeakerDescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardSpeakerDescEs: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                <div>
                  <label className="admin-label">🎓 Viñeta 1 (Educativa)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.speakerBullet1Es || ''}
                    onChange={e => setLocalProfile({ ...localProfile, speakerBullet1Es: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">✨ Viñeta 2 (Damas / Fe)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.speakerBullet2Es || ''}
                    onChange={e => setLocalProfile({ ...localProfile, speakerBullet2Es: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">💼 Viñeta 3 (Compañías / Empleados)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.speakerBullet3Es || ''}
                    onChange={e => setLocalProfile({ ...localProfile, speakerBullet3Es: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 4. Tarjetas The Weyenberg Statement, Blog de Berta y Conecta */}
            <div className="admin-subcard">
              <h3 className="admin-subtitle">4. Tarjetas de The Weyenberg Statement, Blog de Berta y Conecta</h3>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Descripción The Weyenberg Statement (🇪🇸 ES)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={localProfile.cardStatementDescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardStatementDescEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Descripción Blog de Berta (🇪🇸 ES)</label>
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={localProfile.cardBlogDescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardBlogDescEs: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-grid-2" style={{ marginTop: '12px' }}>
                <div>
                  <label className="admin-label">Título Tarjeta Conecta (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardConectaTitleEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardConectaTitleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Descripción Tarjeta Conecta (🇪🇸 ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.cardConectaDescEs || ''}
                    onChange={e => setLocalProfile({ ...localProfile, cardConectaDescEs: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="admin-sticky-bottom">
              <button type="submit" className="admin-btn-primary">
                Guardar Todo el Contenido de Inicio
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 3: THE WEYENBERG STATEMENT
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'statements' && !editingStatement && (
          <div>
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-title">The Weyenberg Statement ({statements.length})</h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
                  Publica los pronunciamientos de la familia Weyenberg desde Facebook con versículos e imágenes.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '0 18px', height: '42px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => {
                  setStatementData({
                    id: '',
                    titulo: '',
                    categoria: 'Actualidad & Fe',
                    versiculo: '',
                    autor: 'Familia Weyenberg',
                    fecha: new Date().toISOString().split('T')[0],
                    resumen: '',
                    contenidoRaw: '',
                    imagen: '/berta.jpeg',
                    imagenes: [],
                    facebookUrl: '',
                  });
                  setEditingStatement('new');
                }}
              >
                <Plus size={18} /> Nuevo Statement
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {statements.map(st => (
                <div key={st.id} className="admin-item-card">
                  <img src={st.imagen || '/berta.jpeg'} className="admin-item-img" alt={st.titulo} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{st.titulo}</h4>
                    <span className="admin-item-subtitle">
                      {st.categoria} • {st.fecha} {st.versiculo ? `• 📖 ${st.versiculo.substring(0, 45)}...` : ''}
                    </span>
                    <span className="admin-badge-success">The Weyenberg Statement</span>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => {
                        setStatementData({
                          id: st.id,
                          titulo: st.titulo || '',
                          categoria: st.categoria || 'Actualidad & Fe',
                          versiculo: st.versiculo || '',
                          autor: st.autor || 'Familia Weyenberg',
                          fecha: st.fecha || new Date().toISOString().split('T')[0],
                          resumen: st.resumen || '',
                          contenidoRaw: htmlToPlainText(st.contenido || ''),
                          imagen: st.imagen || '/berta.jpeg',
                          imagenes: st.imagenes || [],
                          facebookUrl: st.facebookUrl || '',
                        });
                        setEditingStatement(st.id);
                      }}
                    >
                      <Edit2 size={18} color="#4B5563" />
                    </button>
                    <button
                      className="admin-action-btn error"
                      onClick={() => {
                        if (window.confirm('¿Eliminar este Statement?')) {
                          onDeleteStatement(st.id);
                          triggerAdminToast('Statement eliminado', 'error');
                        }
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'statements' && editingStatement && (
          <form className="admin-form-card" onSubmit={handleSaveStatement}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
              {editingStatement === 'new' ? 'Publicar Nuevo Weyenberg Statement' : 'Editar Statement'}
            </h3>

            <div className="admin-grid-2">
              <div>
                <label className="admin-label">Título del Statement *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={statementData.titulo}
                  onChange={e => setStatementData({ ...statementData, titulo: e.target.value })}
                  placeholder="Ej. Discernimiento en Tiempos de Confusión Cultural"
                />
              </div>
              <div>
                <label className="admin-label">Categoría *</label>
                <select
                  className="admin-input"
                  value={statementData.categoria}
                  onChange={e => setStatementData({ ...statementData, categoria: e.target.value })}
                >
                  {STATEMENT_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginTop: '14px' }}>
              <div>
                <label className="admin-label">Concepto o Versículo Bíblico Base *</label>
                <input
                  type="text"
                  className="admin-input"
                  value={statementData.versiculo}
                  onChange={e => setStatementData({ ...statementData, versiculo: e.target.value })}
                  placeholder="Ej. Romanos 12:2 — No os conforméis a este siglo..."
                />
              </div>
              <div>
                <label className="admin-label">Autor y Fecha</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={statementData.autor}
                    onChange={e => setStatementData({ ...statementData, autor: e.target.value })}
                    placeholder="Familia Weyenberg"
                  />
                  <input
                    type="date"
                    className="admin-input"
                    style={{ width: '155px' }}
                    value={statementData.fecha}
                    onChange={e => setStatementData({ ...statementData, fecha: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Enlace al Post Original en Facebook (Opcional)</label>
              <input
                type="url"
                className="admin-input"
                value={statementData.facebookUrl}
                onChange={e => setStatementData({ ...statementData, facebookUrl: e.target.value })}
                placeholder="https://www.facebook.com/..."
              />
            </div>

            {/* Cover & Gallery Uploads */}
            <div className="admin-grid-2" style={{ marginTop: '16px' }}>
              <div className="admin-subcard" style={{ marginBottom: 0 }}>
                <label className="admin-label">Imagen Principal de Portada</label>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-input"
                  style={{ marginBottom: '8px' }}
                  onChange={e => handleSingleImageUpload(e, res => setStatementData(prev => ({ ...prev, imagen: res })))}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="O pega URL de imagen..."
                  value={statementData.imagen && !statementData.imagen.startsWith('data:') ? statementData.imagen : ''}
                  onChange={e => setStatementData({ ...statementData, imagen: e.target.value })}
                />
                {statementData.imagen && (
                  <img
                    src={statementData.imagen}
                    alt="Portada"
                    style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                  />
                )}
              </div>

              <div className="admin-subcard" style={{ marginBottom: 0 }}>
                <label className="admin-label">Galería de Fotos Adicionales (Múltiples)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="admin-input"
                  onChange={e =>
                    handleMultipleImagesUpload(e, res =>
                      setStatementData(prev => ({ ...prev, imagenes: [...(prev.imagenes || []), res] }))
                    )
                  }
                />
                {statementData.imagenes?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {statementData.imagenes.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: '68px', height: '68px' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        <button
                          type="button"
                          onClick={() =>
                            setStatementData(prev => ({
                              ...prev,
                              imagenes: prev.imagenes.filter((_, idx) => idx !== i),
                            }))
                          }
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Resumen Corto (Opcional)</label>
              <input
                type="text"
                className="admin-input"
                value={statementData.resumen}
                onChange={e => setStatementData({ ...statementData, resumen: e.target.value })}
                placeholder="Breve síntesis del fenómeno analizado..."
              />
            </div>

            <div style={{ marginTop: '14px', marginBottom: '20px' }}>
              <label className="admin-label">Contenido Completo del Statement (Puedes copiar y pegar de Facebook) *</label>
              <textarea
                required
                className="admin-textarea"
                style={{ minHeight: '200px' }}
                value={statementData.contenidoRaw}
                onChange={e => setStatementData({ ...statementData, contenidoRaw: e.target.value })}
                placeholder="Escribe o pega aquí el pronunciamiento completo..."
              />
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingStatement(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                Guardar Statement
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 4: BLOG DE BERTA (REFLEXIONES ESCRITAS + IMÁGENES)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'noticias' && !editingNoticia && (
          <div>
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-title">Blog de Berta · Reflexiones ({noticias.length})</h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
                  Publica reflexiones escritas, enseñanzas y galerías de imágenes en tu Blog personal.
                </p>
              </div>
              <button
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '0 18px', height: '42px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => {
                  setNoticiaData({
                    id: '',
                    tipo: 'blog',
                    titulo: '',
                    fraseDestacada: '',
                    excerpt: '',
                    contenidoRaw: '',
                    imagen: '/berta.jpeg',
                    galeria: [],
                    categoria: 'Fe & Esperanza',
                    autor: 'Berta Weyenberg',
                    fecha: new Date().toISOString().split('T')[0],
                    lectura: 4,
                  });
                  setEditingNoticia('new');
                }}
              >
                <Plus size={18} /> Nueva Reflexión del Blog
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {noticias.map(n => (
                <div key={n.id} className="admin-item-card">
                  <img src={n.imagen || '/berta.jpeg'} className="admin-item-img" alt={n.titulo} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{n.titulo}</h4>
                    <span className="admin-item-subtitle">
                      {n.autor} • {n.fecha} • {n.categoria}
                      {n.galeria?.length > 0 ? ` • 📸 ${n.galeria.length + 1} fotos` : ''}
                    </span>
                    <span className="admin-badge-success" style={{ background: '#FCE7F3', color: '#DB2777' }}>
                      Blog de Berta
                    </span>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => {
                        setNoticiaData({
                          id: n.id,
                          tipo: 'blog',
                          titulo: n.titulo || '',
                          fraseDestacada: n.fraseDestacada || '',
                          excerpt: n.excerpt || '',
                          contenidoRaw: htmlToPlainText(n.contenido || ''),
                          imagen: n.imagen || '/berta.jpeg',
                          galeria: n.galeria || [],
                          categoria: n.categoria || 'Fe & Esperanza',
                          autor: n.autor || 'Berta Weyenberg',
                          fecha: n.fecha || new Date().toISOString().split('T')[0],
                          lectura: n.lectura || 4,
                        });
                        setEditingNoticia(n.id);
                      }}
                    >
                      <Edit2 size={18} color="#4B5563" />
                    </button>
                    <button
                      className="admin-action-btn error"
                      onClick={() => {
                        if (window.confirm('¿Borrar esta reflexión del Blog?')) {
                          onDeleteNoticia(n.id);
                          triggerAdminToast('Reflexión eliminada', 'error');
                        }
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'noticias' && editingNoticia && (
          <form className="admin-form-card" onSubmit={handleSaveBlog}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
              {editingNoticia === 'new' ? 'Nueva Reflexión para el Blog de Berta' : 'Editar Reflexión del Blog'}
            </h3>

            <div className="admin-grid-2">
              <div>
                <label className="admin-label">Título de la Reflexión *</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={noticiaData.titulo}
                  onChange={e => setNoticiaData({ ...noticiaData, titulo: e.target.value })}
                  placeholder="Ej. El poder de la fe en tiempos de incertidumbre"
                />
              </div>
              <div>
                <label className="admin-label">Categoría</label>
                <select
                  className="admin-input"
                  value={noticiaData.categoria}
                  onChange={e => setNoticiaData({ ...noticiaData, categoria: e.target.value })}
                >
                  {BLOG_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginTop: '14px' }}>
              <div>
                <label className="admin-label">Frase Destacada (Opcional)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={noticiaData.fraseDestacada}
                  onChange={e => setNoticiaData({ ...noticiaData, fraseDestacada: e.target.value })}
                  placeholder="Cita o pensamiento clave para resaltar..."
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label className="admin-label">Fecha</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={noticiaData.fecha}
                    onChange={e => setNoticiaData({ ...noticiaData, fecha: e.target.value })}
                  />
                </div>
                <div style={{ width: '110px' }}>
                  <label className="admin-label">Lectura (min)</label>
                  <input
                    type="number"
                    min="1"
                    className="admin-input"
                    value={noticiaData.lectura}
                    onChange={e => setNoticiaData({ ...noticiaData, lectura: parseInt(e.target.value) || 3 })}
                  />
                </div>
              </div>
            </div>

            {/* Cover & Gallery Uploads */}
            <div className="admin-grid-2" style={{ marginTop: '16px' }}>
              <div className="admin-subcard" style={{ marginBottom: 0 }}>
                <label className="admin-label">Imagen Principal de Portada</label>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-input"
                  style={{ marginBottom: '8px' }}
                  onChange={e => handleSingleImageUpload(e, res => setNoticiaData(prev => ({ ...prev, imagen: res })))}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="O pega URL de imagen..."
                  value={noticiaData.imagen && !noticiaData.imagen.startsWith('data:') ? noticiaData.imagen : ''}
                  onChange={e => setNoticiaData({ ...noticiaData, imagen: e.target.value })}
                />
                {noticiaData.imagen && (
                  <img
                    src={noticiaData.imagen}
                    alt="Portada"
                    style={{ width: '140px', height: '90px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }}
                  />
                )}
              </div>

              <div className="admin-subcard" style={{ marginBottom: 0 }}>
                <label className="admin-label">Galería de Imágenes Adicionales (Múltiples)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="admin-input"
                  onChange={e =>
                    handleMultipleImagesUpload(e, res =>
                      setNoticiaData(prev => ({ ...prev, galeria: [...(prev.galeria || []), res] }))
                    )
                  }
                />
                {noticiaData.galeria?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {noticiaData.galeria.map((img, i) => (
                      <div key={i} style={{ position: 'relative', width: '68px', height: '68px' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        <button
                          type="button"
                          onClick={() =>
                            setNoticiaData(prev => ({
                              ...prev,
                              galeria: prev.galeria.filter((_, idx) => idx !== i),
                            }))
                          }
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            background: 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            cursor: 'pointer',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Resumen Corto (Opcional)</label>
              <textarea
                className="admin-textarea"
                style={{ minHeight: '60px' }}
                value={noticiaData.excerpt}
                onChange={e => setNoticiaData({ ...noticiaData, excerpt: e.target.value })}
                placeholder="Resumen corto para la tarjeta del blog..."
              />
            </div>

            <div style={{ marginTop: '14px', marginBottom: '20px' }}>
              <label className="admin-label">Texto Completo de la Reflexión *</label>
              <textarea
                required
                className="admin-textarea"
                style={{ minHeight: '220px' }}
                value={noticiaData.contenidoRaw}
                onChange={e => setNoticiaData({ ...noticiaData, contenidoRaw: e.target.value })}
                placeholder="Escribe aquí tu reflexión completa..."
              />
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingNoticia(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                Publicar en el Blog
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 5: EPISODES (ConBERTAciones ENTREVISTAS)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'episodios' && !editingEp && (
          <div>
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-title">ConBERTAciones · Entrevistas ({episodes.length})</h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
                  Sincroniza automáticamente con Spotify for Creators o agrega entrevistas manualmente.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {onSyncSpotify && (
                  <button
                    type="button"
                    onClick={onSyncSpotify}
                    disabled={isSyncingSpotify}
                    className="admin-btn-primary"
                    style={{ width: 'auto', padding: '0 14px', height: '40px', background: '#1DB954', display: 'flex', gap: '6px', alignItems: 'center' }}
                  >
                    <UploadCloud size={16} /> {isSyncingSpotify ? 'Sincronizando...' : 'Sincronizar Spotify'}
                  </button>
                )}
                <button
                  className="admin-btn-primary"
                  style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }}
                  onClick={() => {
                    setFormData({
                      id: '',
                      title: '',
                      host: 'Berta Weyenberg',
                      duration: '30:00',
                      color: 'purple',
                      art: '/cover_art_games.png',
                      audioUrl: '',
                      spotifyUrl: '',
                      audioFile: null,
                      audioFileName: '',
                      description: '',
                      releaseDate: new Date().toISOString().split('T')[0],
                    });
                    setEditingEp('new');
                  }}
                >
                  <Plus size={18} /> Nueva Entrevista
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {episodes.map(ep => (
                <div key={ep.id} className="admin-item-card">
                  <img src={ep.art || '/cover_art_games.png'} className="admin-item-img" alt={ep.title} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{ep.title}</h4>
                    <span className="admin-item-subtitle">{ep.host} • {ep.duration} {ep.releaseDate ? `• ${ep.releaseDate}` : ''}</span>
                    <span className="admin-badge-success">Publicado</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-action-btn" onClick={() => { setFormData(ep); setEditingEp(ep.id); }}>
                      <Edit2 size={18} color="#4B5563" />
                    </button>
                    <button
                      className="admin-action-btn error"
                      onClick={() => {
                        if (window.confirm('¿Borrar episodio?')) {
                          onDelete(ep.id);
                          triggerAdminToast('Episodio eliminado', 'error');
                        }
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'episodios' && editingEp && (
          <form className="admin-form-card" onSubmit={handleSaveEp}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              {editingEp === 'new' ? 'Nueva Entrevista de ConBERTAciones' : 'Editar Entrevista'}
            </h3>

            <div className="admin-grid-2">
              <div>
                <label className="admin-label">Título del Episodio *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Invitado(a) / Host *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={formData.host}
                  onChange={e => setFormData({ ...formData, host: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-grid-2" style={{ marginTop: '14px' }}>
              <div>
                <label className="admin-label">Duración (ej. 32:15)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.duration || ''}
                  onChange={e => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Enlace en Spotify (Opcional)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.spotifyUrl || ''}
                  onChange={e => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/episode/..."
                />
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Portada del Episodio</label>
              <input
                type="file"
                accept="image/*"
                className="admin-input"
                style={{ marginBottom: '8px' }}
                onChange={e => handleSingleImageUpload(e, res => setFormData({ ...formData, art: res }))}
              />
              <input
                type="text"
                className="admin-input"
                value={formData.art || ''}
                onChange={e => setFormData({ ...formData, art: e.target.value })}
                placeholder="O pega enlace URL de imagen"
              />
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Enlace de Audio Directo (MP3 / Streaming)</label>
              <input
                type="text"
                className="admin-input"
                value={formData.audioUrl || ''}
                onChange={e => setFormData({ ...formData, audioUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div style={{ marginTop: '14px', marginBottom: '20px' }}>
              <label className="admin-label">Descripción de la Entrevista</label>
              <textarea
                className="admin-textarea"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingEp(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                Guardar Entrevista
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 6: UNDER THE UMBRELLA (LISTA COMPLETA DE REFLEXIONES BILINGÜES)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'reflexiones' && !editingReflection && (
          <div>
            <div className="admin-section-header">
              <div>
                <h2 className="admin-section-title">Under the Umbrella · Reflexiones Bilingües ({reflections.length})</h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '2px 0 0 0' }}>
                  Administra todas las cápsulas y reflexiones bilingües (Español / Inglés).
                </p>
              </div>
              <button
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => {
                  setReflectionForm({
                    id: '',
                    titleEs: '',
                    titleEn: '',
                    contentEsRaw: '',
                    contentEnRaw: '',
                    audioEs: '',
                    audioEn: '',
                    durationEs: '3:00',
                    durationEn: '3:00',
                    spotifyUrlEs: '',
                    spotifyUrlEn: '',
                    videoEs: '',
                    videoEn: '',
                    thumbnail: '/cover_art_games.png',
                    releaseDate: new Date().toISOString().split('T')[0],
                  });
                  setEditingReflection('new');
                }}
              >
                <Plus size={18} /> Nueva Reflexión (ES/EN)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reflections.map(ref => (
                <div key={ref.id} className="admin-item-card">
                  <img src={ref.thumbnail || '/cover_art_games.png'} className="admin-item-img" alt={ref.titleEs || ref.titleEn} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">🇪🇸 {ref.titleEs || 'Sin título ES'}</h4>
                    <span className="admin-item-subtitle">🇺🇸 {ref.titleEn || 'No EN title'} • {ref.releaseDate || ''}</span>
                    <span className="admin-badge-success">ES / EN Bilingüe</span>
                  </div>
                  <div className="admin-item-actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => {
                        setReflectionForm({
                          id: ref.id,
                          titleEs: ref.titleEs || '',
                          titleEn: ref.titleEn || '',
                          contentEsRaw: ref.rawEs || htmlToPlainText(ref.contentEs || ''),
                          contentEnRaw: ref.rawEn || htmlToPlainText(ref.contentEn || ''),
                          audioEs: ref.audioEs || '',
                          audioEn: ref.audioEn || '',
                          durationEs: ref.durationEs || '3:00',
                          durationEn: ref.durationEn || '3:00',
                          spotifyUrlEs: ref.spotifyUrlEs || '',
                          spotifyUrlEn: ref.spotifyUrlEn || '',
                          videoEs: ref.videoEs || '',
                          videoEn: ref.videoEn || '',
                          thumbnail: ref.thumbnail || '/cover_art_games.png',
                          releaseDate: ref.releaseDate || new Date().toISOString().split('T')[0],
                        });
                        setEditingReflection(ref.id);
                      }}
                    >
                      <Edit2 size={18} color="#4B5563" />
                    </button>
                    <button
                      className="admin-action-btn error"
                      onClick={() => handleDeleteReflectionItem(ref.id)}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'reflexiones' && editingReflection && (
          <form className="admin-form-card" onSubmit={handleSaveReflectionItem}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '18px' }}>
              {editingReflection === 'new' ? 'Nueva Reflexión Under the Umbrella (ES/EN)' : 'Editar Reflexión Bilingüe'}
            </h3>

            <div className="admin-grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <label className="admin-label">Fecha de Publicación</label>
                <input
                  type="date"
                  className="admin-input"
                  value={reflectionForm.releaseDate}
                  onChange={e => setReflectionForm({ ...reflectionForm, releaseDate: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Miniatura / Portada</label>
                <input
                  type="file"
                  accept="image/*"
                  className="admin-input"
                  onChange={e => handleSingleImageUpload(e, res => setReflectionForm({ ...reflectionForm, thumbnail: res }))}
                />
              </div>
            </div>

            <div className="admin-subcard">
              <h4 className="admin-subtitle">🇪🇸 Versión en Español (Bajo la Sombrilla)</h4>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Título en Español</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reflectionForm.titleEs}
                    onChange={e => setReflectionForm({ ...reflectionForm, titleEs: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Enlace Audio / Spotify (ES)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reflectionForm.audioEs}
                    onChange={e => setReflectionForm({ ...reflectionForm, audioEs: e.target.value })}
                    placeholder="URL de audio MP3 o preview..."
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label className="admin-label">Texto / Reflexión en Español</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={reflectionForm.contentEsRaw}
                  onChange={e => setReflectionForm({ ...reflectionForm, contentEsRaw: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-subcard">
              <h4 className="admin-subtitle">🇺🇸 Versión en Inglés (Under the Umbrella)</h4>
              <div className="admin-grid-2">
                <div>
                  <label className="admin-label">Title in English</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reflectionForm.titleEn}
                    onChange={e => setReflectionForm({ ...reflectionForm, titleEn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Audio / Spotify URL (EN)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={reflectionForm.audioEn}
                    onChange={e => setReflectionForm({ ...reflectionForm, audioEn: e.target.value })}
                    placeholder="MP3 or preview URL..."
                  />
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label className="admin-label">Reflection Text in English</label>
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={reflectionForm.contentEnRaw}
                  onChange={e => setReflectionForm({ ...reflectionForm, contentEnRaw: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingReflection(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                Guardar Reflexión
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 7: INVITADOS DEL PODCAST
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'negocios' && !editingGuest && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">Invitados del Podcast ({guests.length})</h2>
              <button
                className="admin-btn-primary"
                style={{ width: 'auto', padding: '0 16px', height: '40px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => {
                  setGuestData({
                    id: '',
                    name: '',
                    business: '',
                    businessEn: '',
                    bio: '',
                    bioEn: '',
                    bgPhoto: '',
                    facebook: '',
                    instagram: '',
                    linkedin: '',
                    youtube: '',
                    website: '',
                  });
                  setEditingGuest('new');
                }}
              >
                <Plus size={18} /> Nuevo Invitado
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guests.map(g => (
                <div key={g.id} className="admin-item-card">
                  <img src={g.bgPhoto || '/berta.jpeg'} className="admin-item-img" style={{ borderRadius: '50%' }} alt={g.name} />
                  <div className="admin-item-info">
                    <h4 className="admin-item-title">{g.name}</h4>
                    <span className="admin-item-subtitle">{g.business || 'Invitado Especial'}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="admin-action-btn" onClick={() => { setGuestData(g); setEditingGuest(g.id); }}>
                      <Edit2 size={18} color="#4B5563" />
                    </button>
                    <button
                      className="admin-action-btn error"
                      onClick={() => {
                        if (window.confirm('¿Borrar invitado?')) {
                          onDeleteGuest(g.id);
                          triggerAdminToast('Invitado eliminado', 'error');
                        }
                      }}
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'negocios' && editingGuest && (
          <form className="admin-form-card" onSubmit={handleSaveGuest}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
              {editingGuest === 'new' ? 'Nuevo Invitado del Podcast' : 'Editar Invitado'}
            </h3>
            <div className="admin-grid-2">
              <div>
                <label className="admin-label">Nombre Completo *</label>
                <input
                  type="text"
                  className="admin-input"
                  required
                  value={guestData.name}
                  onChange={e => setGuestData({ ...guestData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Organización / Cargo (ES)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={guestData.business || ''}
                  onChange={e => setGuestData({ ...guestData, business: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Fotografía del Invitado</label>
              <input
                type="file"
                accept="image/*"
                className="admin-input"
                onChange={e => handleSingleImageUpload(e, res => setGuestData({ ...guestData, bgPhoto: res }))}
              />
            </div>

            <div style={{ marginTop: '14px' }}>
              <label className="admin-label">Biografía / Resumen de la Entrevista</label>
              <textarea
                className="admin-textarea"
                style={{ minHeight: '80px' }}
                value={guestData.bio || ''}
                onChange={e => setGuestData({ ...guestData, bio: e.target.value })}
              />
            </div>

            <div className="admin-grid-2" style={{ marginTop: '14px', marginBottom: '20px' }}>
              <input
                type="text"
                className="admin-input"
                placeholder="Instagram URL"
                value={guestData.instagram || ''}
                onChange={e => setGuestData({ ...guestData, instagram: e.target.value })}
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Sitio Web / Facebook URL"
                value={guestData.website || ''}
                onChange={e => setGuestData({ ...guestData, website: e.target.value })}
              />
            </div>

            <div className="admin-sticky-bottom">
              <button type="button" className="admin-btn-secondary" onClick={() => setEditingGuest(null)}>
                Cancelar
              </button>
              <button type="submit" className="admin-btn-primary" style={{ width: 'auto', padding: '0 24px' }}>
                Guardar Invitado
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 8: SOLICITUDES DE CHARLAS & DAME LA LETRA (COMUNIDAD)
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'comunidad' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="admin-form-card">
              <h2 className="admin-section-title" style={{ marginBottom: '12px' }}>
                🎤 Solicitudes para Agendar Charlas ({speakerBookings.length})
              </h2>
              {speakerBookings.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  Aún no hay solicitudes registradas desde el formulario de Charlas.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {speakerBookings.map(b => (
                    <div key={b.id} className="admin-subcard" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <strong>{b.name} ({b.organization || 'Particular'})</strong>
                        <span className="admin-badge-success">{b.type}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#4B5563', marginTop: '4px' }}>
                        📧 {b.email} • 📅 Fecha tentativa: {b.date || 'Por definir'}
                      </div>
                      {b.message && (
                        <p style={{ fontSize: '13px', color: '#1F2937', marginTop: '8px', marginBottom: 0 }}>
                          "{b.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-form-card">
              <h2 className="admin-section-title" style={{ marginBottom: '12px' }}>
                💬 Mensajes de "Dame La Letra" ({dameSubmissions.length})
              </h2>
              {dameSubmissions.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6B7280' }}>
                  Aún no hay preguntas ni historias enviadas en Dame La Letra.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dameSubmissions.map(sub => (
                    <div key={sub.id} className="admin-subcard" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{sub.name}</strong>
                        <span style={{ fontSize: '12px', color: '#6B7280' }}>{sub.type} • {sub.date}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#1F2937', margin: '6px 0 0 0' }}>{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 9: PERFIL & REDES SOCIALES
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'perfil' && (
          <form className="admin-form-card" onSubmit={handleSaveHomeAndProfile}>
            <h2 className="admin-section-title">Perfil Público & Redes Sociales</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
              Actualiza tus enlaces de redes sociales y las estadísticas que se muestran en tu tarjeta de perfil.
            </p>

            <div className="admin-subcard">
              <h3 className="admin-subtitle">Estadísticas del Perfil</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="admin-label">Episodios</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.statsEpisodes || '50+'}
                    onChange={e => setLocalProfile({ ...localProfile, statsEpisodes: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Comunidad</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.statsCommunity || '12k'}
                    onChange={e => setLocalProfile({ ...localProfile, statsCommunity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="admin-label">Temporadas</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile.statsSeasons || '5'}
                    onChange={e => setLocalProfile({ ...localProfile, statsSeasons: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="admin-subcard">
              <h3 className="admin-subtitle">Enlaces a Redes Sociales</h3>
              {['facebook', 'instagram', 'youtube', 'linkedin', 'website'].map(net => (
                <div key={net} style={{ marginBottom: '14px' }}>
                  <label className="admin-label" style={{ textTransform: 'capitalize' }}>{net}</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={localProfile[net] || ''}
                    onChange={e => setLocalProfile({ ...localProfile, [net]: e.target.value })}
                    placeholder={`https://${net}.com/...`}
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="admin-btn-primary">
              Guardar Perfil y Redes
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            VIEW 10: BACKUP / RESPALDOS
           ══════════════════════════════════════════════════════════════════ */}
        {activeMenu === 'backup' && (
          <div className="admin-form-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#F3E8FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Download size={32} color="#792359" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>
              Copia de Seguridad Completa
            </h2>
            <p style={{ fontSize: '14px', color: '#4B5563', maxWidth: '520px', margin: '0 auto 28px auto' }}>
              Exporta o restaura toda la información del sitio: configuración de Inicio, The Weyenberg Statement, Blog de Berta, Entrevistas, Reflexiones e Invitados.
            </p>

            <button
              className="admin-btn-primary"
              onClick={executeBackup}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}
            >
              <Download size={20} /> Exportar Todos Mis Datos (JSON)
            </button>
            <label
              className="admin-btn-secondary"
              style={{ width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Upload size={20} /> Importar Respaldo (JSON)
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = async evt => {
                      try {
                        const imported = JSON.parse(evt.target.result);
                        await onImportBackup(imported);
                        triggerAdminToast('Datos restaurados con éxito', 'success');
                      } catch {
                        triggerAdminToast('Archivo de respaldo inválido', 'error');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>
        )}
      </main>

      {adminToast && <Toast message={adminToast.message} type={adminToast.type} />}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`admin-sidebar-item ${active ? 'active' : ''}`}>
    {icon} <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, icon, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: '#FFFFFF',
      padding: '18px',
      borderRadius: '14px',
      boxShadow: '0 2px 8px rgba(121, 35, 89, 0.06)',
      border: '1px solid #F3E8FF',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <div style={{ padding: '12px', background: '#FDF4FF', borderRadius: '12px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: 800, color: '#111827', lineHeight: '1.1' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px', fontWeight: 600 }}>{title}</div>
    </div>
  </div>
);

const Toast = ({ message, type }) => {
  const bg = type === 'success' ? '#10B981' : type === 'warning' ? '#F59E0B' : '#EF4444';
  const Icon = type === 'success' ? CheckCircle : type === 'warning' ? AlertTriangle : XCircle;
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        background: bg,
        color: '#FFFFFF',
        padding: '12px 18px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontWeight: 600,
        fontSize: '14px',
      }}
    >
      <Icon size={20} color="#FFFFFF" />
      <span>{message}</span>
    </div>
  );
};

const AdminStyles = () => (
  <style>{`
    .admin-app-layout, .admin-login-layout {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #FAF5FF;
      color: #1F2937;
      min-height: 100vh;
      width: 100%;
      position: absolute;
      top: 0; left: 0; z-index: 1000;
    }
    .admin-login-layout {
      display: flex; align-items: center; justify-content: center; padding: 16px;
      background: linear-gradient(135deg, #792359 0%, #3b0764 100%);
    }
    .admin-login-card {
      background: #FFFFFF; width: 100%; max-width: 430px; padding: 32px 26px;
      border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    .admin-header {
      height: 60px; background: #FFFFFF; border-bottom: 1px solid #F3E8FF;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; position: sticky; top: 0; z-index: 40;
    }
    .admin-header-title { font-size: 17px; font-weight: 800; color: #792359; }
    .admin-icon-btn { background: none; border: none; padding: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    
    .admin-sidebar-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 45;
      opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
    }
    .admin-sidebar-overlay.open { opacity: 1; pointer-events: auto; }
    .admin-sidebar {
      position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: #FFFFFF;
      z-index: 50; transform: translateX(-100%); transition: transform 0.25s ease;
      box-shadow: 4px 0 24px rgba(0,0,0,0.12);
    }
    .admin-sidebar.open { transform: translateX(0); }
    .admin-sidebar-item {
      display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 14px;
      border: none; background: none; border-radius: 10px; font-size: 14px; font-weight: 600;
      color: #4B5563; cursor: pointer; text-align: left; transition: all 0.15s;
    }
    .admin-sidebar-item:hover { background: #FDF4FF; color: #792359; }
    .admin-sidebar-item.active { background: linear-gradient(135deg, #792359, #c026d3); color: #FFFFFF; }

    .admin-main { padding: 20px 16px 80px 16px; max-width: 960px; margin: 0 auto; }
    .admin-section-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
    .admin-section-title { font-size: 20px; font-weight: 800; color: #111827; margin: 0; }
    
    .admin-form-card { background: #FFFFFF; padding: 24px; border-radius: 16px; box-shadow: 0 4px 16px rgba(121, 35, 89, 0.06); border: 1px solid #F3E8FF; }
    .admin-subcard { background: #FDFBFF; border: 1px solid #F3E8FF; border-radius: 12px; padding: 18px; margin-bottom: 18px; }
    .admin-subtitle { font-size: 15px; font-weight: 700; color: #792359; margin: 0 0 14px 0; }
    .admin-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }

    .admin-label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 6px; }
    .admin-input {
      width: 100%; height: 42px; padding: 0 12px; border: 1px solid #D1D5DB;
      border-radius: 8px; font-size: 14px; color: #1F2937; background: #FFFFFF;
      box-sizing: border-box;
    }
    .admin-input:focus, .admin-textarea:focus { outline: none; border-color: #792359; box-shadow: 0 0 0 3px rgba(121, 35, 89, 0.12); }
    .admin-textarea {
      width: 100%; min-height: 96px; padding: 10px 12px; border: 1px solid #D1D5DB;
      border-radius: 8px; font-size: 14px; color: #1F2937; font-family: inherit; resize: vertical;
      box-sizing: border-box; line-height: 1.5;
    }

    .admin-btn-primary {
      width: 100%; height: 44px; background: linear-gradient(135deg, #792359, #c026d3); color: #FFFFFF;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
    }
    .admin-btn-secondary {
      height: 44px; padding: 0 16px; background: #FFFFFF; color: #374151;
      border: 1px solid #D1D5DB; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer;
    }

    .admin-item-card {
      background: #FFFFFF; padding: 14px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);
      border: 1px solid #F3E8FF; display: flex; align-items: center; gap: 14px;
    }
    .admin-item-img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
    .admin-item-info { flex: 1; min-width: 0; }
    .admin-item-title { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .admin-item-subtitle { display: block; font-size: 13px; color: #6B7280; margin-bottom: 4px; }
    .admin-badge-success { display: inline-block; background: #F3E8FF; color: #792359; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
    .admin-item-actions { display: flex; gap: 6px; }
    .admin-action-btn { width: 36px; height: 36px; border: 1px solid #F3E8FF; background: #FDFBFF; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

    .admin-sticky-bottom {
      margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB;
      display: flex; justify-content: flex-end; gap: 12px;
    }
  `}</style>
);

export default AdminView;
