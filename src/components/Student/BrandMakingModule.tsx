import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Save,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  Palette,
  Layers,
  Crown,
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Check,
  X,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface BrandMakingModuleProps {
  studentId: string;
  studentName: string;
}

const DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    module: 'MODULE 02 — TANI COMPLETE',
    title: 'Brand Purpose & Identity Mastery',
    tab1: 'Purpose Canvas',
    tab2: 'Purpose Deep Dive',
    tab3: 'DNA & Story',
    tab4: 'Personality & Archetype',
    tab5: 'Voice & Culture',
    tab6: 'Beliefs & Identity',
    tab7: 'Positioning',
    tab8: 'Library & Preview',
    tab9: 'Collections',
    tab10: 'Style & Season',
    tab11: 'Color & Moodboard',
    saveJson: 'Save JSON',
    exportCsv: 'Export CSV',
    saveBook: 'Save Brand Book HTML',
    downloadPdf: 'Download as PDF (A4)',
    progress: 'COMPLETION',
    example: 'EXAMPLE / උදාහරණ',
    guidance: 'Write here:',
    toastLang: 'Language changed',
    fillGuide: 'මෙහිදී ලියන්න: ඔබේ සිතුවිලි පැහැදිලිව විස්තර කරන්න',
  },
  si: {
    module: 'මොඩියුල 02 — සම්පූර්ණ TANI',
    title: 'සන්නාම අරමුණ සහ අනන්‍යතා ප්‍රවීණත්වය',
    tab1: 'අරමුණු කැන්වසය',
    tab2: 'ගැඹුරු අරමුණ',
    tab3: 'DNA සහ කතාව',
    tab4: 'පෞරුෂය සහ පුරාවෘත්තය',
    tab5: 'හඬ සහ සංස්කෘතිය',
    tab6: 'විශ්වාස සහ අනන්‍යතාව',
    tab7: 'ස්ථානගත කිරීම',
    tab8: 'පුස්තකාලය සහ පෙරදසුන',
    tab9: 'එකතු කිරීම්',
    tab10: 'විලාසිතා සහ සෘතුව',
    tab11: 'වර්ණ සහ මනෝභාවය',
    saveJson: 'JSON සුරකින්න',
    exportCsv: 'CSV අපනයනය',
    saveBook: 'Brand Book HTML සුරකින්න',
    downloadPdf: 'PDF බාගත කරන්න (A4)',
    progress: 'සම්පූර්ණ කිරීම',
    example: 'උදාහරණ',
    guidance: 'මෙහි ලියන්න:',
    toastLang: 'භාෂාව වෙනස් විය',
    fillGuide: 'මෙහිදී ලියන්න: ඔබේ සිතුවිලි පැහැදිලිව විස්තර කරන්න',
  },
  ta: {
    module: 'தொகுதி 02 — முழுமையான TANI',
    title: 'பிராண்ட் நோக்கம் & அடையாள தேர்ச்சி',
    tab1: 'நோக்க கேன்வாஸ்',
    tab2: 'ஆழமான நோக்கம்',
    tab3: 'DNA & கதை',
    tab4: 'ஆளுமை & முன்மாதிரி',
    tab5: 'குரல் & கலாச்சாரம்',
    tab6: 'நம்பிக்கைகள் & அடையாளம்',
    tab7: 'நிலைநிறுத்தல்',
    tab8: 'நூலகம் & முன்னோட்டம்',
    tab9: 'சேகரிப்புகள்',
    tab10: 'ஸ்டைல் & பருவம்',
    tab11: 'நிறம் & மூட்போர்டு',
    saveJson: 'JSON சேமி',
    exportCsv: 'CSV ஏற்றுமதி',
    saveBook: 'Brand Book HTML சேமி',
    downloadPdf: 'PDF பதிவிறக்கம் (A4)',
    progress: 'முடிவு',
    example: 'உதாரணம்',
    guidance: 'இங்கே எழுதுங்கள்:',
    toastLang: 'மொழி மாற்றப்பட்டது',
    fillGuide: 'இங்கே எழுதுங்கள்: உங்கள் எண்ணங்களை தெளிவாக விவரிக்கவும்',
  },
};

const GOLD = '#D4AF37';
const NOIR = '#0a0a0a';
const CREAM = '#F5F1E8';

export const BrandMakingModule: React.FC<BrandMakingModuleProps> = ({
  studentId,
  studentName,
}) => {
  const { saveStudentBrandModuleData, getStudentBrandModuleData } = useData();

  const [lang, setLang] = useState<'en' | 'si' | 'ta'>('en');
  const t = DICTIONARY[lang] || DICTIONARY.en;
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // 1. Purpose Canvas
  const [canvas, setCanvas] = useState({
    why: '',
    mission: '',
    vision: '',
    values: '',
    impact: '',
    longTerm: '',
  });

  // 2. Ikigai & Golden Circle & Pyramid & Legacy
  const [ikigai, setIkigai] = useState({
    love: '',
    goodAt: '',
    worldNeeds: '',
    paidFor: '',
    purpose: '',
  });
  const [goldenCircle, setGoldenCircle] = useState({ why: '', how: '', what: '' });
  const [pyramid, setPyramid] = useState({ why: '', how: '', what: '' });
  const [pvmv, setPvmv] = useState({ purpose: '', mission: '', vision: '' });
  const [legacyLetter, setLegacyLetter] = useState('');

  // 3. DNA & Story
  const [dna, setDna] = useState({ purpose: '', values: '', personality: '', story: '', skill: '' });
  const [story, setStory] = useState({ started: '', founder: '', purposeStory: '' });
  const [timeline, setTimeline] = useState([
    { year: '2020', event: '' },
    { year: '2021', event: '' },
    { year: '2022', event: '' },
    { year: '2023', event: '' },
    { year: '2024', event: '' },
    { year: '2025', event: '' },
  ]);
  const [spine, setSpine] = useState({
    once: '',
    everyday: '',
    until: '',
    because: '',
    because2: '',
    ever: '',
  });

  // 4. Personality & Archetype
  const [personalityChips, setPersonalityChips] = useState<string[]>(['Friendly', 'Minimal']);
  const [sliders, setSliders] = useState({ serious: 50, classic: 30, bold: 70, luxury: 60, street: 20 });
  const [archetype, setArchetype] = useState<string>('Creator');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [brandPerson, setBrandPerson] = useState({
    age: '28',
    gender: 'Female',
    job: 'Designer in Colombo',
    lifestyle: '',
    quote: '',
  });
  const [matchData, setMatchData] = useState({ person: 'MIA inspired by Selyn', brand: 'Patagonia meets Selyn' });

  // 5. Voice & Culture
  const [voiceStyle, setVoiceStyle] = useState('Friendly');
  const [toneSliders, setToneSliders] = useState({
    formalCasual: 50,
    seriousFunny: 65,
    respectfulBold: 40,
    minimalDetailed: 30,
  });
  const [voiceChart, setVoiceChart] = useState([
    { this: 'We say: Crafted slowly', not: "We don't say: Cheap fast fashion" },
    { this: 'We say: For our community', not: 'We don\'t say: For customers only' },
    { this: 'We say: Rooted in Sri Lanka', not: 'We don\'t say: Generic island brand' },
  ]);
  const [voiceExamples, setVoiceExamples] = useState({
    ig: 'Rooted in heritage, designed for today. #TaniPurpose',
    email: 'Ayubowan! Your Selyn-inspired story begins here.',
    packaging: 'Carefully made with respect — ආයුබෝවන්',
  });
  const [mantra, setMantra] = useState({
    three: 'Slow. Rooted. True.',
    essence: 'We make heritage wearable for conscious future.',
  });
  const [valuesRank, setValuesRank] = useState([
    'Authenticity',
    'Sustainability',
    'Community',
    'Craftsmanship',
    'Courage',
  ]);
  const [valuesAction, setValuesAction] = useState([
    { value: 'Authenticity', action: 'Source from real artisans', example: 'Meet artisan video' },
    { value: 'Sustainability', action: 'Use natural dyes', example: 'Low water process' },
  ]);
  const [culturalChecks, setCulturalChecks] = useState<string[]>(['ආයුබෝවන්', 'එකමුතුකම']);
  const [sdgs, setSdgs] = useState<number[]>([5, 8, 12]);

  // 6. Beliefs & Identity System
  const [beliefs, setBeliefs] = useState({
    promise: 'To preserve craft and empower makers',
    belief: 'Craft can heal communities',
    philosophy: 'Slow is luxury',
    culture: 'Respect, Ritual, Return',
    experience: 'Feels like coming home',
    signature: 'Handloom border detail',
    rituals: 'Morning loom blessing',
    symbols: 'Lotus + Loom',
    icons: 'Palm leaf, Thread spool',
  });
  const [keywords, setKeywords] = useState<string[]>(
    Array(20)
      .fill('')
      .map((_, i) => (i < 4 ? ['heritage', 'slow', 'conscious', 'loom'][i] : ''))
  );
  const [taglines, setTaglines] = useState<string[]>([
    'Woven with Purpose',
    'Rooted in Sri Lanka, Worn Worldwide',
    'Slow Made, Long Loved',
  ]);
  const [taglineFavs, setTaglineFavs] = useState<string[]>([]);

  // 7. Positioning & Business
  const [positioning, setPositioning] = useState({
    target: 'conscious women 25-40 in Colombo & diaspora',
    category: 'slow fashion brand',
    benefit: 'wear heritage with modern confidence',
    reason: 'handloom crafted by women artisans',
  });
  const [elevatorPitch, setElevatorPitch] = useState({
    who: 'We are Tani, a Sri Lankan slow fashion label',
    problem: 'fast fashion erases craft',
    solution: 'we revive handloom with contemporary design',
    benefit: 'you wear story, not just clothes',
  });
  const [problemMap, setProblemMap] = useState([
    { problem: 'Fast fashion waste', purpose: 'We create long-lasting pieces', alignment: 'Circular design' },
  ]);

  // 8. Library, Vision & Logo
  const [visionImages, setVisionImages] = useState<(string | null)[]>(Array(15).fill(null));
  const [logoImg, setLogoImg] = useState<string | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<number[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoVariations, setLogoVariations] = useState<(string | null)[]>([null, null, null, null]);
  const logoVarNames = ['Primary', 'Secondary', 'Icon Only', 'Wordmark'];
  const [logoUsage, setLogoUsage] = useState({ clearSpace: '20px', minSize: '24px', bg: 'light' });

  // 9. Collections Management
  const [collections, setCollections] = useState<any[]>([
    {
      id: 'ac1',
      name: 'Kola Heritage SS25',
      season: 'SS25',
      year: '2025',
      theme: 'Beeralu lace meets temple garden',
      inspiration:
        "Morning alms, lotus ponds, clay walls of Kurunegala. Inspired by grandmother's lace collection and temple murals.",
      numLooks: '12',
      priceRange: '8500-18500',
      launchDate: '2025-03-15',
      status: 'Concept',
      looks: [
        {
          id: 'l1',
          lookNo: '01',
          name: 'Lotus Lace Dress',
          category: 'Dress',
          fabric: 'Handloom cotton + Beeralu lace',
          color: '#F5F1E8',
          img: null,
          desc: 'A-line dress with lace yoke',
          styling: 'With palm clutch',
          matCost: '2500',
          stitchCost: '1800',
          sellPrice: '12500',
        },
        {
          id: 'l2',
          lookNo: '02',
          name: 'Temple Border Shirt',
          category: 'Top',
          fabric: 'Natural dyed cotton',
          color: '#D4AF37',
          img: null,
          desc: 'Boxy shirt with gold temple border',
          styling: 'With wide pants',
          matCost: '1800',
          stitchCost: '1200',
          sellPrice: '8500',
        },
      ],
      drops: [
        { id: 'd1', name: 'Drop 1', date: '2025-03-01', pieces: '4', hook: 'Heritage Tease - Lace story', status: 'Planned' },
        { id: 'd2', name: 'Drop 2', date: '2025-03-15', pieces: '4', hook: 'Garden Ritual - Core looks', status: 'Planned' },
        { id: 'd3', name: 'Drop 3', date: '2025-04-01', pieces: '4', hook: 'Full Bloom - Complete story', status: 'Planned' },
      ],
    },
  ]);
  const [activeCollectionId, setActiveCollectionId] = useState<string>('ac1');
  const activeCol = useMemo(
    () => collections.find((c) => c.id === activeCollectionId) || collections[0],
    [collections, activeCollectionId]
  );

  // 10. Style Library & Seasonal Direction
  const [customStyleName, setCustomStyleName] = useState('');
  const [styleLibrary, setStyleLibrary] = useState<Record<string, any>>({
    Minimal: {
      name: 'Minimal',
      images: [null, null, null],
      notes: 'Clean lines, no excess - less but better',
      silhouettes: ['Boxy', 'Straight'],
      fabrics: 'Handloom cotton, organic linen',
      details: ['raw edge', 'temple border'],
      priceTier: 'Premium',
      exampleBrands: 'COS, KOLOMBO, Selyn',
      keySilhouettes: 'Boxy shirt, wide pant',
    },
    Sustainable: {
      name: 'Sustainable',
      images: [null, null, null],
      notes: 'Zero waste pattern cutting',
      silhouettes: ['Relaxed', 'A-line'],
      fabrics: 'Natural dyes, organic cotton',
      details: ['patchwork', 'raw edge'],
      priceTier: 'Mid',
      exampleBrands: 'Patagonia, Urban Island',
      keySilhouettes: 'Versatile wrap',
    },
    Luxury: {
      name: 'Luxury',
      images: [null, null, null],
      notes: 'Heirloom quality',
      silhouettes: ['Tailored', 'Draped'],
      fabrics: 'Silk + cotton blend',
      details: ['gold thread', 'temple border'],
      priceTier: 'Luxury',
      exampleBrands: 'Selyn, Amakie',
      keySilhouettes: 'Tailored but soft',
    },
    Handloom: {
      name: 'Handloom',
      images: [null, null, null],
      notes: 'Traditional loom revival',
      silhouettes: ['A-line', 'Straight'],
      fabrics: 'Handloom cotton, beeralu',
      details: ['temple border', 'gold thread'],
      priceTier: 'Premium',
      exampleBrands: 'Selyn, Kandy House',
      keySilhouettes: 'Saree, A-line dress',
    },
  });
  const [trends, setTrends] = useState([
    {
      id: 't1',
      name: 'Craftcore Revival',
      source: 'Runway',
      img: null,
      adapt: 'Use beeralu lace as modern trim, not costume',
      priority: 'High',
    },
    {
      id: 't2',
      name: 'Quiet Luxury',
      source: 'Instagram',
      img: null,
      adapt: 'Muted earth tones, no logos, focus on handfeel',
      priority: 'High',
    },
  ]);
  const [seasonSelected, setSeasonSelected] = useState('SS25');
  const [seasonDirections, setSeasonDirections] = useState({
    color: 'Pastel earth - clay, lotus pink, palm green',
    fabric: 'Light handloom, open weave, natural dyes',
    silhouette: 'Relaxed saree drape, cropped shirts, wide pants',
    trends: 'Y2K boho revival, quiet luxury, craftcore',
  });
  const [seasonMood, setSeasonMood] = useState('Earthy');
  const [seasonTimeline, setSeasonTimeline] = useState({
    design: 'Jan 2025',
    sample: 'Feb-Mar 2025',
    produce: 'Apr-May 2025',
    launch: 'June 2025',
  });
  const [evolution, setEvolution] = useState({
    past: '2023: Traditional sarees only, local market',
    present: '2025: Contemporary handloom essentials, global diaspora, minimal luxury',
    future: '2026: Full lifestyle - home, menswear, upcycled line, Colombo flagship',
  });

  // 11. Color Theory & Moodboard Studio
  const [customPalette, setCustomPalette] = useState({
    primary: '#0A0A0A',
    secondary: '#D4AF37',
    accent: '#F5F1E8',
    neutral1: '#FFFFFF',
    neutral2: '#8B5E34',
    text: '#111111',
  });
  const [savedPalettes, setSavedPalettes] = useState<any[]>([]);
  const [paletteNameInput, setPaletteNameInput] = useState('');
  const [colorInspo, setColorInspo] = useState([
    { id: 'ci1', img: null, notes: 'Temple clay wall - warm grounding', colors: ['#8B4513', '#D4AF37', '#FEFAE0'] },
    { id: 'ci2', img: null, notes: 'Lotus pond at dawn', colors: ['#E8C4C4', '#A8D5D8', '#F4F1DE'] },
    { id: 'ci3', img: null, notes: 'Palm leaf shadow', colors: ['#606C38', '#CCD5AE', '#F5F1E8'] },
    { id: 'ci4', img: null, notes: 'Gold thread detail', colors: ['#D4AF37', '#0A0A0A', '#F5E6A3'] },
  ]);
  const [moodTemplate, setMoodTemplate] = useState<'grid' | 'collage' | 'polaroid' | 'magazine'>('grid');
  const [moodBg, setMoodBg] = useState<'cream' | 'black' | 'white' | 'blush'>('cream');
  const [moodBorder, setMoodBorder] = useState<'gold' | 'black' | 'none'>('gold');
  const [moodSpacing, setMoodSpacing] = useState(12);
  const [moodboardItems, setMoodboardItems] = useState<{ img: string | null; caption: string }[]>(
    Array(15).fill(null).map(() => ({ img: null, caption: '' }))
  );
  const [moodKeywords, setMoodKeywords] = useState([
    'slow', 'rooted', 'ayubowan', 'loom', 'heritage', 'calm', 'woven', 'conscious', 'timeless', 'soulful',
  ]);
  const [moodNotes, setMoodNotes] = useState({
    feeling: 'Calm morning ritual in temple garden - incense, loom sound, soft light',
    source: "Grandmother's saree chest, Beeralu lace, Temple mural, Kurunegala clay walls",
    colorNotes: 'Clay #8B4513, Lotus #E8C4C4, Palm #606C38, Gold #D4AF37',
    fabricNotes: 'Handloom cotton slub, natural dye, open weave, raw silk',
    textureNotes: 'Raw slub, smooth silk, rough clay, soft lace',
  });

  // Load saved state from Local Database / Cloud on mount
  useEffect(() => {
    const saved = getStudentBrandModuleData(studentId);
    if (saved) {
      try {
        if (saved.canvas) setCanvas(saved.canvas);
        if (saved.ikigai) setIkigai(saved.ikigai);
        if (saved.goldenCircle) setGoldenCircle(saved.goldenCircle);
        if (saved.pyramid) setPyramid(saved.pyramid);
        if (saved.pvmv) setPvmv(saved.pvmv);
        if (saved.legacyLetter) setLegacyLetter(saved.legacyLetter);
        if (saved.dna) setDna(saved.dna);
        if (saved.story) setStory(saved.story);
        if (saved.timeline) setTimeline(saved.timeline);
        if (saved.spine) setSpine(saved.spine);
        if (saved.personalityChips) setPersonalityChips(saved.personalityChips);
        if (saved.sliders) setSliders(saved.sliders);
        if (saved.archetype) setArchetype(saved.archetype);
        if (saved.quizAnswers) setQuizAnswers(saved.quizAnswers);
        if (saved.brandPerson) setBrandPerson(saved.brandPerson);
        if (saved.matchData) setMatchData(saved.matchData);
        if (saved.voiceStyle) setVoiceStyle(saved.voiceStyle);
        if (saved.toneSliders) setToneSliders(saved.toneSliders);
        if (saved.voiceChart) setVoiceChart(saved.voiceChart);
        if (saved.voiceExamples) setVoiceExamples(saved.voiceExamples);
        if (saved.mantra) setMantra(saved.mantra);
        if (saved.valuesRank) setValuesRank(saved.valuesRank);
        if (saved.valuesAction) setValuesAction(saved.valuesAction);
        if (saved.culturalChecks) setCulturalChecks(saved.culturalChecks);
        if (saved.sdgs) setSdgs(saved.sdgs);
        if (saved.beliefs) setBeliefs(saved.beliefs);
        if (saved.keywords) setKeywords(saved.keywords);
        if (saved.taglines) setTaglines(saved.taglines);
        if (saved.taglineFavs) setTaglineFavs(saved.taglineFavs);
        if (saved.positioning) setPositioning(saved.positioning);
        if (saved.elevatorPitch) setElevatorPitch(saved.elevatorPitch);
        if (saved.problemMap) setProblemMap(saved.problemMap);
        if (saved.logoImg) setLogoImg(saved.logoImg);
        if (saved.logoVariations) setLogoVariations(saved.logoVariations);
        if (saved.logoUsage) setLogoUsage(saved.logoUsage);
        if (saved.collections) setCollections(saved.collections);
        if (saved.styleLibrary) setStyleLibrary(saved.styleLibrary);
        if (saved.trends) setTrends(saved.trends);
        if (saved.seasonSelected) setSeasonSelected(saved.seasonSelected);
        if (saved.seasonDirections) setSeasonDirections(saved.seasonDirections);
        if (saved.seasonMood) setSeasonMood(saved.seasonMood);
        if (saved.seasonTimeline) setSeasonTimeline(saved.seasonTimeline);
        if (saved.evolution) setEvolution(saved.evolution);
        if (saved.customPalette) setCustomPalette(saved.customPalette);
        if (saved.savedPalettes) setSavedPalettes(saved.savedPalettes);
        if (saved.colorInspo) setColorInspo(saved.colorInspo);
        if (saved.moodboardItems) setMoodboardItems(saved.moodboardItems);
        if (saved.moodKeywords) setMoodKeywords(saved.moodKeywords);
        if (saved.moodNotes) setMoodNotes(saved.moodNotes);
        if (saved.visionImages) setVisionImages(saved.visionImages);
        if (saved.lang) setLang(saved.lang);
      } catch (err) {
        console.warn('Error loading brand module state:', err);
      }
    }
  }, [studentId]);

  // Auto-save debounce to Student Local Database & Cloud
  useEffect(() => {
    const timer = setTimeout(() => {
      const stateToSave = {
        canvas,
        ikigai,
        goldenCircle,
        pyramid,
        pvmv,
        legacyLetter,
        dna,
        story,
        timeline,
        spine,
        personalityChips,
        sliders,
        archetype,
        quizAnswers,
        brandPerson,
        matchData,
        voiceStyle,
        toneSliders,
        voiceChart,
        voiceExamples,
        mantra,
        valuesRank,
        valuesAction,
        culturalChecks,
        sdgs,
        beliefs,
        keywords,
        taglines,
        taglineFavs,
        positioning,
        elevatorPitch,
        problemMap,
        logoImg,
        logoVariations,
        logoUsage,
        collections,
        styleLibrary,
        trends,
        seasonSelected,
        seasonDirections,
        seasonMood,
        seasonTimeline,
        evolution,
        customPalette,
        savedPalettes,
        colorInspo,
        moodboardItems,
        moodKeywords,
        moodNotes,
        visionImages,
        lang,
      };
      saveStudentBrandModuleData(studentId, stateToSave);
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    canvas,
    ikigai,
    goldenCircle,
    pyramid,
    pvmv,
    legacyLetter,
    dna,
    story,
    timeline,
    spine,
    personalityChips,
    sliders,
    archetype,
    quizAnswers,
    brandPerson,
    matchData,
    voiceStyle,
    toneSliders,
    voiceChart,
    voiceExamples,
    mantra,
    valuesRank,
    valuesAction,
    culturalChecks,
    sdgs,
    beliefs,
    keywords,
    taglines,
    taglineFavs,
    positioning,
    elevatorPitch,
    problemMap,
    logoImg,
    logoVariations,
    logoUsage,
    collections,
    styleLibrary,
    trends,
    seasonSelected,
    seasonDirections,
    seasonMood,
    seasonTimeline,
    evolution,
    customPalette,
    savedPalettes,
    colorInspo,
    moodboardItems,
    moodKeywords,
    moodNotes,
    visionImages,
    lang,
    studentId,
  ]);

  // Overall Completion Calculation
  const progressPercent = useMemo(() => {
    const raw = [
      ...Object.values(canvas),
      ...Object.values(ikigai),
      ...Object.values(goldenCircle),
      ...Object.values(pyramid),
      ...Object.values(pvmv),
      legacyLetter,
      ...Object.values(dna),
      ...Object.values(story),
      ...timeline.map((t) => t.event),
      ...Object.values(spine),
      brandPerson.age,
      brandPerson.job,
      matchData.person,
      ...Object.values(voiceExamples),
      mantra.three,
      mantra.essence,
      ...Object.values(beliefs),
      ...keywords,
      ...Object.values(positioning),
      ...Object.values(seasonDirections),
      ...Object.values(customPalette),
      ...moodKeywords,
    ].join('|');
    const filled = raw.split('|').filter((val) => val.trim().length > 3).length;
    const total = raw.split('|').length;
    return Math.min(100, Math.round((filled / total) * 100));
  }, [
    canvas,
    ikigai,
    goldenCircle,
    pyramid,
    pvmv,
    legacyLetter,
    dna,
    story,
    timeline,
    spine,
    brandPerson,
    matchData,
    voiceExamples,
    mantra,
    beliefs,
    keywords,
    positioning,
    seasonDirections,
    customPalette,
    moodKeywords,
  ]);

  const ARCHETYPES = [
    'Hero', 'Creator', 'Explorer', 'Ruler', 'Innocent', 'Lover',
    'Sage', 'Magician', 'Outlaw', 'Jester', 'Caregiver', 'Everyman',
  ];

  const ARCHETYPE_DESCS: Record<string, string> = {
    Hero: 'Makes world better through mastery',
    Creator: 'Builds enduring value with imagination',
    Explorer: 'Seeks freedom & authenticity',
    Ruler: 'Creates order from chaos',
    Innocent: 'Optimism, honesty, purity',
    Lover: 'Passion & intimacy',
    Sage: 'Truth & knowledge',
    Magician: 'Transformation & vision',
    Outlaw: 'Breaks rules, liberation',
    Jester: 'Joy & play',
    Caregiver: 'Service & care',
    Everyman: 'Belonging & real',
  };

  const QUIZ_QUESTIONS = [
    'Your brand in crisis: you...',
    'Customer remembers you for...',
    'Your superpower is...',
    'You fear being...',
    'Your brand voice is...',
  ];

  const QUIZ_OPTIONS = [
    ['Fight', 'Create', 'Explore', 'Lead'],
    ['Courage', 'Craft', 'Freedom', 'Status'],
    ['Willpower', 'Imagination', 'Authenticity', 'Control'],
    ['Weak', 'Boring', 'Trapped', 'Chaotic'],
    ['Brave', 'Inspiring', 'Free', 'Powerful'],
  ];

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // Save JSON
  const handleSaveJson = () => {
    const payload = {
      canvas,
      ikigai,
      goldenCircle,
      pyramid,
      pvmv,
      legacyLetter,
      dna,
      story,
      timeline,
      spine,
      personalityChips,
      sliders,
      archetype,
      quizAnswers,
      brandPerson,
      matchData,
      voiceStyle,
      toneSliders,
      voiceChart,
      voiceExamples,
      mantra,
      valuesRank,
      valuesAction,
      culturalChecks,
      sdgs,
      beliefs,
      keywords,
      taglines,
      taglineFavs,
      positioning,
      elevatorPitch,
      problemMap,
      logoImg,
      logoVariations,
      logoUsage,
      collections,
      styleLibrary,
      trends,
      seasonSelected,
      seasonDirections,
      seasonMood,
      seasonTimeline,
      evolution,
      customPalette,
      savedPalettes,
      colorInspo,
      moodboardItems,
      moodKeywords,
      moodNotes,
      visionImages,
      lang,
      studentId,
      studentName,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TANI_BRAND_MODULE_02_${studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON state successfully downloaded!');
  };

  // Export CSV
  const handleExportCsv = () => {
    const rows = [
      ['Section', 'Field', 'Value'],
      ['Canvas', 'WHY', canvas.why],
      ['Canvas', 'MISSION', canvas.mission],
      ['Canvas', 'VISION', canvas.vision],
      ['Canvas', 'VALUES', canvas.values],
      ['Canvas', 'IMPACT', canvas.impact],
      ['DNA', 'Archetype', archetype],
      ['Voice', 'Style', voiceStyle],
      ['Mantra', 'Three Words', mantra.three],
      ['Positioning', 'Target', positioning.target],
      ['Positioning', 'Category', positioning.category],
      ['Positioning', 'Benefit', positioning.benefit],
      ['Collections', 'Count', collections.length.toString()],
      ['Student', 'Name', studentName],
      ['Student', 'ID', studentId],
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TANI_BRAND_MODULE_${studentName.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported!');
  };

  // Generate Complete HTML Brand Book
  const generateBrandBookHtml = () => {
    const collectionsHtml = collections
      .map(
        (c) => `
      <div style="margin-bottom: 24px; padding: 16px; border: 1px solid #D4AF37; border-radius: 8px;">
        <h3 style="color: #D4AF37; margin: 0 0 8px 0;">${c.name} (${c.season} - ${c.year})</h3>
        <p><b>Theme:</b> ${c.theme || '—'}</p>
        <p><b>Inspiration:</b> ${c.inspiration || '—'}</p>
        <p><b>Looks Count:</b> ${c.looks?.length || 0} | <b>Target Price:</b> LKR ${c.priceRange || '—'}</p>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 12px;">
          ${(c.looks || [])
            .map((look: any) =>
              look.img
                ? `<div>
                    <img src="${look.img}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px; border: 1px solid #D4AF37;" />
                    <div style="font-size: 11px; margin-top: 4px;">Look ${look.lookNo}: ${look.name} (${look.category})</div>
                  </div>`
                : ''
            )
            .join('')}
        </div>
      </div>`
      )
      .join('');

    const moodboardHtml = moodboardItems
      .filter((i) => i.img)
      .map(
        (item) => `
        <div style="display: inline-block; width: 30%; margin: 1%; vertical-align: top; border: 2px solid #D4AF37; border-radius: 6px; overflow: hidden; background: white; padding: 4px;">
          <img src="${item.img}" style="width: 100%; height: 140px; object-fit: cover;" />
          <div style="font-size: 10px; color: black; padding: 4px; text-align: center;">${item.caption || ''}</div>
        </div>`
      )
      .join('');

    const logoHtml = logoImg
      ? `<img src="${logoImg}" style="width: 120px; height: 120px; object-fit: contain; border: 3px solid #D4AF37; border-radius: 12px; background: white; padding: 8px;" />`
      : `<div style="width: 120px; height: 120px; border: 2px dashed #D4AF37; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #D4AF37;">Primary Logo</div>`;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${studentName} - TANI Brand Book (A4 Portrait)</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    * { box-sizing: border-box; }
    body { background: #0a0a0a; color: #F5F1E8; font-family: 'Georgia', serif; width: 210mm; margin: 0 auto; padding: 0; }
    .page { width: 210mm; min-height: 297mm; padding: 18mm; page-break-after: always; background: #0a0a0a; border-left: 6px solid #D4AF37; position: relative; }
    h1 { color: #D4AF37; font-size: 38px; line-height: 1.1; margin: 0 0 10px 0; }
    h2 { color: #D4AF37; font-size: 22px; border-bottom: 2px solid #D4AF37; padding-bottom: 6px; margin-top: 24px; }
    .section-label { font-size: 11px; letter-spacing: 0.3em; color: #D4AF37; text-transform: uppercase; margin-bottom: 8px; }
    .swatch { display: inline-block; width: 60px; height: 60px; border-radius: 8px; border: 2px solid #D4AF37; margin: 4px; vertical-align: top; }
    .meta { font-size: 12px; color: #a89f91; margin-top: 8px; }
    @media print {
      body { width: 100%; margin: 0; padding: 0; }
      .page { border-left: 6px solid #D4AF37 !important; }
    }
  </style>
</head>
<body>
  <!-- PAGE 1: COVER -->
  <div class="page">
    <div class="section-label">TANI COMPLETE • MODULE 02 • OFFICIAL BRAND BOOK</div>
    <div style="display: flex; justify-content: space-between; align-items: start; margin-top: 30px;">
      <div>${logoHtml}</div>
      <div style="text-align: right;">
        <div style="font-size: 13px; color: #D4AF37; font-weight: bold;">CEYLON STYLE STUDIO</div>
        <div class="meta">Student: ${studentName} (${studentId})</div>
      </div>
    </div>
    <h1 style="margin-top: 50px; font-size: 48px;">${mantra.three || 'Slow. Rooted. True.'}</h1>
    <p style="font-size: 16px; color: #F5F1E8; line-height: 1.6; max-width: 80%;">${mantra.essence || 'We make heritage wearable for a conscious future.'}</p>
    
    <div style="margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; line-height: 1.6;">
      <div><span class="section-label">PURPOSE (WHY)</span><p>${canvas.why || '—'}</p></div>
      <div><span class="section-label">MISSION</span><p>${canvas.mission || '—'}</p></div>
      <div><span class="section-label">VISION</span><p>${canvas.vision || '—'}</p></div>
      <div><span class="section-label">ARCHETYPE</span><p>${archetype} — ${ARCHETYPE_DESCS[archetype] || ''}</p></div>
    </div>
  </div>

  <!-- PAGE 2: BRAND DNA & STORY -->
  <div class="page">
    <div class="section-label">BRAND DNA & PHILOSOPHY</div>
    <h2>Brand DNA Equation</h2>
    <p><b>Purpose:</b> ${dna.purpose || '—'} + <b>Values:</b> ${dna.values || '—'} + <b>Personality:</b> ${dna.personality || '—'} = <b>${archetype}</b></p>
    
    <h2>Brand Story & Origins</h2>
    <p><b>How It Started:</b> ${story.started || '—'}</p>
    <p><b>Founder Story:</b> ${story.founder || '—'}</p>
    <p><b>Purpose Story:</b> ${story.purposeStory || '—'}</p>
    
    <h2>Positioning</h2>
    <p>For <b>${positioning.target}</b>, our brand is a <b>${positioning.category}</b> that provides <b>${positioning.benefit}</b> because <b>${positioning.reason}</b>.</p>
  </div>

  <!-- PAGE 3: COLLECTIONS -->
  <div class="page">
    <div class="section-label">COLLECTIONS & LOOKS</div>
    <h2>Fashion Collections Portfolio</h2>
    ${collectionsHtml || '<p>No collections added yet.</p>'}
  </div>

  <!-- PAGE 4: COLOR & MOODBOARD -->
  <div class="page">
    <div class="section-label">PALETTE & MOODBOARD</div>
    <h2>Color Palette</h2>
    <div>
      ${Object.entries(customPalette)
        .map(
          ([name, hex]) =>
            `<div style="display: inline-block; text-align: center; margin: 8px;">
              <div class="swatch" style="background: ${hex};"></div>
              <div style="font-size: 10px;">${name}<br/>${hex}</div>
            </div>`
        )
        .join('')}
    </div>

    <h2>Moodboard Gallery</h2>
    <div style="margin-top: 16px;">
      ${moodboardHtml || '<p>No moodboard images uploaded yet.</p>'}
    </div>
    <p style="font-size: 12px; margin-top: 16px;"><b>Feeling:</b> ${moodNotes.feeling}</p>
  </div>
</body>
</html>`;
  };

  // Save Brand Book HTML
  const handleSaveBrandBookHtml = () => {
    const html = generateBrandBookHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TANI_BrandBook_${studentName.replace(/\s+/g, '_')}_A4.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Brand Book HTML Saved!');
  };

  // Download / Print as PDF (A4 Portrait format)
  const handleDownloadPdf = () => {
    const html = generateBrandBookHtml();
    try {
      let printFrame = document.getElementById('css-brand-print-frame') as HTMLIFrameElement;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'css-brand-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        printFrame.style.visibility = 'hidden';
        document.body.appendChild(printFrame);
      }
      const frameDoc = printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();
        setTimeout(() => {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
          showToast('Print / Save as PDF (A4) dialog opened!');
        }, 400);
        return;
      }
    } catch (e) {
      console.warn('Iframe print fallback:', e);
    }

    // Direct A4 HTML/PDF file download fallback
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TANI_BrandBook_${studentName.replace(/\s+/g, '_')}_A4_Ready.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Brand Book saved! Open & select Print to PDF.');
  };

  const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#f0e6c8] ${className}`}
      style={{ borderLeft: `4px solid ${GOLD}` }}
    >
      {children}
    </div>
  );

  const ExampleCallout: React.FC<{ text: string }> = ({ text }) => (
    <div className="mt-3 bg-[#FFFBEB] border border-amber-100 rounded-xl p-3 text-[12px] leading-5 text-[#7a5a1d]">
      <span className="font-bold tracking-wide text-[10px] text-amber-800 uppercase">
        {' '}{t.example} —{' '}
      </span>
      {text}
    </div>
  );

  const SectionHeader: React.FC<{ children: React.ReactNode; trilingual?: string }> = ({ children, trilingual }) => (
    <div className="mb-2">
      <div className="font-semibold text-[13px] tracking-[0.04em] uppercase text-[#111]">
        {children}
      </div>
      {trilingual && <div className="text-[11px] text-neutral-500 mt-0.5">{trilingual}</div>}
    </div>
  );

  const InputField: React.FC<{
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    example?: string;
  }> = ({ value, onChange, placeholder, example }) => (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[96px] rounded-xl bg-[#FCFBF8] border border-[#e8dfc3] p-4 text-[14px] leading-6 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] transition text-black"
      />
      <div className="text-[11px] text-neutral-400">{t.fillGuide}</div>
      {example && <ExampleCallout text={example} />}
    </div>
  );

  const TAB_TITLES = [
    t.tab1, t.tab2, t.tab3, t.tab4, t.tab5,
    t.tab6, t.tab7, t.tab8, t.tab9, t.tab10, t.tab11,
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-black rounded-sm" style={{ background: CREAM }}>
      {/* Top Banner & Actions Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#0a0a0a]/95 border-b border-[#2a2a2a] text-white">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37] grid place-items-center text-black font-bold">
              T
            </div>
            <div>
              <div className="text-[11px] tracking-[0.2em] text-[#D4AF37] font-mono">{t.module}</div>
              <div className="font-semibold text-[15px] -mt-0.5 font-editorial text-white">{t.title}</div>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-2 ml-6 bg-white/10 rounded-full p-1">
              {(['en', 'si', 'ta'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLang(code);
                    showToast(DICTIONARY[code].toastLang);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    lang === code ? 'bg-white text-black font-bold' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {code === 'en' ? 'EN' : code === 'si' ? 'සිං' : 'தமி'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress Bar in Header */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-white/70 mr-2 font-mono">
              <span>{t.progress} {progressPercent}%</span>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleSaveJson}
              className="px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-[#F5F1E8] flex items-center gap-1 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveJson}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 rounded-full bg-[#1a1a1a] border border-[#333] text-white text-xs font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.exportCsv}</span>
            </button>
            <button
              onClick={handleSaveBrandBookHtml}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37] text-black text-xs font-bold flex items-center gap-1 shadow-md hover:brightness-105"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.saveBook}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-full bg-[#540d18] border border-[#D4AF37] text-[#f7e2a9] text-xs font-bold flex items-center gap-1 shadow-md hover:bg-[#6e1322]"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.downloadPdf}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-[1320px] mx-auto px-2 md:px-8 overflow-x-auto scrollbar-none">
          <div className="flex gap-1 pb-2">
            {TAB_TITLES.map((title, idx) => (
              <button
                key={idx}
                onClick={() => setTabIndex(idx)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[11px] font-medium transition ${
                  tabIndex === idx
                    ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {idx + 1}. {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-[1320px] mx-auto p-4 md:p-8 min-w-0 space-y-6">
        {/* TAB 0: PURPOSE CANVAS */}
        {tabIndex === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap gap-4 items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
                  Brand Purpose Canvas
                </h1>
                <p className="text-xs md:text-sm text-neutral-600 mt-1 max-w-2xl">
                  WHY / MISSION / VISION / VALUES / IMPACT / LONG TERM — EN / සිංහල / தமிழ் explanations below each field.
                </p>
              </div>
              {logoImg && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-white shadow-sm p-1">
                  <img src={logoImg} alt="Brand Logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Logo Manager */}
            <Card className="border-[#D4AF37] !border-l-[6px]">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <SectionHeader>LOGO UPLOAD &amp; BRAND MARK — Primary + Variations (A4 Ready)</SectionHeader>
                <span className="text-[10px] px-2 py-1 rounded-full bg-black text-[#D4AF37] font-mono">
                  A4 Portrait Cover Ready
                </span>
              </div>

              <div className="grid lg:grid-cols-[160px_1fr] gap-6 mt-4">
                <div className="space-y-3">
                  <div className="w-[120px] h-[120px] rounded-2xl border-[3px] border-[#D4AF37] bg-white grid place-items-center overflow-hidden relative shadow-sm">
                    {logoImg ? (
                      <img src={logoImg} alt="Primary Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-[10px] text-neutral-400">Primary Logo</span>
                    )}
                    {logoImg && (
                      <button
                        onClick={() => {
                          setLogoImg(null);
                          showToast('Logo removed');
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black text-white grid place-items-center text-[10px]"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={logoInputRef}
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const b64 = await fileToBase64(f);
                        setLogoImg(b64);
                        showToast('Primary Logo Uploaded!');
                      }
                    }}
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full px-3 py-2 rounded-full bg-black text-[#D4AF37] text-xs font-semibold hover:bg-neutral-900"
                  >
                    Upload Primary Logo
                  </button>
                  <div className="text-[10px] text-neutral-500">
                    120×120 preview • gold border • displays on all previews
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {logoVarNames.map((name, idx) => (
                      <div key={name} className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-100">
                        <div className="text-[11px] font-bold uppercase">{name}</div>
                        <div className="mt-2 w-full aspect-square rounded-xl border-2 border-dashed border-[#D4AF37]/50 bg-white grid place-items-center overflow-hidden relative">
                          {logoVariations[idx] ? (
                            <img
                              src={logoVariations[idx]!}
                              alt={name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-[9px] text-neutral-400">Upload {name}</span>
                          )}
                          {logoVariations[idx] && (
                            <button
                              onClick={() => {
                                const next = [...logoVariations];
                                next[idx] = null;
                                setLogoVariations(next);
                              }}
                              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white grid place-items-center text-[8px]"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        <label className="mt-2 block w-full text-center px-2 py-1 rounded-full border border-[#D4AF37] text-[10px] cursor-pointer hover:bg-amber-50">
                          <span>Upload</span>
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const b64 = await fileToBase64(f);
                                const next = [...logoVariations];
                                next[idx] = b64;
                                setLogoVariations(next);
                                showToast(`${name} variation uploaded`);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <div className="text-[11px] font-semibold">Clear Space</div>
                      <input
                        value={logoUsage.clearSpace}
                        onChange={(e) => setLogoUsage({ ...logoUsage, clearSpace: e.target.value })}
                        placeholder="20px"
                        className="w-full rounded-full border px-3 py-2 text-xs bg-[#FCFBF8] mt-1 text-black"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold">Minimum Size</div>
                      <input
                        value={logoUsage.minSize}
                        onChange={(e) => setLogoUsage({ ...logoUsage, minSize: e.target.value })}
                        placeholder="24px"
                        className="w-full rounded-full border px-3 py-2 text-xs bg-[#FCFBF8] mt-1 text-black"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold">Background Theme</div>
                      <div className="flex gap-1 mt-1">
                        {(['light', 'dark', 'gold'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setLogoUsage({ ...logoUsage, bg: mode })}
                            className={`px-3 py-1.5 rounded-full text-[10px] border capitalize ${
                              logoUsage.bg === mode ? 'bg-black text-[#D4AF37] border-black font-bold' : 'bg-white'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Canvas Core 6 Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <SectionHeader trilingual="ඇයි ඔබ පවතින්නේ? / நீங்கள் ஏன் இருக்கிறீர்கள்?">
                  WHY - Brand Purpose
                </SectionHeader>
                <InputField
                  value={canvas.why}
                  onChange={(val) => setCanvas({ ...canvas, why: val })}
                  placeholder="Why does your brand exist beyond profit?"
                  example="TANI exists to keep Sri Lankan handloom alive — because every thread carries a mother’s story, not just cloth. Eg: Selyn — preserving craft heritage."
                />
              </Card>

              <Card>
                <SectionHeader trilingual="මෙහෙයුම / பணி">
                  MISSION - What you do daily
                </SectionHeader>
                <InputField
                  value={canvas.mission}
                  onChange={(val) => setCanvas({ ...canvas, mission: val })}
                  placeholder="What do you do everyday to fulfill WHY?"
                  example="We design contemporary essentials handwoven by rural women artisans in Kurunegala, paying 3x fair wage and planting 1 tree per product."
                />
              </Card>

              <Card>
                <SectionHeader trilingual="දැක්ම / பார்வை">
                  VISION - Future you create
                </SectionHeader>
                <InputField
                  value={canvas.vision}
                  onChange={(val) => setCanvas({ ...canvas, vision: val })}
                  placeholder="Where will world be because you existed?"
                  example="A world where Sri Lankan craft is global luxury — 10,000 artisans thriving, zero waste looms in every village by 2035."
                />
              </Card>

              <Card>
                <SectionHeader trilingual="වටිනාකම් / மதிப்புகள்">
                  VALUES - Non-negotiables
                </SectionHeader>
                <InputField
                  value={canvas.values}
                  onChange={(val) => setCanvas({ ...canvas, values: val })}
                  placeholder="3-5 values you never compromise"
                  example="Authenticity, Ayubowan (Respect), Slow Craft, Community, Circularity — we never do polyester, never copy."
                />
              </Card>

              <Card>
                <SectionHeader trilingual="බලපෑම / தாக்கம்">
                  IMPACT - Change you make
                </SectionHeader>
                <InputField
                  value={canvas.impact}
                  onChange={(val) => setCanvas({ ...canvas, impact: val })}
                  placeholder="Measurable impact on people & planet"
                  example="Impact: 120 women artisans earning $300/mo, 2 tons textile waste diverted, 500 customers educated on slow fashion."
                />
              </Card>

              <Card>
                <SectionHeader trilingual="දිගු කාලීන ඉලක්කය / நீண்ட கால இலக்கு">
                  LONG TERM GOAL - 10 Year BHAG
                </SectionHeader>
                <InputField
                  value={canvas.longTerm}
                  onChange={(val) => setCanvas({ ...canvas, longTerm: val })}
                  placeholder="Big Hairy Audacious Goal"
                  example="Become Sri Lanka's first craft unicorn — but measured in artisans empowered, not dollars. 1M heirloom pieces worn worldwide."
                />
              </Card>
            </div>
          </div>
        )}

        {/* TAB 1: PURPOSE DEEP DIVE */}
        {tabIndex === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Purpose Deep Dive
            </h1>
            <Card>
              <SectionHeader>Ikigai Diagram — 4 Circles (ඉකිගායි)</SectionHeader>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                {[
                  { k: 'love', label: 'What you LOVE ❤️ — ආදරය', ex: 'We love weaving stories, natural dyes' },
                  { k: 'goodAt', label: "What you're GOOD AT — දක්ෂතාවය", ex: 'Contemporary design + traditional loom mastery' },
                  { k: 'worldNeeds', label: 'What WORLD NEEDS — ලෝකයට අවශ්‍ය', ex: 'World needs slow, ethical alternatives to fast fashion' },
                  { k: 'paidFor', label: 'What you can be PAID FOR — මුදල් ලැබෙන', ex: 'Conscious consumers pay premium for heritage luxury' },
                ].map((item) => (
                  <div key={item.k}>
                    <div className="text-xs font-semibold mb-1">{item.label}</div>
                    <InputField
                      value={(ikigai as any)[item.k]}
                      onChange={(val) => setIkigai({ ...ikigai, [item.k]: val })}
                      example={item.ex}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-black text-[#F5E6A3] border border-[#D4AF37]">
                <div className="text-xs tracking-widest text-[#D4AF37] font-mono">
                  INTERSECTION — YOUR PURPOSE / PURPOSE AT CENTER
                </div>
                <textarea
                  value={ikigai.purpose}
                  onChange={(e) => setIkigai({ ...ikigai, purpose: e.target.value })}
                  placeholder="At the intersection of all four lies your Ikigai..."
                  className="w-full mt-2 bg-transparent border border-[#D4AF37]/30 rounded-xl p-3 text-sm min-h-[72px] text-white"
                />
                <ExampleCallout text="Our Ikigai: To make heritage desirable — merging love for craft, skill in design, need for sustainability, and market for conscious luxury." />
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <SectionHeader>Golden Circle — WHY / HOW / WHAT</SectionHeader>
                <div className="space-y-4 mt-2">
                  {[
                    { k: 'why', label: 'WHY — Belief (ඇයි)', ex: 'We believe craft is dignity, not charity' },
                    { k: 'how', label: 'HOW — Process (කෙසේද)', ex: 'By partnering directly with artisan clusters, zero middlemen' },
                    { k: 'what', label: 'WHAT — Product (මොනවාද)', ex: 'Handloom sarees, shirts, bags with modern cuts' },
                  ].map((item) => (
                    <div key={item.k}>
                      <div className="text-xs font-semibold">{item.label}</div>
                      <textarea
                        value={(goldenCircle as any)[item.k]}
                        onChange={(e) => setGoldenCircle({ ...goldenCircle, [item.k]: e.target.value })}
                        className="w-full rounded-xl bg-[#FCFBF8] border p-3 text-sm min-h-[64px] mt-1 text-black"
                      />
                      <ExampleCallout text={item.ex} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader>Brand Legacy Letter 2030</SectionHeader>
                <InputField
                  value={legacyLetter}
                  onChange={setLegacyLetter}
                  placeholder="Dear 2025 self, by 2030 we have..."
                  example="Dear past me, 2030 — Tani now employs 500 artisans, we opened a loom museum in Galle, our pieces are in 30 countries, and my daughter says 'Amma, your work matters'."
                />
                <div
                  className="mt-3 p-4 rounded-xl bg-[#0a0a0a] text-[#F5F1E8] text-sm leading-7 font-serif border border-[#D4AF37]/30"
                >
                  {legacyLetter || 'Your 2030 letter will appear here in luxury manuscript style...'}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: DNA & STORY */}
        {tabIndex === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Brand DNA &amp; Story
            </h1>
            <Card>
              <SectionHeader>Brand DNA Formula</SectionHeader>
              <div className="p-4 rounded-xl bg-black text-white flex flex-wrap gap-2 items-center justify-center text-sm">
                <span className="px-3 py-1.5 rounded-full bg-white/10">Purpose: {dna.purpose || '___'}</span>
                <span className="text-[#D4AF37]">+</span>
                <span className="px-3 py-1.5 rounded-full bg-white/10">Values: {dna.values || '___'}</span>
                <span className="text-[#D4AF37]">+</span>
                <span className="px-3 py-1.5 rounded-full bg-white/10">Personality: {dna.personality || '___'}</span>
                <span className="text-[#D4AF37]">+</span>
                <span className="px-3 py-1.5 rounded-full bg-white/10">Story: {dna.story || '___'}</span>
                <span className="text-[#D4AF37]">=</span>
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-black font-bold">
                  DNA = {archetype}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                {[
                  { k: 'purpose', label: 'Purpose', ex: 'Preserve craft' },
                  { k: 'values', label: 'Values', ex: 'Authentic, Slow, Respect' },
                  { k: 'personality', label: 'Personality', ex: 'Warm, Minimal, Confident' },
                  { k: 'story', label: 'Story', ex: 'Daughter of weaver returns to village' },
                ].map((item) => (
                  <div key={item.k}>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <input
                      value={(dna as any)[item.k]}
                      onChange={(e) => setDna({ ...dna, [item.k]: e.target.value })}
                      className="w-full rounded-xl border p-2.5 text-sm mt-1 bg-[#FCFBF8] text-black"
                    />
                    <ExampleCallout text={item.ex} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionHeader>Brand Story — Origin &amp; Mission</SectionHeader>
              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  value={story.started}
                  onChange={(val) => setStory({ ...story, started: val })}
                  placeholder="How did brand start?"
                  example="Started in my grandmother's house in Matara, with 2 looms and mother's old patterns."
                />
                <InputField
                  value={story.founder}
                  onChange={(val) => setStory({ ...story, founder: val })}
                  placeholder="Founder personal story"
                  example="Founder: Anuki, 29, left corporate job in Singapore, returned because village looms were silent."
                />
                <InputField
                  value={story.purposeStory}
                  onChange={(val) => setStory({ ...story, purposeStory: val })}
                  placeholder="Purpose story"
                  example="Purpose story: Every saree sold keeps a loom singing — we don't make clothes, we keep culture breathing."
                />
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: PERSONALITY & ARCHETYPE */}
        {tabIndex === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Personality &amp; Archetype
            </h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <SectionHeader>Personality Chips</SectionHeader>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    'Friendly', 'Luxury', 'Bold', 'Elegant', 'Minimal',
                    'Creative', 'Classic', 'Street', 'Modern', 'Premium',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setPersonalityChips((prev) =>
                          prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
                        );
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                        personalityChips.includes(chip)
                          ? 'bg-black text-[#D4AF37] border-black font-bold'
                          : 'bg-white border-[#e5d8b0] hover:border-[#D4AF37]'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <SectionHeader>Personality Spectrum Sliders</SectionHeader>
                  {[
                    { k: 'serious', l: 'Serious', r: 'Playful' },
                    { k: 'classic', l: 'Classic', r: 'Modern' },
                    { k: 'bold', l: 'Minimal', r: 'Bold' },
                    { k: 'luxury', l: 'Street', r: 'Luxury' },
                    { k: 'street', l: 'Formal', r: 'Friendly' },
                  ].map((item) => (
                    <div key={item.k} className="flex items-center gap-3">
                      <span className="text-[11px] w-16 text-black">{item.l}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={(sliders as any)[item.k]}
                        onChange={(e) => setSliders({ ...sliders, [item.k]: Number(e.target.value) })}
                        className="flex-1 accent-[#D4AF37]"
                      />
                      <span className="text-[11px] w-16 text-right text-black">{item.r}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <SectionHeader>Archetype 12 Grid</SectionHeader>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {ARCHETYPES.map((arch) => (
                    <button
                      key={arch}
                      onClick={() => setArchetype(arch)}
                      className={`p-3 rounded-xl border text-left transition ${
                        archetype === arch
                          ? 'bg-black text-[#D4AF37] border-black shadow-md'
                          : 'bg-[#FFFBEB] border-amber-100 hover:border-[#D4AF37]'
                      }`}
                    >
                      <div className="font-bold text-xs">{arch}</div>
                      <div className="text-[10px] mt-1 leading-tight opacity-80">
                        {ARCHETYPE_DESCS[arch]}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-[#0a0a0a] text-[#D4AF37] text-sm">
                  Active Archetype: <b>{archetype}</b> — {ARCHETYPE_DESCS[archetype]}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 4: VOICE & CULTURE */}
        {tabIndex === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Voice &amp; Culture
            </h1>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <SectionHeader>Brand Voice &amp; Tone</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {['Friendly', 'Luxury', 'Professional', 'Minimal', 'Confident'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setVoiceStyle(style)}
                      className={`px-3 py-1.5 rounded-full text-xs border ${
                        voiceStyle === style ? 'bg-black text-[#D4AF37] border-black font-bold' : 'bg-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <SectionHeader>Voice Chart — This but not That</SectionHeader>
                  <table className="w-full text-xs border rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-black text-[#D4AF37]">
                        <th className="p-2 text-left">We Say This ✅</th>
                        <th className="p-2 text-left">Not That ❌</th>
                      </tr>
                    </thead>
                    <tbody>
                      {voiceChart.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-1">
                            <input
                              value={row.this}
                              onChange={(e) => {
                                const next = [...voiceChart];
                                next[idx].this = e.target.value;
                                setVoiceChart(next);
                              }}
                              className="w-full bg-[#FFFBEB] rounded p-1 text-black"
                            />
                          </td>
                          <td className="p-1">
                            <input
                              value={row.not}
                              onChange={(e) => {
                                const next = [...voiceChart];
                                next[idx].not = e.target.value;
                                setVoiceChart(next);
                              }}
                              className="w-full bg-white rounded p-1 border text-black"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <SectionHeader>Mantra (3 words) + Essence Sentence</SectionHeader>
                <input
                  value={mantra.three}
                  onChange={(e) => setMantra({ ...mantra, three: e.target.value })}
                  placeholder="Slow. Rooted. True."
                  className="w-full rounded-xl border p-3 text-sm bg-black text-[#D4AF37] font-bold tracking-widest"
                />
                <textarea
                  value={mantra.essence}
                  onChange={(e) => setMantra({ ...mantra, essence: e.target.value })}
                  placeholder="Essence sentence..."
                  className="w-full rounded-xl border p-3 text-sm mt-3 bg-[#FCFBF8] text-black"
                />
              </Card>
            </div>
          </div>
        )}

        {/* TAB 5: BELIEFS & IDENTITY SYSTEM */}
        {tabIndex === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Beliefs &amp; Identity System
            </h1>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { k: 'promise', label: 'Brand Promise', ex: 'We promise heirloom quality, not seasonal trend' },
                { k: 'belief', label: 'Brand Belief', ex: 'We believe what you wear shapes how you respect craft' },
                { k: 'philosophy', label: 'Philosophy', ex: 'Less, better, longer — Dieter Rams meets Sri Lankan loom' },
              ].map((item) => (
                <Card key={item.k}>
                  <SectionHeader>{item.label}</SectionHeader>
                  <InputField
                    value={(beliefs as any)[item.k]}
                    onChange={(val) => setBeliefs({ ...beliefs, [item.k]: val })}
                    example={item.ex}
                  />
                </Card>
              ))}
            </div>

            <Card>
              <SectionHeader>Brand Keywords (20 Tags)</SectionHeader>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-3">
                {keywords.map((kw, idx) => (
                  <input
                    key={idx}
                    value={kw}
                    onChange={(e) => {
                      const next = [...keywords];
                      next[idx] = e.target.value;
                      setKeywords(next);
                    }}
                    placeholder={`Keyword ${idx + 1}`}
                    className="rounded-full border px-3 py-2 text-xs bg-[#FFFBEB] border-amber-100 focus:border-[#D4AF37] outline-none text-black"
                  />
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: POSITIONING & BUSINESS */}
        {tabIndex === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Positioning &amp; Business
            </h1>
            <Card>
              <SectionHeader>Positioning Formula Statement</SectionHeader>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                {[
                  { k: 'target', label: 'For [Target Audience]', ex: 'conscious women 25-40 in Colombo & diaspora' },
                  { k: 'category', label: 'is a [Category]', ex: 'slow fashion brand' },
                  { k: 'benefit', label: 'that provides [Unique Benefit]', ex: 'makes heritage wearable daily' },
                  { k: 'reason', label: 'because [Reason to Believe]', ex: 'handwoven by women artisans with 3x fair wage' },
                ].map((item) => (
                  <div key={item.k}>
                    <div className="text-xs font-semibold mb-1">{item.label}</div>
                    <input
                      value={(positioning as any)[item.k]}
                      onChange={(e) => setPositioning({ ...positioning, [item.k]: e.target.value })}
                      className="w-full rounded-xl border p-2.5 text-sm bg-[#FFFBEB] text-black"
                    />
                    <ExampleCallout text={item.ex} />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-black text-white text-sm leading-6">
                <div className="text-[10px] tracking-widest text-[#D4AF37] font-mono">
                  FINAL POSITIONING STATEMENT
                </div>
                <div className="mt-2 font-editorial text-base">
                  For <b className="text-[#D4AF37]">{positioning.target || '[Target]'}</b> who seeks{' '}
                  <b>{positioning.benefit || '[Benefit]'}</b>, <b>{studentName}'s Brand</b> is a{' '}
                  <b className="text-[#D4AF37]">{positioning.category || '[Category]'}</b> that{' '}
                  <b>{positioning.benefit}</b> because <b>{positioning.reason}</b>.
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 7: LIBRARY & PREVIEW */}
        {tabIndex === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Library &amp; Brand Book Preview
            </h1>
            <Card className="!border-l-[6px] border-[#D4AF37]">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader>Official Brand Book Live Preview (A4 Portrait)</SectionHeader>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 rounded-full bg-[#540d18] border border-[#D4AF37] text-[#f7e2a9] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Download PDF / Print</span>
                  </button>
                  <button
                    onClick={handleSaveBrandBookHtml}
                    className="px-4 py-2 rounded-full bg-black text-[#D4AF37] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save HTML</span>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#0a0a0a] text-[#F5F1E8] border border-[#D4AF37]/30 font-serif space-y-6">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] block">
                      TANI BRAND IDENTITY PORTFOLIO
                    </span>
                    <h2 className="text-2xl font-editorial font-bold text-[#f7e2a9] mt-1">
                      {mantra.three || 'Slow. Rooted. True.'}
                    </h2>
                    <p className="text-xs text-white/70">{mantra.essence}</p>
                  </div>
                  {logoImg && (
                    <img src={logoImg} alt="Brand" className="w-16 h-16 object-contain bg-white rounded p-1" />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[#D4AF37] font-bold block mb-1">WHY / PURPOSE:</span>
                    <p className="text-white/80">{canvas.why || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[#D4AF37] font-bold block mb-1">MISSION:</span>
                    <p className="text-white/80">{canvas.mission || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[#D4AF37] font-bold block mb-1">ARCHETYPE:</span>
                    <p className="text-white/80">{archetype} — {ARCHETYPE_DESCS[archetype]}</p>
                  </div>
                  <div>
                    <span className="text-[#D4AF37] font-bold block mb-1">POSITIONING:</span>
                    <p className="text-white/80">For {positioning.target} ({positioning.category})</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 8: COLLECTIONS MANAGEMENT */}
        {tabIndex === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap justify-between gap-4 items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
                  Fashion Collections Management
                </h1>
                <p className="text-xs md:text-sm text-neutral-600">
                  Build multi-drop clothing capsule collections with sketches, costing, and margin analysis.
                </p>
              </div>

              <button
                onClick={() => {
                  const newId = `ac${Date.now()}`;
                  setCollections([
                    ...collections,
                    {
                      id: newId,
                      name: `New Collection ${collections.length + 1}`,
                      season: 'SS25',
                      year: '2025',
                      theme: '',
                      inspiration: '',
                      numLooks: '6',
                      priceRange: '',
                      launchDate: '',
                      status: 'Concept',
                      looks: [],
                      drops: [],
                    },
                  ]);
                  setActiveCollectionId(newId);
                  showToast('New Collection Created!');
                }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] text-black text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Collection</span>
              </button>
            </div>

            {/* Collection Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setActiveCollectionId(col.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border ${
                    activeCollectionId === col.id ? 'bg-black text-[#D4AF37] border-black font-bold' : 'bg-white'
                  }`}
                >
                  {col.name} ({col.season})
                </button>
              ))}
            </div>

            {activeCol && (
              <Card>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1">Collection Name</label>
                    <input
                      value={activeCol.name}
                      onChange={(e) =>
                        setCollections((prev) =>
                          prev.map((c) => (c.id === activeCol.id ? { ...c, name: e.target.value } : c))
                        )
                      }
                      className="w-full rounded-xl border p-2 text-xs bg-[#FCFBF8] text-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Season</label>
                    <select
                      value={activeCol.season}
                      onChange={(e) =>
                        setCollections((prev) =>
                          prev.map((c) => (c.id === activeCol.id ? { ...c, season: e.target.value } : c))
                        )
                      }
                      className="w-full rounded-xl border p-2 text-xs bg-[#FCFBF8] text-black"
                    >
                      <option>SS25</option>
                      <option>AW25</option>
                      <option>Resort 25</option>
                      <option>Pre-Fall 25</option>
                      <option>SS26</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Target Price Range LKR</label>
                    <input
                      value={activeCol.priceRange}
                      onChange={(e) =>
                        setCollections((prev) =>
                          prev.map((c) => (c.id === activeCol.id ? { ...c, priceRange: e.target.value } : c))
                        )
                      }
                      placeholder="8500-18500"
                      className="w-full rounded-xl border p-2 text-xs bg-[#FCFBF8] text-black"
                    />
                  </div>
                </div>

                {/* Looks Builder */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <SectionHeader>Looks &amp; Sketches ({activeCol.looks?.length || 0})</SectionHeader>
                    <button
                      onClick={() => {
                        const newLook = {
                          id: `look-${Date.now()}`,
                          lookNo: String((activeCol.looks?.length || 0) + 1).padStart(2, '0'),
                          name: `Look ${(activeCol.looks?.length || 0) + 1}`,
                          category: 'Dress',
                          fabric: '',
                          color: '#D4AF37',
                          img: null,
                          desc: '',
                          styling: '',
                          matCost: '2000',
                          stitchCost: '1500',
                          sellPrice: '9500',
                        };
                        setCollections((prev) =>
                          prev.map((c) =>
                            c.id === activeCol.id ? { ...c, looks: [...(c.looks || []), newLook] } : c
                          )
                        );
                      }}
                      className="px-3 py-1 rounded-full bg-black text-[#D4AF37] text-xs font-bold"
                    >
                      + Add Look
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {(activeCol.looks || []).map((look: any) => (
                      <div key={look.id} className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs">Look #{look.lookNo}</span>
                          <button
                            onClick={() => {
                              setCollections((prev) =>
                                prev.map((c) =>
                                  c.id === activeCol.id
                                    ? { ...c, looks: c.looks.filter((l: any) => l.id !== look.id) }
                                    : c
                                )
                              );
                            }}
                            className="text-red-500 text-xs font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                        <label className="block aspect-[4/5] rounded-lg border-2 border-dashed border-[#D4AF37]/50 bg-white grid place-items-center overflow-hidden cursor-pointer relative">
                          {look.img ? (
                            <img src={look.img} alt={look.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-neutral-400">+ Upload Sketch</span>
                          )}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const b64 = await fileToBase64(f);
                                setCollections((prev) =>
                                  prev.map((c) =>
                                    c.id === activeCol.id
                                      ? {
                                          ...c,
                                          looks: c.looks.map((l: any) =>
                                            l.id === look.id ? { ...l, img: b64 } : l
                                          ),
                                        }
                                      : c
                                  )
                                );
                              }
                            }}
                          />
                        </label>
                        <input
                          value={look.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCollections((prev) =>
                              prev.map((c) =>
                                c.id === activeCol.id
                                  ? { ...c, looks: c.looks.map((l: any) => (l.id === look.id ? { ...l, name: val } : l)) }
                                  : c
                              )
                            );
                          }}
                          placeholder="Look Name"
                          className="w-full rounded border px-2 py-1 text-xs bg-white text-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* TAB 9: STYLE & SEASON */}
        {tabIndex === 9 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Style Library &amp; Seasonal Direction
            </h1>
            <Card>
              <SectionHeader>Seasonal Direction for {seasonSelected}</SectionHeader>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Color Direction</label>
                  <textarea
                    value={seasonDirections.color}
                    onChange={(e) => setSeasonDirections({ ...seasonDirections, color: e.target.value })}
                    className="w-full rounded-xl border p-2 text-xs min-h-[64px] bg-[#FCFBF8] text-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Fabric Direction</label>
                  <textarea
                    value={seasonDirections.fabric}
                    onChange={(e) => setSeasonDirections({ ...seasonDirections, fabric: e.target.value })}
                    className="w-full rounded-xl border p-2 text-xs min-h-[64px] bg-[#FCFBF8] text-black"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 10: COLOR & MOODBOARD STUDIO */}
        {tabIndex === 10 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h1 className="text-2xl md:text-3xl font-editorial font-bold text-[#0a0a0a]">
              Color Theory &amp; Moodboard Studio
            </h1>

            <Card>
              <SectionHeader>Custom Brand Palette</SectionHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                {Object.entries(customPalette).map(([key, hex]) => (
                  <div key={key} className="p-3 rounded-xl bg-[#FCFBF8] border text-center space-y-2">
                    <span className="text-[11px] font-semibold uppercase text-black block">{key}</span>
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => setCustomPalette({ ...customPalette, [key]: e.target.value })}
                      className="w-12 h-12 rounded-lg border mx-auto block cursor-pointer"
                    />
                    <input
                      value={hex}
                      onChange={(e) => setCustomPalette({ ...customPalette, [key]: e.target.value })}
                      className="w-full text-center rounded border px-1 py-0.5 text-xs font-mono text-black"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="!border-l-[6px] border-[#D4AF37]">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <SectionHeader>Moodboard Gallery (Upload &amp; Arrange Up To 15 Images)</SectionHeader>
                <div className="flex gap-2">
                  {(['grid', 'collage', 'polaroid', 'magazine'] as const).map((tmpl) => (
                    <button
                      key={tmpl}
                      onClick={() => setMoodTemplate(tmpl)}
                      className={`px-3 py-1 rounded-full text-xs capitalize border ${
                        moodTemplate === tmpl ? 'bg-black text-[#D4AF37] font-bold' : 'bg-white'
                      }`}
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-neutral-900 border border-[#D4AF37]/30">
                {moodboardItems.map((item, idx) => (
                  <div key={idx} className="aspect-square rounded-lg bg-black/60 border border-white/20 overflow-hidden relative group">
                    {item.img ? (
                      <>
                        <img src={item.img} alt={`Mood ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            const next = [...moodboardItems];
                            next[idx] = { img: null, caption: '' };
                            setMoodboardItems(next);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white grid place-items-center text-xs opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full grid place-items-center cursor-pointer text-[10px] text-white/50 hover:text-white">
                        <span>+ Slot {idx + 1}</span>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const b64 = await fileToBase64(f);
                              const next = [...moodboardItems];
                              next[idx] = { img: b64, caption: `Inspiration #${idx + 1}` };
                              setMoodboardItems(next);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Status Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37] text-xs font-semibold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
