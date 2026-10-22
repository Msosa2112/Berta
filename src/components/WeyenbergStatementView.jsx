import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Scale,
  Search,
  Calendar,
  Share2,
  Plus,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  Image as ImageIcon,
  ExternalLink,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { InteractiveHoverButton } from './InteractiveHoverButton';
import { useLanguage, useAutoTranslated } from '../utils/i18n.jsx';

const CATEGORIES = [
  'Todos',
  'Actualidad & Fe',
  'Familia & Sociedad',
  'Cultura & Verdad Bíblica',
  'Educación & Valores',
];

const CATEGORY_EN = {
  'Todos': 'All',
  'Actualidad & Fe': 'Current Events & Faith',
  'Familia & Sociedad': 'Family & Society',
  'Cultura & Verdad Bíblica': 'Culture & Biblical Truth',
  'Educación & Valores': 'Education & Values',
};

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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

const StatementCard = ({ st, onSelect, lang, tr }) => {
  const title = useAutoTranslated(st.titulo, st.tituloEn, lang);
  const verse = useAutoTranslated(st.versiculo, st.versiculoEn, lang);
  const summaryRaw = st.resumen || stripHtml(st.contenido).substring(0, 140) + '...';
  const summary = useAutoTranslated(summaryRaw, st.resumenEn, lang);
  const catLabel = lang === 'en' ? (CATEGORY_EN[st.categoria] || st.categoria) : st.categoria;

  return (
    <div
      onClick={() => onSelect(st)}
      className="glass-card glass-card-interactive blog-card"
      style={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid var(--glass-border)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/10',
          overflow: 'hidden',
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        }}
      >
        <img
          src={st.imagen || '/cover_art_faith.png'}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          className="blog-card-img"
        />
        <span
          className="news-card-badge"
          style={{
            background: 'rgba(121, 35, 89, 0.88)',
            color: '#fff',
            top: '12px',
            left: '12px',
          }}
        >
          {catLabel}
        </span>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {verse && (
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-purple)',
                background: 'rgba(121, 35, 89, 0.08)',
                padding: '4px 10px',
                borderRadius: '6px',
                marginBottom: '10px',
                display: 'inline-block',
              }}
            >
              📖 {verse}
            </div>
          )}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.35 }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '16px' }}>
            {summary}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '12px',
            marginTop: '8px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {st.autor || tr('Familia Weyenberg', 'Weyenberg Family')}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={11} /> {st.fecha}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {st.facebookUrl && (
              <a
                href={st.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="biz-btn-icon"
                style={{ color: '#1877F2', width: '32px', height: '32px' }}
                title={tr('Ver en Facebook', 'View on Facebook')}
              >
                <FacebookIcon size={14} />
              </a>
            )}
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
              {tr('Leer →', 'Read →')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatementReaderModal = ({ activeStatement, onClose, onShare, lang, tr }) => {
  const title = useAutoTranslated(activeStatement.titulo, activeStatement.tituloEn, lang);
  const verse = useAutoTranslated(activeStatement.versiculo, activeStatement.versiculoEn, lang);
  const bodyHtml = useAutoTranslated(activeStatement.contenido, activeStatement.contenidoEn, lang);
  const catLabel = lang === 'en' ? (CATEGORY_EN[activeStatement.categoria] || activeStatement.categoria) : activeStatement.categoria;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--glass-bg-dense)',
        backdropFilter: 'blur(30px)',
        zIndex: 120,
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
      className="reveal"
    >
      <div className="editorial-post" style={{ width: '100%', maxWidth: '800px', padding: '32px 20px 120px 20px' }}>
        {/* Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <InteractiveHoverButton onClick={onClose}>
            {tr('Volver a The Weyenberg Statement', 'Back to The Weyenberg Statement')}
          </InteractiveHoverButton>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {activeStatement.facebookUrl && (
              <a
                href={activeStatement.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#1877F2',
                  textDecoration: 'none',
                }}
              >
                <FacebookIcon size={14} /> {tr('Ver en Facebook', 'View on Facebook')}
              </a>
            )}
            <button
              onClick={() => onShare(activeStatement)}
              className="btn-secondary"
              style={{
                padding: '8px 14px',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} /> {tr('Compartir', 'Share')}
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="editorial-header">
          <span className="editorial-tag">The Weyenberg Statement · {catLabel}</span>
          <h1 className="editorial-title">{title}</h1>
          <div className="editorial-meta" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <img src="/berta.jpeg" alt="Familia Weyenberg" className="editorial-meta-img" />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {activeStatement.autor || tr('Familia Weyenberg', 'Weyenberg Family')}
            </span>
            <span>·</span>
            <span>{activeStatement.fecha}</span>
          </div>
        </header>

        {/* Biblical Foundation Highlight Box */}
        {verse && (
          <div
            className="glass-card glow-amber"
            style={{
              padding: '18px 22px',
              marginBottom: '24px',
              borderLeft: '4px solid var(--accent-purple)',
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-purple)', marginBottom: '4px' }}>
              📖 {tr('Fundamento y Lente Bíblico', 'Biblical Foundation & Lens')}
            </div>
            <div style={{ fontSize: '0.98rem', fontStyle: 'italic', fontWeight: 600, color: 'var(--text-primary)' }}>
              "{verse}"
            </div>
          </div>
        )}

        {/* Main Cover Image */}
        {activeStatement.imagen && (
          <img
            src={activeStatement.imagen}
            alt={title}
            style={{
              width: '100%',
              maxHeight: '440px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              marginBottom: '28px',
              border: '1px solid var(--glass-border)',
            }}
          />
        )}

        {/* Statement Body */}
        <article className="glass-card editorial-body" style={{ padding: '32px', marginBottom: '28px' }}>
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </article>

        {/* Additional Gallery Images if any */}
        {activeStatement.imagenes && activeStatement.imagenes.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px' }}>
              {tr('Galería de la Publicación', 'Publication Photo Gallery')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {activeStatement.imagenes.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`${title} - ${i + 1}`}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--glass-border)',
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const WeyenbergStatementView = ({
  statements = [],
  onAddStatement,
  onUpdateStatement,
  onDeleteStatement,
  triggerToast,
}) => {
  const { lang, tr } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatement, setActiveStatement] = useState(null);

  // Mini Admin Panel States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(() => {
    try {
      return sessionStorage.getItem('weyenberg_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    try {
      setIsAdminLogged(sessionStorage.getItem('weyenberg_admin_auth') === 'true');
    } catch {}
  }, [isAdminOpen]);

  const emptyForm = {
    id: '',
    titulo: '',
    categoria: 'Actualidad & Fe',
    versiculo: '',
    autor: 'Familia Weyenberg',
    fecha: new Date().toISOString().split('T')[0],
    resumen: '',
    contenidoRaw: '',
    imagen: '',
    imagenes: [],
    facebookUrl: '',
  };

  const [editingId, setEditingId] = useState(null); // null | 'new' | statement.id
  const [form, setForm] = useState(emptyForm);

  // Filter statements
  const filteredStatements = statements.filter(st => {
    if (selectedCategory !== 'Todos' && st.categoria !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (st.titulo || '').toLowerCase().includes(q);
      const matchVerse = (st.versiculo || '').toLowerCase().includes(q);
      const matchBody = stripHtml(st.contenido || st.resumen || '').toLowerCase().includes(q);
      return matchTitle || matchVerse || matchBody;
    }
    return true;
  });

  const featuredStatement = filteredStatements[0];

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const u = loginUser.trim().toLowerCase();
    const p = loginPass.trim();
    if (
      (u === 'weyenberg' && p === 'statement2026') ||
      (u === 'berta' && (p === 'statement2026' || p === 'berta')) ||
      (u === 'admin' && (p === 'statement2026' || p === 'berta'))
    ) {
      setIsAdminLogged(true);
      try {
        sessionStorage.setItem('weyenberg_admin_auth', 'true');
      } catch {}
      if (triggerToast) triggerToast('Bienvenida al Panel de The Weyenberg Statement');
    } else {
      if (triggerToast) triggerToast('Usuario o contraseña incorrectos');
    }
  };

  // Cover Image Upload
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Additional Gallery Images Upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          imagenes: [...(prev.imagenes || []), reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (idx) => {
    setForm(prev => ({
      ...prev,
      imagenes: (prev.imagenes || []).filter((_, i) => i !== idx),
    }));
  };

  const startCreate = () => {
    setForm({
      ...emptyForm,
      fecha: new Date().toISOString().split('T')[0],
    });
    setEditingId('new');
  };

  const startEdit = (st) => {
    setForm({
      id: st.id,
      titulo: st.titulo || '',
      categoria: st.categoria || 'Actualidad & Fe',
      versiculo: st.versiculo || '',
      autor: st.autor || 'Familia Weyenberg',
      fecha: st.fecha || new Date().toISOString().split('T')[0],
      resumen: st.resumen || '',
      contenidoRaw: htmlToPlainText(st.contenido || ''),
      imagen: st.imagen || '',
      imagenes: st.imagenes || [],
      facebookUrl: st.facebookUrl || '',
    });
    setEditingId(st.id);
  };

  const handleSaveStatement = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenidoRaw.trim()) {
      if (triggerToast) triggerToast('Por favor ingresa el título y el contenido del Statement.');
      return;
    }

    const htmlContent = formatParagraphsToHtml(form.contenidoRaw);
    const autoExcerpt = form.resumen.trim() || stripHtml(htmlContent).substring(0, 170) + '...';

    const payload = {
      id: editingId === 'new' ? 'ws_' + Date.now().toString() : editingId,
      titulo: form.titulo.trim(),
      categoria: form.categoria,
      versiculo: form.versiculo.trim(),
      autor: form.autor.trim() || 'Familia Weyenberg',
      fecha: form.fecha || new Date().toISOString().split('T')[0],
      resumen: autoExcerpt,
      contenido: htmlContent,
      imagen: form.imagen || '/cover_art_faith.png',
      imagenes: form.imagenes || [],
      facebookUrl: form.facebookUrl.trim(),
    };

    if (editingId === 'new') {
      if (onAddStatement) await onAddStatement(payload);
      if (triggerToast) triggerToast('¡Nuevo Statement publicado con éxito!');
    } else {
      if (onUpdateStatement) await onUpdateStatement(payload);
      if (triggerToast) triggerToast('¡Statement actualizado!');
    }
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás segura de que deseas eliminar este Statement?')) {
      if (onDeleteStatement) await onDeleteStatement(id);
      if (triggerToast) triggerToast('Statement eliminado');
    }
  };

  const handleShareStatement = (st) => {
    const shareTarget = st.facebookUrl || window.location.href;
    navigator.clipboard
      .writeText(`${st.titulo} — The Weyenberg Statement: ${shareTarget}`)
      .then(() => {
        if (triggerToast) triggerToast('¡Enlace del Statement copiado!');
      })
      .catch(() => {
        if (triggerToast) triggerToast('No se pudo copiar el enlace.');
      });
  };

  return (
    <div className="reveal" style={{ paddingBottom: '48px' }}>
      {/* ── Top Header Section ── */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span
              className="editorial-tag"
              style={{
                background: 'rgba(121, 35, 89, 0.14)',
                color: 'var(--accent-purple)',
                marginBottom: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Scale size={13} /> {tr('Cosmovisión & Lente Bíblico · Familia Weyenberg', 'Worldview & Biblical Lens · Weyenberg Family')}
            </span>
            <h1 style={{ fontSize: '2.35rem', marginTop: '4px', marginBottom: '8px' }}>
              The Weyenberg Statement
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: 0, lineHeight: 1.55 }}>
              {tr(
                'Statements y pronunciamientos de la Familia Weyenberg basados en conceptos bíblicos, analizando fenómenos de la actualidad, la cultura y la sociedad a través de un lente bíblico.',
                'Statements and reflections from the Weyenberg Family grounded in biblical concepts, analyzing current events, culture, and society through a biblical lens.'
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderColor: isAdminOpen ? 'var(--accent-purple)' : 'var(--glass-border)',
                color: isAdminOpen ? 'var(--accent-purple)' : 'var(--text-primary)',
              }}
            >
              <Lock size={14} />
              <span>{isAdminOpen ? tr('Cerrar Panel Admin', 'Close Admin Panel') : tr('Administrar Statements', 'Manage Statements')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── DEDICATED MINI ADMIN PANEL FOR THE WEYENBERG STATEMENT ── */}
      {isAdminOpen && (
        <section style={{ marginBottom: '44px' }}>
          <div
            className="glass-card glow-purple"
            style={{
              padding: '28px 24px',
              border: '2px solid var(--accent-purple)',
              background: 'var(--bg-space)',
            }}
          >
            {!isAdminLogged ? (
              <div style={{ maxWidth: '420px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(121, 35, 89, 0.12)',
                      color: 'var(--accent-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                    }}
                  >
                    <Lock size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '4px' }}>
                    Panel Admin · The Weyenberg Statement
                  </h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                    Ingresa tus credenciales para publicar nuevos Statements desde Facebook, subir imágenes o editar publicaciones.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin}>
                  <div className="form-group">
                    <label className="form-label">Usuario</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="weyenberg"
                      value={loginUser}
                      onChange={e => setLoginUser(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ position: 'relative' }}>
                    <label className="form-label">Contraseña</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      className="form-control"
                      placeholder="••••••••••••"
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '36px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <InteractiveHoverButton type="submit" style={{ width: '100%' }}>
                    Ingresar al Panel
                  </InteractiveHoverButton>
                </form>
              </div>
            ) : (
              <div>
                {/* Admin Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingBottom: '16px',
                    marginBottom: '20px',
                    borderBottom: '1px solid var(--glass-border)',
                  }}
                >
                  <div>
                    <span className="editorial-tag" style={{ marginBottom: '4px' }}>
                      Modo Editor Activo
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                      Gestión de The Weyenberg Statement ({statements.length})
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {!editingId && (
                      <button
                        onClick={startCreate}
                        className="btn-primary"
                        style={{
                          padding: '9px 18px',
                          fontSize: '0.84rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={16} /> Nuevo Statement
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsAdminLogged(false);
                        setEditingId(null);
                        try {
                          sessionStorage.removeItem('weyenberg_admin_auth');
                        } catch {}
                      }}
                      className="btn-secondary"
                      style={{
                        padding: '9px 14px',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <LogOut size={14} /> Salir
                    </button>
                  </div>
                </div>

                {/* Create / Edit Statement Form */}
                {editingId ? (
                  <form onSubmit={handleSaveStatement}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                      {editingId === 'new' ? 'Crear Nuevo Statement' : 'Editar Statement'}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Título del Statement *</label>
                        <input
                          type="text"
                          required
                          className="form-control"
                          placeholder="Ej. La Familia y la Verdad en Tiempos Modernos"
                          value={form.titulo}
                          onChange={e => setForm({ ...form, titulo: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Categoría / Tema *</label>
                        <select
                          className="form-control"
                          value={form.categoria}
                          onChange={e => setForm({ ...form, categoria: e.target.value })}
                          style={{ background: 'var(--bg-space)', color: 'var(--text-primary)' }}
                        >
                          {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">Base o Concepto Bíblico (Cita / Versículo) *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ej. Romanos 12:2 — No os conforméis a este siglo..."
                          value={form.versiculo}
                          onChange={e => setForm({ ...form, versiculo: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Autor y Fecha</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Familia Weyenberg"
                            value={form.autor}
                            onChange={e => setForm({ ...form, autor: e.target.value })}
                            style={{ flex: 1 }}
                          />
                          <input
                            type="date"
                            className="form-control"
                            value={form.fecha}
                            onChange={e => setForm({ ...form, fecha: e.target.value })}
                            style={{ width: '150px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Enlace al Post Original en Facebook (Opcional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://www.facebook.com/..."
                        value={form.facebookUrl}
                        onChange={e => setForm({ ...form, facebookUrl: e.target.value })}
                      />
                    </div>

                    {/* Cover Image & Additional Gallery Upload */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '16px',
                        marginBottom: '18px',
                        padding: '16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px dashed var(--glass-border)',
                        background: 'rgba(121, 35, 89, 0.03)',
                      }}
                    >
                      <div>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ImageIcon size={15} /> Imagen Principal de Portada
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="form-control"
                          style={{ padding: '8px', marginBottom: '8px' }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="O pega la URL de una imagen..."
                          value={form.imagen && !form.imagen.startsWith('data:') ? form.imagen : ''}
                          onChange={e => setForm({ ...form, imagen: e.target.value })}
                        />
                        {form.imagen && (
                          <div style={{ position: 'relative', marginTop: '10px', width: '140px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                            <img src={form.imagen} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, imagen: '' })}
                              style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer' }}
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ImageIcon size={15} /> Galería de Imágenes Adicionales (Opcional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="form-control"
                          style={{ padding: '8px' }}
                        />
                        {form.imagenes && form.imagenes.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {form.imagenes.map((imgUrl, idx) => (
                              <div key={idx} style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                <img src={imgUrl} alt={`Extra ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(idx)}
                                  style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Resumen Corto (Opcional — se genera solo si lo dejas en blanco)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Breve síntesis del fenómeno analizado..."
                        value={form.resumen}
                        onChange={e => setForm({ ...form, resumen: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Contenido Completo del Statement (Puedes copiar y pegar directamente desde Facebook) *
                      </label>
                      <textarea
                        required
                        rows={8}
                        className="form-control"
                        placeholder="Pega o escribe aquí el análisis completo de la Familia Weyenberg..."
                        value={form.contenidoRaw}
                        onChange={e => setForm({ ...form, contenidoRaw: e.target.value })}
                        style={{ minHeight: '180px', lineHeight: 1.6 }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="btn-secondary"
                        style={{ padding: '10px 18px', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                      <InteractiveHoverButton type="submit">
                        Guardar y Publicar Statement
                      </InteractiveHoverButton>
                    </div>
                  </form>
                ) : (
                  /* List of existing statements inside Admin */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {statements.map(st => (
                      <div
                        key={st.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--glass-border)',
                          background: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <img
                            src={st.imagen || '/cover_art_faith.png'}
                            alt={st.titulo}
                            style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {st.titulo}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {st.categoria} • {st.fecha} • {st.versiculo}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            onClick={() => startEdit(st)}
                            className="biz-btn-icon"
                            title="Editar Statement"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(st.id)}
                            className="biz-btn-icon"
                            style={{ color: '#EF4444' }}
                            title="Eliminar Statement"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Featured Statement Banner ── */}
      {featuredStatement && !searchQuery && selectedCategory === 'Todos' && (
        <section style={{ marginBottom: '40px' }}>
          <div
            onClick={() => setActiveStatement(featuredStatement)}
            className="featured-banner bento-col-12 glass-card-interactive"
            style={{ padding: 0, cursor: 'pointer', minHeight: '300px' }}
          >
            <img
              src={featuredStatement.imagen || '/cover_art_faith.png'}
              alt={featuredStatement.titulo}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(121, 35, 89, 0.96) 0%, rgba(121, 35, 89, 0.58) 60%, rgba(0,0,0,0.25) 100%)',
              }}
            />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', margin: 0 }}>
                    📖 {tr('Statement Destacado', 'Featured Statement')} · {lang === 'en' ? (CATEGORY_EN[featuredStatement.categoria] || featuredStatement.categoria) : featuredStatement.categoria}
                  </span>
                  {(featuredStatement.versiculo || featuredStatement.versiculoEn) && (
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        background: 'rgba(255,255,255,0.18)',
                        color: '#fff',
                        padding: '3px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      {lang === 'en' ? (featuredStatement.versiculoEn || featuredStatement.versiculo) : featuredStatement.versiculo}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginTop: '4px' }}>
                  <h2 style={{ margin: 0, fontSize: '1.65rem', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>
                    {lang === 'en' ? (featuredStatement.tituloEn || featuredStatement.titulo) : featuredStatement.titulo}
                  </h2>
                  <ArrowUpRight style={{ width: '22px', height: '22px', flexShrink: 0, color: '#fff' }} />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.9)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {lang === 'en'
                    ? (featuredStatement.resumenEn || featuredStatement.resumen || stripHtml(featuredStatement.contenido))
                    : (featuredStatement.resumen || stripHtml(featuredStatement.contenido))}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.18)',
                  paddingTop: '12px',
                  marginTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#fff', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700 }}>{featuredStatement.autor || tr('Familia Weyenberg', 'Weyenberg Family')}</span>
                  <span>·</span>
                  <span>{featuredStatement.fecha}</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                  {tr('Leer Statement completo →', 'Read full Statement →')}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Category Pills & Search Bar ── */}
      <section style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '12px',
          }}
        >
          <div className="category-pills" style={{ marginBottom: 0 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {lang === 'en' ? (CATEGORY_EN[cat] || cat) : cat}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-space)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--glass-border)',
              minWidth: '230px',
            }}
          >
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={tr('Buscar tema o pasaje bíblico...', 'Search topic or scripture...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.85rem',
                width: '100%',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Grid of Statements ── */}
      <section>
        {filteredStatements.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {tr('No se encontraron Statements en esta categoría.', 'No Statements found in this category.')}
          </div>
        ) : (
          <div className="directory-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredStatements.map(st => (
              <StatementCard
                key={st.id}
                st={st}
                onSelect={setActiveStatement}
                lang={lang}
                tr={tr}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Full Statement Reader Modal ── */}
      {activeStatement && (
        <StatementReaderModal
          activeStatement={activeStatement}
          onClose={() => setActiveStatement(null)}
          onShare={handleShareStatement}
          lang={lang}
          tr={tr}
        />
      )}
    </div>
  );
};

export default WeyenbergStatementView;
