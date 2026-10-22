import React, { useState, useEffect, useRef } from 'react';
import { Home, Mic, Newspaper, Calendar, MapPin, Menu, X, BookOpen, Award, Briefcase, Mail, Plus, Play, Pause, ChevronDown, ChevronUp, Scale, PenTool } from 'lucide-react';
import HomeView from './components/HomeView';
import PodcastView from './components/PodcastView';
import UnderTheUmbrellaView from './components/UnderTheUmbrellaView';
import WeyenbergStatementView from './components/WeyenbergStatementView';
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
import { useLanguage, LanguageSwitch } from './utils/i18n.jsx';
import {
  getInitialSpotifyInterviews,
  getInitialSpotifyReflections,
  syncSpotifyContent,
  CONBERTACIONES_SPOTIFY_URL,
} from './utils/spotify';

// ─── PODCAST DATA (ConBERTAciones = Entrevistas | Under the Umbrella = Reflexiones) ───
const defaultEpisodes = getInitialSpotifyInterviews();
const defaultReflections = getInitialSpotifyReflections();

const defaultGuests = [
  {
    id: 'g_rachel',
    name: 'Rachel Greenberg',
    business: 'Primera Dama de Louisville',
    businessEn: 'First Lady of Louisville',
    bio: 'Conversación íntima uno a uno con Berta sobre liderazgo comunitario, familia y el futuro de Louisville.',
    bioEn: 'Intimate one-on-one conversation with Berta about community leadership, family, and the future of Louisville.',
    bgPhoto: 'https://i.scdn.co/image/ab6765630000ba8a3621f8847b2a7f7c0b402271',
    facebook: '',
    instagram: 'https://instagram.com',
    linkedin: '',
    youtube: '',
    website: 'https://louisvilleky.gov',
  },
  {
    id: 'g_noemi',
    name: 'Noemi Robinson',
    business: "Tatiana's Light Foundation",
    businessEn: "Tatiana's Light Foundation",
    bio: 'La fe tras la pérdida de su hija y cómo el educar a otros es parte viva del legado de Tatiana.',
    bioEn: 'Faith after the loss of her daughter and how educating others is a living part of Tatiana’s legacy.',
    bgPhoto: 'https://i.scdn.co/image/ab6765630000ba8a3621f8847b2a7f7c0b402271',
    facebook: 'https://www.facebook.com/share/g/18mjhiSMHK/',
    instagram: '',
    linkedin: '',
    youtube: '',
    website: 'https://www.tatianaslight.org',
  },
  { id: 'g1', name: 'Dr. Hector J. Ruiz', business: 'Lexington Comedy Club', businessEn: 'Lexington Comedy Club', bio: 'Comediante local con más de 10 años haciendo reír a Kentucky.', bioEn: 'Local comedian with over 10 years bringing laughter to Kentucky.', bgPhoto: '/guest_hector.png', facebook: '', instagram: 'https://instagram.com', linkedin: '', youtube: '', website: '' },
  { id: 'g2', name: 'Carlos Aguilera', business: 'Aguilera Tech Hub', businessEn: 'Aguilera Tech Hub', bio: 'Joven emprendedor dominicano enfocado en crear soluciones de IA para la iglesia.', bioEn: 'Young Dominican entrepreneur focused on building AI solutions for the church.', bgPhoto: '/guest_carlos.png', facebook: 'https://facebook.com', instagram: '', linkedin: 'https://linkedin.com', youtube: '', website: '' },
];

// ─── BLOG DE BERTA DATA ──────────────────────────────────────────────────────
const defaultNoticias = [
  {
    id: 'b1',
    tipo: 'blog',
    titulo: 'El poder de la fe en tiempos de incertidumbre',
    tituloEn: 'The Power of Faith in Times of Uncertainty',
    fraseDestacada: 'La fe sigue siendo el ancla que nos mantiene unidos y con esperanza.',
    fraseDestacadaEn: 'Faith remains the anchor that keeps us united and filled with hope.',
    excerpt: 'En medio de los cambios que vivimos como comunidad y como familias, la fe sigue siendo el ancla que nos mantiene unidos y con esperanza.',
    excerptEn: 'Amid the changes we experience as a community and as families, faith remains the anchor that keeps us united and hopeful.',
    contenido: '<p>Querida comunidad: vivimos tiempos que nos piden más de lo que a veces sentimos que podemos dar. Familias separadas, sueños postergados, miedo a lo desconocido. Y sin embargo, aquí estamos. Juntos.</p><p>La fe, para nosotros, es la certeza viva de que Dios sigue guiando nuestro camino. Es la voz que nos recuerda que no estamos solos y el abrazo que sostiene a nuestra familia en cada temporada.</p><p>Esta semana, te invito a detenerte cinco minutos. Respira. Recuerda de dónde vienes. Y confía en el propósito que Dios tiene para tu vida y tu hogar.<br /><br /><em>Con amor y fe, Berta.</em></p>',
    contenidoEn: '<p>Dear community: we live in times that ask more of us than we sometimes feel we can give. Separated families, postponed dreams, fear of the unknown. And yet, here we are. Together.</p><p>Faith, for us, is the living certainty that God continues to guide our path. It is the voice that reminds us we are not alone and the embrace that sustains our family in every season.</p><p>This week, I invite you to pause for five minutes. Breathe. Remember where you come from. And trust the purpose God has for your life and your home.<br /><br /><em>With love and faith, Berta.</em></p>',
    imagen: '/berta.jpeg',
    galeria: [],
    categoria: 'Fe & Esperanza',
    autor: 'Berta Weyenberg',
    fecha: '2026-04-18',
    lectura: 4,
  },
  {
    id: 'b2',
    tipo: 'blog',
    titulo: 'Educar el corazón de nuestros hijos más allá del aula',
    tituloEn: 'Educating Our Children’s Hearts Beyond the Classroom',
    fraseDestacada: 'Cada niño que crece con valores firmes y amor en casa lleva consigo un regalo para toda la vida.',
    fraseDestacadaEn: 'Every child who grows up with strong values and love at home carries a gift for a lifetime.',
    excerpt: 'Reflexión sobre el privilegio de acompañar a nuestros estudiantes e hijos en su crecimiento académico, emocional y espiritual.',
    excerptEn: 'A reflection on the privilege of guiding our students and children in their academic, emotional, and spiritual growth.',
    contenido: '<p>Después de tantos años en el salón de clases y acompañando a padres de familia, he comprobado una verdad: los niños aprenden tanto de lo que ven en nuestra vida diaria como de los libros que leen.</p><p>Educar requiere paciencia, presencia e intencionalidad. Cuando escuchamos a nuestros hijos, celebramos su esfuerzo y los corregimos con amor y sabiduría, sembramos semillas que darán fruto por generaciones.</p><p>Nunca subestimes el impacto de una palabra de aliento en la mesa familiar antes de empezar el día.</p>',
    contenidoEn: '<p>After so many years in the classroom and walking alongside parents, I have witnessed one truth: children learn just as much from what they see in our daily lives as from the books they read.</p><p>Educating requires patience, presence, and intentionality. When we listen to our children, celebrate their effort, and guide them with love and wisdom, we plant seeds that will bear fruit for generations.</p><p>Never underestimate the impact of an encouraging word around the family table before starting the day.</p>',
    imagen: '/cover_art_games.png',
    galeria: [],
    categoria: 'Familia & Educación',
    autor: 'Berta Weyenberg',
    fecha: '2026-04-12',
    lectura: 5,
  },
  {
    id: 'b3',
    tipo: 'blog',
    titulo: 'Gratitud cotidiana: encontrar propósito bajo la sombrilla',
    tituloEn: 'Everyday Gratitude: Finding Purpose Under the Umbrella',
    fraseDestacada: 'Aún en los días de lluvia, siempre hay refugio, enseñanza y motivo para agradecer.',
    fraseDestacadaEn: 'Even on rainy days, there is always shelter, wisdom, and a reason to be thankful.',
    excerpt: 'Pequeñas pausas para reflexionar en medio de la rutina diaria y descubrir cómo Dios obra en cada detalle.',
    excerptEn: 'Small pauses to reflect in the middle of our daily routine and discover how God works in every detail.',
    contenido: '<p>A veces esperamos grandes acontecimientos para sentirnos agradecidos, pero la verdadera plenitud se construye en los detalles sencillos de cada mañana: una conversación sincera, una oración en familia, la oportunidad de servir a alguien que necesita ánimo.</p><p>En este blog quiero compartir contigo esas reflexiones e imágenes que van marcando nuestro caminar en ConBERTAciones y Under the Umbrella.</p>',
    contenidoEn: '<p>Sometimes we wait for major events to feel grateful, yet true fullness is built in the simple details of every morning: a sincere conversation, a family prayer, the opportunity to serve someone who needs encouragement.</p><p>In this blog I want to share with you those reflections and images that mark our journey in ConBERTAciones and Under the Umbrella.</p>',
    imagen: '/logo.png',
    galeria: [],
    categoria: 'Reflexiones',
    autor: 'Berta Weyenberg',
    fecha: '2026-04-05',
    lectura: 3,
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
  const { tr } = useLanguage();
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

  const defaultStatements = [
    {
      id: 'ws_1',
      titulo: 'Discernimiento en Tiempos de Confusión Cultural',
      tituloEn: 'Discernment in Times of Cultural Confusion',
      categoria: 'Cultura & Verdad Bíblica',
      versiculo: 'Romanos 12:2 — "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento"',
      versiculoEn: 'Romans 12:2 — "Do not conform to the pattern of this world, but be transformed by the renewing of your mind"',
      autor: 'Familia Weyenberg',
      fecha: 'Octubre 2026',
      imagen: '/berta.jpeg',
      galeria: [],
      facebookUrl: '',
      resumen: 'Como familia creemos que cada fenómeno de nuestra actualidad no debe analizarse desde la reacción emocional ni las modas pasajeras, sino a través del estándar eterno e inmutable de la Palabra de Dios.',
      resumenEn: 'As a family, we believe that every phenomenon of our current times should not be analyzed through emotional reaction or passing trends, but through the eternal and unchanging standard of the Word of God.',
      contenido: '<p>Vivimos en una época donde las corrientes de opinión cambian cada semana y donde la cultura intenta redefinir constantemente lo que es verdadero, bueno y justo. Sin embargo, como familia comprometida con la verdad bíblica, sostenemos que el creyente está llamado a ejercer un discernimiento profundo y compasivo.</p><p>Analizar los fenómenos actuales con un lente bíblico significa preguntar siempre: <strong>¿Qué dice la Escritura sobre la naturaleza humana, la familia, la justicia y la redención?</strong> Cuando miramos los titulares a través de Romanos 12:2, entendemos que nuestra mente necesita ser renovada diariamente por la Palabra para no ser arrastrados por el espíritu de la época.</p><p>Nuestro compromiso en <em>The Weyenberg Statement</em> es compartir reflexiones claras, fundamentadas en principios bíblicos eternos, que edifiquen a las familias y fortalezcan nuestra fe en medio de los desafíos del mundo contemporáneo.</p>',
      contenidoEn: '<p>We live in an era where currents of opinion shift every week and culture constantly attempts to redefine what is true, good, and just. Yet as a family committed to biblical truth, we hold that believers are called to exercise deep and compassionate discernment.</p><p>Analyzing current events through a biblical lens means always asking: <strong>What does Scripture say about human nature, family, justice, and redemption?</strong> When we look at the headlines through Romans 12:2, we understand that our minds must be renewed daily by the Word so we are not swept away by the spirit of the age.</p><p>Our commitment in <em>The Weyenberg Statement</em> is to share clear reflections grounded in eternal biblical principles that build up families and strengthen our faith amid the challenges of the contemporary world.</p>',
    },
    {
      id: 'ws_2',
      titulo: 'La Educación de los Hijos: Una Responsabilidad Diseñada por Dios',
      tituloEn: 'The Education of Children: A God-Designed Responsibility',
      categoria: 'Educación & Valores',
      versiculo: 'Deuteronomio 6:6-7 — "Y estas palabras que yo te mando hoy, estarán sobre tu corazón; y las repetirás a tus hijos"',
      versiculoEn: 'Deuteronomy 6:6-7 — "These commandments that I give you today are to be on your hearts. Impress them on your children"',
      autor: 'Familia Weyenberg',
      fecha: 'Octubre 2026',
      imagen: '/cover_art_games.png',
      galeria: [],
      facebookUrl: '',
      resumen: 'Ante los debates actuales sobre quién debe formar el carácter y la cosmovisión de las nuevas generaciones, la Biblia establece con claridad que el hogar es el primer y principal centro de discipulado y formación.',
      resumenEn: 'Amid current debates over who should shape the character and worldview of the next generation, the Bible clearly establishes that the home is the first and primary center of discipleship and formation.',
      contenido: '<p>Uno de los fenómenos más visibles de nuestra sociedad actual es la delegación total de la formación moral y espiritual de los hijos a las instituciones externas o a las pantallas digitales. Pero desde una cosmovisión bíblica, Dios confirió a los padres el privilegio y la responsabilidad irrenunciable de guiar el corazón de sus hijos.</p><p>En Deuteronomio 6 vemos que la enseñanza de los valores eternos ocurre en la cotidianidad del hogar: al sentarse en casa, al andar por el camino, al acostarse y al levantarse. La escuela instruye en ciencias y habilidades académicas, pero el carácter, la identidad y el temor de Dios se siembran en la mesa familiar.</p><p>Como educadores y como familia, afirmamos que cuando los padres asumen su rol bíblico con amor, intencionalidad y ejemplo, levantamos generaciones firmes, íntegras y preparadas para brillar en cualquier entorno.</p>',
      contenidoEn: '<p>One of the most visible phenomena in our society today is the total delegation of children’s moral and spiritual formation to external institutions or digital screens. Yet from a biblical worldview, God entrusted parents with the privilege and irreplaceable responsibility of guiding their children’s hearts.</p><p>In Deuteronomy 6 we see that teaching eternal values happens in everyday home life: when sitting at home, walking along the road, lying down, and getting up. Schools instruct in sciences and academic skills, but character, identity, and the fear of God are sown around the family table.</p><p>As educators and as a family, we affirm that when parents embrace their biblical role with love, intentionality, and example, we raise up steadfast, upright generations prepared to shine in any environment.</p>',
    },
    {
      id: 'ws_3',
      titulo: 'Paz y Esperanza Soberana Frente a la Incertidumbre Global',
      tituloEn: 'Sovereign Peace and Hope in the Face of Global Uncertainty',
      categoria: 'Actualidad & Fe',
      versiculo: 'Salmos 46:1-2 — "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones"',
      versiculoEn: 'Psalm 46:1-2 — "God is our refuge and strength, an ever-present help in trouble"',
      autor: 'Familia Weyenberg',
      fecha: 'Septiembre 2026',
      imagen: '/logo.png',
      galeria: [],
      facebookUrl: '',
      resumen: 'Frente a la polarización social, las crisis económicas y la ansiedad colectiva que dominan las noticias, recordamos que la historia no está fuera de control: descansa bajo la soberanía de Dios.',
      resumenEn: 'Facing social polarization, economic crises, and collective anxiety dominating the news, we remember that history is not out of control: it rests under the sovereignty of God.',
      contenido: '<p>Al observar las noticias de hoy —conflictos, divisiones sociales e incertidumbre económica— es fácil comprender por qué tantas personas viven bajo un estado constante de temor. Las redes sociales amplifican la alarma, pero rara vez ofrecen una respuesta para el alma.</p><p>El lente bíblico nos permite ver la realidad sin negar los problemas, pero sin perder jamás la perspectiva del Trono de Dios. El Salmo 46 nos recuerda que aunque la tierra tiemble y los escenarios cambien, nuestro refugio permanece inconmovible.</p><p>La respuesta de la familia de fe ante la crisis nunca es el pánico ni el aislamiento, sino ser portadores de paz, verdad y servicio activo en nuestra comunidad.</p>',
      contenidoEn: '<p>Looking at today’s news—conflicts, social divisions, and economic uncertainty—it is easy to understand why so many people live in a constant state of fear. Social media amplifies alarm, yet rarely offers an answer for the soul.</p><p>A biblical lens allows us to see reality without denying problems, while never losing sight of the Throne of God. Psalm 46 reminds us that even though the earth gives way and circumstances shift, our refuge remains unshakable.</p><p>The response of the family of faith in times of crisis is never panic or isolation, but being bearers of peace, truth, and active service in our community.</p>',
    },
  ];

  const [loading, setLoading] = useState(true);
  const [profileSettings, setProfileSettings] = useState(defaultProfile);
  const [episodes, setEpisodes] = useState([]);
  const [guests, setGuests] = useState([]);
  const [savedEpisodes, setSavedEpisodes] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [statements, setStatements] = useState([]);

  // Audio Player states and refs
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [audioDurationSecs, setAudioDurationSecs] = useState(0);
  const [isSyncingSpotify, setIsSyncingSpotify] = useState(false);

  const [toast, setToast] = useState(null);
  const triggerToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleSyncSpotify = async (silent = false) => {
    setIsSyncingSpotify(true);
    try {
      const { interviews, reflections: syncedReflections } = await syncSpotifyContent();
      if (interviews && interviews.length > 0) {
        await clearStore('episodes');
        for (const ep of interviews) {
          await put('episodes', ep);
        }
        setEpisodes(interviews);
      }
      if (syncedReflections && syncedReflections.length > 0) {
        await clearStore('reflections');
        for (const r of syncedReflections) {
          await put('reflections', r);
        }
        setReflections(syncedReflections);
      }
      if (!silent) {
        triggerToast(`Sincronizado con Spotify: ${interviews.length} entrevistas y ${syncedReflections.length} reflexiones`);
      }
    } catch (err) {
      console.error('Error syncing with Spotify:', err);
      if (!silent) {
        triggerToast('Usando catálogo local de Spotify for Creators');
      }
    } finally {
      setIsSyncingSpotify(false);
    }
  };

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

        // 2. Episodes (ConBERTAciones = Entrevistas)
        let storedEpisodes = await getAll('episodes');
        const hasLegacyMockEpisodes =
          !storedEpisodes ||
          storedEpisodes.length === 0 ||
          storedEpisodes.every(e => !e.spotifyId && !e.audioUrl);

        if (hasLegacyMockEpisodes) {
          storedEpisodes = defaultEpisodes;
          await clearStore('episodes');
          for (const ep of storedEpisodes) {
            await put('episodes', ep);
          }
        }
        // Sort interviews newest first
        storedEpisodes.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
        setEpisodes(storedEpisodes);

        // 3. Guests
        let storedGuests = await getAll('guests');
        if (!storedGuests || storedGuests.length === 0 || !storedGuests.some(g => g.id === 'g_rachel')) {
          const existingIds = new Set((storedGuests || []).map(g => g.id));
          const mergedGuests = [...defaultGuests, ...(storedGuests || []).filter(g => !existingIds.has(g.id) && g.id !== 'g1' && g.id !== 'g2')];
          storedGuests = mergedGuests;
          await clearStore('guests');
          for (const g of storedGuests) {
            await put('guests', g);
          }
        }
        setGuests(storedGuests);

        // 4. Reflections (Under the Umbrella = Reflexiones Bilingües)
        let storedReflections = await getAll('reflections');
        const hasLegacyMockReflections =
          !storedReflections ||
          storedReflections.length <= 1 ||
          storedReflections.every(r => !r.spotifyIdEs && !r.spotifyIdEn);

        if (hasLegacyMockReflections) {
          storedReflections = defaultReflections;
          await clearStore('reflections');
          for (const r of storedReflections) {
            await put('reflections', r);
          }
        }
        storedReflections.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
        setReflections(storedReflections);

        // 5. Blog de Berta (stored in 'noticias')
        let storedNoticias = await getAll('noticias');
        const hasLegacyNews = !storedNoticias || storedNoticias.length === 0 || storedNoticias.some(n => n.tipo === 'noticia' || (n.id === 'b1' && !n.tituloEn));
        if (hasLegacyNews) {
          const customBlogs = (storedNoticias || []).filter(n => n.tipo === 'blog' && n.id !== 'b1' && n.id !== 'b2' && n.id !== 'b3');
          storedNoticias = [...customBlogs, ...defaultNoticias];
          await clearStore('noticias');
          for (const n of storedNoticias) {
            await put('noticias', n);
          }
        }
        setNoticias(storedNoticias);

        // 6. The Weyenberg Statements
        let storedStatements = await getAll('statements');
        if (!storedStatements || storedStatements.length === 0 || storedStatements.some(st => st.id === 'ws_1' && !st.tituloEn)) {
          const customSt = (storedStatements || []).filter(st => !['ws_1', 'ws_2', 'ws_3'].includes(st.id));
          storedStatements = [...customSt, ...defaultStatements];
          await clearStore('statements');
          for (const st of storedStatements) {
            await put('statements', st);
          }
        }
        setStatements(storedStatements);

        // 7. Saved episodes (keep in LocalStorage for convenience)
        try {
          const lsSaved = JSON.parse(localStorage.getItem('conbertaciones_saved')) || [];
          setSavedEpisodes(lsSaved);
        } catch (e) {}

        // Refresh from live Spotify API in background
        handleSyncSpotify(true);
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

  const handleAddStatement = async (st) => {
    try {
      const newStatement = { ...st, id: 'ws_' + Date.now().toString() };
      await put('statements', newStatement);
      setStatements(s => [newStatement, ...s]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatement = async (st) => {
    try {
      await put('statements', st);
      setStatements(s => s.map(x => x.id === st.id ? st : x));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStatement = async (id) => {
    try {
      await deleteItem('statements', id);
      setStatements(s => s.filter(st => st.id !== id));
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
      await clearStore('statements');
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
      if (data.statements) {
        for (const st of data.statements) {
          await put('statements', st);
        }
        setStatements(data.statements);
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
    setAudioDurationSecs(0);
    triggerToast(`Escuchando: ${episode.title.split('|')[0]}`);
  };

  const playReflectionAudio = (reflection, lang = 'es') => {
    const isEn = lang === 'en' && (reflection.audioEn || reflection.titleEn);
    const title = isEn ? (reflection.titleEn || reflection.titleEs) : (reflection.titleEs || reflection.titleEn);
    const audioUrl = isEn ? (reflection.audioEn || reflection.audioEs) : (reflection.audioEs || reflection.audioEn);
    const duration = isEn ? (reflection.durationEn || reflection.durationEs || '3:00') : (reflection.durationEs || reflection.durationEn || '3:00');
    const spotifyUrl = isEn ? (reflection.spotifyUrlEn || reflection.spotifyUrlEs) : (reflection.spotifyUrlEs || reflection.spotifyUrlEn);
    const description = isEn ? (reflection.rawEn || reflection.rawEs) : (reflection.rawEs || reflection.rawEn);

    openPlayer({
      id: `${reflection.id}_${isEn ? 'en' : 'es'}`,
      title,
      host: `Berta Weyenberg · Reflexión (${isEn ? 'EN' : 'ES'})`,
      category: 'Reflexión · Under the Umbrella',
      duration,
      art: reflection.thumbnail || '/cover_art_games.png',
      audioUrl,
      spotifyUrl,
      description,
    });
  };

  const openReflection = (r) => { 
    setActiveReflection(r); 
    navigate('reflection'); 
  };

  const closeReflection = () => activePlaylist ? setCurrentView('playlist') : setCurrentView('umbrella');
  const openPlaylist = (lang) => { setActivePlaylist(lang); navigate('playlist'); };
  const closePlaylist = () => { setActivePlaylist(null); setCurrentView('umbrella'); };
  const openArticle = (article) => { setActiveArticle(article); navigate('article'); };
  const closeArticle = () => setCurrentView('noticias');
  const openProfile = () => navigate('profile');
  const [adminInitialSection, setAdminInitialSection] = useState('dashboard');
  const openAdminSection = (section = 'dashboard') => {
    setAdminInitialSection(typeof section === 'string' ? section : 'dashboard');
    navigate('admin');
  };

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

  const handleLoadedMetadata = (e) => {
    if (e.target.duration && !isNaN(e.target.duration) && isFinite(e.target.duration)) {
      setAudioDurationSecs(Math.floor(e.target.duration));
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTimeSecs(0);
  };

  const activeEpisodeTotalSecs = audioDurationSecs > 0
    ? audioDurationSecs
    : (activeEpisode ? durationToSeconds(activeEpisode.duration) : 300);
  const playerPercent = activeEpisode ? Math.min(100, (currentTimeSecs / activeEpisodeTotalSecs) * 100) : 0;

  const FULLSCREEN = ['reflection', 'playlist', 'admin', 'profile'];
  const showNav = !FULLSCREEN.includes(currentView);

  const menuItems = [
    { id: 'home', label: tr('Inicio', 'Home'), icon: <Home size={18} /> },
    { id: 'podcast', label: tr('ConBERTAciones (Entrevistas)', 'ConBERTAciones (Interviews)'), icon: <Mic size={18} /> },
    { id: 'umbrella', label: tr('Under the Umbrella (Reflexiones)', 'Under the Umbrella (Reflections)'), icon: <BookOpen size={18} /> },
    { id: 'noticias', label: tr('Blog & Reflexiones', 'Blog & Reflections'), icon: <PenTool size={18} /> },
    { id: 'statement', label: 'The Weyenberg Statement', icon: <Scale size={18} /> },
    { id: 'speaker', label: tr('Agenda una Charla', 'Book a Speaking Event'), icon: <Award size={18} /> },
    { id: 'conecta', label: tr('Conecta', 'Connect'), icon: <Mail size={18} /> },
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
          <div className="sidebar-logo" style={{ marginBottom: '16px' }}>
            <img src="/logo.png" alt="ConBERTAciones Logo" />
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>ConBERTAciones</h2>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <LanguageSwitch compact />
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{tr('Ver Perfil / Admin', 'View Profile / Admin')}</div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageSwitch compact />
            <div className="mobile-header-profile" onClick={openProfile}>
              <img src="/berta.jpeg" alt="Profile" />
            </div>
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

          {/* ── Protagonist Bilingual Switch Bar (ES / EN) ── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
              padding: '10px 18px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(252,244,255,0.92) 100%)',
              border: '1.5px solid rgba(218, 81, 246, 0.28)',
              boxShadow: '0 8px 24px rgba(121, 35, 89, 0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <span style={{ fontSize: '1.05rem' }}>🌐</span>
              <span>
                {tr(
                  'Idioma del sitio: Español (Cambia a Inglés en cualquier momento)',
                  'Site Language: English (Switch to Spanish anytime)'
                )}
              </span>
            </div>
            <LanguageSwitch />
          </div>

          {/* View Dispatcher */}
          <div style={{ display: currentView === 'home' ? 'block' : 'none' }}>
            <HomeView
              episodes={episodes}
              reflections={reflections}
              noticias={noticias}
              statements={statements}
              profileSettings={profileSettings}
              onPlay={openPlayer}
              onOpenPlaylist={openPlaylist}
              onOpenReflection={openReflection}
              onPlayReflectionAudio={playReflectionAudio}
              onNavigate={setCurrentView}
              onOpenProfile={openProfile}
              savedEpisodes={savedEpisodes}
              onToggleSave={toggleSaveEpisode}
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
              onNavigate={setCurrentView}
              onSyncSpotify={() => handleSyncSpotify(false)}
              isSyncingSpotify={isSyncingSpotify}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'umbrella' ? 'block' : 'none' }}>
            <UnderTheUmbrellaView
              reflections={reflections}
              onOpenPlaylist={openPlaylist}
              onOpenReflection={openReflection}
              onPlayReflectionAudio={playReflectionAudio}
              onNavigate={setCurrentView}
              onSyncSpotify={() => handleSyncSpotify(false)}
              isSyncingSpotify={isSyncingSpotify}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'noticias' ? 'block' : 'none' }}>
            <NoticiasView
              noticias={noticias}
              onAddNoticia={handleAddNoticia}
              onUpdateNoticia={handleUpdateNoticia}
              onDeleteNoticia={handleDeleteNoticia}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          <div style={{ display: currentView === 'statement' ? 'block' : 'none' }}>
            <WeyenbergStatementView
              statements={statements}
              onAddStatement={handleAddStatement}
              onUpdateStatement={handleUpdateStatement}
              onDeleteStatement={handleDeleteStatement}
              triggerToast={triggerToast}
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

          <div style={{ display: currentView === 'conecta' ? 'block' : 'none' }}>
            <ConectaView
              profileSettings={profileSettings}
              triggerToast={triggerToast}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          </div>

          {/* Overlays / Fullscreen Panel Components */}
          {currentView === 'reflection' && activeReflection && (
            <ReflectionView
              reflection={activeReflection}
              onClose={closeReflection}
              onPlayReflectionAudio={playReflectionAudio}
              triggerToast={triggerToast}
            />
          )}
          {currentView === 'playlist' && activePlaylist && (
            <UmbrellaPlaylistView
              reflections={reflections.filter(r => activePlaylist === 'en' ? (r.videoEn || r.contentEn) : (r.videoEs || r.contentEs))}
              language={activePlaylist}
              onClose={closePlaylist}
              onPlayVideo={openReflection}
              onPlayReflectionAudio={playReflectionAudio}
            />
          )}
          {currentView === 'profile' && (
            <ProfileView
              onOpenAdmin={openAdminSection}
              profileSettings={profileSettings}
              onClose={goBack}
            />
          )}
          {currentView === 'admin' && (
            <AdminView
              initialSection={adminInitialSection}
              episodes={episodes}
              guests={guests}
              profileSettings={profileSettings}
              onUpdateProfile={handleUpdateProfile}
              reflections={reflections}
              onUpdateReflections={handleUpdateReflections}
              noticias={noticias}
              onAddNoticia={handleAddNoticia}
              onUpdateNoticia={handleUpdateNoticia}
              onDeleteNoticia={handleDeleteNoticia}
              statements={statements}
              onAddStatement={handleAddStatement}
              onUpdateStatement={handleUpdateStatement}
              onDeleteStatement={handleDeleteStatement}
              onImportBackup={handleImportBackup}
              onAdd={addEpisode}
              onUpdate={updateEpisode}
              onDelete={deleteEpisode}
              onAddGuest={addGuest}
              onUpdateGuest={updateGuest}
              onDeleteGuest={deleteGuest}
              onSyncSpotify={() => handleSyncSpotify(false)}
              isSyncingSpotify={isSyncingSpotify}
              onClose={() => setCurrentView('profile')}
              triggerToast={triggerToast}
            />
          )}
        </main>

        {/* ── Persistent Bottom Media Player Bar ── */}
        {activeEpisode && (
          <div className="persistent-player" style={{ height: isPlayerExpanded ? 'auto' : '76px', zIndex: 150 }}>
            <div className="player-main-row">
              <div className="player-track-info" onClick={() => setIsPlayerExpanded(!isPlayerExpanded)} style={{ cursor: 'pointer' }}>
                <div className="player-art">
                  <img src={activeEpisode.art || '/cover_art_games.png'} alt={activeEpisode.title} />
                </div>
                <div className="player-meta">
                  <div className="player-title">{activeEpisode.title.split('|')[0]}</div>
                  <div className="player-subtitle">
                    {activeEpisode.category?.includes('Reflexión') ? '☂️ Reflexión · ' : '🎙️ Entrevista · '}
                    {activeEpisode.host || 'Berta Weyenberg'}
                  </div>
                </div>
              </div>
              
              <div className="player-controls">
                {activeEpisode.spotifyUrl && (
                  <a
                    href={activeEpisode.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="player-btn"
                    title="Escuchar en Spotify"
                    onClick={e => e.stopPropagation()}
                    style={{ color: '#1DB954', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </a>
                )}
                <button className="player-btn" onClick={() => toggleSaveEpisode(activeEpisode.id)} title="Guardar">
                  <Plus size={20} style={{ color: savedEpisodes.includes(activeEpisode.id) ? 'var(--accent-purple)' : 'inherit', transform: savedEpisodes.includes(activeEpisode.id) ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                <button className="player-btn player-btn-play" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pausar' : 'Reproducir'}>
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
                  <span className="player-time">{audioDurationSecs > 0 ? formatTime(audioDurationSecs) : activeEpisode.duration}</span>
                </div>
                
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0 }}>
                      {activeEpisode.category?.includes('Reflexión') ? 'Acerca de esta Reflexión (Under the Umbrella)' : 'Acerca de la Entrevista (ConBERTAciones)'}
                    </h4>
                    <a
                      href={activeEpisode.spotifyUrl || CONBERTACIONES_SPOTIFY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        color: '#1DB954',
                        textDecoration: 'none',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(29, 185, 84, 0.12)',
                        border: '1px solid rgba(29, 185, 84, 0.3)',
                      }}
                    >
                      <span>Abrir en Spotify</span>
                    </a>
                  </div>
                  <p style={{ maxHeight: '90px', overflowY: 'auto', margin: 0 }}>
                    {activeEpisode.description || 'Escucha este episodio de ConBERTAciones conducido por Berta Weyenberg sobre fe, resiliencia y desarrollo comunitario en Louisville, KY.'}
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
              <span className="nav-label">{tr('Inicio', 'Home')}</span>
            </button>
            <button className={`nav-item ${currentView === 'podcast' ? 'active' : ''}`} onClick={() => setCurrentView('podcast')}>
              <div className="nav-dot" style={{ opacity: currentView === 'podcast' ? 1 : 0 }} />
              <Mic size={20} />
              <span className="nav-label">{tr('Entrevistas', 'Interviews')}</span>
            </button>
            <button className={`nav-item ${currentView === 'umbrella' ? 'active' : ''}`} onClick={() => setCurrentView('umbrella')}>
              <div className="nav-dot" style={{ opacity: currentView === 'umbrella' ? 1 : 0 }} />
              <BookOpen size={20} />
              <span className="nav-label">{tr('Reflexiones', 'Reflections')}</span>
            </button>
            <button className={`nav-item ${currentView === 'noticias' ? 'active' : ''}`} onClick={() => setCurrentView('noticias')}>
              <div className="nav-dot" style={{ opacity: currentView === 'noticias' ? 1 : 0 }} />
              <PenTool size={20} />
              <span className="nav-label">Blog</span>
            </button>
            <button className={`nav-item ${currentView === 'statement' ? 'active' : ''}`} onClick={() => setCurrentView('statement')}>
              <div className="nav-dot" style={{ opacity: currentView === 'statement' ? 1 : 0 }} />
              <Scale size={20} />
              <span className="nav-label">Statement</span>
            </button>
            <button className={`nav-item ${currentView === 'speaker' ? 'active' : ''}`} onClick={() => setCurrentView('speaker')}>
              <div className="nav-dot" style={{ opacity: currentView === 'speaker' ? 1 : 0 }} />
              <Award size={20} />
              <span className="nav-label">{tr('Charlas', 'Speaking')}</span>
            </button>
            <button className={`nav-item ${currentView === 'conecta' ? 'active' : ''}`} onClick={() => setCurrentView('conecta')}>
              <div className="nav-dot" style={{ opacity: currentView === 'conecta' ? 1 : 0 }} />
              <Mail size={20} />
              <span className="nav-label">{tr('Conecta', 'Connect')}</span>
            </button>
          </nav>
        )}
      </div>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />
    </div>
  );
}

export default App;
