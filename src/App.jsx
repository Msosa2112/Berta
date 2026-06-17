import React, { useState, useEffect, useRef } from 'react';
import { Home, Mic, Newspaper, Calendar, MapPin, Menu, X, BookOpen, Award, Briefcase, Mail, Plus, Play, Pause, ChevronDown, ChevronUp } from 'lucide-react';
import HomeView from './components/HomeView';
import PodcastView from './components/PodcastView';
import UnderTheUmbrellaView from './components/UnderTheUmbrellaView';
import PublicSpeakerView from './components/PublicSpeakerView';
import ConectaView from './components/ConectaView';
import NoticiasView from './components/NoticiasView';
import EventosView from './components/EventosView';
import DirectorioView from './components/DirectorioView';
import PlayerView from './components/PlayerView';
import AdminView from './components/AdminView';
import ReflectionView from './components/ReflectionView';
import UmbrellaPlaylistView from './components/UmbrellaPlaylistView';
import ArticleView from './components/ArticleView';
import ProfileView from './components/ProfileView';
import { openDB, getAll, put, deleteItem, clearStore } from './utils/db';

// ─── PODCAST DATA ────────────────────────────────────────────────────────────
const defaultEpisodes = [
  { id: '1', title: 'EP - 251 | Exploring the Art and Science of Games', host: 'Berta Weyenberg', duration: '3:29', color: 'purple', art: '/cover_art_games.png', audioUrl: '' },
  { id: '2', title: 'EP - 521 | Comedy Central Chatter', host: 'Dr. Hector J. Ruiz', duration: '45:10', color: 'purple', art: '/cover_art_comedy.png', audioUrl: '' },
  { id: '3', title: 'EP - 754 | Jóvenes emprendedores y la fe', host: 'Carlos Aguilera', duration: '52:00', color: 'purple', art: '/cover_art_faith.png', audioUrl: '' },
  { id: '4', title: 'EP - 344 | Gaming Adventures Unleashed', host: 'Berta Weyenberg', duration: '38:20', color: 'purple', art: '/cover_art_adventure.png', audioUrl: '' },
];

const defaultGuests = [
  { id: 'g1', name: 'Dr. Hector J. Ruiz', business: 'Lexington Comedy Club', bio: 'Comediante local con más de 10 años haciendo reír a Kentucky.', bgPhoto: '/guest_hector.png', facebook: '', instagram: 'https://instagram.com', linkedin: '', youtube: '', website: '' },
  { id: 'g2', name: 'Carlos Aguilera', business: 'Aguilera Tech Hub', bio: 'Joven emprendedor dominicano enfocado en crear soluciones de IA para la iglesia.', bgPhoto: '/guest_carlos.png', facebook: 'https://facebook.com', instagram: '', linkedin: 'https://linkedin.com', youtube: '', website: '' },
];

// ─── NOTICIAS & BLOG DATA ────────────────────────────────────────────────────
const defaultNoticias = [
  {
    id: 'n1', tipo: 'noticia',
    titulo: 'Nuevo Centro Comunitario Latino abre sus puertas en el West End',
    excerpt: 'La organización Casa Latina inaugura un espacio multicultural con servicios de traducción, orientación legal y clases de inglés gratuitas.',
    contenido: '<p>Louisville da la bienvenida a un nuevo espacio de esperanza y servicio. Casa Latina, organización sin fines de lucro con más de diez años sirviendo a la comunidad hispana de Kentucky, inauguró su nuevo centro comunitario en el West End.</p><p>El centro contará con servicios de traducción e interpretación, orientación migratoria gratuita, clases de inglés para adultos y espacios de reunión para organizaciones comunitarias. El horario de atención es de lunes a viernes de 9 AM a 5 PM.</p><p>"Este espacio es de ustedes, es un hogar para nuestra comunidad", dijo la directora ejecutiva Ana Reyes durante el acto inaugural, rodeada de decenas de familias, líderes religiosos y representantes del gobierno municipal.</p>',
    imagen: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    categoria: 'Comunidad', autor: 'Redacción ConBERTAciones', fecha: '2026-04-19', lectura: 3,
  },
  {
    id: 'n2', tipo: 'noticia',
    titulo: 'JCPS Expande Programa Bilingüe a 5 Nuevas Escuelas en 2026',
    excerpt: 'El Distrito Escolar del Condado de Jefferson anuncia nuevas aulas de educación dual para el próximo año lectivo.',
    contenido: '<p>El Distrito Escolar del Condado de Jefferson (JCPS) anunció la expansión de su programa de educación dual a cinco nuevas escuelas para el año lectivo 2026-2027. El programa ya cuenta con más de 3,000 estudiantes inscritos en educación bilingüe desde kindergarten.</p><p>Berta Weyenberg, educadora de JCPS, celebró el anuncio: "Es un paso histórico para nuestra comunidad. Cada niño que crece bilingüe lleva consigo un regalo que nadie puede quitarle."</p><p>Las inscripciones para el nuevo año escolar estarán abiertas a partir del 15 de mayo. Para más información visita el sitio web oficial de JCPS.</p>',
    imagen: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
    categoria: 'Educación', autor: 'Berta Weyenberg', fecha: '2026-04-15', lectura: 4,
  },
  {
    id: 'n3', tipo: 'noticia',
    titulo: 'Feria de Salud Gratuita para Familias Hispanas en Shelby Park',
    excerpt: 'Médicos voluntarios bilingües ofrecerán chequeos, vacunas y recursos de salud mental en español, sin seguro médico requerido.',
    contenido: '<p>Este sábado 26 de abril, Shelby Park se convertirá en un espacio de salud y bienestar para la comunidad latina de Louisville. Médicos voluntarios bilingües ofrecerán chequeos generales, vacunas, revisiones dentales y recursos de salud mental en español, completamente gratis para toda la familia.</p><p>El evento, organizado por Louisville Latino Alliance con el apoyo de UofL Health, estará disponible de 9 AM a 3 PM. No se requiere seguro médico ni cita previa.</p>',
    imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    categoria: 'Salud', autor: 'Redacción ConBERTAciones', fecha: '2026-04-12', lectura: 2,
  },
  {
    id: 'b1', tipo: 'blog',
    titulo: 'El poder de la fe en tiempos de incertidumbre',
    excerpt: 'En medio de los cambios que vivimos como comunidad inmigrante, la fe sigue siendo el ancla que nos mantiene unidos y con esperanza.',
    contenido: '<p>Querida comunidad: vivimos tiempos que nos piden más de lo que a veces sentimos que podemos dar. Familias separadas, sueños postergados, miedo a lo desconocido. Y sin embargo, aquí estamos. Juntos.</p><p>La fe, para muchos de nosotros, no es solo religión. Es la certeza de que hay algo más grande guiando nuestro camino. Es la voz de abuela que nos dice que aguantemos. Es el abrazo de un vecino que no habla nuestro idioma pero entiende nuestro dolor.</p><p>Esta semana, te invito a detenerte cinco minutos. Respira. Recuerda de dónde vienes. Y confía en hacia dónde vas. Nuestra comunidad es más fuerte de lo que creemos.<br /><br /><em>Con amor y fe, Berta.</em></p>',
    imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    categoria: 'Blog', autor: 'Berta Weyenberg', fecha: '2026-04-10', lectura: 5,
  },
  {
    id: 'n4', tipo: 'noticia',
    titulo: 'Louisville entre las 20 ciudades de mayor crecimiento hispano en EE.UU.',
    excerpt: 'Un informe del Pew Research Center sitúa a Louisville como una de las ciudades con mayor crecimiento de la población latina en la última década.',
    contenido: '<p>Según un nuevo informe del Pew Research Center, Louisville se encuentra entre las 20 ciudades de Estados Unidos con mayor crecimiento porcentual de población hispana en la última década.</p><p>La comunidad latina de Louisville ha crecido un 34% entre 2015 y 2025, pasando de aproximadamente 45,000 a más de 60,000 residentes hispanos en el área metropolitana. Este crecimiento ha impulsado nuevos negocios, organizaciones comunitarias y programas educativos.</p>',
    imagen: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    categoria: 'Comunidad', autor: 'Redacción ConBERTAciones', fecha: '2026-04-02', lectura: 3,
  },
  {
    id: 'b2', tipo: 'blog',
    titulo: 'Cómo la Salsa llevó su ritmo hasta Kentucky',
    excerpt: 'La historia detrás de la comunidad salsera de Louisville y cómo nuestros inmigrantes trajeron su música y alegría al sur de EE.UU.',
    contenido: '<p>Pocos imaginaban que en las orillas del río Ohio florecería una escena salsera tan vibrante. Y sin embargo, cada viernes por la noche, cientos de personas se reúnen en salones de Louisville al ritmo del timbal, el bajo y la trompeta.</p><p>Todo comenzó en los años 90, cuando las primeras familias puertorriqueñas y colombianas encontraron en la música una forma de preservar su identidad en medio de una ciudad que aún no las conocía. Hoy, Louisville tiene instructores certificados, competencias regionales y una escena que atrae visitantes de Tennessee, Indiana y Ohio.</p><p><em>La cultura latina se siembra en donde el corazón la lleva.</em></p>',
    imagen: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
    categoria: 'Cultura', autor: 'Carlos Medina', fecha: '2026-04-05', lectura: 6,
  },
];

// ─── EVENTOS DATA ─────────────────────────────────────────────────────────────
const defaultEventos = [
  {
    id: 'e1', nombre: 'Noche de Talentos Latinos',
    fecha: '2026-04-28', hora: '7:00 PM',
    lugar: 'Actors Theatre of Louisville',
    direccion: '316 W Main St, Louisville, KY 40202',
    organizador: 'Casa Latina Louisville',
    descripcion: 'Una velada de música, danza y expresión artística de nuestra comunidad. Entrada gratuita. Habrá comida típica y espacio para niños.',
    imagen: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    tipo: 'Cultural', gratis: true,
  },
  {
    id: 'e2', nombre: 'Feria Comunitaria Latina 2026',
    fecha: '2026-05-03', hora: '10:00 AM – 5:00 PM',
    lugar: 'Shelby Park',
    direccion: '600 E Oak St, Louisville, KY 40203',
    organizador: 'Louisville Latino Alliance',
    descripcion: 'Comida, artesanías, música en vivo y recursos comunitarios para toda la familia. Más de 40 organizaciones participando.',
    imagen: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    tipo: 'Familia', gratis: true,
  },
  {
    id: 'e3', nombre: 'Conversatorio: Educación y Futuro Bilingüe',
    fecha: '2026-05-07', hora: '6:30 PM',
    lugar: 'Biblioteca Pública – Highlands Branch',
    direccion: '1000 Bardstown Rd, Louisville, KY 40204',
    organizador: 'JCPS Bilingual Programs',
    descripcion: 'Panel de educadores y padres sobre el impacto de los programas bilingües. Moderado por Berta Weyenberg.',
    imagen: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    tipo: 'Educación', gratis: true,
  },
  {
    id: 'e4', nombre: 'Noche de Salsa en el Cardinal',
    fecha: '2026-05-10', hora: '8:00 PM',
    lugar: 'Cardinal Bar',
    direccion: '2600 S 4th St, Louisville, KY 40208',
    organizador: 'Louisville Salsa Community',
    descripcion: 'Música en vivo con orquesta latina. Clases para principiantes a las 7 PM incluidas. Ambiente familiar.',
    imagen: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
    tipo: 'Cultural', gratis: false,
  },
  {
    id: 'e5', nombre: 'Taller: Emprendimiento Latino en KY',
    fecha: '2026-05-14', hora: '5:00 PM',
    lugar: 'Metro United Way',
    direccion: '325 W Main St, Louisville, KY 40202',
    organizador: 'Kentucky Hispanic Education Alliance',
    descripcion: 'Recursos, financiamiento y mentoría para emprendedores latinos. Certificado de participación incluido.',
    imagen: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    tipo: 'Negocios', gratis: true,
  },
];

// ─── DIRECTORIO DATA ──────────────────────────────────────────────────────────
const defaultNegocios = [
  {
    id: 'd1', nombre: 'La Paloma Restaurant', categoria: 'Restaurantes', destacado: true,
    descripcion: 'Auténtica cocina mexicana en el corazón de Louisville. Mariscos frescos, tacos artesanales y las mejores margaritas de la ciudad.',
    imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    telefono: '(502) 555-0123', web: '', instagram: 'https://instagram.com',
    direccion: '1420 S 4th St, Louisville, KY', horario: 'Lun-Dom: 11 AM – 10 PM', rating: 4.8,
  },
  {
    id: 'd2', nombre: 'Casa Latina Louisville', categoria: 'Servicios', destacado: true,
    descripcion: 'Centro comunitario con servicios de traducción, orientación migratoria gratuita, clases de inglés y apoyo integral a familias.',
    imagen: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    telefono: '(502) 555-0187', web: 'https://casalatinalouisville.org', instagram: '',
    direccion: '800 S Floyd St, Louisville, KY', horario: 'Lun-Vie: 9 AM – 5 PM', rating: 4.9,
  },
  {
    id: 'd3', nombre: 'Dra. Maria Santos – Medicina Familiar', categoria: 'Salud', destacado: false,
    descripcion: 'Médica bilingüe especializada en medicina familiar. Atención primaria, pediátrica y preventiva completamente en español.',
    imagen: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    telefono: '(502) 555-0245', web: '', instagram: '',
    direccion: '2600 Bardstown Rd, Louisville, KY', horario: 'Lun-Vie: 8 AM – 4 PM', rating: 4.7,
  },
  {
    id: 'd4', nombre: 'Ley & Asociados', categoria: 'Legal', destacado: false,
    descripcion: 'Especialistas en derecho migratorio, laboral y familiar. Consulta inicial gratuita en español. Más de 15 años de experiencia.',
    imagen: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    telefono: '(502) 555-0312', web: '', instagram: '',
    direccion: '400 W Market St, Louisville, KY', horario: 'Lun-Vie: 9 AM – 6 PM', rating: 4.6,
  },
  {
    id: 'd5', nombre: 'Envision Radio 1490 AM', categoria: 'Medios', destacado: true,
    descripcion: 'La radio latina de Louisville. Noticias, música regional, deportes y programas comunitarios en español las 24 horas.',
    imagen: '/envision_radio.png',
    telefono: '(502) 555-0399', web: 'https://envisionradio.com', instagram: 'https://instagram.com',
    direccion: '612 S 4th St, Louisville, KY', horario: '24/7 en el aire', rating: 4.5,
  },
  {
    id: 'd6', nombre: 'Panadería El Sol', categoria: 'Restaurantes', destacado: false,
    descripcion: 'Pan artesanal, tamales, pasteles de tres leches y antojitos mexicanos y centroamericanos frescos cada día.',
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    telefono: '(502) 555-0456', web: '', instagram: 'https://instagram.com',
    direccion: '2810 Portland Ave, Louisville, KY', horario: 'Mar-Dom: 7 AM – 7 PM', rating: 4.9,
  },
  {
    id: 'd7', nombre: 'Kentucky Hispanic Education Alliance', categoria: 'Educación', destacado: false,
    descripcion: 'Becas, tutorías y orientación universitaria para jóvenes latinos en Kentucky. Servicios gratuitos para estudiantes.',
    imagen: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    telefono: '(502) 555-0511', web: 'https://khea.org', instagram: 'https://instagram.com',
    direccion: '325 W Main St, Louisville, KY', horario: 'Lun-Vie: 9 AM – 5 PM', rating: 4.8,
  },
  {
    id: 'd8', nombre: 'Latino Motors', categoria: 'Servicios', destacado: false,
    descripcion: 'Taller mecánico de confianza con más de 15 años sirviendo a la comunidad. Diagnóstico gratis y precios justos.',
    imagen: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    telefono: '(502) 555-0622', web: '', instagram: '',
    direccion: '1504 S Shelby St, Louisville, KY', horario: 'Lun-Sáb: 8 AM – 6 PM', rating: 4.4,
  },
];

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [prevView, setPrevView] = useState('home');
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [activeReflection, setActiveReflection] = useState(null);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Player simulation states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSecs, setCurrentTimeSecs] = useState(0);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);

  const defaultProfile = { facebook: '', instagram: '', linkedin: '', youtube: '', website: '' };

  const [loading, setLoading] = useState(true);
  const [profileSettings, setProfileSettings] = useState(defaultProfile);
  const [episodes, setEpisodes] = useState([]);
  const [guests, setGuests] = useState([]);
  const [savedEpisodes, setSavedEpisodes] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [noticias, setNoticias] = useState([]);

  // Audio Player states and refs
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');

  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Load initial data from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        await openDB();

        // 1. Profile Settings
        let storedProfile = await getAll('profile');
        let currentProfile = defaultProfile;
        if (storedProfile && storedProfile.length > 0) {
          currentProfile = storedProfile[0];
        } else {
          try {
            const lsProfile = JSON.parse(localStorage.getItem('conbertaciones_profile'));
            if (lsProfile) currentProfile = lsProfile;
          } catch (e) {}
          currentProfile.id = 'default_profile';
          await put('profile', currentProfile);
        }
        setProfileSettings(currentProfile);

        // 2. Episodes
        let storedEpisodes = await getAll('episodes');
        if (!storedEpisodes || storedEpisodes.length === 0) {
          try {
            const lsEp = JSON.parse(localStorage.getItem('conbertaciones_episodes_v2'));
            if (lsEp && lsEp.length > 0) storedEpisodes = lsEp;
          } catch (e) {}
          
          if (!storedEpisodes || storedEpisodes.length === 0) {
            storedEpisodes = defaultEpisodes;
          }
          for (const ep of storedEpisodes) {
            await put('episodes', ep);
          }
        }
        setEpisodes(storedEpisodes);

        // 3. Guests
        let storedGuests = await getAll('guests');
        if (!storedGuests || storedGuests.length === 0) {
          try {
            const lsGuests = JSON.parse(localStorage.getItem('conbertaciones_guests'));
            if (lsGuests && lsGuests.length > 0) storedGuests = lsGuests;
          } catch (e) {}

          if (!storedGuests || storedGuests.length === 0) {
            storedGuests = defaultGuests;
          }
          for (const g of storedGuests) {
            await put('guests', g);
          }
        }
        setGuests(storedGuests);

        // 4. Reflections
        let storedReflections = await getAll('reflections');
        if (!storedReflections || storedReflections.length === 0) {
          try {
            const lsRef = JSON.parse(localStorage.getItem('conbertaciones_reflections_v2'));
            if (lsRef && lsRef.length > 0) storedReflections = lsRef;
          } catch (e) {}

          if (!storedReflections || storedReflections.length === 0) {
            storedReflections = [{
              id: '1', titleEn: 'The Power of Resilience', titleEs: 'El Poder de la Resiliencia',
              contentEn: '<p>Sometimes the hardest part of the journey is simply taking the first step.</p>',
              contentEs: '<p>A veces, la parte más difícil del viaje es simplemente dar el primer paso.</p>',
              videoEn: '', videoEs: '',
              thumbnail: '/cover_art_games.png',
            }];
          }
          for (const r of storedReflections) {
            await put('reflections', r);
          }
        }
        setReflections(storedReflections);

        // 5. Noticias
        let storedNoticias = await getAll('noticias');
        if (!storedNoticias || storedNoticias.length === 0) {
          storedNoticias = defaultNoticias;
          for (const n of storedNoticias) {
            await put('noticias', n);
          }
        }
        setNoticias(storedNoticias);

        // 6. Saved episodes (keep in LocalStorage for convenience)
        try {
          const lsSaved = JSON.parse(localStorage.getItem('conbertaciones_saved')) || [];
          setSavedEpisodes(lsSaved);
        } catch (e) {}

      } catch (err) {
        console.error("Failed to load IndexedDB data", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Save savedEpisodes to localStorage when modified
  useEffect(() => {
    localStorage.setItem('conbertaciones_saved', JSON.stringify(savedEpisodes));
  }, [savedEpisodes]);

  // Audio URL generation and cleanup
  useEffect(() => {
    if (!activeEpisode) {
      setAudioSrc('');
      return;
    }
    let url = '';
    if (activeEpisode.audioFile) {
      url = URL.createObjectURL(activeEpisode.audioFile);
    } else if (activeEpisode.audioUrl) {
      url = activeEpisode.audioUrl;
    }
    setAudioSrc(url);

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [activeEpisode]);

  // Real audio playback control
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio play failed or was interrupted:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);

  const navigate = (view) => { setPrevView(currentView); setCurrentView(view); };
  const goBack = () => setCurrentView(prevView);

  const toggleSaveEpisode = (id) => {
    if (savedEpisodes.includes(id)) {
      setSavedEpisodes(s => s.filter(e => e !== id));
      triggerToast('Eliminado de tus Guardados');
    } else {
      setSavedEpisodes(s => [...s, id]);
      triggerToast('¡Añadido a tus Favoritos!');
    }
  };

  // State modification handlers synced with IndexedDB
  const handleUpdateProfile = async (newProfile) => {
    try {
      newProfile.id = 'default_profile';
      await put('profile', newProfile);
      setProfileSettings(newProfile);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateReflections = async (newReflections) => {
    try {
      for (const r of newReflections) {
        await put('reflections', r);
      }
      setReflections(newReflections);
    } catch (e) {
      console.error(e);
    }
  };

  const addEpisode = async (ep) => {
    try {
      const newEp = { ...ep, id: Date.now().toString() };
      await put('episodes', newEp);
      setEpisodes(s => [newEp, ...s]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateEpisode = async (ep) => {
    try {
      await put('episodes', ep);
      setEpisodes(s => s.map(e => e.id === ep.id ? ep : e));
      if (activeEpisode && activeEpisode.id === ep.id) {
        setActiveEpisode(ep);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEpisode = async (id) => {
    try {
      await deleteItem('episodes', id);
      setEpisodes(s => s.filter(e => e.id !== id));
      if (activeEpisode && activeEpisode.id === id) {
        setActiveEpisode(null);
        setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addGuest = async (g) => {
    try {
      const newGuest = { ...g, id: 'g_' + Date.now().toString() };
      await put('guests', newGuest);
      setGuests(s => [newGuest, ...s]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateGuest = async (g) => {
    try {
      await put('guests', g);
      setGuests(s => s.map(x => x.id === g.id ? g : x));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteGuest = async (id) => {
    try {
      await deleteItem('guests', id);
      setGuests(s => s.filter(g => g.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNoticia = async (n) => {
    try {
      const newNoticia = { ...n, id: 'n_' + Date.now().toString() };
      await put('noticias', newNoticia);
      setNoticias(s => [newNoticia, ...s]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateNoticia = async (n) => {
    try {
      await put('noticias', n);
      setNoticias(s => s.map(x => x.id === n.id ? n : x));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteNoticia = async (id) => {
    try {
      await deleteItem('noticias', id);
      setNoticias(s => s.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleImportBackup = async (data) => {
    try {
      await clearStore('episodes');
      await clearStore('guests');
      await clearStore('reflections');
      await clearStore('noticias');
      await clearStore('profile');

      if (data.episodes) {
        for (const ep of data.episodes) {
          await put('episodes', ep);
        }
        setEpisodes(data.episodes);
      }
      if (data.guests) {
        for (const g of data.guests) {
          await put('guests', g);
        }
        setGuests(data.guests);
      }
      if (data.reflections) {
        for (const r of data.reflections) {
          await put('reflections', r);
        }
        setReflections(data.reflections);
      }
      if (data.noticias) {
        for (const n of data.noticias) {
          await put('noticias', n);
        }
        setNoticias(data.noticias);
      }
      if (data.profileSettings) {
        const p = { ...data.profileSettings, id: 'default_profile' };
        await put('profile', p);
        setProfileSettings(p);
      }
    } catch (e) {
      console.error("Failed to import backup:", e);
      throw e;
    }
  };

  // Audio Player helpers
  const durationToSeconds = (dur) => {
    if (!dur) return 300;
    const parts = dur.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 300;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const openPlayer = (episode) => {
    setActiveEpisode(episode);
    setIsPlaying(true);
    setCurrentTimeSecs(0);
    triggerToast(`Escuchando: ${episode.title.split('|')[0]}`);
  };

  const openReflection = (r) => { 
    setActiveReflection(r); 
    navigate('reflection'); 
  };

  const closeReflection = () => activePlaylist ? setCurrentView('playlist') : setCurrentView('podcast');
  const openPlaylist = (lang) => { setActivePlaylist(lang); navigate('playlist'); };
  const closePlaylist = () => { setActivePlaylist(null); setCurrentView('podcast'); };
  const openArticle = (article) => { setActiveArticle(article); navigate('article'); };
  const closeArticle = () => setCurrentView('noticias');
  const openProfile = () => navigate('profile');

  // Simulated player ticking (only runs when there is no real audio playing)
  useEffect(() => {
    let timer;
    if (isPlaying && activeEpisode && !audioSrc) {
      const totalSecs = durationToSeconds(activeEpisode.duration);
      timer = setInterval(() => {
        setCurrentTimeSecs(s => {
          if (s >= totalSecs) {
            setIsPlaying(false);
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeEpisode, audioSrc]);

  // Handle time update for real audio playback
  const handleTimeUpdate = (e) => {
    if (audioSrc) {
      setCurrentTimeSecs(Math.floor(e.target.currentTime));
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTimeSecs(0);
  };

  const activeEpisodeTotalSecs = activeEpisode ? durationToSeconds(activeEpisode.duration) : 300;
  const playerPercent = activeEpisode ? (currentTimeSecs / activeEpisodeTotalSecs) * 100 : 0;

  const FULLSCREEN = ['reflection', 'playlist', 'admin', 'article', 'profile'];
  const showNav = !FULLSCREEN.includes(currentView);

  const menuItems = [
    { id: 'home', label: 'Inicio', icon: <Home size={18} /> },
    { id: 'podcast', label: 'ConBERTAciones', icon: <Mic size={18} /> },
    { id: 'umbrella', label: 'Under Umbrella', icon: <BookOpen size={18} /> },
    { id: 'speaker', label: 'Public Speaker', icon: <Award size={18} /> },
    { id: 'noticias', label: 'Noticias & Blog', icon: <Newspaper size={18} /> },
    { id: 'negocios', label: 'Negocios', icon: <Briefcase size={18} /> },
    { id: 'eventos', label: 'Eventos', icon: <Calendar size={18} /> },
    { id: 'conecta', label: 'Conecta', icon: <Mail size={18} /> },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #792359 0%, #da51f6 100%)',
        color: '#fffff2',
        fontFamily: 'var(--font-sans)',
        gap: '16px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,242,0.3)',
          borderTopColor: '#fffff2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>ConBERTAciones...</span>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ── Desktop Navigation Sidebar ── */}
      <aside className="desktop-sidebar">
        <div>
          <div className="sidebar-logo">
            <img src="/logo.png" alt="ConBERTAciones Logo" />
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>ConBERTAciones</h2>
          </div>
          <nav className="sidebar-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`sidebar-btn ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' }} onClick={openProfile}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--accent-purple)', overflow: 'hidden' }}>
              <img src="/berta.jpeg" alt="Berta Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Berta Weyenberg</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ver Perfil / Admin</div>
            </div>
          </div>
          <div className="sidebar-footer-text">ConBERTAciones © 2026</div>
          <div className="sidebar-footer-text" style={{ opacity: 0.6 }}>Louisville, Kentucky</div>
        </div>
      </aside>

      {/* ── Main View Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        
        {/* Mobile Header */}
        <header className="mobile-header">
          <button className="sidebar-btn" style={{ padding: 4, width: 'auto' }} onClick={() => setIsDrawerOpen(true)}>
            <Menu size={22} style={{ color: 'var(--text-primary)' }} />
          </button>
          <img src="/logo.png" alt="ConBERTAciones Logo" className="mobile-header-logo" />
          <div className="mobile-header-profile" onClick={openProfile}>
            <img src="/berta.jpeg" alt="Profile" />
          </div>
        </header>

        {/* Mobile Slide-out Drawer Overlay */}
        <div className={`drawer-overlay ${isDrawerOpen ? 'active' : ''}`} onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <img src="/logo.png" alt="ConBERTAciones Logo" className="drawer-logo" />
              <button className="sidebar-btn" style={{ padding: 4, width: 'auto' }} onClick={() => setIsDrawerOpen(false)}>
                <X size={22} style={{ color: 'var(--text-primary)' }} />
              </button>
            </div>
            <div className="drawer-links">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`drawer-link ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsDrawerOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="drawer-footer">
              <div className="drawer-footer-text">ConBERTAciones © 2026</div>
              <div className="drawer-footer-text" style={{ opacity: 0.6 }}>Louisville, Kentucky</div>
            </div>
          </div>
        </div>

        <main className="main-content">
          {toast && <div className="toast-msg">{toast}</div>}

          {/* View Dispatcher */}
          <div style={{ display: currentView === 'home' ? 'block' : 'none' }}>
            <HomeView
              episodes={episodes} reflections={reflections}
              noticias={noticias} eventos={defaultEventos} negocios={defaultNegocios}
              onPlay={openPlayer} onOpenPlaylist={openPlaylist} onOpenArticle={openArticle}
              onNavigate={setCurrentView} onOpenProfile={openProfile}
              savedEpisodes={savedEpisodes} onToggleSave={toggleSaveEpisode}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'podcast' ? 'block' : 'none' }}>
            <PodcastView
              episodes={episodes} guests={guests} reflections={reflections}
              savedEpisodes={savedEpisodes}
              onPlay={openPlayer} onOpenReflection={openReflection}
              onOpenPlaylist={openPlaylist} onToggleSave={toggleSaveEpisode}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'noticias' ? 'block' : 'none' }}>
            <NoticiasView
              noticias={noticias}
              onOpenArticle={openArticle}
            />
          </div>

          <div style={{ display: currentView === 'umbrella' ? 'block' : 'none' }}>
            <UnderTheUmbrellaView
              reflections={reflections}
              onOpenPlaylist={openPlaylist}
              onOpenReflection={openReflection}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'speaker' ? 'block' : 'none' }}>
            <PublicSpeakerView
              onNavigate={setCurrentView}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'negocios' ? 'block' : 'none' }}>
            <DirectorioView
              negocios={defaultNegocios}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'eventos' ? 'block' : 'none' }}>
            <EventosView
              eventos={defaultEventos}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'conecta' ? 'block' : 'none' }}>
            <ConectaView
              profileSettings={profileSettings}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          {/* Overlays / Fullscreen Panel Components */}
          {currentView === 'reflection' && activeReflection && (
            <ReflectionView reflection={activeReflection} onClose={closeReflection} triggerToast={triggerToast} />
          )}
          {currentView === 'playlist' && activePlaylist && (
            <UmbrellaPlaylistView
              reflections={reflections.filter(r => activePlaylist === 'en' ? (r.videoEn || r.contentEn) : (r.videoEs || r.contentEs))}
              language={activePlaylist} onClose={closePlaylist} onPlayVideo={openReflection}
            />
          )}
          {currentView === 'article' && activeArticle && (
            <ArticleView article={activeArticle} onClose={closeArticle} />
          )}
          {currentView === 'profile' && (
            <ProfileView onOpenAdmin={() => navigate('admin')}
              profileSettings={profileSettings} onClose={goBack} />
          )}
          {currentView === 'admin' && (
            <AdminView
              episodes={episodes} guests={guests} profileSettings={profileSettings}
              onUpdateProfile={handleUpdateProfile} reflections={reflections}
              onUpdateReflections={handleUpdateReflections}
              noticias={noticias}
              onAddNoticia={handleAddNoticia}
              onUpdateNoticia={handleUpdateNoticia}
              onDeleteNoticia={handleDeleteNoticia}
              onImportBackup={handleImportBackup}
              onAdd={addEpisode} onUpdate={updateEpisode} onDelete={deleteEpisode}
              onAddGuest={addGuest} onUpdateGuest={updateGuest} onDeleteGuest={deleteGuest}
              onClose={() => setCurrentView('profile')} triggerToast={triggerToast}
            />
          )}
        </main>

        {/* ── Persistent Bottom Media Player Bar ── */}
        {activeEpisode && (
          <div className="persistent-player" style={{ height: isPlayerExpanded ? 'auto' : '76px' }}>
            <div className="player-main-row">
              <div className="player-track-info" onClick={() => setIsPlayerExpanded(!isPlayerExpanded)} style={{ cursor: 'pointer' }}>
                <div className="player-art">
                  <img src={activeEpisode.art || '/cover_art_games.png'} alt={activeEpisode.title} />
                </div>
                <div className="player-meta">
                  <div className="player-title">{activeEpisode.title.split('|')[0]}</div>
                  <div className="player-subtitle">{activeEpisode.host || 'Berta Weyenberg'}</div>
                </div>
              </div>
              
              <div className="player-controls">
                <button className="player-btn" onClick={() => toggleSaveEpisode(activeEpisode.id)}>
                  <Plus size={20} style={{ color: savedEpisodes.includes(activeEpisode.id) ? 'var(--accent-purple)' : 'inherit', transform: savedEpisodes.includes(activeEpisode.id) ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <button className="player-btn player-btn-play" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: '1.5px' }} />}
                </button>
                <button className="player-btn" onClick={() => setIsPlayerExpanded(!isPlayerExpanded)}>
                  {isPlayerExpanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
                </button>
              </div>
            </div>

            {/* Expanded section details */}
            {isPlayerExpanded && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <div className="player-progress-row">
                  <span className="player-time">{formatTime(currentTimeSecs)}</span>
                  <div className="player-bar-container" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    const targetSecs = Math.floor(percent * activeEpisodeTotalSecs);
                    setCurrentTimeSecs(targetSecs);
                    if (audioRef.current && audioSrc) {
                      audioRef.current.currentTime = targetSecs;
                    }
                  }}>
                    <div className="player-bar-fill" style={{ width: `${playerPercent}%` }}></div>
                  </div>
                  <span className="player-time">{activeEpisode.duration}</span>
                </div>
                
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Acerca del Episodio</h4>
                  <p>
                    Escucha esta ConBERTAción inspiradora conducida por Berta Weyenberg. Este episodio aborda lecciones de fe práctica, motivación diaria y desarrollo comunitario en Louisville, KY.
                  </p>
                </div>
              </div>
            )}
            
            {/* Minimized Progress Bar along the very top edge of the player */}
            {!isPlayerExpanded && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.05)' }}>
                <div style={{ height: '100%', background: 'var(--grad-sunset)', width: `${playerPercent}%` }}></div>
              </div>
            )}
          </div>
        )}

        {/* ── Mobile Bottom Navigation — 5 quick-access tabs ── */}
        {showNav && (
          <nav className="bottom-nav">
            <button className={`nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
              <div className="nav-dot" style={{ opacity: currentView === 'home' ? 1 : 0 }} />
              <Home size={20} />
              <span className="nav-label">Inicio</span>
            </button>
            <button className={`nav-item ${currentView === 'podcast' ? 'active' : ''}`} onClick={() => setCurrentView('podcast')}>
              <div className="nav-dot" style={{ opacity: currentView === 'podcast' ? 1 : 0 }} />
              <Mic size={20} />
              <span className="nav-label">Podcast</span>
            </button>
            <button className={`nav-item ${currentView === 'umbrella' ? 'active' : ''}`} onClick={() => setCurrentView('umbrella')}>
              <div className="nav-dot" style={{ opacity: currentView === 'umbrella' ? 1 : 0 }} />
              <BookOpen size={20} />
              <span className="nav-label">Umbrella</span>
            </button>
            <button className={`nav-item ${currentView === 'negocios' ? 'active' : ''}`} onClick={() => setCurrentView('negocios')}>
              <div className="nav-dot" style={{ opacity: currentView === 'negocios' ? 1 : 0 }} />
              <Briefcase size={20} />
              <span className="nav-label">Negocios</span>
            </button>
            <button className={`nav-item ${currentView === 'conecta' ? 'active' : ''}`} onClick={() => setCurrentView('conecta')}>
              <div className="nav-dot" style={{ opacity: currentView === 'conecta' ? 1 : 0 }} />
              <Mail size={20} />
              <span className="nav-label">Conecta</span>
            </button>
          </nav>
        )}
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />
    </div>
  );
}

export default App;
