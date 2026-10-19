import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  X,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Film,
  ChevronDown,
  ChevronUp,
  Info,
  Video,
  Monitor,
  Tv,
  Smartphone,
  SlidersHorizontal,
  MoveVertical,
  Hand,
  Minimize2,
} from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  isPinterestUrl,
  getPinterestEmbedUrl,
  isDirectVideoUrl,
} from '../../lib/mediaUtils';
import { useData } from '../../context/DataContext';

export interface SewingVideoTutorialItem {
  id: string;
  pinId?: string;
  category: 'darts' | 'zippers' | 'collars' | 'tailoring' | 'sleeves' | 'skirts' | 'finishing';
  categoryLabelSi: string;
  categoryLabelEn: string;
  titleSi: string; // Advanced Sinhala Title
  titleEn: string;
  descriptionSi?: string; // Rich Sinhala Tailoring Description & Instructions
  descriptionEn?: string; // Rich English Tailoring Description
  youtubeUrl: string; // Pinterest URL / YouTube URL / Direct Video URL
  thumbnailUrl?: string;
  duration: string;
  levelSi: string;
  levelEn: string;
  badgeSi: string;
  badgeEn: string;
  viewsCount: string;
}

export const DEFAULT_SEWING_VIDEOS: SewingVideoTutorialItem[] = [
  {
    id: 'vid-french-darts',
    pinId: 'pin-696932-01',
    category: 'darts',
    categoryLabelSi: 'ඩාට් සහ බඳ හැඩතල',
    categoryLabelEn: 'Darts & Shaping',
    titleSi: 'උසස් ප්‍රංශ ඩාට් (French Darts) විලාසිතා හා පපුවේ උච්ච හැඩතල තාක්ෂණය',
    titleEn: 'French Darts Slash & Spread Apex Draping Technique',
    descriptionSi: 'බඳ රේඛාවේ සිට පපුවේ උච්ච ලක්ෂ්‍යය (Bust Apex) දක්වා ආනතව දිවෙන සුඛෝපභෝගී ප්‍රංශ ඩාට් තාක්ෂණය. Slash & Spread ක්‍රමවේදය, උච්චයට අඟල් 1ක් මෙපිටින් මැහුම නතර කර ගැට ගැසීම සහ Tailor Ham මඟින් වක්‍රාකාරව Iron Press කිරීම මෙහිදී පියවරෙන් පියවර විස්තර කෙරේ.',
    descriptionEn: 'Couture French Dart technique running diagonally from lower side seam towards bust apex. Step-by-step guidance on slash-and-spread pattern manipulation, stopping stitching 1" before apex point, and curved pressing over a tailor\'s ham.',
    youtubeUrl: 'https://www.youtube.com/watch?v=c4o9_MxjGxY',
    thumbnailUrl: 'https://img.youtube.com/vi/c4o9_MxjGxY/hqdefault.jpg',
    duration: '14:20 min',
    levelSi: 'විශේෂඥ (Advanced)',
    levelEn: 'Advanced',
    badgeSi: 'Couture Bodice',
    badgeEn: 'Couture Bodice',
    viewsCount: '18.4K',
  },
  {
    id: 'vid-invisible-zipper',
    pinId: 'pin-696932-02',
    category: 'zippers',
    categoryLabelSi: 'සිපර් සහ මැහුම්',
    categoryLabelEn: 'Zippers & Seams',
    titleSi: 'නොපෙනෙන සිපර් (Invisible Zipper) රැලි නොවැටී මනාව සවි කිරීමේ රහස',
    titleEn: 'Flawless Invisible Zipper Installation without Puckering',
    descriptionSi: 'නොපෙනෙන සිපර් (Invisible Zipper) කිසිදු රැල්ලක් හෝ ගැස්මක් නොමැතිව ගවුම් හා සායවල් වලට සවි කිරීමේ රහස. විශේෂ Concealed Zipper Foot භාවිතය, සිපර් දත් දිගහැර මැසීම සහ මැහුම් වාසි සමානව තබා ගැනීමේ ප්‍රායෝගික උපදෙස්.',
    descriptionEn: 'Learn professional invisible zipper application using a specialized concealed zipper foot. Covers unrolling zipper coils, basting stitch alignment, and securing invisible seams without fabric puckering.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4XTCQsSLBFw',
    thumbnailUrl: 'https://img.youtube.com/vi/4XTCQsSLBFw/hqdefault.jpg',
    duration: '11:45 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Clean Zipper',
    badgeEn: 'Clean Zipper',
    viewsCount: '24.1K',
  },
  {
    id: 'vid-notched-lapel',
    pinId: 'pin-696932-03',
    category: 'collars',
    categoryLabelSi: 'කර සහ කරපටි',
    categoryLabelEn: 'Collars & Lapels',
    titleSi: 'නොච් ලැපල් (Notched Lapel) කෝට් කර සහ රෝල් ලයින් පරිපූර්ණ නිර්මාණය',
    titleEn: 'Tailored Notched Lapel Coat Collar & Roll Line Masterclass',
    descriptionSi: 'බ්ලේසර් සහ කෝට් සඳහා නොච් ලැපල් (Notched Lapel) කරපටි කැපීම සහ මැසීම. Horsehair කැන්වස් ඇලවීම, රෝල් ලයින් එක Pad Stitching කිරීම සහ කරපටියේ 90° කොන් මනාව පිටතට හැරවීමේ සම්ප්‍රදායික සැවිල් රෝ (Savile Row) ටේලරින් ශිල්පය.',
    descriptionEn: 'Bespoke tailoring masterclass on drafting and constructing classic notched lapels. Covers horsehair canvas interfacing, pad stitching the roll line, and pressing crisp 90-degree collar gorge points.',
    youtubeUrl: 'https://www.youtube.com/watch?v=E1TEvxgmVf0',
    thumbnailUrl: 'https://img.youtube.com/vi/E1TEvxgmVf0/hqdefault.jpg',
    duration: '22:15 min',
    levelSi: 'විශේෂඥ (Masterclass)',
    levelEn: 'Masterclass',
    badgeSi: 'Bespoke Tailoring',
    badgeEn: 'Bespoke Tailoring',
    viewsCount: '15.9K',
  },
  {
    id: 'vid-princess-seams',
    pinId: 'pin-696932-04',
    category: 'tailoring',
    categoryLabelSi: 'කෝට් සහ බ්ලේසර්',
    categoryLabelEn: 'Coats & Tailoring',
    titleSi: 'කිහිල්ලේ සිට වාටිය දක්වා අඛණ්ඩ ප්‍රින්සස් කට් (Princess Seams) මැහුම් ශිල්පය',
    titleEn: 'Continuous Armhole-to-Hem Princess Seams Construction',
    descriptionSi: 'කිහිල්ලේ වක්‍රයේ (Armhole) සිට පහළ වාටිය දක්වා අඛණ්ඩව දිවෙන ප්‍රින්සස් කට් මැහුම. උත්තල (Convex) සහ අවතල (Concave) වක්‍ර රෙදි රැළි නොවැටී බද්ධ කිරීම, මැහුම් වාටි වල කුඩා කැපුම් (Notches & Clipping) දැමීම සහ යකඩ බෝලයක් (Tailor Ham) මතින් හැඩ ගැන්වීම.',
    descriptionEn: 'Continuous armhole-to-hem princess seams construction. Joining opposing convex and concave curved seams with precise notch clipping, easing, and pressing for sculpted silhouette.',
    youtubeUrl: 'https://www.youtube.com/watch?v=9h47LyYvkGs',
    thumbnailUrl: 'https://img.youtube.com/vi/9h47LyYvkGs/hqdefault.jpg',
    duration: '16:30 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Hourglass Seams',
    badgeEn: 'Hourglass Seams',
    viewsCount: '19.8K',
  },
  {
    id: 'vid-set-in-sleeve',
    pinId: 'pin-696932-05',
    category: 'sleeves',
    categoryLabelSi: 'අත් සහ කෆ් විලාසිතා',
    categoryLabelEn: 'Sleeves & Cuffs',
    titleSi: 'උරහිසට රැලි නොවැටී අත (Set-in Sleeve) නිවැරදිව බද්ධ කිරීමේ ක්‍රමවේදය',
    titleEn: 'Flawless Set-in Sleeve with Eased Shoulder Cap',
    descriptionSi: 'කිහිල්ලට අත රැලි නොවැටී මනාව බද්ධ කිරීමේ (Set-in Sleeve) රහස. Ease Stitching නූල් ඇදීම, උරහිස් කට්ටලයේ හැඩය රඳවා ගැනීම සහ අත ඇතුළත Sleeve Heading පටියක් යොදා පිරුණු පෙනුමක් ලබා දීම.',
    descriptionEn: 'Professional set-in sleeve insertion with eased cap. Preventing puckers at shoulder head, clipping underarm curves, and installing sleeve headers for tailored structure.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kWfjGh1-z38',
    thumbnailUrl: 'https://img.youtube.com/vi/kWfjGh1-z38/hqdefault.jpg',
    duration: '13:50 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Tailored Shoulder',
    badgeEn: 'Tailored Shoulder',
    viewsCount: '21.5K',
  },
  {
    id: 'vid-box-pleats',
    pinId: 'pin-696932-06',
    category: 'skirts',
    categoryLabelSi: 'සාය සහ රැලි මෝස්තර',
    categoryLabelEn: 'Skirts & Pleats',
    titleSi: 'සාය සඳහා ගණිතමය ගැඹුරු බොක්ස් රැලි (Inverted Box Pleats) සැකසීම',
    titleEn: 'Inverted Box Pleats Mathematical Calculation & Pressing',
    descriptionSi: 'සායවල් සඳහා ගණිතමය වශයෙන් නිවැරදි ගැඹුරු බොක්ස් රැලි (Inverted Box Pleats) ගණනය කිරීම. රෙදි පළල මැනීම, එක් එක් රැල්ලේ ගැඹුර සලකුණු කිරීම සහ වාෂ්ප යකඩෙන් (Steam Press) ස්ථිර හැඩයක් ලබා දීම.',
    descriptionEn: 'Precise mathematical layout and pressing of architectural inverted box pleats for skirts. Calculating fabric intake, pinning pleat depth, and steam creasing.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q6lZ7BRBBH0',
    thumbnailUrl: 'https://img.youtube.com/vi/Q6lZ7BRBBH0/hqdefault.jpg',
    duration: '15:10 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Architectural Flare',
    badgeEn: 'Architectural Flare',
    viewsCount: '12.8K',
  },
  {
    id: 'vid-hong-kong-finish',
    pinId: 'pin-696932-07',
    category: 'finishing',
    categoryLabelSi: 'මැහුම් වාටි හා නිමාවන්',
    categoryLabelEn: 'Finishing & Hems',
    titleSi: 'හොංකොං මැහුම් වාටිය (Hong Kong Seam Finish) උසස් කෝචර් නිමාව',
    titleEn: 'Couture Hong Kong Seam Binding on Unlined Garments',
    descriptionSi: 'ඇතුළත ලයිනිං නොමැති කෝට් සහ ගවුම් වල මැහුම් වාටි බයස් පටි (Bias Binding) මඟින් හොංකොං ක්‍රමයට ආවරණය කිරීම. සේද හෝ කපු බයස් පටිවලින් ඇඳුම තුළ සුඛෝපභෝගී කෝචර් නිමාවක් ලබා ගැනීම.',
    descriptionEn: 'Couture Hong Kong seam finish using fine bias binding strips. Encasing raw edges cleanly on unlined garments for an atelier-grade luxury interior.',
    youtubeUrl: 'https://www.youtube.com/watch?v=H9JGNJ6__lc',
    thumbnailUrl: 'https://img.youtube.com/vi/H9JGNJ6__lc/hqdefault.jpg',
    duration: '10:40 min',
    levelSi: 'ආරම්භක (Beginner)',
    levelEn: 'Beginner',
    badgeSi: 'Haute Couture',
    badgeEn: 'Haute Couture',
    viewsCount: '31.2K',
  },
  {
    id: 'vid-curved-waistband',
    pinId: 'pin-696932-08',
    category: 'skirts',
    categoryLabelSi: 'සාය සහ රැලි මෝස්තර',
    categoryLabelEn: 'Skirts & Pleats',
    titleSi: 'ශරීරයට මනාව හසුවන වක්‍ර ඉණ පටිය (Contoured Curved Waistband) මැසීම',
    titleEn: 'Anatomical Contoured Curved Waistband Drafting & Interfacing',
    descriptionSi: 'සිරුරේ ස්වාභාවික හැඩයට මනාව හසුවන වක්‍ර ඉණ පටි (Contoured Curved Waistband). අඟල් 1.5 - 2 අතර හැඩැති ඉණ පටි ඩ්‍රාෆ්ට් කිරීම, ඇතුළත Fusible Interfacing ඇලවීම සහ ඉණ පිටුපස විවර නොවන සේ මැසීම.',
    descriptionEn: 'Anatomical contoured waistband drafting and sewing. Eliminates back gap on high-waist skirts and trousers with fusible interfacing and clean edge topstitching.',
    youtubeUrl: 'https://www.youtube.com/watch?v=UFNCFFhoP10',
    thumbnailUrl: 'https://img.youtube.com/vi/UFNCFFhoP10/hqdefault.jpg',
    duration: '12:15 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Zero Gaping',
    badgeEn: 'Zero Gaping',
    viewsCount: '17.3K',
  },
  {
    id: 'vid-besom-pocket',
    pinId: 'pin-696932-09',
    category: 'tailoring',
    categoryLabelSi: 'කෝට් සහ බ්ලේසර්',
    categoryLabelEn: 'Coats & Tailoring',
    titleSi: 'බ්ලේසර් සඳහා ද්විත්ව වෙල්ට් සහ කෝණික ෆ්ලැප් සාක්කු (Besom Pocket) තාක්ෂණය',
    titleEn: 'Double-Besom Welt Pocket with Tailored Flap Insertion',
    descriptionSi: 'කෝට් සහ කලිසම් සඳහා ද්විත්ව වෙල්ට් (Double Besom) සහ කෝණික ෆ්ලැප් සාක්කු සවි කිරීම. සාක්කු විවරය නිවැරදිව කැපීම, ත්‍රිකෝණාකාර කොන් ශක්තිමත් කිරීම සහ අභ්‍යන්තර සාක්කු බෑගය බද්ධ කිරීම.',
    descriptionEn: 'Savile Row double-besom welt pocket with tailored flap insertion. Precision slit cutting, triangular corner reinforcement, and pocket bag assembly.',
    youtubeUrl: 'https://www.youtube.com/watch?v=22CnRTCdSsU',
    thumbnailUrl: 'https://img.youtube.com/vi/22CnRTCdSsU/hqdefault.jpg',
    duration: '24:00 min',
    levelSi: 'විශේෂඥ (Masterclass)',
    levelEn: 'Masterclass',
    badgeSi: 'Savile Row Technique',
    badgeEn: 'Savile Row Technique',
    viewsCount: '14.6K',
  },
  {
    id: 'vid-bias-neckline',
    pinId: 'pin-696932-10',
    category: 'collars',
    categoryLabelSi: 'කර සහ කරපටි',
    categoryLabelEn: 'Collars & Lapels',
    titleSi: 'වක්‍ර සහ V-කර සඳහා බයස් පටි (Bias Binding) සියුම්ව යොදා නිම කිරීම',
    titleEn: 'Understitched Bias Neckline Binding without Puckering',
    descriptionSi: 'රවුම් සහ V-හැඩැති කරවල් සඳහා බයස් පටි (Bias Binding) සියුම්ව ඇදීමකින් තොරව යොදා නිම කිරීම. Understitching මැහුම දැමීම මඟින් බයස් පටිය පිටතට නොපෙනී ඇතුළට නැමී සිටීම තහවුරු කිරීම.',
    descriptionEn: 'Clean understitched bias binding on neckline curves and V-necks. Preventing edge stretching, trimming inner bulk, and flawless invisible edge finish.',
    youtubeUrl: 'https://www.youtube.com/watch?v=myDo57_oveI',
    thumbnailUrl: 'https://img.youtube.com/vi/myDo57_oveI/hqdefault.jpg',
    duration: '09:50 min',
    levelSi: 'ආරම්භක (Beginner)',
    levelEn: 'Beginner',
    badgeSi: 'Clean Neckline',
    badgeEn: 'Clean Neckline',
    viewsCount: '28.5K',
  },
  {
    id: 'vid-horsehair-braid',
    pinId: 'pin-696932-11',
    category: 'finishing',
    categoryLabelSi: 'මැහුම් වාටි හා නිමාවන්',
    categoryLabelEn: 'Finishing & Hems',
    titleSi: 'උත්සව ගවුම් වාටි සඳහා හෝස්හෙයා බ්‍රේඩ් (Horsehair Braid Hem) පාවෙන හැඩය',
    titleEn: 'Horsehair Braid Installation for Sculptural Gown Hems',
    descriptionSi: 'උත්සව සහ මනාලියන්ගේ ගවුම් වාටි සඳහා හෝස්හෙයා බ්‍රේඩ් (Horsehair Braid) සවි කිරීම. වාටිය පාවෙන, රැළි ගැහෙන (Sculptural Fluted Hem) ආකාරයෙන් හැඩ ගැන්වීම සහ අත් මැහුමෙන් රඳවා ගැනීම.',
    descriptionEn: 'Red carpet bridal gown sculptural hem finishing with horsehair braid. Adding body, bounce, and wave structure to fluid satin and organza skirts.',
    youtubeUrl: 'https://www.youtube.com/watch?v=lGNp1ZOUfZo',
    thumbnailUrl: 'https://img.youtube.com/vi/lGNp1ZOUfZo/hqdefault.jpg',
    duration: '18:25 min',
    levelSi: 'මධ්‍යම (Intermediate)',
    levelEn: 'Intermediate',
    badgeSi: 'Red Carpet Hem',
    badgeEn: 'Red Carpet Hem',
    viewsCount: '22.0K',
  },
  {
    id: 'vid-tulip-drape',
    pinId: 'pin-696932-12',
    category: 'darts',
    categoryLabelSi: 'ඩාට් සහ බඳ හැඩතල',
    categoryLabelEn: 'Darts & Shaping',
    titleSi: 'ඉදිරිපස ස්ලිට් සහිත විකර්ණ ටියුලිප් රැලි (Tulip Wrap Drape) ඩ්‍රේපින් කලාව',
    titleEn: 'Asymmetrical Tulip Wrap Drape & Overlap Walking Vent',
    descriptionSi: 'ඉදිරිපස ස්ලිට් සහිත විකර්ණ ටියුලිප් රැලි (Tulip Wrap Drape) ඩ්‍රේපින් කලාව. ඉණෙන් අල්ලා ඇති රැලි රටාවන්, ඇවිදීමේ විවරය (Walking Vent) සහ අභ්‍යන්තර ආධාරක බඳ පටිය සකසන අයුරු.',
    descriptionEn: 'Asymmetrical tulip wrap draping with walking vent. Creating controlled gathered folds at waistline, securing overlap drape, and clean hem edges.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8pswShvGw2g',
    thumbnailUrl: 'https://img.youtube.com/vi/8pswShvGw2g/hqdefault.jpg',
    duration: '20:10 min',
    levelSi: 'විශේෂඥ (Masterclass)',
    levelEn: 'Masterclass',
    badgeSi: 'Couture Drape',
    badgeEn: 'Couture Drape',
    viewsCount: '16.7K',
  },
];

export const PinterestSewingTutorials: React.FC = () => {
  const { videos, siteSettings } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeInlineVideoId, setActiveInlineVideoId] = useState<string | null>(null);
  const [theaterModalVideo, setTheaterModalVideo] = useState<SewingVideoTutorialItem | null>(null);

  // Screen size adjustment mode for theater modal ('adaptive' | 'widescreen' | 'portrait' | 'cinema')
  const [modalScreenMode, setModalScreenMode] = useState<'adaptive' | 'widescreen' | 'portrait' | 'cinema'>(
    siteSettings.sewingTutorialsPlayerAspect || 'adaptive'
  );

  // Per-card screen size aspect mode
  const [cardAspectModes, setCardAspectModes] = useState<Record<string, 'adaptive' | 'widescreen' | 'portrait'>>({});

  useEffect(() => {
    if (siteSettings.sewingTutorialsPlayerAspect) {
      setModalScreenMode(siteSettings.sewingTutorialsPlayerAspect);
    }
  }, [siteSettings.sewingTutorialsPlayerAspect]);

  // Expanded description tracker per card
  const [expandedDescIds, setExpandedDescIds] = useState<Record<string, boolean>>({});

  // Vertical scroll & touch-friendly drag gesture states for catalog
  const catalogScrollRef = useRef<HTMLDivElement>(null);
  const [isCatalogDragging, setIsCatalogDragging] = useState<boolean>(false);
  const [catalogStartY, setCatalogStartY] = useState<number>(0);
  const [catalogScrollTop, setCatalogScrollTop] = useState<number>(0);
  const [catalogHasDragged, setCatalogHasDragged] = useState<boolean>(false);
  const [isCatalogExpanded, setIsCatalogExpanded] = useState<boolean>(false);
  const [catalogScrollProgress, setCatalogScrollProgress] = useState<number>(0);
  const [canScrollUpCatalog, setCanScrollUpCatalog] = useState<boolean>(false);
  const [canScrollDownCatalog, setCanScrollDownCatalog] = useState<boolean>(true);

  const handleCatalogMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a, input, select, iframe, video')) return;
    if (!catalogScrollRef.current) return;
    setIsCatalogDragging(true);
    setCatalogHasDragged(false);
    setCatalogStartY(e.pageY - catalogScrollRef.current.offsetTop);
    setCatalogScrollTop(catalogScrollRef.current.scrollTop);
  };

  const handleCatalogMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCatalogDragging || !catalogScrollRef.current) return;
    e.preventDefault();
    const currentY = e.pageY - catalogScrollRef.current.offsetTop;
    const walk = (currentY - catalogStartY) * 1.35;
    if (Math.abs(walk) > 6) {
      setCatalogHasDragged(true);
    }
    catalogScrollRef.current.scrollTop = catalogScrollTop - walk;
  };

  const handleCatalogMouseUp = () => {
    setIsCatalogDragging(false);
    setTimeout(() => setCatalogHasDragged(false), 60);
  };

  const handleCatalogScroll = () => {
    if (!catalogScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = catalogScrollRef.current;
    const maxScroll = scrollHeight - clientHeight;
    setCanScrollUpCatalog(scrollTop > 15);
    setCanScrollDownCatalog(scrollTop < maxScroll - 15);
    if (maxScroll > 0) {
      setCatalogScrollProgress(Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)));
    } else {
      setCatalogScrollProgress(100);
    }
  };

  const scrollCatalogBy = (amount: number) => {
    if (catalogScrollRef.current) {
      catalogScrollRef.current.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  // Reset scroll position on filter/search change
  useEffect(() => {
    if (catalogScrollRef.current) {
      catalogScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const timer = setTimeout(() => {
      handleCatalogScroll();
    }, 120);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const tabId = siteSettings.sewingTutorialsPinterestTabId || '696932179776250726';
  const showDescriptionByDefault = siteSettings.sewingTutorialsShowDescription !== false;

  // Dynamic texts from backend (Firestore / siteSettings)
  const sectionTitleSi = siteSettings.sewingTutorialsTitleSinhala || 'මැහුම් සහ ටේලරින් වීඩියෝ ටියුටෝරියල්ස්';
  const sectionTitleEn = siteSettings.sewingTutorialsTitle || 'Tailoring & Sewing Video Masterclass Collection';
  const sectionDescSi =
    siteSettings.sewingTutorialsDescriptionSinhala ||
    'Pinterest හරහා තෝරාගත් වෘත්තීය මැහුම් හා ටේලරින් තාක්ෂණික වීඩියෝ පාඩම්, විස්තරාත්මක උපදෙස් සහ පැටර්න් මගපෙන්වීම් පිටතට නොගොස් මෙතැනින්ම නරඹන්න.';
  const sectionBadgeSi =
    siteSettings.sewingTutorialsBadgeTextSinhala ||
    siteSettings.sewingTutorialsBadgeText ||
    `Pinterest Sewing Tutorials Collection (tabId: ${tabId})`;
  const feature1Si = siteSettings.sewingTutorialsFeature1Sinhala || 'සියලුම වීඩියෝ ඇප් එක තුළින්ම ක්‍රියාත්මක වේ';
  const feature2Si = siteSettings.sewingTutorialsFeature2Sinhala || 'පිටතට නොගොස් මෙතැනින්ම Play කරන්න';
  const verifyNoteSi =
    siteSettings.sewingTutorialsVerifyNoteSinhala ||
    '✓ සියලුම වීඩියෝ පිටතට redirect නොවී ඇප් එක තුළින්ම සම්පූර්ණයෙන්ම ක්‍රියාත්මක වේ';

  // Saved pins in local storage
  const [savedPinIds, setSavedPinIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ceylon_saved_sewing_pins');
      return stored ? JSON.parse(stored) : ['vid-french-darts', 'vid-invisible-zipper'];
    } catch {
      return ['vid-french-darts', 'vid-invisible-zipper'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceylon_saved_sewing_pins', JSON.stringify(savedPinIds));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [savedPinIds]);

  // Track deleted video IDs so deleted defaults stay hidden
  const [deletedPinIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ceylon_deleted_sewing_pins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSavePin = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPinIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleExpandDesc = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedDescIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Merge default curated videos with any backend videos from DataContext
  const allSewingVideos = useMemo(() => {
    const backendSewingVideos: SewingVideoTutorialItem[] = videos
      .filter((v) => {
        const cat = (v.category || '').toUpperCase();
        return (
          cat === 'PINTEREST SEWING TUTORIALS' ||
          cat === 'SEWING TUTORIALS' ||
          cat.includes('PINTEREST') ||
          cat.includes('SEWING')
        );
      })
      .map((v) => {
        let cat: 'darts' | 'zippers' | 'collars' | 'tailoring' | 'sleeves' | 'skirts' | 'finishing' = 'tailoring';
        const titleUpper = (v.title || '').toUpperCase() + ' ' + (v.titleSinhala || '');
        const catSin = v.categorySinhala || '';
        if (catSin.includes('ඩාට්') || titleUpper.includes('DART') || titleUpper.includes('ඩාට්')) cat = 'darts';
        else if (catSin.includes('සිපර්') || titleUpper.includes('ZIP') || titleUpper.includes('සිපර්')) cat = 'zippers';
        else if (catSin.includes('කර') || titleUpper.includes('COLLAR') || titleUpper.includes('LAPEL') || titleUpper.includes('කර')) cat = 'collars';
        else if (catSin.includes('අත්') || titleUpper.includes('SLEEVE') || titleUpper.includes('අත්')) cat = 'sleeves';
        else if (catSin.includes('සාය') || catSin.includes('රැලි') || titleUpper.includes('PLEAT') || titleUpper.includes('SKIRT') || titleUpper.includes('සාය')) cat = 'skirts';
        else if (catSin.includes('වාටි') || catSin.includes('නිමාව') || titleUpper.includes('HEM') || titleUpper.includes('FINISH') || titleUpper.includes('වාටි')) cat = 'finishing';

        const categoryLabels: Record<string, { en: string; si: string }> = {
          darts: { en: 'Darts & Shaping', si: 'ඩාට් සහ බඳ හැඩතල' },
          zippers: { en: 'Zippers & Seams', si: 'සිපර් සහ මැහුම්' },
          collars: { en: 'Collars & Lapels', si: 'කර සහ කරපටි' },
          tailoring: { en: 'Coats & Tailoring', si: 'කෝට් සහ බ්ලේසර්' },
          skirts: { en: 'Skirts & Pleats', si: 'සාය සහ රැලි මෝස්තර' },
          sleeves: { en: 'Sleeves & Cuffs', si: 'අත් සහ කෆ් විලාසිතා' },
          finishing: { en: 'Finishing & Hems', si: 'මැහුම් වාටි හා නිමාවන්' },
        };

        return {
          id: v.id,
          pinId: `db-${v.id}`,
          category: cat,
          categoryLabelSi: categoryLabels[cat]?.si || v.categorySinhala || 'මැහුම් ටියුටෝරියල්',
          categoryLabelEn: categoryLabels[cat]?.en || v.category || 'Sewing Tutorial',
          titleSi: v.titleSinhala || v.title,
          titleEn: v.title,
          descriptionSi: v.descriptionSinhala || v.description || 'ප්‍රායෝගික ටේලරින් හා මැහුම් උපදෙස් ඇතුළත් වීඩියෝව.',
          descriptionEn: v.description || 'Hands-on tailoring and couture sewing masterclass guide.',
          youtubeUrl: v.youtubeUrl,
          thumbnailUrl: v.thumbnailUrl,
          duration: v.duration ? (v.duration.includes('min') ? v.duration : `${v.duration} min`) : '12:00 min',
          levelSi: 'විශේෂඥ (Masterclass)',
          levelEn: 'Masterclass',
          badgeSi: 'Saved Masterclass',
          badgeEn: 'Saved Masterclass',
          viewsCount: 'Direct Play',
        };
      });

    // Merge backend videos first (to allow overwriting defaults), then defaults
    const merged = [...backendSewingVideos, ...DEFAULT_SEWING_VIDEOS];
    const seen = new Set<string>();
    return merged
      .filter((item) => !deletedPinIds.includes(item.id))
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
  }, [videos, deletedPinIds]);

  // Filtered tutorials
  const filteredVideos = useMemo(() => {
    return allSewingVideos.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.titleSi.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        (item.descriptionSi && item.descriptionSi.toLowerCase().includes(q)) ||
        (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q)) ||
        item.categoryLabelSi.toLowerCase().includes(q) ||
        item.categoryLabelEn.toLowerCase().includes(q) ||
        item.badgeSi.toLowerCase().includes(q)
      );
    });
  }, [allSewingVideos, searchQuery, selectedCategory]);

  // Navigate next/prev in theater modal
  const currentModalIndex = useMemo(() => {
    if (!theaterModalVideo) return -1;
    return filteredVideos.findIndex((t) => t.id === theaterModalVideo.id);
  }, [theaterModalVideo, filteredVideos]);

  const handleNextVideo = useCallback(() => {
    if (currentModalIndex >= 0 && currentModalIndex < filteredVideos.length - 1) {
      setTheaterModalVideo(filteredVideos[currentModalIndex + 1]);
    }
  }, [currentModalIndex, filteredVideos]);

  const handlePrevVideo = useCallback(() => {
    if (currentModalIndex > 0) {
      setTheaterModalVideo(filteredVideos[currentModalIndex - 1]);
    }
  }, [currentModalIndex, filteredVideos]);

  // ESC and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTheaterModalVideo(null);
      }
      if (e.key === 'ArrowRight' && theaterModalVideo) handleNextVideo();
      if (e.key === 'ArrowLeft' && theaterModalVideo) handlePrevVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theaterModalVideo, handleNextVideo, handlePrevVideo]);

  const categories = [
    { id: 'all', labelSi: 'සියලුම වීඩියෝ', count: allSewingVideos.length },
    { id: 'darts', labelSi: 'ඩාට් සහ බඳ', count: allSewingVideos.filter((v) => v.category === 'darts').length },
    { id: 'zippers', labelSi: 'සිපර් සහ මැහුම්', count: allSewingVideos.filter((v) => v.category === 'zippers').length },
    { id: 'collars', labelSi: 'කර සහ කරපටි', count: allSewingVideos.filter((v) => v.category === 'collars').length },
    { id: 'tailoring', labelSi: 'කෝට් සහ බ්ලේසර්', count: allSewingVideos.filter((v) => v.category === 'tailoring').length },
    { id: 'skirts', labelSi: 'සාය සහ රැලි', count: allSewingVideos.filter((v) => v.category === 'skirts').length },
    { id: 'sleeves', labelSi: 'අත් සහ කෆ්', count: allSewingVideos.filter((v) => v.category === 'sleeves').length },
    { id: 'finishing', labelSi: 'වාටි හා නිමාවන්', count: allSewingVideos.filter((v) => v.category === 'finishing').length },
  ];

  // Helper to render universal in-app player (zero external redirects!)
  const renderVideoPlayer = (url: string, title: string, isAutoplay: boolean = true) => {
    if (isPinterestUrl(url)) {
      const embedUrl = getPinterestEmbedUrl(url);
      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="eager"
          />
        </div>
      );
    }

    if (isDirectVideoUrl(url)) {
      return (
        <video
          src={url}
          controls
          autoPlay={isAutoplay}
          playsInline
          className="w-full h-full object-contain bg-black"
        >
          Your browser does not support HTML5 video.
        </video>
      );
    }

    // Default: YouTube In-App Player
    const embedUrl = getYouTubeEmbedUrl(url, { autoplay: isAutoplay });
    return (
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0 bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="eager"
      />
    );
  };

  return (
    <section id="sewing-tutorials" className="relative py-20 bg-[#0c080a] text-[#f7f3eb] overflow-hidden scroll-mt-20">
      {/* Invisible anchor for backward compatibility */}
      <div id="patterns" className="absolute -top-24 left-0 w-1 h-1 pointer-events-none" />

      {/* Atelier cinematic glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#540d18]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#c99a45]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =================================================================== */}
        {/* HEADER SECTION (CLEAN PUBLIC VIEW - ZERO ADMIN BUTTONS ON FRONTEND) */}
        {/* =================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Pinterest Direct In-App Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1b1013] border border-[#dfb56c]/40 text-xs font-mono shadow-lg">
            <span className="w-5 h-5 rounded-full bg-[#e60023] flex items-center justify-center text-white font-bold text-[11px] shadow">
              P
            </span>
            <span className="text-[#f7e2a9] font-semibold">
              {sectionBadgeSi}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#dfb56c]" />
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>In-App Direct Player</span>
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#f7f3eb] tracking-tight">
            {sectionTitleSi.includes('වීඩියෝ ටියුටෝරියල්ස්') ? (
              <>
                {sectionTitleSi.replace('වීඩියෝ ටියුටෝරියල්ස්', '').trim()}{' '}
                <span className="text-gradient-gold">වීඩියෝ ටියුටෝරියල්ස්</span>
              </>
            ) : (
              <span>{sectionTitleSi}</span>
            )}
          </h2>

          {sectionTitleEn && (
            <p className="text-xs uppercase tracking-widest font-mono text-[#dfb56c]/90 -mt-2">
              {sectionTitleEn}
            </p>
          )}

          {/* Main Description - Fully editable from backend */}
          <p className="text-xs sm:text-sm text-[#b8afa2] font-sinhala leading-relaxed max-w-2xl mx-auto">
            {sectionDescSi}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#a89f91] pt-1">
            <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded border border-white/10">
              <Film className="w-3.5 h-3.5 text-[#dfb56c]" />
              <strong className="text-white">{allSewingVideos.length} Tutorials</strong> Direct Play
            </span>
            <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded border border-white/10 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{feature1Si}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{feature2Si}</span>
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SEARCH & CATEGORY SELECTOR */}
        {/* =================================================================== */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#140e10] p-3 rounded-xl border border-[#dfb56c]/30 shadow-xl">
            {/* Live Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#a89f91] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="වීඩියෝ මාතෘකාව, තාක්ෂණය හෝ විස්තරය සොයන්න (Dart, Zipper, Collar, Sleeve, Pleat, Finish...)"
                className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-xs sm:text-sm text-white placeholder-[#7a7268] focus:outline-none focus:border-[#dfb56c] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f91] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Reset Button if active search */}
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-3 py-2 rounded-lg bg-black/60 hover:bg-white/10 text-xs font-mono text-[#dfb56c] border border-white/10 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold border-[#dfb56c] shadow-md shadow-[#c99a45]/20'
                      : 'bg-[#160f12] text-[#a89f91] hover:text-white hover:bg-[#201518] border-white/10'
                  }`}
                >
                  <span>{cat.labelSi}</span>
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/30 text-black' : 'bg-white/10 text-[#a89f91]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* VIDEOS GRID (PLAYABLE IN-APP WITH ADVANCED TITLES & DESCRIPTIONS) */}
        {/* =================================================================== */}
        {filteredVideos.length === 0 ? (
          <div className="mt-12 p-12 text-center rounded-2xl bg-[#140e10] border border-white/10 space-y-3">
            <h3 className="text-base font-editorial font-bold text-white">
              ගැළපෙන වීඩියෝවක් හමු නොවීය
            </h3>
            <p className="text-xs text-[#a89f91]">
              කරුණාකර සෙවුම් වචනය වෙනස් කර නැවත උත්සාහ කරන්න.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn-3d-gold px-4 py-2 text-xs uppercase tracking-wider font-bold text-black rounded mt-2"
            >
              සියලුම වීඩියෝ පෙන්වන්න
            </button>
          </div>
        ) : (
          /* Responsive Vertical Scroll Container with CSS Flexbox Fluid Grid Layout */
          <div className="mt-8 relative rounded-2xl border border-[#dfb56c]/30 bg-gradient-to-b from-[#140e10]/95 to-[#0f090b]/95 shadow-2xl p-3 sm:p-5">
            {/* Scroll Header Bar & Touch Gesture Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2 text-[#f7e2a9]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">
                  {filteredVideos.length} Tutorials Catalog
                </span>
                <span className="hidden sm:inline-block text-[#dfb56c]/60">•</span>
                <span className="hidden sm:flex items-center gap-1.5 text-[#b8afa2] text-[11px]">
                  <Hand className="w-3.5 h-3.5 text-[#dfb56c]" />
                  <span>Drag or scroll vertically to explore full catalog</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCatalogBy(-340)}
                  disabled={!canScrollUpCatalog}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-[#540d18] text-[#f7e2a9] disabled:opacity-30 disabled:pointer-events-none border border-white/10 hover:border-[#dfb56c]/40 transition-colors cursor-pointer"
                  title="Scroll Up"
                  aria-label="Scroll Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCatalogBy(340)}
                  disabled={!canScrollDownCatalog}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-[#540d18] text-[#f7e2a9] disabled:opacity-30 disabled:pointer-events-none border border-white/10 hover:border-[#dfb56c]/40 transition-colors cursor-pointer"
                  title="Scroll Down"
                  aria-label="Scroll Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
                  className="px-2.5 py-1 rounded-lg bg-[#241317] hover:bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                  title={isCatalogExpanded ? 'Switch to Vertical Scroll View' : 'Expand Full Height'}
                >
                  {isCatalogExpanded ? (
                    <>
                      <Minimize2 className="w-3 h-3 text-[#dfb56c]" />
                      <span className="hidden md:inline">Scroll View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3 h-3 text-[#dfb56c]" />
                      <span className="hidden md:inline">Expand All</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Radiant Gold Progress Bar */}
            {!isCatalogExpanded && (
              <div className="w-full h-1 bg-black/60 rounded-full mb-3 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#dfb56c] transition-all duration-150"
                  style={{ width: `${Math.max(8, catalogScrollProgress)}%` }}
                />
              </div>
            )}

            {/* Top Shadow Indicator */}
            {!isCatalogExpanded && canScrollUpCatalog && (
              <div className="pointer-events-none absolute top-14 left-0 right-0 h-8 bg-gradient-to-b from-[#140e10] to-transparent z-20 opacity-80" />
            )}

            {/* Scrollable Viewport with Touch-Friendly Drag Gestures */}
            <div
              ref={catalogScrollRef}
              onScroll={handleCatalogScroll}
              onMouseDown={handleCatalogMouseDown}
              onMouseMove={handleCatalogMouseMove}
              onMouseUp={handleCatalogMouseUp}
              onMouseLeave={handleCatalogMouseUp}
              className={`transition-all select-none focus:outline-none ${
                isCatalogExpanded
                  ? 'h-auto overflow-visible'
                  : 'max-h-[620px] sm:max-h-[720px] lg:max-h-[820px] overflow-y-auto overscroll-y-contain scroll-smooth'
              } ${isCatalogDragging ? 'cursor-grabbing' : 'cursor-grab'} pr-1 sm:pr-2`}
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
              }}
            >
              {/* CSS Flexbox for fluid grid layouts */}
              <div className="flex flex-wrap gap-6 justify-start items-stretch w-full">
                {filteredVideos.map((video) => {
                  const isPlayingInline = activeInlineVideoId === video.id;
                  const isSaved = savedPinIds.includes(video.id);
                  const isDescExpanded = !!expandedDescIds[video.id];
                  const thumbUrl =
                    (video.thumbnailUrl && video.thumbnailUrl.trim().length > 0)
                      ? video.thumbnailUrl.trim()
                      : getYouTubeThumbnailUrl(video.youtubeUrl) || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80';

                  const isPin = isPinterestUrl(video.youtubeUrl);
                  const isDirect = isDirectVideoUrl(video.youtubeUrl);

                  return (
                    <div
                      key={video.id}
                      className="flex-1 min-w-[280px] sm:min-w-[320px] max-w-full sm:max-w-[calc(50%-12px)] lg:max-w-[calc(33.333%-16px)] group rounded-2xl bg-[#140f11] border border-white/10 hover:border-[#dfb56c]/50 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
                    >
                  {/* Top Video Player Container (Adaptive Responsive Screen Sizing) */}
                  <div
                    className={`relative bg-black overflow-hidden border-b border-white/10 transition-all duration-300 ${
                      isPlayingInline
                        ? (cardAspectModes[video.id] || (isPin ? 'adaptive' : 'widescreen')) === 'adaptive'
                          ? isPin
                            ? 'h-[460px] sm:h-[500px] w-full'
                            : 'aspect-video w-full'
                          : (cardAspectModes[video.id] || (isPin ? 'adaptive' : 'widescreen')) === 'portrait'
                          ? 'aspect-[9/16] w-full max-h-[560px]'
                          : 'aspect-video w-full'
                        : 'aspect-video'
                    }`}
                  >
                    {isPlayingInline ? (
                      /* Inline Video Player - Completely inside the app with Screen Controls! */
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        {renderVideoPlayer(video.youtubeUrl, video.titleSi, true)}

                        {/* Top Mini Screen Mode & Controls Strip */}
                        <div className="absolute top-2 inset-x-2 flex items-center justify-between z-30 pointer-events-auto">
                          <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-1 rounded-md border border-[#dfb56c]/30 text-[10px] font-mono shadow-lg">
                            <span className="text-[#dfb56c] font-bold flex items-center gap-1">
                              <SlidersHorizontal className="w-3 h-3 text-[#dfb56c]" />
                              <span className="hidden sm:inline">Screen:</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardAspectModes((prev) => ({ ...prev, [video.id]: 'adaptive' }));
                              }}
                              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                (cardAspectModes[video.id] || (isPin ? 'adaptive' : 'widescreen')) === 'adaptive'
                                  ? 'bg-[#dfb56c] text-black font-bold'
                                  : 'text-white/70 hover:text-white'
                              }`}
                              title="ස්වයංක්‍රීය තිර ගැලපීම (Smart Fit)"
                            >
                              Fit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardAspectModes((prev) => ({ ...prev, [video.id]: 'widescreen' }));
                              }}
                              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                cardAspectModes[video.id] === 'widescreen'
                                  ? 'bg-[#dfb56c] text-black font-bold'
                                  : 'text-white/70 hover:text-white'
                              }`}
                              title="16:9 සිනමා තිරය"
                            >
                              16:9
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardAspectModes((prev) => ({ ...prev, [video.id]: 'portrait' }));
                              }}
                              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                                cardAspectModes[video.id] === 'portrait'
                                  ? 'bg-[#dfb56c] text-black font-bold'
                                  : 'text-white/70 hover:text-white'
                              }`}
                              title="9:16 Pinterest Reel / Mobile"
                            >
                              9:16
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTheaterModalVideo(video);
                              }}
                              className="p-1.5 rounded-full bg-black/85 hover:bg-[#dfb56c] text-white hover:text-black transition-colors cursor-pointer border border-white/10 shadow"
                              title="Open Theater Full Screen Player"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveInlineVideoId(null);
                              }}
                              className="p-1.5 rounded-full bg-black/85 hover:bg-rose-900 text-white transition-colors cursor-pointer border border-white/10 shadow"
                              title="Stop player"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Video Preview Thumbnail with Hover Overlay */
                      <div
                        className="relative w-full h-full cursor-pointer"
                        onClick={() => {
                          if (!catalogHasDragged) setActiveInlineVideoId(video.id);
                        }}
                      >
                        <img
                          src={thumbUrl}
                          alt={video.titleSi}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          draggable={false}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:via-black/10 transition-colors" />

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#f7e2a9] border border-[#dfb56c]/40 font-bold flex items-center gap-1">
                            {isPin ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#e60023] inline-block" />
                            ) : isDirect ? (
                              <Video className="w-2.5 h-2.5 text-cyan-400" />
                            ) : null}
                            <span>{video.badgeSi}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-white/10 font-bold">
                              {video.duration}
                            </span>
                            <button
                              onClick={(e) => toggleSavePin(video.id, e)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                                isSaved
                                  ? 'bg-[#dfb56c] text-black shadow'
                                  : 'bg-black/80 text-white/70 hover:text-white border border-white/20'
                              }`}
                              title={isSaved ? 'Saved Pin' : 'Save Pin'}
                            >
                              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Center Big Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-14 h-14 rounded-full bg-[#dfb56c] text-black flex items-center justify-center shadow-2xl group-hover:scale-115 transition-transform shadow-[#c99a45]/40 pl-1">
                            <Play className="w-6 h-6 fill-black" />
                          </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10 text-[10.5px] font-mono text-[#d5cfc4]">
                          <span className="text-[#dfb56c] font-bold">{video.categoryLabelSi}</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Play In-App</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clean Content Area (Advanced Titles & Descriptions) */}
                  <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Advanced Sinhala Title */}
                      <h4
                        onClick={() => {
                          if (!catalogHasDragged) setTheaterModalVideo(video);
                        }}
                        className="text-sm sm:text-base font-editorial font-bold text-white group-hover:text-[#f7e2a9] transition-colors leading-snug cursor-pointer line-clamp-2"
                        title={video.titleSi}
                      >
                        {video.titleSi}
                      </h4>

                      {/* English Subtitle */}
                      <span className="text-[11px] font-mono text-[#a89f91] block truncate">
                        {video.titleEn}
                      </span>

                      {/* Rich Description Box (Configured & Set from Backend) */}
                      {showDescriptionByDefault && video.descriptionSi && (
                        <div className="mt-2 p-2.5 rounded-lg bg-black/50 border border-white/10 text-xs font-sinhala leading-relaxed text-[#dcd6cd] space-y-1.5 transition-all">
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#dfb56c] pb-1 border-b border-white/5">
                            <span className="flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              <span>ටේලරින් තාක්ෂණික විස්තරය:</span>
                            </span>
                            <span className="text-[#a89f91]">{video.levelSi}</span>
                          </div>

                          <p className={`text-[11.5px] ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                            {video.descriptionSi}
                          </p>

                          {video.descriptionSi.length > 90 && (
                            <button
                              onClick={(e) => toggleExpandDesc(video.id, e)}
                              className="text-[10px] font-mono text-[#dfb56c] hover:underline flex items-center gap-1 pt-0.5 cursor-pointer"
                            >
                              {isDescExpanded ? (
                                <>
                                  <span>අඩු කරන්න</span>
                                  <ChevronUp className="w-3 h-3" />
                                </>
                              ) : (
                                <>
                                  <span>සම්පූර්ණ විස්තරය බලන්න</span>
                                  <ChevronDown className="w-3 h-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Controls Strip - Completely internal, zero redirect */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            if (!catalogHasDragged) setActiveInlineVideoId(video.id);
                          }}
                          className="flex-1 py-2 rounded-lg bg-[#1f1316] hover:bg-[#dfb56c] text-[#f7e2a9] hover:text-black font-mono text-xs font-bold transition-all border border-[#dfb56c]/30 hover:border-[#dfb56c] flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Video</span>
                        </button>

                        <button
                          onClick={() => {
                            if (!catalogHasDragged) setTheaterModalVideo(video);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-black/60 hover:bg-[#201518] text-[#dfb56c] border border-white/10 hover:border-[#dfb56c] transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                          title="Theater Full Screen Player"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Full</span>
                        </button>
                      </div>

                      {/* Public video info strip (Clean & distraction-free) */}
                      <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#a89f91]">
                        <span>ක්‍රමය: {isPin ? 'Pinterest' : isDirect ? 'Direct MP4' : 'Direct Play'}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>100% In-App</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
              </div>
            </div>

            {/* Subtle Bottom Gradient Shadow indicator when more content remains below */}
            {!isCatalogExpanded && canScrollDownCatalog && (
              <div className="pointer-events-none absolute bottom-12 left-0 right-0 h-10 bg-gradient-to-t from-[#0f090b] to-transparent z-20 opacity-80" />
            )}

            {/* Footer Drag / Scroll Hint & Progress percentage */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#a89f91]">
              <div className="flex items-center gap-2">
                <MoveVertical className="w-3.5 h-3.5 text-[#dfb56c]" />
                <span>Touch swipe or drag vertically to explore full catalog</span>
              </div>
              <span className="text-[#dfb56c]">
                {Math.round(catalogScrollProgress)}% viewed
              </span>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PINTEREST SOURCE VERIFICATION BAR (NO REDIRECT LINK) */}
        {/* =================================================================== */}
        <div className="mt-12 p-4 rounded-xl bg-[#140e10] border border-[#dfb56c]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#e60023] text-white flex items-center justify-center font-bold text-xs shrink-0">
              P
            </span>
            <div className="min-w-0">
              <span className="text-[#f7e2a9] font-bold block truncate">
                {sectionBadgeSi}
              </span>
              <span className="text-emerald-400 text-[11px] font-bold block mt-0.5">
                {verifyNoteSi}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#a89f91] text-[11px] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#f7e2a9] font-bold">100% In-App Full Player Mode</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* THEATER MODE / FULL SCREEN VIDEO PLAYER (100% IN-APP, SCREEN-ADAPTIVE) */}
      {/* ===================================================================== */}
      {theaterModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setTheaterModalVideo(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#120b0e] border-2 border-[#dfb56c]/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#f7f3eb] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Screen Size Controls */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#1a1013] flex flex-wrap items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e60023] text-white font-bold inline-block">
                    {isPinterestUrl(theaterModalVideo.youtubeUrl) ? 'Pinterest Pin Player' : 'In-App Direct Player'}
                  </span>
                  <span className="text-[10px] font-mono text-[#dfb56c] uppercase tracking-wider">
                    {theaterModalVideo.categoryLabelSi}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold hidden md:inline">
                    • In-App Fullscreen Play
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-editorial font-bold text-white mt-1 truncate">
                  {theaterModalVideo.titleSi}
                </h3>
              </div>

              {/* Screen Mode Quick Adjuster */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/70 border border-white/10 text-xs font-mono">
                <span className="text-[#dfb56c] px-1 hidden lg:inline font-bold">
                  Screen Size:
                </span>
                <button
                  type="button"
                  onClick={() => setModalScreenMode('adaptive')}
                  className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer text-xs ${
                    modalScreenMode === 'adaptive' ? 'bg-[#dfb56c] text-black font-bold shadow' : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="ස්වයංක්‍රීය තිර ගැලපීම (Smart Adaptive Screen Fit)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Auto Fit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalScreenMode('widescreen')}
                  className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer text-xs ${
                    modalScreenMode === 'widescreen' ? 'bg-[#dfb56c] text-black font-bold shadow' : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="16:9 සිනමා විලාසය"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">16:9</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalScreenMode('portrait')}
                  className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer text-xs ${
                    modalScreenMode === 'portrait' ? 'bg-[#dfb56c] text-black font-bold shadow' : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="9:16 Pinterest Reel / Mobile Pin"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">9:16 Pin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalScreenMode('cinema')}
                  className={`px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer text-xs ${
                    modalScreenMode === 'cinema' ? 'bg-[#dfb56c] text-black font-bold shadow' : 'text-[#a89f91] hover:text-white'
                  }`}
                  title="සම්පූර්ණ තිරය (Full Theater)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setTheaterModalVideo(null)}
                className="p-2 rounded-lg bg-black/60 hover:bg-rose-900 text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive Player Area with Screen Size Adaptation */}
            <div className="relative bg-black w-full shadow-inner flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              {/* Atelier Cinema Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#540d18]/15 via-black to-[#c99a45]/10 pointer-events-none" />

              <div
                className={`relative w-full transition-all duration-300 ${
                  modalScreenMode === 'adaptive'
                    ? isPinterestUrl(theaterModalVideo.youtubeUrl)
                      ? 'max-w-xl mx-auto h-[64vh] min-h-[460px] max-h-[700px] rounded-xl border border-[#dfb56c]/40 overflow-hidden shadow-2xl'
                      : 'aspect-video max-h-[72vh] rounded-xl border border-white/10 overflow-hidden shadow-2xl'
                    : modalScreenMode === 'widescreen'
                    ? 'aspect-video max-h-[75vh] rounded-xl border border-white/10 overflow-hidden shadow-2xl'
                    : modalScreenMode === 'portrait'
                    ? 'max-w-sm sm:max-w-md mx-auto aspect-[9/16] max-h-[80vh] rounded-xl border border-[#dfb56c]/40 overflow-hidden shadow-2xl'
                    : 'w-full h-[72vh] sm:h-[80vh] rounded-xl border border-white/10 overflow-hidden shadow-2xl'
                }`}
              >
                {renderVideoPlayer(theaterModalVideo.youtubeUrl, theaterModalVideo.titleSi, true)}
              </div>
            </div>

            {/* Active Screen Adjustment Status Bar */}
            <div className="px-4 py-2 bg-[#10080a] border-t border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-[#a89f91]">
              <span className="flex items-center gap-1.5 text-[#dfb56c]">
                <Sparkles className="w-3 h-3 text-[#dfb56c]" />
                <span>
                  තිර මාදිලිය:{' '}
                  <strong className="text-white">
                    {modalScreenMode === 'adaptive'
                      ? 'Smart Adaptive Screen Fit (ස්වයංක්‍රීයව තිර ප්‍රමාණයට ගැලපීම)'
                      : modalScreenMode === 'widescreen'
                      ? '16:9 Widescreen Cinema'
                      : modalScreenMode === 'portrait'
                      ? '9:16 Pinterest Reel / Mobile Portrait Pin'
                      : 'Cinema Full View'}
                  </strong>
                </span>
              </span>
              <span className="text-emerald-400 font-bold hidden sm:inline">
                ✓ 100% In-App HD Player • Screen Responsive
              </span>
            </div>

            {/* Modal Video Details & Descriptions */}
            <div className="p-4 sm:p-6 bg-[#160e11] border-t border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9]">
                  {theaterModalVideo.titleSi}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[#dfb56c]">
                    {theaterModalVideo.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#540d18] border border-[#dfb56c]/30 text-[#f7e2a9]">
                    {theaterModalVideo.levelSi}
                  </span>
                </div>
              </div>

              <p className="text-xs font-mono text-[#a89f91]">
                {theaterModalVideo.titleEn}
              </p>

              {/* Full Detailed Tailoring Sinhala Description */}
              {theaterModalVideo.descriptionSi && (
                <div className="p-3.5 rounded-xl bg-black/60 border border-[#dfb56c]/30 text-xs sm:text-sm font-sinhala leading-relaxed text-[#ece6dc] space-y-1">
                  <span className="text-[11px] font-mono text-[#dfb56c] font-bold block">
                    මැහුම් හා ටේලරින් තාක්ෂණික මගපෙන්වීම (Tailoring Masterclass Guide):
                  </span>
                  <p>{theaterModalVideo.descriptionSi}</p>
                </div>
              )}

              {/* English Description */}
              {theaterModalVideo.descriptionEn && (
                <div className="p-3 rounded-lg bg-[#140e10] border border-white/10 text-xs text-[#a89f91] space-y-0.5">
                  <span className="text-[10px] font-mono text-[#dfb56c] uppercase block">
                    English Technique Summary:
                  </span>
                  <p>{theaterModalVideo.descriptionEn}</p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-[#160e11] flex items-center justify-between text-xs font-mono">
              <button
                onClick={handlePrevVideo}
                disabled={currentModalIndex <= 0}
                className="px-3.5 py-1.5 rounded bg-black/60 hover:bg-white/10 text-[#f7e2a9] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Video</span>
              </button>

              <span className="text-[#a89f91] hidden sm:inline">
                {currentModalIndex + 1} / {filteredVideos.length}
              </span>

              <button
                onClick={handleNextVideo}
                disabled={currentModalIndex >= filteredVideos.length - 1}
                className="btn-3d-gold px-4 py-1.5 rounded text-black font-bold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Video</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
