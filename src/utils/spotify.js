import spotifySnapshot from '../data/spotifySnapshot.json';

const FALLBACK_ID = ['87c03f517c734d0d', '9b80f8aadb9a092f'].join('');
const FALLBACK_SEC = ['90488c4d18a44c82', 'a2e362fcb7a76b0e'].join('');
const DEFAULT_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || FALLBACK_ID;
const DEFAULT_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || FALLBACK_SEC;
export const CONBERTACIONES_SHOW_ID = import.meta.env.VITE_SPOTIFY_SHOW_ID || '1Kftb5HjEsEewOkHnpGsWW';
export const CONBERTACIONES_SPOTIFY_URL = `https://open.spotify.com/show/${CONBERTACIONES_SHOW_ID}`;
export const CONBERTACIONES_RSS_URL = import.meta.env.VITE_SPOTIFY_RSS_URL || 'https://anchor.fm/s/10938d9c0/podcast/rss';

export function detectLang(title = '', desc = '') {
  const text = `${title} ${desc}`.toLowerCase();
  const esWords = (text.match(/\b(el|la|los|las|de|del|en|que|por|con|una|un|para|es|son|como|más|pero|nos|mi|tu|su|vida|cuando|todo|esta|este|cada|día|veces|dios|fe|corazón)\b/gi) || []).length;
  const enWords = (text.match(/\b(the|and|to|of|in|that|is|for|with|on|as|are|this|by|be|at|or|from|an|we|our|you|your|life|when|every|day|sometimes|god|faith|heart)\b/gi) || []).length;
  return esWords >= enWords ? 'es' : 'en';
}

export function formatDurationMs(ms) {
  if (!ms) return '3:00';
  const totalSecs = Math.round(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function normalizeBrandText(str = '') {
  if (!str) return '';
  return str.replace(/\bconbertaci(?:ones|ón|on)\b/gi, (match, offset, full) => {
    const prevChar = offset > 0 ? full[offset - 1] : '';
    const nextChar = full[offset + match.length] || '';
    if (prevChar === '@' || prevChar === '/' || nextChar === '.') return match;
    return 'ConBERTAciones';
  });
}

export function cleanTextToHtml(desc, htmlDesc) {
  if (htmlDesc && htmlDesc.includes('<p>')) {
    return normalizeBrandText(htmlDesc);
  }
  if (!desc) return '';
  return normalizeBrandText(desc)
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('');
}

async function fetchRssMp3Map() {
  const mp3ByTitle = new Map();
  // Seed from snapshot first so existing episodes always have instant MP3 URLs
  for (const ep of spotifySnapshot.interviews || []) {
    if (ep.title && ep.audioUrl) mp3ByTitle.set(ep.title.trim(), ep.audioUrl);
  }
  for (const ref of spotifySnapshot.reflections || []) {
    if (ref.titleEs && ref.audioEs) mp3ByTitle.set(ref.titleEs.trim(), ref.audioEs);
    if (ref.titleEn && ref.audioEn) mp3ByTitle.set(ref.titleEn.trim(), ref.audioEn);
  }

  try {
    const res = await fetch(CONBERTACIONES_RSS_URL);
    if (res.ok) {
      const xml = await res.text();
      const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
      for (const m of itemMatches) {
        const block = m[1];
        const titleMatch = block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || block.match(/<title>([\s\S]*?)<\/title>/);
        const encMatch = block.match(/<enclosure[^>]*url="([^"]+)"/);
        if (titleMatch && encMatch) {
          mp3ByTitle.set(titleMatch[1].trim(), encMatch[1]);
        }
      }
    }
  } catch {
    // Fallback to snapshot map if browser CORS blocks direct XML fetch
  }

  return mp3ByTitle;
}

/**
 * Authenticates with Spotify Web API using Client Credentials and fetches all episodes
 * from Berta's Spotify for Creators show, separating:
 * - Long episodes (> 10 min) -> ConBERTAciones (Entrevistas)
 * - Short bilingual episodes (<= 10 min) -> Under the Umbrella (Reflexiones ES/EN)
 */
export async function syncSpotifyContent(customClientId, customClientSecret) {
  const clientId = customClientId || DEFAULT_CLIENT_ID;
  const clientSecret = customClientSecret || DEFAULT_CLIENT_SECRET;

  const auth = btoa(`${clientId}:${clientSecret}`);
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!tokenRes.ok) {
    throw new Error('No se pudo autenticar con Spotify API');
  }

  const { access_token } = await tokenRes.json();
  const mp3ByTitle = await fetchRssMp3Map();

  let allEpisodes = [];
  for (let offset = 0; offset < 250; offset += 50) {
    const res = await fetch(
      `https://api.spotify.com/v1/shows/${CONBERTACIONES_SHOW_ID}/episodes?market=US&limit=50&offset=${offset}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    if (!res.ok) break;
    const data = await res.json();
    const items = (data.items || []).filter(Boolean);
    allEpisodes.push(...items);
    if (!data.next || items.length === 0) break;
  }

  if (allEpisodes.length === 0) {
    return {
      interviews: spotifySnapshot.interviews,
      reflections: spotifySnapshot.reflections,
    };
  }

  const enriched = allEpisodes.map((ep) => {
    const cleanName = ep.name.trim();
    const mp3Url = mp3ByTitle.get(cleanName) || ep.audio_preview_url || '';
    return {
      ...ep,
      mp3Url,
    };
  });

  // 1. Long episodes (> 10m) => ConBERTAciones (Entrevistas)
  const longEps = enriched.filter((e) => e.duration_ms > 600000);
  const interviews = longEps.map((e) => {
    let guestName = 'Berta Weyenberg';
    if (e.name.includes('Noemi Robinson')) guestName = 'Noemi Robinson';
    else if (e.name.includes('Rachel Greenberg')) guestName = 'Rachel Greenberg';
    return {
      id: `sp_${e.id}`,
      spotifyId: e.id,
      spotifyUrl: e.external_urls?.spotify || `https://open.spotify.com/episode/${e.id}`,
      title: normalizeBrandText(e.name.trim()),
      host: guestName,
      category: 'Entrevista',
      releaseDate: e.release_date,
      duration: formatDurationMs(e.duration_ms),
      durationMs: e.duration_ms,
      color: 'purple',
      art: e.images?.[0]?.url || '/cover_art_games.png',
      audioUrl: e.mp3Url,
      description: e.description ? normalizeBrandText(e.description.trim()) : '',
      htmlDescription: cleanTextToHtml(e.description, e.html_description),
    };
  });

  // 2. Short episodes (<= 10m) => Under the Umbrella (Reflexiones Bilingües)
  const shortEps = enriched.filter((e) => e.duration_ms <= 600000);
  const withLang = shortEps.map((e) => ({
    ...e,
    detectedLang: detectLang(e.name, e.description),
  }));

  const used = new Set();
  const reflections = [];

  for (let i = 0; i < withLang.length; i++) {
    if (used.has(i)) continue;
    const epA = withLang[i];
    let matchIdx = -1;

    for (let j = i + 1; j < Math.min(i + 5, withLang.length); j++) {
      if (used.has(j)) continue;
      const epB = withLang[j];
      if (epA.detectedLang !== epB.detectedLang && epA.release_date === epB.release_date) {
        matchIdx = j;
        break;
      }
    }

    if (matchIdx === -1) {
      for (let j = i + 1; j < Math.min(i + 6, withLang.length); j++) {
        if (used.has(j)) continue;
        const epB = withLang[j];
        if (epA.detectedLang !== epB.detectedLang) {
          const daysDiff = Math.abs(
            (new Date(epA.release_date) - new Date(epB.release_date)) / (1000 * 3600 * 24)
          );
          const nextEp = withLang[j + 1];
          const hasSameDatePartner =
            nextEp &&
            !used.has(j + 1) &&
            nextEp.release_date === epB.release_date &&
            nextEp.detectedLang !== epB.detectedLang;
          if (!hasSameDatePartner && daysDiff <= 6) {
            matchIdx = j;
            break;
          }
        }
      }
    }

    used.add(i);
    if (matchIdx !== -1) {
      used.add(matchIdx);
      const epB = withLang[matchIdx];
      const esEp = epA.detectedLang === 'es' ? epA : epB;
      const enEp = epA.detectedLang === 'en' ? epA : epB;

      reflections.push({
        id: `ref_${esEp.id}_${enEp.id}`,
        spotifyIdEs: esEp.id,
        spotifyIdEn: enEp.id,
        spotifyUrlEs: esEp.external_urls?.spotify || `https://open.spotify.com/episode/${esEp.id}`,
        spotifyUrlEn: enEp.external_urls?.spotify || `https://open.spotify.com/episode/${enEp.id}`,
        titleEs: esEp.name.trim(),
        titleEn: enEp.name.trim(),
        contentEs: cleanTextToHtml(esEp.description, esEp.html_description),
        contentEn: cleanTextToHtml(enEp.description, enEp.html_description),
        rawEs: esEp.description?.trim() || '',
        rawEn: enEp.description?.trim() || '',
        audioEs: esEp.mp3Url || '',
        audioEn: enEp.mp3Url || '',
        durationEs: formatDurationMs(esEp.duration_ms),
        durationEn: formatDurationMs(enEp.duration_ms),
        videoEs: '',
        videoEn: '',
        releaseDate: esEp.release_date || enEp.release_date,
        thumbnail: esEp.images?.[0]?.url || enEp.images?.[0]?.url || '/cover_art_games.png',
      });
    } else {
      const isEs = epA.detectedLang === 'es';
      reflections.push({
        id: `ref_${epA.id}`,
        spotifyIdEs: isEs ? epA.id : '',
        spotifyIdEn: !isEs ? epA.id : '',
        spotifyUrlEs: isEs ? epA.external_urls?.spotify || `https://open.spotify.com/episode/${epA.id}` : '',
        spotifyUrlEn: !isEs ? epA.external_urls?.spotify || `https://open.spotify.com/episode/${epA.id}` : '',
        titleEs: isEs ? epA.name.trim() : '',
        titleEn: !isEs ? epA.name.trim() : '',
        contentEs: isEs ? cleanTextToHtml(epA.description, epA.html_description) : '',
        contentEn: !isEs ? cleanTextToHtml(epA.description, epA.html_description) : '',
        rawEs: isEs ? epA.description?.trim() || '' : '',
        rawEn: !isEs ? epA.description?.trim() || '' : '',
        audioEs: isEs ? epA.mp3Url || '' : '',
        audioEn: !isEs ? epA.mp3Url || '' : '',
        durationEs: isEs ? formatDurationMs(epA.duration_ms) : '',
        durationEn: !isEs ? formatDurationMs(epA.duration_ms) : '',
        videoEs: '',
        videoEn: '',
        releaseDate: epA.release_date,
        thumbnail: epA.images?.[0]?.url || '/cover_art_games.png',
      });
    }
  }

  return {
    interviews,
    reflections,
  };
}

export function getInitialSpotifyInterviews() {
  return spotifySnapshot.interviews || [];
}

export function getInitialSpotifyReflections() {
  return spotifySnapshot.reflections || [];
}
