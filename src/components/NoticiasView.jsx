import React, { useState, useEffect } from 'react';
import {
  Clock,
  User,
  PenTool,
  Search,
  Calendar,
  Share2,
  Plus,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  Image as ImageIcon,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const BLOG_CATEGORIES = [
  'Todos',
  'Reflexiones',
  'Fe & Esperanza',
  'Familia & Educación',
  'Comunidad & Vida',
];

const CAT_COLORS = {
  'Reflexiones':         { bg: '#fce7f3', text: '#db2777' },
  'Fe & Esperanza':      { bg: '#ede9fe', text: '#6E4BFA' },
  'Familia & Educación': { bg: '#dbeafe', text: '#2563eb' },
  'Comunidad & Vida':    { bg: '#fef3c7', text: '#d97706' },
  'Blog':                { bg: '#fce7f3', text: '#db2777' },
  'Educación':           { bg: '#dbeafe', text: '#2563eb' },
  'Cultura':             { bg: '#fef3c7', text: '#d97706' },
  'Comunidad':           { bg: '#ede9fe', text: '#6E4BFA' },
};

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

const formatDate = (dateStr) => {
  if (!dateStr) return 'Reciente';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const NoticiasView = ({
  noticias = [],
  onAddNoticia,
  onUpdateNoticia,
  onDeleteNoticia,
  triggerToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState(null);

  // Mini Admin Panel States (same access as The Weyenberg Statement)
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
    categoria: 'Reflexiones',
    fraseDestacada: '',
    autor: 'Berta Weyenberg',
    fecha: new Date().toISOString().split('T')[0],
    excerpt: '',
    contenidoRaw: '',
    imagen: '',
    galeria: [],
    lectura: 4,
  };

  const [editingId, setEditingId] = useState(null); // null | 'new' | post.id
  const [form, setForm] = useState(emptyForm);

  // Only show blog/reflection entries (or all entries if legacy)
  const blogPosts = noticias.filter(n => n.tipo === 'blog' || !n.tipo);

  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory !== 'Todos' && post.categoria !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (post.titulo || '').toLowerCase().includes(q);
      const matchQuote = (post.fraseDestacada || '').toLowerCase().includes(q);
      const matchBody = stripHtml(post.contenido || post.excerpt || '').toLowerCase().includes(q);
      return matchTitle || matchQuote || matchBody;
    }
    return true;
  });

  const featuredPost = filteredPosts[0];

  // Admin Login Handler (same credentials: weyenberg / statement2026)
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
      setLoginUser('');
      setLoginPass('');
      if (triggerToast) triggerToast('Bienvenida al Panel del Blog de Berta');
    } else {
      if (triggerToast) triggerToast('Usuario o contraseña incorrectos');
    }
  };

  // Cover Image Upload
  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, imagen: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Gallery Multiple Images Upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({
          ...prev,
          galeria: [...(prev.galeria || []), ev.target.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (idx) => {
    setForm(prev => ({
      ...prev,
      galeria: (prev.galeria || []).filter((_, i) => i !== idx),
    }));
  };

  const startNewPost = () => {
    setForm({
      ...emptyForm,
      fecha: new Date().toISOString().split('T')[0],
    });
    setEditingId('new');
  };

  const startEditPost = (post) => {
    setForm({
      id: post.id,
      titulo: post.titulo || '',
      categoria: post.categoria || 'Reflexiones',
      fraseDestacada: post.fraseDestacada || '',
      autor: post.autor || 'Berta Weyenberg',
      fecha: post.fecha || new Date().toISOString().split('T')[0],
      excerpt: post.excerpt || '',
      contenidoRaw: htmlToPlainText(post.contenido || post.excerpt || ''),
      imagen: post.imagen || '',
      galeria: Array.isArray(post.galeria) ? post.galeria : [],
      lectura: post.lectura || 4,
    });
    setEditingId(post.id);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenidoRaw.trim()) {
      if (triggerToast) triggerToast('Por favor completa el título y la reflexión del blog');
      return;
    }

    const htmlContent = formatParagraphsToHtml(form.contenidoRaw);
    const plainSummary = form.excerpt.trim() || stripHtml(htmlContent).slice(0, 180) + '...';
    const wordCount = stripHtml(htmlContent).split(/\s+/).filter(Boolean).length;
    const estimatedRead = Math.max(2, Math.round(wordCount / 160));

    const payload = {
      ...(editingId !== 'new' ? { id: editingId } : {}),
      tipo: 'blog',
      titulo: form.titulo.trim(),
      categoria: form.categoria || 'Reflexiones',
      fraseDestacada: form.fraseDestacada.trim(),
      autor: form.autor.trim() || 'Berta Weyenberg',
      fecha: form.fecha || new Date().toISOString().split('T')[0],
      excerpt: plainSummary,
      contenido: htmlContent,
      imagen: form.imagen || '/berta.jpeg',
      galeria: form.galeria || [],
      lectura: Number(form.lectura) || estimatedRead,
    };

    if (editingId === 'new') {
      if (onAddNoticia) await onAddNoticia(payload);
      if (triggerToast) triggerToast('¡Reflexión publicada en el Blog!');
    } else {
      if (onUpdateNoticia) await onUpdateNoticia(payload);
      if (triggerToast) triggerToast('¡Publicación del Blog actualizada!');
    }

    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`¿Estás segura de eliminar "${titulo}" del Blog?`)) {
      if (onDeleteNoticia) await onDeleteNoticia(id);
      if (activePost?.id === id) setActivePost(null);
      if (triggerToast) triggerToast('Publicación eliminada del Blog');
    }
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: `${post.titulo} — Blog de Berta (ConBERTAciones)`,
        text: post.excerpt || stripHtml(post.contenido),
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      if (triggerToast) triggerToast('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="reveal" style={{ paddingBottom: '48px' }}>
      {/* ── Top Header ── */}
      <header style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span
              className="editorial-tag"
              style={{
                background: 'rgba(218, 81, 246, 0.14)',
                color: 'var(--accent-terracotta)',
                marginBottom: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <PenTool size={13} /> Blog Personal · Reflexiones &amp; Vivencias
            </span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
              Blog de Berta · Reflexiones
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: 0, lineHeight: 1.6 }}>
              Un espacio íntimo donde Berta Weyenberg comparte reflexiones escritas, enseñanzas para la familia, momentos especiales e imágenes que edifican el alma.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className={isAdminOpen ? 'btn-primary' : 'btn-secondary'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              onClick={() => setIsAdminOpen(!isAdminOpen)}
            >
              <Lock size={14} />
              <span>{isAdminOpen ? 'Cerrar Panel del Blog' : 'Administrar Blog'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Dedicated Mini-Admin Panel for Berta's Blog ── */}
      {isAdminOpen && (
        <div
          className="glass-card"
          style={{
            marginBottom: '32px',
            padding: '24px',
            border: '2px solid rgba(218, 81, 246, 0.35)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(252,245,255,0.96) 100%)',
            boxShadow: '0 16px 40px rgba(121, 35, 89, 0.12)',
          }}
        >
          {!isAdminLogged ? (
            <form
              onSubmit={handleAdminLogin}
              style={{ maxWidth: '420px', margin: '0 auto', padding: '12px 0' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(121, 35, 89, 0.12)',
                    color: 'var(--accent-purple)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <Lock size={22} />
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                  Acceso al Blog de Berta
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Ingresa con el mismo usuario y contraseña para publicar reflexiones e imágenes en tu Blog.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. weyenberg"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={loginPass}
                    onChange={e => setLoginPass(e.target.value)}
                    style={{ paddingRight: '42px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Entrar al Panel del Blog
              </button>
            </form>
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
                    Panel de Edición · Blog &amp; Reflexiones
                  </span>
                  <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>
                    Gestionar Reflexiones e Imágenes del Blog ({blogPosts.length})
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {!editingId && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '9px 18px', fontSize: '0.82rem' }}
                      onClick={startNewPost}
                    >
                      <Plus size={15} /> Nueva Reflexión / Entrada
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '9px 14px', fontSize: '0.8rem', color: '#DC2626' }}
                    onClick={() => {
                      setIsAdminLogged(false);
                      setEditingId(null);
                      try {
                        sessionStorage.removeItem('weyenberg_admin_auth');
                      } catch {}
                      if (triggerToast) triggerToast('Sesión cerrada');
                    }}
                  >
                    <LogOut size={14} /> Salir
                  </button>
                </div>
              </div>

              {/* Create / Edit Blog Reflection Form */}
              {editingId ? (
                <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--accent-purple)' }}>
                      {editingId === 'new' ? '✨ Publicar Nueva Reflexión en el Blog' : '✏️ Editar Reflexión del Blog'}
                    </h4>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Título de la Reflexión / Artículo *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ej. El poder de la fe en tiempos de incertidumbre"
                        value={form.titulo}
                        onChange={e => setForm({ ...form, titulo: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Categoría</label>
                      <select
                        className="form-control"
                        value={form.categoria}
                        onChange={e => setForm({ ...form, categoria: e.target.value })}
                      >
                        {BLOG_CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Frase Destacada o Versículo (opcional)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder='Ej. "La fe es el ancla que nos mantiene unidos y con esperanza."'
                        value={form.fraseDestacada}
                        onChange={e => setForm({ ...form, fraseDestacada: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Autor(a)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Berta Weyenberg"
                        value={form.autor}
                        onChange={e => setForm({ ...form, autor: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Fecha</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.fecha}
                        onChange={e => setForm({ ...form, fecha: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload + Gallery Upload */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: '1px dashed rgba(121, 35, 89, 0.35)',
                        background: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <ImageIcon size={15} color="var(--accent-purple)" /> Imagen Principal de Portada
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        style={{ fontSize: '0.78rem', marginBottom: '8px', width: '100%' }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="O pega la URL de una imagen..."
                        value={form.imagen && !form.imagen.startsWith('data:') ? form.imagen : ''}
                        onChange={e => setForm({ ...form, imagen: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                      />
                      {form.imagen && (
                        <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                          <img
                            src={form.imagen}
                            alt="Portada"
                            style={{ height: '90px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                          />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, imagen: '' })}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: '#DC2626',
                              color: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding: '14px',
                        borderRadius: '14px',
                        border: '1px dashed rgba(218, 81, 246, 0.35)',
                        background: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <ImageIcon size={15} color="var(--accent-terracotta)" /> Galería de Imágenes (Subir varias fotos)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        style={{ fontSize: '0.78rem', marginBottom: '8px', width: '100%' }}
                      />
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>
                        Sube fotos adicionales para acompañar tu reflexión en el Blog.
                      </p>
                      {form.galeria && form.galeria.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {form.galeria.map((img, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                              <img
                                src={img}
                                alt={`Galería ${idx + 1}`}
                                style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                style={{
                                  position: 'absolute',
                                  top: '-5px',
                                  right: '-5px',
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  background: '#DC2626',
                                  color: '#fff',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '11px',
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

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Resumen corto (opcional, se genera solo si lo dejas vacío)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Breve introducción que se verá en la tarjeta del Blog..."
                      value={form.excerpt}
                      onChange={e => setForm({ ...form, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Texto de la Reflexión / Entrada del Blog *</label>
                    <textarea
                      className="form-control"
                      rows={9}
                      placeholder="Escribe o pega aquí tu reflexión completa. Los saltos de línea se convertirán automáticamente en párrafos..."
                      value={form.contenidoRaw}
                      onChange={e => setForm({ ...form, contenidoRaw: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      <CheckCircle2 size={16} />
                      <span>{editingId === 'new' ? 'Publicar en el Blog' : 'Guardar Cambios'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* List of existing blog posts in Admin */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
                  {blogPosts.map(post => (
                    <div
                      key={post.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.8)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <img
                          src={post.imagen || '/berta.jpeg'}
                          alt={post.titulo}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.titulo}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {post.categoria} · {formatDate(post.fecha)}
                            {post.galeria?.length > 0 ? ` · 📸 ${post.galeria.length} fotos` : ''}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          type="button"
                          className="biz-btn-icon"
                          title="Editar reflexión"
                          onClick={() => startEditPost(post)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          className="biz-btn-icon"
                          title="Eliminar reflexión"
                          style={{ color: '#DC2626' }}
                          onClick={() => handleDelete(post.id, post.titulo)}
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
      )}

      {/* ── Featured Blog Reflection Banner ── */}
      {featuredPost && !searchQuery && selectedCategory === 'Todos' && (
        <div
          className="glass-card glow-purple"
          style={{
            marginBottom: '28px',
            padding: '26px',
            background: 'linear-gradient(135deg, rgba(121, 35, 89, 0.08) 0%, rgba(218, 81, 246, 0.12) 100%)',
            border: '1px solid rgba(218, 81, 246, 0.28)',
            cursor: 'pointer',
          }}
          onClick={() => setActivePost(featuredPost)}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span className="editorial-tag" style={{ background: 'var(--accent-purple)', color: '#fff', margin: 0 }}>
                  <Sparkles size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Reflexión Destacada
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-terracotta)' }}>
                  {featuredPost.categoria}
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {formatDate(featuredPost.fecha)}
                </span>
              </div>

              <h2 style={{ fontSize: '1.65rem', margin: '0 0 10px 0', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {featuredPost.titulo}
              </h2>

              {featuredPost.fraseDestacada && (
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(121, 35, 89, 0.08)',
                    borderLeft: '3px solid var(--accent-purple)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--accent-purple)',
                    marginBottom: '12px',
                    fontStyle: 'italic',
                  }}
                >
                  “{featuredPost.fraseDestacada}”
                </div>
              )}

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 18px 0' }}>
                {featuredPost.excerpt || stripHtml(featuredPost.contenido).slice(0, 220) + '...'}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                <button
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.84rem' }}
                  onClick={() => setActivePost(featuredPost)}
                >
                  <BookOpen size={15} />
                  <span>Leer Reflexión Completa</span>
                </button>
              </div>
            </div>

            {featuredPost.imagen && (
              <div
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  maxHeight: '280px',
                  boxShadow: '0 12px 30px rgba(121, 35, 89, 0.16)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <img
                  src={featuredPost.imagen}
                  alt={featuredPost.titulo}
                  style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Category Pills + Search Bar ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '24px',
        }}
      >
        <div className="category-pills" style={{ margin: 0, padding: 0 }}>
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '250px', flex: '1 1 250px', maxWidth: '360px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Buscar reflexión en el Blog..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', paddingRight: '14px', height: '42px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* ── Grid of Blog Reflections ── */}
      {filteredPosts.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No se encontraron reflexiones con ese criterio.
        </div>
      ) : (
        <div className="noticias-grid">
          {filteredPosts.map(post => {
            const cat = CAT_COLORS[post.categoria] || { bg: '#fce7f3', text: '#db2777' };
            return (
              <div key={post.id} className="article-card" onClick={() => setActivePost(post)}>
                <div className="article-img-container">
                  <span className="category-badge" style={{ background: cat.bg, color: cat.text }}>
                    {post.categoria}
                  </span>
                  {post.galeria && post.galeria.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        zIndex: 2,
                      }}
                    >
                      📸 +{post.galeria.length} fotos
                    </span>
                  )}
                  <img
                    src={post.imagen || '/berta.jpeg'}
                    alt={post.titulo}
                    className="article-img"
                  />
                </div>
                <div className="article-body">
                  <h3 className="article-title">{post.titulo}</h3>
                  {post.fraseDestacada && (
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: 'var(--accent-purple)',
                        fontStyle: 'italic',
                        marginBottom: '6px',
                      }}
                    >
                      “{post.fraseDestacada}”
                    </div>
                  )}
                  <p className="article-excerpt">{post.excerpt || stripHtml(post.contenido).slice(0, 150) + '...'}</p>
                  <div className="article-meta">
                    <span>
                      <User size={12} /> {post.autor || 'Berta Weyenberg'}
                    </span>
                    <span>
                      <Clock size={12} /> {post.lectura || 4} min
                    </span>
                    <span>{formatDate(post.fecha)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Fullscreen Reader Modal for Blog Post & Gallery ── */}
      {activePost && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(14, 13, 20, 0.72)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setActivePost(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              background: '#ffffff',
              border: '1px solid var(--glass-border)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePost(null)}
              className="icon-btn"
              style={{
                position: 'sticky',
                top: '0',
                float: 'right',
                background: 'rgba(121, 35, 89, 0.1)',
                color: 'var(--text-primary)',
                zIndex: 10,
              }}
              title="Cerrar lectura"
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '16px' }}>
              <span className="editorial-tag">Blog de Berta · {activePost.categoria}</span>
              <h2 style={{ fontSize: '1.85rem', margin: '6px 0 10px 0', color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {activePost.titulo}
              </h2>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>✍️ {activePost.autor || 'Berta Weyenberg'}</span>
                <span>📅 {formatDate(activePost.fecha)}</span>
                <span>⏱️ {activePost.lectura || 4} min de lectura</span>
              </div>
            </div>

            {activePost.fraseDestacada && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(121, 35, 89, 0.08), rgba(218, 81, 246, 0.12))',
                  borderLeft: '4px solid var(--accent-purple)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  “{activePost.fraseDestacada}”
                </div>
              </div>
            )}

            {activePost.imagen && (
              <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '22px', maxHeight: '380px' }}>
                <img
                  src={activePost.imagen}
                  alt={activePost.titulo}
                  style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div
              className="editorial-body"
              style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '24px' }}
              dangerouslySetInnerHTML={{
                __html: formatParagraphsToHtml(activePost.contenido || activePost.excerpt),
              }}
            />

            {/* Additional Gallery Images if uploaded */}
            {activePost.galeria && activePost.galeria.length > 0 && (
              <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  📸 Galería de Imágenes ({activePost.galeria.length})
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {activePost.galeria.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`${activePost.titulo} - imagen ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '18px',
                borderTop: '1px solid var(--glass-border)',
              }}
            >
              <button
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.82rem' }}
                onClick={() => handleShare(activePost)}
              >
                <Share2 size={14} /> Compartir Reflexión
              </button>

              <button
                className="btn-primary"
                style={{ padding: '9px 20px', fontSize: '0.82rem' }}
                onClick={() => setActivePost(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticiasView;
