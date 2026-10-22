import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Globe } from 'lucide-react';

const LanguageContext = createContext({
  lang: 'es',
  setLang: () => {},
  toggleLang: () => {},
  tr: (es, en) => es,
});

// Simple client-side translation cache for dynamic user-added content
const translationCache = new Map();
try {
  const cached = JSON.parse(localStorage.getItem('conbertaciones_i18n_cache') || '{}');
  Object.entries(cached).forEach(([k, v]) => translationCache.set(k, v));
} catch {}

function saveCache() {
  try {
    const obj = {};
    translationCache.forEach((v, k) => {
      obj[k] = v;
    });
    localStorage.setItem('conbertaciones_i18n_cache', JSON.stringify(obj));
  } catch {}
}

export async function autoTranslateText(text, targetLang = 'en') {
  if (!text || typeof text !== 'string' || !text.trim()) return text;
  const cacheKey = `${targetLang}::${text.slice(0, 300)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // Preserve ConBERTAciones brand name
    const protectedText = text.replace(/ConBERTAciones/g, 'CONBERTACIONES_BRAND');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(protectedText)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    const translated = (data?.[0] || [])
      .map(part => part?.[0] || '')
      .join('')
      .replace(/CONBERTACIONES_BRAND/gi, 'ConBERTAciones');
    if (translated) {
      translationCache.set(cacheKey, translated);
      saveCache();
      return translated;
    }
  } catch {
    // Fallback to original text if offline
  }
  return text;
}

export function useAutoTranslated(text, explicitEn, lang) {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let active = true;
    if (lang !== 'en') {
      setTranslated(text);
      return;
    }
    if (explicitEn) {
      setTranslated(explicitEn);
      return;
    }
    if (!text) {
      setTranslated('');
      return;
    }
    autoTranslateText(text, 'en').then(res => {
      if (active) setTranslated(res);
    });
    return () => {
      active = false;
    };
  }, [text, explicitEn, lang]);

  return lang === 'en' ? (explicitEn || translated || text) : text;
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('conbertaciones_lang') || 'es';
    } catch {
      return 'es';
    }
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    try {
      return !sessionStorage.getItem('conbertaciones_lang_prompted');
    } catch {
      return false;
    }
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('conbertaciones_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {}
  }, []);

  const chooseWelcomeLang = (chosenLang) => {
    setLang(chosenLang);
    setShowWelcomeModal(false);
    try {
      sessionStorage.setItem('conbertaciones_lang_prompted', 'true');
    } catch {}
  };

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  const tr = useCallback(
    (esText, enText) => (lang === 'en' ? (enText ?? esText) : esText),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, tr, openLangModal: () => setShowWelcomeModal(true) }}>
      {children}

      {/* ── Welcome Language Selector Modal on Entry ── */}
      {showWelcomeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            background: 'rgba(14, 13, 20, 0.72)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => chooseWelcomeLang(lang)}
        >
          <div
            className="glass-card reveal"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '32px 28px',
              textAlign: 'center',
              background: 'linear-gradient(145deg, #ffffff 0%, #fcf7ff 100%)',
              border: '2px solid rgba(218, 81, 246, 0.35)',
              boxShadow: '0 24px 60px rgba(121, 35, 89, 0.25)',
              borderRadius: '28px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                margin: '0 auto 14px',
                overflow: 'hidden',
                border: '3px solid var(--accent-terracotta)',
                boxShadow: '0 8px 24px rgba(218, 81, 246, 0.25)',
              }}
            >
              <img src="/berta.jpeg" alt="Berta Weyenberg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(218, 81, 246, 0.12)',
                color: 'var(--accent-purple)',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '10px',
              }}
            >
              <Globe size={13} /> Bilingual Experience · ES / EN
            </div>

            <h2 style={{ fontSize: '1.65rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
              Bienvenido a ConBERTAciones
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              ¿En qué idioma deseas explorar el sitio? <br />
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
                Which language would you like to use?
              </span>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <button
                type="button"
                onClick={() => chooseWelcomeLang('es')}
                style={{
                  padding: '18px 14px',
                  borderRadius: '18px',
                  border: lang === 'es' ? '2px solid var(--accent-terracotta)' : '1px solid var(--glass-border-highlight)',
                  background: lang === 'es' ? 'linear-gradient(135deg, rgba(218, 81, 246, 0.14), rgba(121, 35, 89, 0.08))' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 6px 20px rgba(121, 35, 89, 0.08)',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>🇪🇸</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Español</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>Entrar en Español</span>
              </button>

              <button
                type="button"
                onClick={() => chooseWelcomeLang('en')}
                style={{
                  padding: '18px 14px',
                  borderRadius: '18px',
                  border: lang === 'en' ? '2px solid var(--accent-terracotta)' : '1px solid var(--glass-border-highlight)',
                  background: lang === 'en' ? 'linear-gradient(135deg, rgba(218, 81, 246, 0.14), rgba(121, 35, 89, 0.08))' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 6px 20px rgba(121, 35, 89, 0.08)',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>🇺🇸</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>English</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500 }}>Enter in English</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

/**
 * Protagonist ES / EN Segmented Switch Pill
 */
export const LanguageSwitch = ({ compact = false }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language Switcher"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(121, 35, 89, 0.08)',
        padding: compact ? '3px' : '4px',
        borderRadius: '999px',
        border: '1.5px solid rgba(218, 81, 246, 0.35)',
        boxShadow: '0 4px 16px rgba(218, 81, 246, 0.15)',
        gap: '2px',
      }}
    >
      <button
        type="button"
        onClick={() => setLang('es')}
        style={{
          border: 'none',
          cursor: 'pointer',
          padding: compact ? '5px 10px' : '7px 16px',
          borderRadius: '999px',
          fontSize: compact ? '0.75rem' : '0.82rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: lang === 'es' ? 'linear-gradient(135deg, #fd3e81 0%, #da51f6 100%)' : 'transparent',
          color: lang === 'es' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: lang === 'es' ? '0 3px 10px rgba(218, 81, 246, 0.35)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span>🇪🇸</span>
        <span>{compact ? 'ES' : 'ES · Español'}</span>
      </button>

      <button
        type="button"
        onClick={() => setLang('en')}
        style={{
          border: 'none',
          cursor: 'pointer',
          padding: compact ? '5px 10px' : '7px 16px',
          borderRadius: '999px',
          fontSize: compact ? '0.75rem' : '0.82rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: lang === 'en' ? 'linear-gradient(135deg, #fd3e81 0%, #da51f6 100%)' : 'transparent',
          color: lang === 'en' ? '#ffffff' : 'var(--text-secondary)',
          boxShadow: lang === 'en' ? '0 3px 10px rgba(218, 81, 246, 0.35)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span>🇺🇸</span>
        <span>{compact ? 'EN' : 'EN · English'}</span>
      </button>
    </div>
  );
};
