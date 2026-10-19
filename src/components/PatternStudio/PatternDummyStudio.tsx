import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Scissors,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Eye,
  BookOpen,
  HelpCircle,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  PenTool,
  Ruler,
  Compass,
  FileText,
  Bookmark,
  Share2,
  Download,
  AlertTriangle,
  Award,
  X,
  Play,
  Pause,
  ZoomIn
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { DEFAULT_BODY_MEASUREMENTS } from '../../lib/defaults';
import { BodyMeasurementItem } from '../../types';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export interface PatternTermItem {
  id: string;
  termEn: string;
  termSi: string;
  category: 'lines' | 'seams' | 'fitting' | 'pieces' | 'cutting';
  categoryLabelEn: string;
  categoryLabelSi: string;
  meaningEn: string;
  meaningSi: string;
  importanceEn: string;
  importanceSi: string;
  atelierTipEn: string;
  atelierTipSi: string;
  symbol: string;
}

export interface MandatoryElementItem {
  id: string;
  titleEn: string;
  titleSi: string;
  shortDescEn: string;
  shortDescSi: string;
  whyMandatoryEn: string;
  whyMandatorySi: string;
  industryStandardEn: string;
  industryStandardSi: string;
  riskIfMissingEn: string;
  riskIfMissingSi: string;
  badge: string;
  iconName: string;
  svgHighlightId: string;
}

export interface PatternPieceBlueprint {
  id: string;
  nameEn: string;
  nameSi: string;
  styleNo: string;
  cutInstructionEn: string;
  cutInstructionSi: string;
  sizeRange: string;
  descriptionEn: string;
  descriptionSi: string;
  seamAllowanceEn: string;
  seamAllowanceSi: string;
  grainlineType: string;
  grainlineTypeSi: string;
  totalNotches: number;
  dartCount: number;
  svgType: 'bodiceFront' | 'bodiceBack' | 'sleeve' | 'skirt';
}

// ============================================================================
// COMPREHENSIVE TECHNICAL TERMINOLOGY (සිංහල සහ ඉංග්‍රීසි තේරුම් සමග)
// ============================================================================
export const PATTERN_TERMINOLOGY_DATABASE: PatternTermItem[] = [
  {
    id: 'term-grainline',
    termEn: 'Grainline',
    termSi: 'ධාන්‍ය රේඛාව / නූල් කෙඳි දිශාව',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'A long line drawn with arrows at both ends indicating the direction in which the pattern piece must be placed relative to the fabric warp (selvage).',
    meaningSi: 'රෙද්දේ වාටියට (Selvage) සමාන්තරව දිග අතට ඇති ප්‍රධාන නූල් කෙඳි දිශාව පෙන්වන, දෙපසට ඊතල සහිත දිගු රේඛාවයි. රෙද්ද මත පැටර්න් කොටස තැබිය යුතු නිවැරදි දිශාව මෙයින් දැක්වේ.',
    importanceEn: 'Ensures the finished garment hangs straight and does not twist around the body when worn or washed.',
    importanceSi: 'ඇඳුම ඇන්ද විට එය ශරීරය වටා ඇඹරී යාම වැළැක්වීම සහ ඇඳුමේ පහළට වැටීම (Drape) සෘජුව හා අලංකාරව තබා ගැනීම සඳහා අත්‍යවශ්‍ය වේ.',
    atelierTipEn: 'Always measure with a ruler from both ends of the grainline arrow to the fabric selvage to ensure absolute parallel alignment.',
    atelierTipSi: 'රෙද්ද කැපීමට පෙර ධාන්‍ය රේඛාවේ දෙකෙළවර සිට රෙද්දේ වාටියට (Selvage) ඇති දුර සමාන දැයි ටේප් එකෙන් හෝ රූලරයෙන් මැන තහවුරු කරගන්න.',
    symbol: '↕ ⟷',
  },
  {
    id: 'term-seam-allowance',
    termEn: 'Seam Allowance (S.A.)',
    termSi: 'මැහුම් වාසිය / ෂෝක් ලයින්',
    category: 'seams',
    categoryLabelEn: 'Seam & Darts',
    categoryLabelSi: 'මැහුම් හා ඩාට්',
    meaningEn: 'The extra width of fabric added outside the sewing line to allow pieces to be stitched together securely without reducing the garment size.',
    meaningSi: 'ඇඳුමේ සැබෑ මැහුම් රේඛාවෙන් (Stitching Line) පිටතට තබන අතිරේක රෙදි ප්‍රමාණයයි. සාමාන්‍ය මැහුම් සඳහා 1/2" (1.2cm) ද, කර සහ වක්‍ර සඳහා 1/4" (0.6cm) ද, වාටි සඳහා 1.5" - 2" ද තබයි.',
    importanceEn: 'Without seam allowance, sewing the garment will instantly make it smaller than the intended body measurements, ruining the fit.',
    importanceSi: 'මැහුම් වාසිය නොතැබුවහොත් ඇඳුම මැසූ පසු ශරීර මිණුම්වලට වඩා කුඩා වී සිරවීම හෝ මැසීමට නොහැකි වී විනාශ වේ.',
    atelierTipEn: 'In haute couture, leave 1" to 1.5" on side seams to allow for future alterations and personalized body fitting.',
    atelierTipSi: 'විශේෂ උත්සව ඇඳුම්වල පැති මැහුම් සඳහා 1" සිට 1.5" දක්වා වැඩිපුර වාසියක් තැබීමෙන් පසුව ඇඳුම බුරුල් කර හැඩ ගැන්වීමට ඉඩ ලැබේ.',
    symbol: '--- ✄',
  },
  {
    id: 'term-dart',
    termEn: 'Dart & Dart Apex',
    termSi: 'ඩාට් එක සහ උච්ච ලක්ෂ්‍යය',
    category: 'fitting',
    categoryLabelEn: 'Fitting & Shaping',
    categoryLabelSi: 'හැඩ ගැන්වීම',
    meaningEn: 'A wedge-shaped fold stitched into fabric that tapers to a point (apex), transforming flat 2D fabric into 3D curves conforming to the bust, waist, or hips.',
    meaningSi: 'තලීය 2D රෙද්දක් මිනිස් සිරුරේ පියයුරු, ඉණ හෝ උකුල් වක්‍රතාවලට ගැලපෙන සේ ත්‍රිමාණ (3D) හැඩයකට හැරවීම සඳහා මසන ත්‍රිකෝණාකාර නැමුමයි.',
    importanceEn: 'Provides smooth, anatomical contouring without puckering or bunching.',
    importanceSi: 'ඇඳුම ශරීරයේ ස්වභාවික හැඩයට අනුකූලව රැලි වැටීම්වලින් තොරව සුමටව රැඳී සිටීමට උපකාරී වේ.',
    atelierTipEn: 'Stop stitching the dart 1/2" (1.2cm) before the true bust apex to avoid creating an unsightly pointed tip on the garment.',
    atelierTipSi: 'පපුවේ උච්ච ලක්ෂ්‍යය (Bust Apex) මතටම ඩාට් කෙළවර මසන්න එපා; උච්ච ලක්ෂ්‍යයට අඟල් 1/2කට පෙර ඩාට් එක අවසන් කරන්න.',
    symbol: '▲ ▽',
  },
  {
    id: 'term-notch',
    termEn: 'Notch / Balance Marks',
    termSi: 'කප්පාදුව / ලකුණු (Notches)',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'Small triangular (▲) or straight slit marks cut into the seam allowance edge indicating how adjoining pattern pieces must align during assembly.',
    meaningSi: 'පැටර්න් එකලස් කිරීමේදී එකිනෙකට යා වන කොටස් නිවැරදිව සමපාත වන ස්ථාන දැක්වීමට මැහුම් වාසියේ දාරයේ කපන කුඩා V හැඩැති කප්පාදු ලකුණුය.',
    importanceEn: 'Prevents one piece of fabric from being stretched or eased unevenly against its matching partner piece.',
    importanceSi: 'මැසීමේදී එක රෙදි කොටසක් ඇදී අනෙක් කොටසට වඩා දික්වීම හෝ නොගැලපී යාම සම්පූර්ණයෙන්ම වළක්වයි.',
    atelierTipEn: 'Standard industry rule: Single notch = Front armhole / Front piece. Double notch = Back armhole / Back piece.',
    atelierTipSi: 'ජාත්‍යන්තර සම්මත නීතිය: තනි කප්පාදුව (Single Notch) = ඉදිරිපස. ද්විත්ව කප්පාදුව (Double Notch) = පසුපස.',
    symbol: '▲ ▲▲',
  },
  {
    id: 'term-fold-line',
    termEn: 'Place on Fold',
    termSi: 'නැමුම මත තබන්න (Fold Line)',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'A bracket or double-arrow symbol indicating that the specified pattern edge must be placed flush against the folded edge of the fabric, cutting a single symmetrical piece.',
    meaningSi: 'මැද මැහුමක් නොමැතිව සම්පූර්ණ සමමිතික රෙදි කොටසක් එකවර කපා ගැනීම සඳහා රෙද්දේ නැමුම් දාරය මත තැබිය යුතු බව දක්වන ඊතල සංකේතයයි.',
    importanceEn: 'Eliminates unnecessary center front or back seams on dresses, bodices, and skirts.',
    importanceSi: 'ඇඳුමේ ඉදිරිපස හෝ පසුපස අනවශ්‍ය මැහුම් ඉවත් කර පිරිසිදු තනි කොටසක් ලෙස ලබා ගැනීමට භාවිතා කරයි.',
    atelierTipEn: 'Never add seam allowance to an edge marked "Place on Fold", otherwise the garment will be twice as wide!',
    atelierTipSi: '"Place on Fold" ලකුණ ඇති දාරයට කිසි විටෙකත් මැහුම් වාසි (Seam Allowance) එකතු නොකරන්න; එසේ කළහොත් ඇඳුමේ පළල දෙගුණයක් වේ!',
    symbol: '⟵ ⊐ ⟶',
  },
  {
    id: 'term-style-number',
    termEn: 'Style Number',
    termSi: 'විලාසිතා අංකය (Style Code)',
    category: 'cutting',
    categoryLabelEn: 'Cutting & Labelling',
    categoryLabelSi: 'කැපුම් හා ලේබල්',
    meaningEn: 'A unique code identifying the specific garment design, season, collection, and category in atelier production (e.g., CSS-2026-DRS-01).',
    meaningSi: 'නිෂ්පාදනයේදී අදාළ ඇඳුම් විලාසිතාව, වර්ෂය සහ එකතුව වෙන්කර හඳුනා ගැනීමට යොදන සුවිශේෂී කේත අංකයයි (උදා: CSS-2026-DRS-01).',
    importanceEn: 'Prevents mixing up pattern pieces from different garment designs during grading, cutting, or sample room sewing.',
    importanceSi: 'විවිධ ඇඳුම්වල පැටර්න් කෑලි එකට මිශ්‍ර වීම වළක්වා, කටර් සහ මහන්නන්ට නියමිත විලාසිතාව නිවැරදිව හඳුනා ගැනීමට මග පෙන්වයි.',
    atelierTipEn: 'Every single pattern piece (bodice, sleeve, collar, facing) must bear the exact same Style Number.',
    atelierTipSi: 'ඇඳුමට අයත් සෑම කුඩා පැටර්න් කෑල්ලකම (කරපටි, අත්, ලයිනින්) මෙම විලාසිතා අංකය අනිවාර්යයෙන්ම සටහන් කළ යුතුය.',
    symbol: '# ST-01',
  },
  {
    id: 'term-cut-quantity',
    termEn: 'Number of Cut (Cut Quantity)',
    termSi: 'කපන වාර ගණන (Cut Quantity)',
    category: 'cutting',
    categoryLabelEn: 'Cutting & Labelling',
    categoryLabelSi: 'කැපුම් හා ලේබල්',
    meaningEn: 'Explicit instruction stating how many times that piece must be cut, and in which material: Cut 1 on Fold (Self), Cut 2 (Self), Cut 2 (Lining), Cut 2 (Fusible).',
    meaningSi: 'එම පැටර්න් කොටසින් රෙදි කැබලි කීයක් කපා ගත යුතුද සහ කුමන රෙදි වර්ගයෙන්ද (ප්‍රධාන රෙද්ද, ලයිනින්, කැන්වස්) යන්න පැහැදිලිව දක්වන උපදෙසයි.',
    importanceEn: 'Tells the cutter precisely how many panels are required to construct one full garment.',
    importanceSi: 'ඇඳුම සම්පූර්ණ කිරීමට අදාළ කොටසින් කැබලි කීයක් කැපිය යුතුදැයි කටර්ට නිශ්චිතවම පෙන්වා දෙයි.',
    atelierTipEn: 'For asymmetrical designs, write "Cut 1 with fabric face UP" to prevent cutting mirror-image mistakes.',
    atelierTipSi: 'අසමමිතික විලාසිතාවලදී රෙද්දේ මුහුණත උඩට තබා "Cut 1 Face UP" ලෙස සටහන් කිරීමෙන් කපන වැරදි වළක්වා ගත හැක.',
    symbol: '✂ x2',
  },
  {
    id: 'term-size-grading',
    termEn: 'Size & Grading',
    termSi: 'ප්‍රමාණය සහ ශ්‍රේණිගත කිරීම (Size / Grading)',
    category: 'cutting',
    categoryLabelEn: 'Cutting & Labelling',
    categoryLabelSi: 'කැපුම් හා ලේබල්',
    meaningEn: 'The designated body size (e.g., S, M, L, UK 10, US 6) and multi-size nesting lines that scale the pattern proportionally up or down.',
    meaningSi: 'පැටර්නය අදාළ වන ශරීර ප්‍රමාණය (S, M, L හෝ UK 10) සහ එය විවිධ ප්‍රමාණවලට විශාල හෝ කුඩා කිරීම සඳහා යොදන සමාන්තර ශ්‍රේණිගත රේඛා සමූහයයි.',
    importanceEn: 'Enables fashion brands to produce the same design across a wide range of customer body proportions.',
    importanceSi: 'විවිධ ශරීර ප්‍රමාණ ඇති පාරිභෝගිකයින් සඳහා එකම විලාසිතාව නිවැරදි අනුපාතයට සකස් කර ගැනීමට මග පාදයි.',
    atelierTipEn: 'Multi-size patterns use distinct line styles (solid, dashed, dotted) or colors for each size tier.',
    atelierTipSi: 'විවිධ සයිස් පෙන්වීමට තිත් ඉරි (Dotted), තනි ඉරි (Solid) හෝ විවිධ වර්ණ භාවිතා කර පැටර්න් ඇඳීම පහසු කරයි.',
    symbol: '📏 S/M/L',
  },
  {
    id: 'term-ease',
    termEn: 'Wearing Ease & Design Ease',
    termSi: 'ලිහිල් බව / ඊස් (Ease)',
    category: 'fitting',
    categoryLabelEn: 'Fitting & Shaping',
    categoryLabelSi: 'හැඩ ගැන්වීම',
    meaningEn: 'Wearing Ease is the minimum room added to exact body measurements for breathing, sitting, and moving (typically 2"-3" on bust). Design Ease is extra volume added for fashion styling.',
    meaningSi: 'හුස්ම ගැනීමට, වාඩි වීමට හා චලනය වීමට සිරුරු මිණුම්වලට වඩා තබන අවම ඉඩ "Wearing Ease" වේ. විලාසිතාවේ හැඩය සඳහා වැඩිපුර තබන ඉඩ "Design Ease" වේ.',
    importanceEn: 'Without wearing ease, a woven garment will rip at the seams the moment the wearer sits down or raises their arms.',
    importanceSi: 'ඊස් නොමැති වුවහොත් ඇඳුම ඇඳ වාඩි වන විට හෝ අත් ඔසවන විට මැහුම් පුපුරා ඉරී යාමට ඉඩ ඇත.',
    atelierTipEn: 'Knit stretch fabrics require "Negative Ease", meaning the pattern is drafted smaller than body measurements.',
    atelierTipSi: 'ඇදෙනසුළු නිට් (Knit/Lycra) රෙදි සඳහා "Negative Ease" භාවිතා කරයි; එනම් ශරීර මිණුමට වඩා කුඩාවට පැටර්න් අඳියි.',
    symbol: '↔ +2"',
  },
  {
    id: 'term-bust-apex',
    termEn: 'Bust Apex',
    termSi: 'පපුවේ උච්ච ලක්ෂ්‍යය (Bust Apex)',
    category: 'fitting',
    categoryLabelEn: 'Fitting & Shaping',
    categoryLabelSi: 'හැඩ ගැන්වීම',
    meaningEn: 'The highest, most prominent point of the bust mound on the body form; serves as the central pivot point for all dart manipulations and style lines.',
    meaningSi: 'පපුවේ වඩාත්ම ඉස්මතු වූ උසම ලක්ෂ්‍යයයි. සියලුම ඩාට් වෙනස් කිරීම් (Dart Pivoting) සහ ප්‍රින්සස් රේඛා හැරවීමේ ප්‍රධාන කේන්ද්‍රස්ථානය මෙය වේ.',
    importanceEn: 'All bust darts must point directly toward this apex to ensure the garment cups the body naturally.',
    importanceSi: 'සියලුම පියයුරු ඩාට් මෙම ලක්ෂ්‍යය දෙසට එල්ල විය යුතුය; එසේ නොවුණහොත් ඇඳුමේ පපුව ප්‍රදේශය වැරදි තැනකට හැඩ ගැසේ.',
    atelierTipEn: 'Never terminate a stitched dart directly on the apex. Stop the dart stitch line 1/2" to 1" away from the apex marker drill hole.',
    atelierTipSi: 'කිසි විටෙකත් උච්ච ලක්ෂ්‍යය මතටම ඩාට් මැහුම නොයවන්න. අඟල් 1/2 සිට 1 දක්වා පසුපසින් ඩාට් එක අවසන් කරන්න.',
    symbol: '◎ Apex',
  },
  {
    id: 'term-armhole-scye',
    termEn: 'Armhole / Scye',
    termSi: 'කිහිලි වටය / අත් කුහරය (Armhole / Scye)',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'The tailored opening in the bodice where the sleeve is inserted, engineered to balance aesthetic drape and full arm mobility.',
    meaningSi: 'අත (Sleeve) සවි කිරීම සඳහා බඳ කොටසේ කපන වක්‍රාකාර කුහරයයි. අත් පහසුවෙන් එහා මෙහා කිරීමට හැකි වන සේ නිවැරදි ජ්‍යාමිතික වක්‍රයකින් යුක්ත විය යුතුය.',
    importanceEn: 'An armhole that is too low restricts arm lifting; an armhole that is cut too tight pinches the underarm.',
    importanceSi: 'කිහිලි වටය ඕනෑවට වඩා පහත් වුවහොත් අත් ඉහළට එසවීමට අපහසු වන අතර, ඕනෑවට වඩා තද වුවහොත් කිහිල්ල තද වී අපහසු වේ.',
    atelierTipEn: 'The back armhole curve is always longer and flatter than the front armhole curve to allow for forward shoulder reaching.',
    atelierTipSi: 'අත් ඉදිරියට දිගු කිරීමේ පහසුව සඳහා පසුපස කිහිලි වක්‍රය ඉදිරිපස වක්‍රයට වඩා දිගින් සහ පැතලි බවින් වැඩි විය යුතුය.',
    symbol: '◠ Scye',
  },
  {
    id: 'term-trueing',
    termEn: 'Trueing (Pattern Trueing)',
    termSi: 'පැටර්න් සත්‍යාපනය / සමතලා කිරීම (Trueing)',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'The process of measuring and checking that matching seams (e.g., front and back side seams, shoulder seams) are exactly equal in length and form smooth continuous lines across seam joins.',
    meaningSi: 'එකිනෙකට මැසෙන දෙපැත්තේ මැහුම් (Side Seams) සහ උරහිස් මැහුම් දිගින් හරියටම සමාන දැයි මැන බැලීම සහ සන්ධි වන තැන්වලදී සුමට අඛණ්ඩ රේඛා සාදන්නේ දැයි තහවුරු කිරීමයි.',
    importanceEn: 'Prevents jagged corners, stepped seams, and mismatched hemlines when the pieces are stitched.',
    importanceSi: 'මැසූ පසු වාටි උස් පහත් වීම, උරහිස් හෝ පැති මැහුම් එකිනෙකට නොගැලපී අගල් අඩුවැඩි වීම වළක්වයි.',
    atelierTipEn: 'Fold darts closed on paper before cutting the seam edge to create the proper dart roof/shape.',
    atelierTipSi: 'පැටර්න් කඩදාසිය කැපීමට පෙර ඩාට් එක නවා වසා මැහුම් දාරය කැපීමෙන් ඩාට් එකට නියමිත ත්‍රිකෝණාකාර පියන (Dart Roof) ලැබේ.',
    symbol: '✓ True',
  },
  {
    id: 'term-bias-grain',
    termEn: 'True Bias (45° Angle)',
    termSi: 'ඇල දිශාව / බයස් (True Bias 45°)',
    category: 'lines',
    categoryLabelEn: 'Lines & Markings',
    categoryLabelSi: 'රේඛා හා ලකුණු',
    meaningEn: 'A 45-degree angle diagonal line relative to the fabric selvage. Fabric cut on true bias has maximum stretch, fluid drape, and hugs curves sensuously.',
    meaningSi: 'රෙද්දේ වාටියට අංශක 45ක කෝණයකින් ඇලව පිහිටන දිශාවයි. බයස් අතට කැපූ රෙදි ස්වභාවිකවම ඇදෙනසුළු වන අතර සිරුරට ඇලී අලංකාරව පහළට වැටේ.',
    importanceEn: 'Essential for cowl necklines, slip dresses, bias skirts, and flexible neck bindings.',
    importanceSi: 'කවුල් කරවල් (Cowl Neck), බයස් සායවල් සහ කරට අල්ලන බයස් පටි (Bias Binding) සඳහා මෙය අත්‍යවශ්‍ය වේ.',
    atelierTipEn: 'Hang bias-cut garments on a dress form for 24 hours before hemming, as gravity will stretch the hem unevenly.',
    atelierTipSi: 'බයස් ඇඳුම් මැසූ පසු වාටිය මැසීමට පෙර පැය 24ක් මැනික්වින් ඩමියක එල්ලා තබන්න; ගුරුත්වාකර්ෂණය නිසා ඇදෙන රෙද්ද පසුව සමතලා කර කැපිය හැක.',
    symbol: '↗ 45°',
  },
  {
    id: 'term-slash-spread',
    termEn: 'Slash and Spread',
    termSi: 'කපා විහිදුවීම (Slash & Spread)',
    category: 'fitting',
    categoryLabelEn: 'Fitting & Shaping',
    categoryLabelSi: 'හැඩ ගැන්වීම',
    meaningEn: 'A foundational pattern manipulation method of cutting a block pattern along design lines and spreading the pieces apart to insert gathers, pleats, flare, or cowls.',
    meaningSi: 'මූලික පැටර්න් අච්චුවක් සැලසුම් රේඛා දිගේ කපා, ඒවා අතරට ඉඩ තබා විහිදුවා රැලි (Gathers), ප්ලීට් (Pleats) හෝ ෆ්ලෙයාර් එකතු කිරීමේ උසස් ක්‍රමයයි.',
    importanceEn: 'Enables endless creative variations from a single standard fitted block without redrafting from scratch.',
    importanceSi: 'මුල සිට අලුතින් නොඇඳ, මූලික බ්ලොක් එකකින් ඕනෑම නවීන විලාසිතාවක් නිර්මාණය කර ගැනීමට හැකි වේ.',
    atelierTipEn: 'Always secure the spread pattern pieces onto fresh paper with tape before tracing the new perimeter curve.',
    atelierTipSi: 'විහිදුවා ගත් කඩදාසි කැබලි නව කඩදාසියක් මත තබා ටේප් අලවා ස්ථාවර කරගත් පසු නව දාර රේඛාව අඳින්න.',
    symbol: '✂ ⤢',
  },
  {
    id: 'term-facing',
    termEn: 'Facing',
    termSi: 'පේසිම / ෆේසිං (Facing)',
    category: 'pieces',
    categoryLabelEn: 'Garment Pieces',
    categoryLabelSi: 'ඇඳුම් කොටස්',
    meaningEn: 'A fabric piece cut to mirror the exact shape of a garment opening (neckline, armhole) used to finish raw edges cleanly without visible binding.',
    meaningSi: 'ඇඳුමේ කර හෝ කිහිලි වැනි විවරයන්හි අමු දාර පිටතට නොපෙනෙන සේ පිරිසිදුව නිම කිරීම සඳහා එම විවරයේ හැඩයටම කපා ඇතුළට හරවා මසන රෙදි පටියයි.',
    importanceEn: 'Provides crisp, structured, invisible edge finishing on couture garments.',
    importanceSi: 'ඇඳුමේ කර දාරය රැලි නොවැටී සවිමත්ව සහ පිරිසිදුව තබා ගැනීමට උපකාරී වේ.',
    atelierTipEn: 'Always apply lightweight fusible interfacing to facings to prevent stretching and maintain crisp edges.',
    atelierTipSi: 'කරේ පේසිමට සැමවිටම සැහැල්ලු අයන් පේස්ට් (Interfacing) අලවන්න; එවිට කර ඇදීමෙන් තොරව ලස්සනට පිහිටයි.',
    symbol: '▭ Facing',
  },
  {
    id: 'term-interfacing',
    termEn: 'Interfacing / Fusible Canvas',
    termSi: 'ඉන්ටර්ෆේසිං / කැන්වස් / අයන් පේස්ට්',
    category: 'pieces',
    categoryLabelEn: 'Garment Pieces',
    categoryLabelSi: 'ඇඳුම් කොටස්',
    meaningEn: 'An extra textile layer applied between the garment fabric and facing to provide rigidity, shape retention, and reinforcement to collars, cuffs, waistbands, and lapels.',
    meaningSi: 'කරපටි, කෆ්ස්, ඉණ පටි සහ කෝට් කරවල්වලට සවිමත් බව, නොනැමෙන සුළු බව සහ හැඩය රැක දීම සඳහා රෙද්ද ඇතුළතින් අලවන විශේෂ ආධාරක රෙදි වර්ගයයි.',
    importanceEn: 'Prevents collars and button plackets from collapsing or going limp after laundering.',
    importanceSi: 'ඇඳුම සේදූ පසු කරපටි සහ බොත්තම් පටි එල්ලා වැටීම හෝ හැඩය නැති වීම වළක්වයි.',
    atelierTipEn: 'Cut interfacing slightly smaller than the fabric piece (trim away seam allowance) to reduce bulky seams.',
    atelierTipSi: 'මැහුම් ඝනකම් වීම වැළැක්වීම සඳහා කැන්වස් කොටසේ මැහුම් වාසිය තරමක් කපා ඉවත් කරන්න.',
    symbol: '░ Canvas',
  },
  {
    id: 'term-drill-hole',
    termEn: 'Drill Hole / Punch Hole',
    termSi: 'හිල් ලකුණ / විදුම් ලකුණ (Punch Hole)',
    category: 'cutting',
    categoryLabelEn: 'Cutting & Labelling',
    categoryLabelSi: 'කැපුම් හා ලේබල්',
    meaningEn: 'A small circular punch mark inside the pattern interior marking the apex of darts, button positions, or pocket corner placements.',
    meaningSi: 'ඩාට් කෙළවර, බොත්තම් හෝ සාක්කු ස්ථානගත කළ යුතු නිශ්චිත තැන් පෙන්වීමට පැටර්න් කඩදාසිය ඇතුළත විදින කුඩා වටකුරු සිදුරයි.',
    importanceEn: 'Allows precise marking through paper onto the fabric without cutting into the seam edge.',
    importanceSi: 'පැටර්න් කඩදාසිය ඉවත් නොකර රෙද්ද මත හුණු ලකුණ තැබීමට මෙම සිදුර උපකාරී වේ.',
    atelierTipEn: 'In production factories, awls punch a 1mm hole 1/2" back from the true dart tip so the hole is hidden inside the sewn dart fold.',
    atelierTipSi: 'ඇඳුමේ පිටතට සිදුර නොපෙනෙන පරිදි, ඩාට් එකේ සැබෑ කෙළවරට අඟල් 1/2ක් ඇතුළතින් මෙම සිදුර සලකුණු කරයි.',
    symbol: '⦿ Hole',
  },
  {
    id: 'term-hem-allowance',
    termEn: 'Hem Allowance',
    termSi: 'වාටියේ වාසිය (Hem Allowance)',
    category: 'seams',
    categoryLabelEn: 'Seam & Darts',
    categoryLabelSi: 'මැහුම් හා ඩාට්',
    meaningEn: 'The extra length of fabric folded up and stitched at the bottom of a skirt, dress, pant, or sleeve to give weight and a finished edge.',
    meaningSi: 'ඇඳුමක, සායක හෝ කලිසමක පහළ දාරය ලස්සනට නවා මැසීම සඳහා සහ බරක් ලබා දීම සඳහා තබන අතිරේක රෙදි ප්‍රමාණයයි (සාමාන්‍යයෙන් 1" සිට 2" දක්වා).',
    importanceEn: 'Provides visual gravity and anchor weight so the garment hangs with elegance.',
    importanceSi: 'ඇඳුමේ පහළ කෙළවර බරින් යුක්තව අලංකාරව පහළට එල්ලී සිටීමට සහ පසුව උස වෙනස් කිරීමට ඉඩ සලසයි.',
    atelierTipEn: 'Flared curved skirts require narrow hems (1/4" to 1/2" baby hem) to prevent puckering, while straight skirts need deep 1.5" to 2" hems.',
    atelierTipSi: 'වක්‍රාකාර රවුම් සායවල් සඳහා කුඩා වාටියක්ද (1/4"), සෘජු සායවල් සඳහා පළල් වාටියක්ද (1.5" - 2") භාවිතා කරන්න.',
    symbol: '⤓ Hem',
  },
];

// ============================================================================
// MANDATORY ELEMENTS (පැටර්න් එකකට අනිවාර්යයෙන්ම තිබිය යුතු අංග)
// ============================================================================
export const MANDATORY_PATTERN_ELEMENTS: MandatoryElementItem[] = [
  {
    id: 'elem-style-no',
    titleEn: 'Style Number & Name',
    titleSi: 'විලාසිතා අංකය හා නම (Style #)',
    shortDescEn: 'Unique identity code for the garment model and piece designation.',
    shortDescSi: 'ඇඳුම් විලාසිතාව හා අදාළ පැටර්න් කොටස හඳුනාගැනීමේ නිල කේතය.',
    whyMandatoryEn: 'Prevents mixing up pattern pieces from different styles during atelier batch cutting.',
    whyMandatorySi: 'විවිධ ඇඳුම්වල පැටර්න් කෑලි එකට මිශ්‍ර වීම වළක්වා, කටර් සහ ටේලර්ට නිශ්චිත කෑල්ල තෝරා ගැනීමට උපකාරී වේ.',
    industryStandardEn: 'Every single piece must show: [STYLE CODE] - [PIECE NAME] (e.g. ST-2026-DRS-01 FRONT BODICE).',
    industryStandardSi: 'සෑම කෑල්ලකම: [විලාසිතා අංකය] - [කොටසේ නම] (උදා: ST-2026-DRS-01 FRONT BODICE) අනිවාර්යයෙන් මුද්‍රණය කළ යුතුය.',
    riskIfMissingEn: 'Factory sewers stitch wrong bodice to wrong skirt, resulting in rejected batches.',
    riskIfMissingSi: 'වැරදි බඳ කොටසකට වෙනත් සායක් මසා මුළු ඇඳුම් තොගයම ප්‍රතික්ෂේප වී මූල්‍ය පාඩු සිදුවිය හැක.',
    badge: 'MANDATORY #1',
    iconName: 'FileText',
    svgHighlightId: 'hl-style',
  },
  {
    id: 'elem-grainline',
    titleEn: 'Grain Line (Straight / Bias)',
    titleSi: 'ධාන්‍ය රේඛාව / නූල් දිශාව (Grainline)',
    shortDescEn: 'Directional line with double-ended arrows parallel to fabric selvage.',
    shortDescSi: 'රෙද්දේ වාටියට සමාන්තර නූල් දිශාව පෙන්වන දෙපැත්තට ඊතල සහිත රේඛාව.',
    whyMandatoryEn: 'Dictates how the fabric hangs and prevents the garment from twisting around the body.',
    whyMandatorySi: 'ඇඳුම ශරීරය වටා ඇඹරීම වළක්වා සෘජුව සහ ගුරුත්වාකර්ෂණයට අනුකූලව අලංකාරව පහළට වැටීම සහතික කරයි.',
    industryStandardEn: 'Must span at least 60% of the pattern piece length, clearly marked with arrows at both ends.',
    industryStandardSi: 'පැටර්න් කොටසේ උසින් අවම වශයෙන් 60%ක් දිගින් යුක්ත විය යුතු අතර දෙකෙළවරම ඊතල සටහන් විය යුතුය.',
    riskIfMissingEn: 'Garment drapes crookedly, side seams twist forward onto the stomach, completely unwearable.',
    riskIfMissingSi: 'ඇඳුම ඇන්ද පසු පැති මැහුම් ඉදිරියට කරකැවී විකෘති වන අතර ඇඳුම ඇඳීමට නොහැකි තත්ත්වයට පත්වේ.',
    badge: 'MANDATORY #2',
    iconName: 'Compass',
    svgHighlightId: 'hl-grain',
  },
  {
    id: 'elem-cut-qty',
    titleEn: 'Cut Quantity (Number of Cuts)',
    titleSi: 'කපන වාර ගණන (Number of Cut)',
    shortDescEn: 'Exact cutting count: Cut 1 on fold, Cut 2 self, Cut 2 lining, Cut 2 interfacing.',
    shortDescSi: 'අදාළ කොටසින් කැබලි කීයක් කැපිය යුතුද සහ කුමන රෙදි වර්ගයෙන්ද යන්න.',
    whyMandatoryEn: 'Instructs the cutter how many fabric layers to cut and in which specific textile.',
    whyMandatorySi: 'කටර්ට එක් ඇඳුමක් සඳහා කෑලි කීයක්, ප්‍රධාන රෙද්දෙන්ද, ලයිනින් රෙද්දෙන්ද කපාගත යුතු දැයි නිශ්චිතව කියයි.',
    industryStandardEn: 'Format: "CUT 1 ON FOLD (SELF)" or "CUT 2 (SELF) + CUT 2 (LINING)".',
    industryStandardSi: 'සම්මත ලේඛනය: "CUT 1 ON FOLD (SELF)" හෝ "CUT 2 (SELF) + CUT 2 (LINING)".',
    riskIfMissingEn: 'Cutter cuts only one sleeve instead of a pair, or fails to cut lining pieces, halting production.',
    riskIfMissingSi: 'අත් දෙකක් වෙනුවට එක අතක් පමණක් කැපීම හෝ ලයිනින් නොකපා හැරීම නිසා මැහුම් වැඩ නැවතී පාඩු සිදුවේ.',
    badge: 'MANDATORY #3',
    iconName: 'Scissors',
    svgHighlightId: 'hl-cut',
  },
  {
    id: 'elem-size',
    titleEn: 'Size & Grading Tier',
    titleSi: 'ප්‍රමාණය සහ සයිස් ශ්‍රේණිය (Size)',
    shortDescEn: 'Identifies standard body size: UK 8/10/12/14 or S/M/L/XL with measurement specs.',
    shortDescSi: 'පැටර්නය අයත් වන සම්මත ශරීර ප්‍රමාණය (S, M, L හෝ UK 10/12).',
    whyMandatoryEn: 'Ensures the finished garment matches customer body specifications exactly.',
    whyMandatorySi: 'නිම කළ ඇඳුම පාරිභෝගිකයාගේ ශරීර මිණුම්වලට නිවැරදිව ගැලපෙන බව තහවුරු කරයි.',
    industryStandardEn: 'Marked prominently in bold near center: SIZE: M (UK 10 / BUST 36").',
    industryStandardSi: 'පැටර්නයේ මැදට වන්නට තද අකුරින් පැහැදිලිව සටහන් කිරීම: SIZE: M (UK 10 / BUST 36").',
    riskIfMissingEn: 'Wrong size tag attached to garment, causing retail customer returns and disputes.',
    riskIfMissingSi: 'වැරදි සයිස් ලේබල් වැදී පාරිභෝගිකයින්ගෙන් ඇඳුම් ආපසු ලැබීම සහ සන්නාම විශ්වාසය බිඳවැටීම.',
    badge: 'MANDATORY #4',
    iconName: 'Ruler',
    svgHighlightId: 'hl-size',
  },
  {
    id: 'elem-fold-sym',
    titleEn: 'Fold Line Symbol',
    titleSi: 'නැමුම් සංකේතය (Place on Fold)',
    shortDescEn: 'Double-ended arrow bracket placed against the edge that aligns with fabric fold.',
    shortDescSi: 'රෙද්දේ නැමුම මත තැබිය යුතු දාරය දක්වන ද්විත්ව ඊතල වරහන.',
    whyMandatoryEn: 'Prevents accidentally cutting along the center front or center back of a garment.',
    whyMandatorySi: 'ඉදිරිපස හෝ පසුපස මැදින් අත්වැරදීමකින් රෙද්ද කපා දැමීම සම්පූර්ණයෙන්ම වළක්වයි.',
    industryStandardEn: 'Standard 3-point bracket arrow with label "PLACE ON FOLD ⟵ ⊐ ⟶".',
    industryStandardSi: 'සම්මත ඊතල වරහන සහ "PLACE ON FOLD ⟵ ⊐ ⟶" පාඨය.',
    riskIfMissingEn: 'Cutter slices center front into two separated pieces, destroying fabric layout and wasting expensive cloth.',
    riskIfMissingSi: 'රෙද්ද මැදින් දෙකට කැපී ගොස් වටිනා සුඛෝපභෝගී රෙද්ද සම්පූර්ණයෙන්ම අපතේ යාම.',
    badge: 'MANDATORY #5',
    iconName: 'Bookmark',
    svgHighlightId: 'hl-fold',
  },
  {
    id: 'elem-seam-spec',
    titleEn: 'Seam Allowance Breakdown',
    titleSi: 'මැහුම් වාසි විස්තරය (Seam Allowance Specs)',
    shortDescEn: 'Explicit margin values for general seams, necklines, armholes, and hemlines.',
    shortDescSi: 'සාමාන්‍ය මැහුම්, කර, කිහිල්ල සහ වාටිය සඳහා තබා ඇති වාසි අඟල් ප්‍රමාණය.',
    whyMandatoryEn: 'Sewers need to know whether 1/2" or 1/4" was budgeted to maintain exact garment dimensions.',
    whyMandatorySi: 'මහන ටේලර්ට නියමිත මිණුම රැකගැනීමට මැහුම දැමිය යුත්තේ අඟල් කීයකින්දැයි නිවැරදිව දැනගැනීමට.',
    industryStandardEn: 'Notation: "1/2 INCH SEAM ALLOWANCE INCLUDED UNLESS NOTED (NECK: 1/4\", HEM: 1.5\")".',
    industryStandardSi: 'සටහන: "1/2\" මැහුම් වාසිය ඇතුළත් කර ඇත (කරට 1/4\", වාටියට 1.5\")".',
    riskIfMissingEn: 'Tailor sews with 3/4" seam, shrinking a size M garment down to an unwearable size XS.',
    riskIfMissingSi: 'ටේලර් වැඩිපුර අඟලකින් මැසීම නිසා Medium ඇඳුම XS තරම් කුඩා වී ඇඳීමට නොහැකි වීම.',
    badge: 'MANDATORY #6',
    iconName: 'PenTool',
    svgHighlightId: 'hl-sa',
  },
  {
    id: 'elem-notches',
    titleEn: 'Notches & Balance Marks',
    titleSi: 'කප්පාදු සහ ලකුණු (Notches)',
    shortDescEn: 'Single notch for front, double notch for back, matching markers for side seams.',
    shortDescSi: 'ඉදිරිපසට තනි කප්පාදුවක්, පසුපසට ද්විත්ව කප්පාදුවක් සහ පැති මැහුම් ලකුණු.',
    whyMandatoryEn: 'Ensures proper seam alignment and prevents uneven fabric stretching during high-speed sewing.',
    whyMandatorySi: 'වේගයෙන් මහන විට රෙදි කොටස් නොඇදී එකිනෙකට නිවැරදි ස්ථානයෙන් සමපාත වන බව තහවුරු කරයි.',
    industryStandardEn: 'Single Notch (▲) = Front armhole / Front side. Double Notch (▲▲) = Back armhole / Back side.',
    industryStandardSi: 'තනි කප්පාදුව (▲) = ඉදිරිපස. ද්විත්ව කප්පාදුව (▲▲) = පසුපස කිහිල්ල.',
    riskIfMissingEn: 'Sleeves sewn on backwards or twisted, leading to painful restriction in arm movement.',
    riskIfMissingSi: 'අත් කොටස් පෙරළා පසුපසට මසනු ලැබීමෙන් අත් සෙලවීමට නොහැකි වීම.',
    badge: 'MANDATORY #7',
    iconName: 'Layers',
    svgHighlightId: 'hl-notches',
  },
  {
    id: 'elem-dart-apex',
    titleEn: 'Dart Apex & Punch Hole Markers',
    titleSi: 'ඩාට් උච්ච ලක්ෂ්‍යය හා විදුම් සිදුර (Dart Apex & Punch Hole)',
    shortDescEn: 'Accurate dart stitching legs converging toward apex with drill hole set 1/2" back.',
    shortDescSi: 'නියමිත කෝණයෙන් පපුව දෙසට එල්ල වන ඩාට් රේඛා සහ අඟල් 1/2කට පෙර පිහිටි විදුම් සිදුර.',
    whyMandatoryEn: 'Prevents pointy conical shapes on the bust and guides machine operator to the exact stop point.',
    whyMandatorySi: 'පපුව ප්‍රදේශයේ උල් හැඩ ඇතිවීම වළක්වා, මැහුම නැවතිය යුතු නියමිත ස්ථානය ටේලර්ට පෙන්වා දෙයි.',
    industryStandardEn: 'Dart fold lines drawn solid; punch hole marked 1/2" (1.2cm) back from the true apex.',
    industryStandardSi: 'ඩාට් රේඛා තදින් අඳියි; විදුම් සිදුර සැබෑ උච්ච ලක්ෂ්‍යයට අඟල් 1/2කට මෙපිටින් සලකුණු කරයි.',
    riskIfMissingEn: 'Darts stitched past apex, causing sharp cone-shaped points on the chest of evening dresses.',
    riskIfMissingSi: 'ඩාට් එක උච්ච ලක්ෂ්‍යය ඉක්මවා මැසීම නිසා උත්සව ඇඳුමේ පපුව උල් හැඩයක් ගෙන අවලස්සන වීම.',
    badge: 'MANDATORY #8',
    iconName: 'HelpCircle',
    svgHighlightId: 'hl-dart',
  },
];

// ============================================================================
// BLUEPRINT PIECES CATALOG
// ============================================================================
export const BLUEPRINT_PIECES: PatternPieceBlueprint[] = [
  {
    id: 'piece-front-bodice',
    nameEn: 'Couture Front Bodice Block',
    nameSi: 'ඉදිරිපස බඳ පැටර්න් අච්චුව',
    styleNo: 'CSS-2026-DRS-01',
    cutInstructionEn: 'Cut 1 on Fold (Self Fabric) + Cut 1 on Fold (Lining)',
    cutInstructionSi: 'නැමුම මත 1ක් (ප්‍රධාන රෙද්දෙන්) + නැමුම මත 1ක් (ලයිනින්)',
    sizeRange: 'Size M (UK 10 / US 6 / Bust 36" / Waist 28")',
    descriptionEn: 'Fitted master front bodice featuring French bust dart, waist shaping dart, contoured armhole, and neckline.',
    descriptionSi: 'පපුවේ ඩාට් එක, ඉණ හැඩගැන්වීමේ ඩාට් එක සහ සම්මත කර හා කිහිලි වක්‍ර සහිත මූලික ඉදිරිපස බඳ පැටර්නය.',
    seamAllowanceEn: 'General seams: 1/2" (1.2cm) | Neckline: 1/4" (0.6cm) | Waist: 1/2" (1.2cm) | Center Front: ON FOLD (0")',
    seamAllowanceSi: 'සාමාන්‍ය මැහුම්: 1/2" | කර වටය: 1/4" | ඉණ: 1/2" | ඉදිරිපස මැද: නැමුම මත (0")',
    grainlineType: 'Straight Grain (Parallel to Center Front Fold)',
    grainlineTypeSi: 'සෘජු ධාන්‍ය රේඛාව (ඉදිරිපස නැමුමට සමාන්තර)',
    totalNotches: 3,
    dartCount: 2,
    svgType: 'bodiceFront',
  },
  {
    id: 'piece-back-bodice',
    nameEn: 'Tailored Back Bodice Block',
    nameSi: 'පසුපස බඳ පැටර්න් අච්චුව',
    styleNo: 'CSS-2026-DRS-01',
    cutInstructionEn: 'Cut 2 (Self Fabric) + Cut 2 (Lining) - Center Back Zipper',
    cutInstructionSi: 'පසුපස සිපර් සඳහා කැබලි 2ක් (ප්‍රධාන රෙද්දෙන්) + 2ක් (ලයිනින්)',
    sizeRange: 'Size M (UK 10 / US 6 / Back Length 16")',
    descriptionEn: 'Ergonomic back bodice with shoulder blade dart, long vertical waist contour dart, and double back armhole notch.',
    descriptionSi: 'උරහිස් ඩාට් එක, දිගු ඉණ ඩාට් එක, පසුපස සිපර් වාසිය සහ ද්විත්ව කිහිලි කප්පාදුව (Double Notch) සහිත පසුපස පැටර්නය.',
    seamAllowanceEn: 'General: 1/2" (1.2cm) | Center Back (Zipper): 3/4" (2cm) | Neckline: 1/4" (0.6cm)',
    seamAllowanceSi: 'සාමාන්‍ය: 1/2" | පසුපස මැද (සිපර් වාසිය): 3/4" | කර වටය: 1/4"',
    grainlineType: 'Straight Grain (Parallel to Center Back)',
    grainlineTypeSi: 'සෘජු ධාන්‍ය රේඛාව (පසුපස මැදට සමාන්තර)',
    totalNotches: 4,
    dartCount: 2,
    svgType: 'bodiceBack',
  },
  {
    id: 'piece-sleeve',
    nameEn: 'Set-in Fitted Sleeve Block',
    nameSi: 'අත පැටර්න් අච්චුව (Set-in Sleeve)',
    styleNo: 'CSS-2026-SLV-01',
    cutInstructionEn: 'Cut 1 Pair (1 Left, 1 Right Face-to-Face)',
    cutInstructionSi: 'යුගල 1ක් කපන්න (වම් සහ දකුණු අත මුහුණට මුහුණ ලා)',
    sizeRange: 'Size M (Bicep 11.5" / Sleeve Length 23")',
    descriptionEn: 'Engineered sleeve block with balanced cap crown ease, front single notch, back double notch, and wrist taper.',
    descriptionSi: 'උරහිස් බුරුල් බව (Crown Ease), ඉදිරිපස තනි කප්පාදුව, පසුපස ද්විත්ව කප්පාදුව සහ මැණික් කටුව දක්වා හැඩය සහිත අත පැටර්නය.',
    seamAllowanceEn: 'Underarm seams: 1/2" (1.2cm) | Sleeve Cap: 1/2" (1.2cm) | Wrist Hem: 1" (2.5cm)',
    seamAllowanceSi: 'යට මැහුම: 1/2" | අතේ උඩ වක්‍රය: 1/2" | මැණික් කටු වාටිය: 1"',
    grainlineType: 'Straight Grain (Center Bicep Line)',
    grainlineTypeSi: 'සෘජු ධාන්‍ය රේඛාව (අතේ මධ්‍ය රේඛාව දිගේ)',
    totalNotches: 3,
    dartCount: 0,
    svgType: 'sleeve',
  },
  {
    id: 'piece-skirt',
    nameEn: 'A-Line Flared Skirt Block',
    nameSi: 'සාය පැටර්න් අච්චුව (A-Line Skirt)',
    styleNo: 'CSS-2026-SKT-01',
    cutInstructionEn: 'Cut 1 on Fold (Front) + Cut 2 (Back Panels)',
    cutInstructionSi: 'ඉදිරිපසට නැමුම මත 1ක් + පසුපසට කැබලි 2ක්',
    sizeRange: 'Size M (Waist 28" / Hip 38" / Length 26")',
    descriptionEn: 'Graceful A-line silhouette with dual waist shaping darts, hip curve grading, and wide 1.5" weighted hemline allowance.',
    descriptionSi: 'ද්විත්ව ඉණ ඩාට්, උකුල් වක්‍රය සහ පහළ අඟල් 1.5ක බරැති වාටි වාසිය සහිත A-හැඩයේ සාය පැටර්නය.',
    seamAllowanceEn: 'Side seams: 1/2" (1.2cm) | Waist: 1/2" (1.2cm) | Bottom Hem: 1.5" (3.8cm)',
    seamAllowanceSi: 'පැති මැහුම්: 1/2" | ඉණ: 1/2" | පහළ වාටිය: 1.5"',
    grainlineType: 'Straight Grain (Or 45° True Bias for Fluid Drape)',
    grainlineTypeSi: 'සෘජු ධාන්‍ය රේඛාව (හෝ බයස් අතට අංශක 45)',
    totalNotches: 2,
    dartCount: 2,
    svgType: 'skirt',
  },
];

// ============================================================================
// MINI QUIZ QUESTIONS FOR STUDENTS
// ============================================================================
const PATTERN_QUIZ_QUESTIONS = [
  {
    questionSi: 'පැටර්න් එකක ද්විත්ව කප්පාදුව (Double Notch ▲▲) යොදන්නේ කුමන කොටස සඳහාද?',
    questionEn: 'On a garment pattern, what does a Double Notch (▲▲) indicate?',
    optionsSi: ['ඉදිරිපස කිහිලි වටය', 'පසුපස කිහිලි වටය හෝ පසුපස කොටස', 'කර වටයේ මැද', 'පහළ වාටිය'],
    optionsEn: ['Front armhole', 'Back armhole or Back pattern piece', 'Center of neckline', 'Bottom hemline'],
    correctIndex: 1,
    explanationSi: 'ජාත්‍යන්තර සම්මතය අනුව තනි කප්පාදුව (▲) ඉදිරිපසටද, ද්විත්ව කප්පාදුව (▲▲) පසුපසටද යොදයි. එමගින් අත් පෙරළා මසනු ලැබීම වළක්වයි.',
    explanationEn: 'By international standard, a single notch indicates the front armhole and a double notch indicates the back armhole.',
  },
  {
    questionSi: 'ඩාට් එකක මැහුම පපුවේ සැබෑ උච්ච ලක්ෂ්‍යයට (Bust Apex) අඟල් 1/2කට මෙපිටින් නතර කරන්නේ ඇයි?',
    questionEn: 'Why is a dart stitch line stopped 1/2 inch away from the true Bust Apex?',
    optionsSi: ['නූල් ඉතිරි කර ගැනීමට', 'පපුව ප්‍රදේශයේ අවලස්සන උල් හැඩයක් ඇතිවීම වැළැක්වීමට', 'රෙද්ද ඇදීම සඳහා', 'කිහිල්ලට ඉඩ තැබීමට'],
    optionsEn: ['To save thread', 'To prevent an unsightly cone-shaped point on the bust', 'To allow fabric stretch', 'To leave room for armhole'],
    correctIndex: 1,
    explanationSi: 'උච්ච ලක්ෂ්‍යය මතටම මැහුම ගියහොත් පපුව උල් වී විකෘති පෙනුමක් ලැබේ. අඟල් 1/2ක් පෙර නතර කිරීමෙන් ස්වභාවික සුමට වක්‍රයක් ලැබේ.',
    explanationEn: 'Ending the stitch 1/2" before the apex avoids sharp conical points and yields a soft, anatomical roundness.',
  },
  {
    questionSi: '"Cut 1 on Fold" යනුවෙන් සටහන් කර ඇති දාරයකට කුමක් නොකළ යුතුද?',
    questionEn: 'What must you NEVER do to an edge marked "Place on Fold"?',
    optionsSi: ['රෙද්ද නැමීම', 'මැහුම් වාසිය (Seam Allowance) එකතු කිරීම', 'හුණු ලකුණු තැබීම', 'පැටර්නය අල්පෙනෙති ගැසීම'],
    optionsEn: ['Fold the fabric', 'Add seam allowance to that fold edge', 'Mark with chalk', 'Pin the pattern'],
    correctIndex: 1,
    explanationSi: 'නැමුම් දාරයට මැහුම් වාසියක් එකතු කළහොත් ඇඳුමේ මධ්‍ය කොටසින් අමතර පළලක් එකතු වී ඇඳුම දෙගුණයක් විශාල වේ!',
    explanationEn: 'Adding seam allowance to a fold line increases the garment width erroneously, ruining the symmetry and sizing.',
  },
  {
    questionSi: 'රෙද්දක "True Bias" (සැබෑ ඇල දිශාව) පිහිටන්නේ රෙද්දේ වාටියට (Selvage) සාපේක්ෂව කවර කෝණයකින්ද?',
    questionEn: 'At what angle does the "True Bias" grainline lie relative to the fabric selvage?',
    optionsSi: ['අංශක 30', 'අංශක 45', 'අංශක 90', 'අංශක 180'],
    optionsEn: ['30 degrees', '45 degrees', '90 degrees', '180 degrees'],
    correctIndex: 1,
    explanationSi: 'සැබෑ බයස් (True Bias) යනු රෙද්දේ වාටියට හරියටම අංශක 45ක කෝණයකින් ඇලව පිහිටන දිශාවයි. මෙම දිශාවට උපරිම ඇදෙනසුළු බවක් සහ පහළ වැටීමක් ඇත.',
    explanationEn: 'True Bias lies precisely at a 45-degree angle to the warp and selvage, providing maximum natural elasticity and fluid drape.',
  },
];

export interface Garment3DStyleItem {
  id: 'gown' | 'princess' | 'shift' | 'skirt';
  titleEn: string;
  titleSi: string;
  subtitleEn: string;
  subtitleSi: string;
  badgeEn: string;
  badgeSi: string;
  imageFilename: string;
  colorPalette: { name: string; nameSi: string; hex: string }[];
  details: {
    titleEn: string;
    titleSi: string;
    descEn: string;
    descSi: string;
  }[];
  patternSpecs: {
    keyTechniqueEn: string;
    keyTechniqueSi: string;
    dartType: string;
    seamType: string;
    recommendedFabricEn: string;
    recommendedFabricSi: string;
    mannequinSize: string;
  };
}

export const GARMENT_3D_CATALOGUE: Record<'gown' | 'princess' | 'shift' | 'skirt', Garment3DStyleItem> = {
  gown: {
    id: 'gown',
    titleEn: 'Evening Gown (French Darts)',
    titleSi: 'උත්සව ගවුම (French Darts)',
    subtitleEn: 'Floor-Length Silk Satin Gown with High Leg Slit & Sculptural French Darts',
    subtitleSi: 'ප්‍රංශ ඩාට් සහ උකුල් ස්ලිට් සහිත උසස් සේද සැටින් උත්සව ගවුම',
    badgeEn: 'French Darts & Slit',
    badgeSi: 'ප්‍රංශ ඩාට් හා ස්ලිට්',
    imageFilename: 'Blush Rose Gown Design Board.png',
    colorPalette: [
      { name: 'Blush Rose', nameSi: 'බ්ලෂ් රෝස', hex: '#df9fa8' },
      { name: 'Dusty Mauve', nameSi: 'ඩස්ටි මෝව්', hex: '#b87d8a' },
      { name: 'Champagne Gold', nameSi: 'ෂැම්පේන් ගෝල්ඩ්', hex: '#dfcca3' },
      { name: 'Noir Midnight', nameSi: 'මිඩ්නයිට් බ්ලැක්', hex: '#1c191a' },
    ],
    details: [
      {
        titleEn: 'Square Neckline Detail',
        titleSi: 'කොටු කර මෝස්තරය (Neckline)',
        descEn: 'Architectural tailored square neckline framing the décolletage with wide supportive straps.',
        descSi: 'පළල් පටි සහිත හැඩකාර කොටු කර මෝස්තරය සහ ශක්තිමත් නිමාව.',
      },
      {
        titleEn: 'French Dart Construction',
        titleSi: 'ප්‍රංශ ඩාට් හැඩතලය (French Dart)',
        descEn: 'Sculptural diagonal bust shaping curving smoothly from the lower side waist directly to the apex point.',
        descSi: 'පහළ පැති ඉණෙන් පටන්ගෙන පපුවේ උච්ච ලක්ෂ්‍යය දක්වා විහිදෙන ප්‍රංශ ඩාට් (French Darts).',
      },
      {
        titleEn: 'Low Scoop Back & Zipper',
        titleSi: 'පසුපස හැඩය හා සිපර් (Back Detail)',
        descEn: 'Graceful low scoop back opening with concealed invisible zipper extending past the waistline.',
        descSi: 'අලංකාර ගැඹුරු පසුපස හැඩය සහ නොපෙනෙන සිපර් (Invisible Zipper) නිමාව.',
      },
      {
        titleEn: 'Sunburst Slit & Skirt Drape',
        titleSi: 'උකුල් ස්ලිට් සහ රැළි (Skirt Drape)',
        descEn: 'Directional sunburst pleats radiating from the high left thigh walking slit for dynamic movement.',
        descSi: 'උකුල් ස්ලිට් එකෙන් විහිදෙන අලංකාර රැලි සහ දියරමය පතිත වීම.',
      },
    ],
    patternSpecs: {
      keyTechniqueEn: 'French Dart Diagonal Slash & Spread with Contoured Waist Balance',
      keyTechniqueSi: 'විකර්ණ ප්‍රංශ ඩාට් හැසිරවීම සහ උකුල් ස්ලිට් සමබරතාවය',
      dartType: 'Diagonal Curved French Darts (Side-Seam to Apex)',
      seamType: 'French Seams (1/2") & Contoured Neck Facing',
      recommendedFabricEn: 'Heavy Silk Satin, Mikado Silk, Duchess Satin (220-280 GSM)',
      recommendedFabricSi: 'හෙවි සිල්ක් සැටින්, මිකාඩෝ, ඩචස් සැටින් (220-280 GSM)',
      mannequinSize: 'Standard UK 10 (Bust 34", Waist 26", Hip 36")',
    },
  },
  princess: {
    id: 'princess',
    titleEn: 'Princess Cut Coat',
    titleSi: 'ප්‍රින්සස් කට් කෝට්',
    subtitleEn: 'Structured A-Line Flared Coat with Notched Lapel & Princess Seams',
    subtitleSi: 'නොච් ලැපල් කර සහ ප්‍රින්සස් කට් සහිත උසස් කෝට් විලාසිතාව',
    badgeEn: 'Princess Cut & Flap Pocket',
    badgeSi: 'ප්‍රින්සස් කට් සහ ෆ්ලැප් සාක්කු',
    imageFilename: '35e9fa5a-373a-43f6-86d5-c5509c25b364.png',
    colorPalette: [
      { name: 'Rose Wool', nameSi: 'රෝස වූල්', hex: '#d98d9c' },
      { name: 'Tailored Camel', nameSi: 'කැමල්', hex: '#c29a6b' },
      { name: 'Deep Wine', nameSi: 'ක්රිම්සන් වයින්', hex: '#781d2a' },
      { name: 'Charcoal Noir', nameSi: 'චාකෝල් බ්ලැක්', hex: '#29272b' },
    ],
    details: [
      {
        titleEn: 'Tailored Notched Lapel',
        titleSi: 'නොච් ලැපල් කර (Notched Lapel)',
        descEn: 'Architectural notched collar with crisp roll-line tailored over structured hair-canvas interlining.',
        descSi: 'කැන්වස් ආධාරකයක් සහිත උසස් ටේලර්ඩ් නොච් ලැපල් කර.',
      },
      {
        titleEn: 'Continuous Princess Seam',
        titleSi: 'ප්‍රින්සස් කට් මැහුම (Princess Seam)',
        descEn: 'Continuous curved seam sculpting from scye/armhole through apex down to the flared hemline.',
        descSi: 'කිහිල්ලේ සිට පපුව හරහා වාටිය දක්වා දිවෙන අඛණ්ඩ ප්‍රින්සස් කට් මැහුම් රේඛාව.',
      },
      {
        titleEn: 'Angled Flap Besom Pocket',
        titleSi: 'කෝණික ෆ්ලැප් සාක්කුව (Flap Pocket)',
        descEn: 'Double-besom welt pocket with angled flap tailored directly along the hip balance line.',
        descSi: 'කෝණයකට තැබූ අලංකාර සාක්කු ෆ්ලැප් (Flap Pocket) සහ වෙල්ට් නිමාව.',
      },
      {
        titleEn: 'Medallion Button & Sleeve Vent',
        titleSi: 'රන්වන් බොත්තම් සහ අත් නිමාව (Buttons & Vent)',
        descEn: 'Single embossed gold medallion closure button and matching triple cuff buttons with satin lining.',
        descSi: 'රන්වන් මෙඩලියන් බොත්තම්, අත් වාටි සහ අභ්‍යන්තර සැටින් ලයිනින් නිමාව.',
      },
    ],
    patternSpecs: {
      keyTechniqueEn: 'Armhole-to-Hem Princess Panel Geometry & Tailored Coat Collar Roll',
      keyTechniqueSi: 'කිහිලි-වාටි ප්‍රින්සස් පැනල් සහ කෝට් කොලර් රෝල් ක්‍රමය',
      dartType: 'Zero Darts (Fully integrated into Princess Seams)',
      seamType: 'Lapped Tailored Seam with Pressing Canvas (5/8")',
      recommendedFabricEn: 'Wool Melton, Cashmere Blend, Tailoring Twill (350-420 GSM)',
      recommendedFabricSi: 'වූල් මෙල්ටන්, කැෂ්මියර් බ්ලෙන්ඩ්, ටේලරින් ට්විල් (350-420 GSM)',
      mannequinSize: 'Standard UK 10 / Tailored Overgarment Fit',
    },
  },
  shift: {
    id: 'shift',
    titleEn: 'Fit Dress',
    titleSi: 'Fit Dress',
    subtitleEn: 'Square-Neck Sheath Dress with Asymmetrical Tulip Wrap Pleats',
    subtitleSi: 'කොටු කර සහ ටියුලිප් රැලි සහිත හැඩකාර ෆිට් ඩ්‍රෙස්',
    badgeEn: 'Tulip Drape & Square Neck',
    badgeSi: 'ටියුලිප් ඩ්‍රේප් හා කොටු කර',
    imageFilename: 'Mauve Dress Design Showcase Board.png',
    colorPalette: [
      { name: 'Dusty Mauve', nameSi: 'ඩස්ටි මෝව්', hex: '#a37280' },
      { name: 'Midnight Navy', nameSi: 'මිඩ්නයිට් නේවි', hex: '#1a263d' },
      { name: 'Champagne Sand', nameSi: 'ෂැම්පේන් සැන්ඩ්', hex: '#d5c6b4' },
      { name: 'Noir Black', nameSi: 'නොයර් බ්ලැක්', hex: '#1c1a1a' },
    ],
    details: [
      {
        titleEn: 'Contoured Square Neckline',
        titleSi: 'කොටු කර (Square Neckline)',
        descEn: 'Mitered square neckline engineered to contour the clavicle without gaping.',
        descSi: 'කොලර්බෝන් ඉස්මතු කරන තියුණු කොටු කර (Square Neckline).',
      },
      {
        titleEn: 'Princess Contour Seams',
        titleSi: 'සිරුරු හැඩතල මැහුම් (Princess Contours)',
        descEn: 'Vertical shaping seams tailoring the bodice seamlessly down into the hip block.',
        descSi: 'ඉණ සහ සිරුරට මනාව ගැළපෙන සිරස් හැඩතල මැහුම්.',
      },
      {
        titleEn: 'Asymmetrical Tulip Drape',
        titleSi: 'විකර්ණ ටියුලිප් රැලි (Tulip Pleats)',
        descEn: 'Diagonal pleat radiating from right waist across the front with overlap walking vent.',
        descSi: 'ඉණෙන් ආරම්භ වන අලංකාර විකර්ණ ටියුලිප් රැලි සහ ඉදිරිපස ස්ලිට් එක.',
      },
      {
        titleEn: '3/4 Sleeve Split Vents',
        titleSi: '3/4 අත් පැළුම (Sleeve Detail)',
        descEn: 'Slim tailored 3/4 sleeve with architectural notched wrist vent.',
        descSi: 'අලංකාර පැළුමක් සහිත 3/4 අත් මෝස්තරය.',
      },
    ],
    patternSpecs: {
      keyTechniqueEn: 'Asymmetrical Draping on Fitted Sheath Block with Walking Vent',
      keyTechniqueSi: 'අසමමිතික ඩ්‍රේපින් සහ ඉදිරිපස වෙන්ට් එකලස් කිරීම',
      dartType: 'Waist & Bust Darts absorbed into Wrap Drape',
      seamType: 'Concealed Seams with Stretch Interfacing (1/2")',
      recommendedFabricEn: 'Crepe de Chine, Ponte di Roma, Wool Crepe (240-300 GSM)',
      recommendedFabricSi: 'ක්‍රේප් ඩි චයින්, පොන්ටේ ඩි රෝමා, වූල් ක්‍රේප් (240-300 GSM)',
      mannequinSize: 'Standard UK 10 (Fitted Silhouette)',
    },
  },
  skirt: {
    id: 'skirt',
    titleEn: 'A-Line Skirt',
    titleSi: 'A-ලයින් සාය',
    subtitleEn: 'High-Waisted Architectural Pleated Maxi Skirt with Tailored Sweep',
    subtitleSi: 'උස් ඉණ පටිය සහ ගැඹුරු බොක්ස් රැලි සහිත A-ලයින් සාය',
    badgeEn: 'Contoured Waist & Box Pleats',
    badgeSi: 'වක්‍ර ඉණ පටිය හා බොක්ස් රැලි',
    imageFilename: '567e2f4c-6d6d-4f2b-8f24-7605bf6a6889.png',
    colorPalette: [
      { name: 'Blush Pink', nameSi: 'බ්ලෂ් පිංක්', hex: '#d494a2' },
      { name: 'Royal Navy', nameSi: 'රෝයල් නේවි', hex: '#1e2b47' },
      { name: 'Oatmeal Beige', nameSi: 'ඕට්මීල් බේජ්', hex: '#ded4c3' },
      { name: 'Forest Olive', nameSi: 'ෆොරස්ට් ඔලිව්', hex: '#464f3d' },
      { name: 'Jet Black', nameSi: 'ජෙට් බ්ලැක්', hex: '#1a1a1a' },
    ],
    details: [
      {
        titleEn: 'Curved Anatomical Waistband',
        titleSi: 'වක්‍රාකාර ඉණ පටිය (Waistband)',
        descEn: 'High-rise 2" contoured waistband patterned on a radius curve to hug the natural waist.',
        descSi: 'ඉණට මනාව ගැළපෙන අඟල් 2ක වක්‍රාකාර ඉණ පටිය.',
      },
      {
        titleEn: 'Side Seam & Pockets',
        titleSi: 'පැති මැහුම සහ සාක්කු (Side Seam)',
        descEn: 'Reinforced side seams with integrated in-seam pockets and precise grainline fall.',
        descSi: 'පැති මැහුම සහ වාටිය සමබරව තබා ගැනීමේ ධාන්‍ය රේඛා ක්‍රමය.',
      },
      {
        titleEn: 'Invisible Zipper Closure',
        titleSi: 'නොපෙනෙන සිපර් (Invisible Zip)',
        descEn: 'Center-back concealed invisible zipper with hook-and-eye closure at waistband top.',
        descSi: 'පසුපස ඉණ පටිය හරහා දිවෙන නොපෙනෙන සිපර් (Invisible Zip) නිමාව.',
      },
      {
        titleEn: 'Crisp Deep Box Pleats',
        titleSi: 'ගැඹුරු බොක්ස් රැලි (Box Pleats)',
        descEn: 'Structured inverted box pleats offering volumetric architectural silhouette.',
        descSi: 'ඇඳුමට හැඩය සහ පාවෙන බව ලබා දෙන ගැඹුරු බොක්ස් රැලි.',
      },
    ],
    patternSpecs: {
      keyTechniqueEn: 'Box Pleat Mathematical Calculation & Curved Waistband Grading',
      keyTechniqueSi: 'බොක්ස් රැලි ගණනය කිරීම සහ වක්‍ර ඉණ පටි පැටර්නය',
      dartType: 'Waist Darts converted to Pleat Depth',
      seamType: '5-Thread Serged & Flat Pressed (1/2")',
      recommendedFabricEn: 'Medium-Weight Suiting, Cotton Sateen, Linen-Viscose (220-280 GSM)',
      recommendedFabricSi: 'මීඩියම්-වේට් සූටින්, කොට්න් සැටින්, ලිනන්-විස්කෝස් (220-280 GSM)',
      mannequinSize: 'Standard UK 10 (Waist 26", Hip 36")',
    },
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const PatternDummyStudio: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const { siteSettings } = useData();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dummy' | 'measurements' | 'blueprint' | 'checklist' | 'glossary' | 'quiz'>('dummy');

  // Body Measurements State
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string>('bm-01');
  const [measurementCategory, setMeasurementCategory] = useState<string>('all');
  const [measurementModalImage, setMeasurementModalImage] = useState<string | null>(null);

  // Body Measurements: from siteSettings or fallback to default
  const bodyMeasurementsList = useMemo(() => {
    return siteSettings.bodyMeasurements && siteSettings.bodyMeasurements.length > 0
      ? siteSettings.bodyMeasurements
      : DEFAULT_BODY_MEASUREMENTS;
  }, [siteSettings.bodyMeasurements]);

  const currentMeasurement = useMemo(() => {
    return bodyMeasurementsList.find((m) => m.id === selectedMeasurementId) || bodyMeasurementsList[0];
  }, [bodyMeasurementsList, selectedMeasurementId]);

  const filteredMeasurements = useMemo(() => {
    if (measurementCategory === 'all') return bodyMeasurementsList;
    return bodyMeasurementsList.filter((m) => m.category === measurementCategory);
  }, [bodyMeasurementsList, measurementCategory]);

  // Mini Dummy 3D Dress State
  const [dummyAngle, setDummyAngle] = useState<'front' | 'angle' | 'side' | 'back'>('front');
  const [dummyGarmentStyle, setDummyGarmentStyle] = useState<'gown' | 'princess' | 'shift' | 'skirt'>('gown');
  const [showDummyLandmarks, setShowDummyLandmarks] = useState<boolean>(true);
  const [showPatternOverlay, setShowPatternOverlay] = useState<boolean>(true);
  const [activeLandmark, setActiveLandmark] = useState<string | null>('apex');

  // 3D Dress Studio Sub-modes: '3d_turntable' | 'design_board' | 'flat_cad'
  const [dummySubMode, setDummySubMode] = useState<'3d_turntable' | 'design_board' | 'flat_cad'>('3d_turntable');
  const [turntableDegree, setTurntableDegree] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [boardModalImage, setBoardModalImage] = useState<string | null>(null);

  // Auto-rotation effect for 360 degree turntable
  useEffect(() => {
    if (!isAutoRotating) return;
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    const timer = setInterval(() => {
      setTurntableDegree((prev) => {
        const nextIdx = (angles.indexOf(prev) + 1) % angles.length;
        const nextDeg = angles[nextIdx];
        if (nextDeg === 0) setDummyAngle('front');
        else if (nextDeg === 45 || nextDeg === 315) setDummyAngle('angle');
        else if (nextDeg === 90 || nextDeg === 270) setDummyAngle('side');
        else setDummyAngle('back');
        return nextDeg;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [isAutoRotating]);

  const activeGarmentData = useMemo(() => {
    return GARMENT_3D_CATALOGUE[dummyGarmentStyle] || GARMENT_3D_CATALOGUE.gown;
  }, [dummyGarmentStyle]);

  const currentColorHex = useMemo(() => {
    return activeGarmentData.colorPalette[selectedColorIndex]?.hex || activeGarmentData.colorPalette[0].hex;
  }, [activeGarmentData, selectedColorIndex]);

  const handleAngleSelect = (deg: number) => {
    setTurntableDegree(deg);
    setIsAutoRotating(false);
    if (deg === 0) setDummyAngle('front');
    else if (deg === 45 || deg === 315) setDummyAngle('angle');
    else if (deg === 90 || deg === 270) setDummyAngle('side');
    else setDummyAngle('back');
  };

  // Blueprint State
  const [selectedPieceId, setSelectedPieceId] = useState<string>('piece-front-bodice');
  const [highlightedElement, setHighlightedElement] = useState<string | null>('elem-style-no');
  const [showGradingLines, setShowGradingLines] = useState<boolean>(true);
  const [showSeamAllowanceRuler, setShowSeamAllowanceRuler] = useState<boolean>(true);

  // Glossary State
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('all');
  const [expandedTermId, setExpandedTermId] = useState<string | null>('term-grainline');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Active Blueprint piece data
  const currentBlueprintPiece = useMemo(() => {
    return BLUEPRINT_PIECES.find((p) => p.id === selectedPieceId) || BLUEPRINT_PIECES[0];
  }, [selectedPieceId]);

  // Filtered glossary items
  const filteredGlossary = useMemo(() => {
    return PATTERN_TERMINOLOGY_DATABASE.filter((term) => {
      const matchesCategory = glossaryCategory === 'all' || term.category === glossaryCategory;
      const query = glossarySearch.toLowerCase().trim();
      if (!query) return matchesCategory;
      const matchesSearch =
        term.termEn.toLowerCase().includes(query) ||
        term.termSi.toLowerCase().includes(query) ||
        term.meaningEn.toLowerCase().includes(query) ||
        term.meaningSi.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [glossaryCategory, glossarySearch]);

  // Active Highlighted Mandatory Element
  const currentHighlightElement = useMemo(() => {
    return MANDATORY_PATTERN_ELEMENTS.find((e) => e.id === highlightedElement) || MANDATORY_PATTERN_ELEMENTS[0];
  }, [highlightedElement]);

  // Quiz score calculator
  const quizScore = useMemo(() => {
    let score = 0;
    PATTERN_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  }, [quizAnswers]);

  return (
    <section id="patterns" data-bg="dark" className="relative py-14 sm:py-20 text-[#f7f3eb] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0708] via-[#100b0d] to-[#0a0708] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#dfb56c]/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative Grid Lines - Atelier Tailoring Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `linear-gradient(#c99a45 1px, transparent 1px), linear-gradient(90deg, #c99a45 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* SECTION HEADER - GOLD THEMED LUXURY TITLE */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-lg shadow-[#c99a45]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-pulse" />
            <span>
              {isSinhalaMode ? 'ඇඳුම් පැටර්න් හා මැනික්වින් ඩමි ස්ටුඩියෝ' : 'PATTERN ANATOMY & DUMMY STUDIO'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold gold-gradient-text tracking-tight mb-4">
            {isSinhalaMode
              ? 'ඇඳුම් පැටර්න් තාක්ෂණය සහ ත්‍රිමාණ මැනික්වින් ඩමි'
              : 'Garment Pattern Anatomy & 3D Mini Dummy Studio'}
          </h2>

          <p className="text-sm sm:text-base text-[#d5cfc4] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'ඇඳුමකට සම්මත Pattern එකක් සැකසීමේදී අනිවාර්යයෙන්ම තිබිය යුතු අංග (Style #, Grainline, Cut Quantity, Size), තාක්ෂණික නාමාවලිය (English & Sinhala තේරුම් සමග) සහ ත්‍රිමාණ මැනික්වින් ඩමි පෙරදසුන මෙහිදී සජීවීව අධ්‍යයනය කරන්න.'
              : 'Explore the mandatory elements of professional garment patterns (Style #, Grainline, Cut Quantity, Size), complete technical terminology in English & Sinhala, and interactive 3D mannequin dummy assembly.'}
          </p>
        </div>

        {/* ================================================================= */}
        {/* NAVIGATION PILL TABS */}
        {/* ================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          <button
            onClick={() => setActiveTab('dummy')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'dummy'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '1. ත්‍රිමාණ මැනික්වින් ඩමි' : '1. 3D Mini Dummy'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'measurements'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '2. ශරීර මිණුම් (Measurements)' : '2. Body Measurements'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'blueprint'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '3. පැටර්න් අච්චු බ්ලූප්‍රින්ට්' : '3. Pattern Blueprint'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '4. අනිවාර්ය අංග 8' : '4. Mandatory 8'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '5. තාක්ෂණික නාමාවලිය' : '5. Technical Terms'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-[#dfb56c] to-[#9e7225] text-[#0c090a] font-bold border-[#dfb56c] shadow-lg shadow-[#c99a45]/30'
                : 'bg-[#141011]/90 text-[#a89f91] hover:text-[#f7e2a9] border-white/10 hover:border-[#dfb56c]/40'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>
              {isSinhalaMode ? '6. දැනුම පරීක්ෂාව' : '6. Student Quiz'}
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* ================================================================= */}
        {/* TAB 1: 3D DRESS & MANNEQUIN STUDIO (ත්‍රිමාණ මැනික්වින් ඩමි ස්ටුඩියෝ) */}
        {/* ================================================================= */}
        {activeTab === 'dummy' && (
          <div className="space-y-8 animate-fadeIn">
            {/* ------------------------------------------------------------- */}
            {/* TOP CONTROL BAR: 4 GARMENT SILHOUETTES */}
            {/* ------------------------------------------------------------- */}
            <div className="bg-[#120a0d] border border-[#dfb56c]/30 rounded-xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#dfb56c] font-bold block mb-1">
                    {isSinhalaMode ? '1. ප්‍රධාන විලාසිතාව තෝරන්න (Select 3D Garment Silhouette)' : 'Select 3D Garment Silhouette'}
                  </span>
                  <p className="text-xs text-[#a89f91] font-sinhala">
                    {isSinhalaMode
                      ? 'ප්‍රංශ ඩාට් උත්සව ගවුම, ප්‍රින්සස් කට් කෝට්, Fit Dress සහ A-ලයින් සාය සඳහා 3D මැනික්වින් පෙරදසුන සහ තාක්ෂණික විස්තර මෙහිදී අධ්‍යයනය කරන්න.'
                      : 'Explore interactive 3D mannequin turntables, CAD flat patterns, and design boards for the 4 haute couture master styles.'}
                  </p>
                </div>

                {/* Sub-Mode Switcher */}
                <div className="flex items-center gap-1.5 p-1 bg-[#0a0708] rounded-lg border border-white/10 shrink-0">
                  <button
                    onClick={() => setDummySubMode('3d_turntable')}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      dummySubMode === '3d_turntable'
                        ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                        : 'text-[#a89f91] hover:text-[#f7e2a9]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isSinhalaMode ? '3D මැනික්වින්' : '3D Turntable'}</span>
                  </button>

                  <button
                    onClick={() => setDummySubMode('design_board')}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      dummySubMode === 'design_board'
                        ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                        : 'text-[#a89f91] hover:text-[#f7e2a9]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isSinhalaMode ? 'විලාසිතා බෝර්ඩ්' : 'Design Board'}</span>
                  </button>

                  <button
                    onClick={() => setDummySubMode('flat_cad')}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                      dummySubMode === 'flat_cad'
                        ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                        : 'text-[#a89f91] hover:text-[#f7e2a9]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{isSinhalaMode ? 'CAD පැටර්න්' : 'CAD Specs'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Garment Cards / Buttons Matching User Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'gown',
                    nameSi: 'උත්සව ගවුම (French Darts)',
                    nameEn: 'Evening Gown (French Darts)',
                    badge: 'French Darts & Slit',
                    badgeSi: 'ප්‍රංශ ඩාට් හා ස්ලිට්',
                    icon: '👗',
                  },
                  {
                    id: 'princess',
                    nameSi: 'ප්‍රින්සස් කට් කෝට්',
                    nameEn: 'Princess Cut Coat',
                    badge: 'Princess Seams & Flap',
                    badgeSi: 'ප්‍රින්සස් කට් හා කෝට්',
                    icon: '🧥',
                  },
                  {
                    id: 'shift',
                    nameSi: 'Fit Dress',
                    nameEn: 'Fit Dress (Draped Tulip)',
                    badge: 'Square Neck & Drape',
                    badgeSi: 'කොටු කර හා ටියුලිප් රැලි',
                    icon: '👗',
                  },
                  {
                    id: 'skirt',
                    nameSi: 'A-ලයින් සාය',
                    nameEn: 'A-Line Skirt (Box Pleats)',
                    badge: 'High Waist & Box Pleat',
                    badgeSi: 'උස් ඉණ හා බොක්ස් රැලි',
                    icon: '👗',
                  },
                ].map((item) => {
                  const isSelected = dummyGarmentStyle === item.id;
                  const itemData = GARMENT_3D_CATALOGUE[item.id as keyof typeof GARMENT_3D_CATALOGUE];
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDummyGarmentStyle(item.id as any);
                        setSelectedColorIndex(0);
                      }}
                      className={`p-3 sm:p-3.5 rounded-lg border text-left transition-all cursor-pointer relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#38070e] via-[#240509] to-[#140a0c] border-[#dfb56c] shadow-lg shadow-[#c99a45]/20 ring-1 ring-[#dfb56c]/40'
                          : 'bg-[#181114]/90 border-white/10 hover:border-[#dfb56c]/40 hover:bg-[#201518]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xl">{item.icon}</span>
                        <span
                          className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-[#dfb56c] text-[#0c090a] font-bold border-[#dfb56c]'
                              : 'bg-black/60 text-[#a89f91] border-white/10'
                          }`}
                        >
                          {isSinhalaMode ? item.badgeSi : item.badge}
                        </span>
                      </div>

                      <h4
                        className={`text-xs sm:text-sm font-editorial font-bold leading-tight ${
                          isSelected ? 'text-[#f7e2a9]' : 'text-[#f7f3eb] group-hover:text-white'
                        }`}
                      >
                        {isSinhalaMode ? item.nameSi : item.nameEn}
                      </h4>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-2">
                        <div className="w-8 h-8 rounded border border-[#dfb56c]/40 overflow-hidden shrink-0 bg-black/80 flex items-center justify-center">
                          {Boolean(itemData?.imageFilename && itemData.imageFilename.trim()) ? (
                            <img
                              src={`/${encodeURIComponent(itemData.imageFilename.trim())}`}
                              alt={item.nameEn}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9.5px] font-mono text-[#dfb56c] block leading-none font-bold">
                            3D Design Board
                          </span>
                          <span className="text-[8.5px] font-mono text-[#a89f91] truncate block mt-0.5 max-w-[120px]">
                            {itemData?.imageFilename}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Garment Secondary Bar: 360 Turntable Angles & Color Swatches */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                {/* 8 Turntable Angles (0° to 315°) */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
                  <span className="text-[10px] font-mono uppercase text-[#a89f91] mr-1 hidden sm:inline">
                    {isSinhalaMode ? '360° කෝණය:' : '360° Turntable:'}
                  </span>

                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const isSelected = turntableDegree === deg;
                    return (
                      <button
                        key={deg}
                        onClick={() => handleAngleSelect(deg)}
                        className={`px-2 sm:px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#dfb56c] text-black font-bold shadow'
                            : 'bg-[#1a1114] text-[#a89f91] hover:text-white border border-white/5'
                        }`}
                        title={`${deg}° Angle View`}
                      >
                        {deg}°
                      </button>
                    );
                  })}

                  {/* Auto-Rotate Spin Toggle */}
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isAutoRotating
                        ? 'bg-green-600 text-white font-bold border-green-400 animate-pulse'
                        : 'bg-[#1a1114] text-[#a89f91] hover:text-white border-white/10'
                    }`}
                    title={isAutoRotating ? 'Pause 360° Spin' : 'Play 360° Spin'}
                  >
                    {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isAutoRotating ? 'Spinning' : 'Auto 360°'}</span>
                  </button>
                </div>

                {/* Color Palette Swatches */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[#a89f91] hidden sm:inline">
                    {isSinhalaMode ? 'වර්ණය (Color):' : 'Palette:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeGarmentData.colorPalette.map((col, idx) => {
                      const isColorSelected = selectedColorIndex === idx;
                      return (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer relative ${
                            isColorSelected ? 'scale-125 border-[#dfb56c] shadow-md' : 'border-black hover:scale-110'
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={`${col.name} (${col.nameSi})`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* SUB-MODE 1: 3D TURNTABLE MANNEQUIN STUDIO */}
            {/* ------------------------------------------------------------- */}
            {dummySubMode === '3d_turntable' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Interactive 3D Mannequin Canvas */}
                <div className="lg:col-span-7 bg-[#0c090a] border-2 border-[#dfb56c]/30 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[520px]">
                  {/* Ambient Atelier Lighting Glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#dfb56c]/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Top Status Badges */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-2 bg-[#181113]/90 px-3 py-1.5 rounded-full border border-[#dfb56c]/40 text-[11px] font-mono text-[#f7e2a9] pointer-events-auto">
                      <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-ping" />
                      <span>
                        3D DRESS • {activeGarmentData.titleEn.toUpperCase()} • {turntableDegree}°
                      </span>
                    </div>

                    <div className="flex items-center gap-1 pointer-events-auto bg-[#181113]/90 px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-mono text-[#a89f91]">
                      <span>Size UK 10</span>
                    </div>
                  </div>

                  {/* SVG 3D Dress Form Mannequin Visualizer */}
                  <div className="relative w-full max-w-[380px] h-[460px] flex items-center justify-center pt-6">
                    <svg
                      viewBox="0 0 360 480"
                      className="w-full h-full drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] select-none transition-transform duration-300"
                    >
                      <defs>
                        {/* Linen / Canvas Texture Gradient for Mannequin */}
                        <linearGradient id="dummyLinenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f4eee0" />
                          <stop offset="50%" stopColor="#ded1b4" />
                          <stop offset="100%" stopColor="#bfa87e" />
                        </linearGradient>

                        {/* Dark Wooden Stand / Brass Accent */}
                        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9e7225" />
                          <stop offset="50%" stopColor="#dfb56c" />
                          <stop offset="100%" stopColor="#9e7225" />
                        </linearGradient>

                        {/* Selected Fabric Dynamic Tint Gradient */}
                        <linearGradient id="selectedFabricGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={currentColorHex} stopOpacity="0.85" />
                          <stop offset="50%" stopColor={currentColorHex} stopOpacity="0.95" />
                          <stop offset="100%" stopColor={currentColorHex} stopOpacity="0.80" />
                        </linearGradient>

                        {/* Pattern Seam Glow */}
                        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Pedestal Stand (Base, Pole, Finials) */}
                      <g id="stand">
                        {/* Brass Neck Finial Cap */}
                        <path d="M 165 40 L 195 40 L 190 20 L 170 20 Z" fill="url(#brassGrad)" />
                        <circle cx="180" cy="18" r="7" fill="url(#brassGrad)" stroke="#c99a45" strokeWidth="1" />

                        {/* Cast Iron Bottom Pole */}
                        <rect x="177" y="375" width="6" height="85" fill="#1f181b" />
                        {/* 360 Degree Turntable Plinth Disc */}
                        <ellipse cx="180" cy="455" rx="70" ry="12" fill="#140f11" stroke="#dfb56c" strokeWidth="1.5" />
                        <ellipse cx="180" cy="453" rx="60" ry="9" fill="#1f1619" stroke="#9e7225" strokeWidth="1" />
                      </g>

                      {/* Dress Form Mannequin Torso Body (UK 10) */}
                      <g id="dummy-body">
                        {/* Neck Base */}
                        <path
                          d="M 160 55 C 160 50, 200 50, 200 55 L 208 72 C 208 72, 152 72, 152 72 Z"
                          fill="url(#dummyLinenGrad)"
                          stroke="#8c7752"
                          strokeWidth="1"
                        />

                        {/* Torso Form (Anatomical Female Silhouette UK 10) */}
                        {dummyAngle === 'front' && (
                          <path
                            d="M 148 74 
                               C 125 80, 115 105, 112 135 
                               C 110 160, 122 175, 126 195 
                               C 130 215, 134 235, 138 250 
                               C 134 270, 122 300, 118 335 
                               C 116 350, 130 365, 180 365 
                               C 230 365, 244 350, 242 335 
                               C 238 300, 226 270, 222 250 
                               C 226 235, 230 215, 234 195 
                               C 238 175, 250 160, 248 135 
                               C 245 105, 235 80, 212 74 
                               Z"
                            fill="url(#dummyLinenGrad)"
                            stroke="#7a643e"
                            strokeWidth="1.5"
                          />
                        )}

                        {dummyAngle === 'angle' && (
                          <path
                            d="M 145 74 
                               C 122 82, 114 108, 112 138 
                               C 110 165, 124 182, 128 200 
                               C 133 218, 136 238, 140 252 
                               C 135 272, 120 302, 116 338 
                               C 114 352, 130 365, 182 365 
                               C 232 365, 248 350, 246 335 
                               C 242 298, 230 268, 226 248 
                               C 230 232, 235 210, 240 188 
                               C 245 165, 256 150, 254 125 
                               C 250 98, 238 78, 214 74 
                               Z"
                            fill="url(#dummyLinenGrad)"
                            stroke="#7a643e"
                            strokeWidth="1.5"
                          />
                        )}

                        {dummyAngle === 'side' && (
                          <path
                            d="M 165 74 
                               C 148 85, 140 115, 142 145 
                               C 145 175, 150 195, 155 220 
                               C 152 245, 145 275, 142 310 
                               C 140 340, 155 365, 185 365 
                               C 215 365, 230 340, 226 310 
                               C 222 275, 210 240, 205 215 
                               C 218 190, 232 165, 230 135 
                               C 228 105, 212 85, 195 74 
                               Z"
                            fill="url(#dummyLinenGrad)"
                            stroke="#7a643e"
                            strokeWidth="1.5"
                          />
                        )}

                        {dummyAngle === 'back' && (
                          <path
                            d="M 148 74 
                               C 125 80, 115 105, 112 135 
                               C 110 160, 122 175, 126 195 
                               C 130 215, 134 235, 138 250 
                               C 134 270, 122 300, 118 335 
                               C 116 350, 130 365, 180 365 
                               C 230 365, 244 350, 242 335 
                               C 238 300, 226 270, 222 250 
                               C 226 235, 230 215, 234 195 
                               C 238 175, 250 160, 248 135 
                               C 245 105, 235 80, 212 74 
                               Z"
                            fill="url(#dummyLinenGrad)"
                            stroke="#7a643e"
                            strokeWidth="1.5"
                          />
                        )}

                        {/* Tailor's Twill Ribbon Lines */}
                        <line x1="180" y1="74" x2="180" y2="365" stroke="#9e1e2d" strokeWidth="1.5" strokeDasharray="4 2" />
                        <path d="M 116 148 Q 180 162 244 148" fill="none" stroke="#9e1e2d" strokeWidth="1.5" />
                        <path d="M 136 248 Q 180 258 224 248" fill="none" stroke="#9e1e2d" strokeWidth="2" />
                        <path d="M 120 325 Q 180 340 240 325" fill="none" stroke="#9e1e2d" strokeWidth="1.5" />
                      </g>

                      {/* ----------------------------------------------------------- */}
                      {/* DRAPED 3D GARMENT SILHOUETTES */}
                      {/* ----------------------------------------------------------- */}
                      {showPatternOverlay && (
                        <g id="garment-drape">
                          {/* 1. GOWN: French Darts Floor-Length Evening Gown */}
                          {dummyGarmentStyle === 'gown' && (
                            <g>
                              {/* Front View */}
                              {dummyAngle === 'front' && (
                                <>
                                  {/* Bodice with Square Neckline & French Darts */}
                                  <path
                                    d="M 152 78 C 134 85, 120 110, 118 140 C 122 170, 130 205, 138 250 L 222 250 C 230 205, 238 170, 242 140 C 240 110, 226 85, 208 78 Q 180 92 152 78 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Sculptural French Dart Stitch Lines */}
                                  <path d="M 138 245 Q 155 190 156 160" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 2" />
                                  <path d="M 222 245 Q 205 190 204 160" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 2" />
                                  {/* Floor-Length Flared Gown Skirt with Thigh-High Slit */}
                                  <path
                                    d="M 138 250 L 222 250 C 236 295, 260 365, 282 430 Q 180 445 80 430 C 100 365, 124 295, 138 250 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Sunburst Pleat Radiations at Slit */}
                                  <path d="M 145 250 Q 155 330 148 435" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.35" />
                                  <path d="M 175 250 Q 170 340 180 438" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.35" />
                                  <path d="M 205 250 Q 215 340 220 435" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.35" />
                                  {/* Thigh High Slit Opening Reveal */}
                                  <path d="M 142 260 L 134 430" fill="none" stroke="#f7e2a9" strokeWidth="2.5" />
                                </>
                              )}

                              {/* 3/4 Angle View */}
                              {dummyAngle === 'angle' && (
                                <>
                                  <path
                                    d="M 148 78 C 132 86, 120 112, 118 142 C 122 172, 132 208, 140 252 L 224 248 C 232 202, 238 168, 240 138 C 238 108, 222 84, 204 78 Q 176 92 148 78 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* French Dart along side angle */}
                                  <path d="M 140 248 Q 158 192 160 162" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="4 2" />
                                  <path
                                    d="M 140 252 L 224 248 C 240 295, 268 368, 290 432 Q 185 446 76 432 C 98 368, 124 298, 140 252 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Angled High Slit Reveal */}
                                  <path d="M 148 262 L 136 432" fill="none" stroke="#f7e2a9" strokeWidth="2.5" />
                                  <path d="M 160 255 Q 170 335 168 435" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.35" />
                                </>
                              )}

                              {/* Side Profile View */}
                              {dummyAngle === 'side' && (
                                <>
                                  {/* Bust Projection & Waist Silhouette */}
                                  <path
                                    d="M 168 76 C 152 86, 144 116, 146 146 C 150 176, 154 196, 158 222 L 156 250 L 204 248 C 218 190, 230 162, 228 134 C 226 104, 210 84, 194 76 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Side French Dart coming from waist seam to apex point */}
                                  <path d="M 156 248 Q 178 195 186 160" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 2" />
                                  {/* Side Flared Skirt Profile with Back Train Sweep */}
                                  <path
                                    d="M 156 250 L 204 248 C 218 300, 240 370, 265 435 Q 180 445 110 435 C 130 370, 146 300, 156 250 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <line x1="156" y1="280" x2="148" y2="435" stroke="#f7e2a9" strokeWidth="2.5" />
                                </>
                              )}

                              {/* Back View */}
                              {dummyAngle === 'back' && (
                                <>
                                  {/* Low Scoop Back with Straps */}
                                  <path
                                    d="M 152 78 L 160 135 Q 180 155 200 135 L 208 78 L 222 250 L 138 250 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Center Back Invisible Zipper with Gold Pull */}
                                  <line x1="180" y1="145" x2="180" y2="295" stroke="#f7e2a9" strokeWidth="2" strokeDasharray="3 1" />
                                  <circle cx="180" cy="148" r="3" fill="#dfb56c" stroke="#000" strokeWidth="1" />
                                  {/* Back Flared Train Skirt */}
                                  <path
                                    d="M 138 250 L 222 250 C 238 298, 265 368, 285 432 Q 180 448 75 432 C 95 368, 122 298, 138 250 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <line x1="180" y1="250" x2="180" y2="440" stroke="#000" strokeWidth="1.5" opacity="0.3" />
                                </>
                              )}
                            </g>
                          )}

                          {/* 2. PRINCESS: Princess Cut Tailored Coat */}
                          {dummyGarmentStyle === 'princess' && (
                            <g>
                              {/* Front View */}
                              {dummyAngle === 'front' && (
                                <>
                                  {/* Notched Lapel & Coat Silhouette */}
                                  <path
                                    d="M 148 76 L 134 250 L 226 250 L 212 76 L 180 135 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Notched Lapels */}
                                  <path d="M 148 76 L 126 125 L 140 128 L 180 170" fill="url(#brassGrad)" opacity="0.4" stroke="#dfb56c" strokeWidth="1.5" />
                                  <path d="M 212 76 L 234 125 L 220 128 L 180 170" fill="url(#brassGrad)" opacity="0.4" stroke="#dfb56c" strokeWidth="1.5" />
                                  {/* Continuous Princess Seam Curves from Armhole to Flared Hem */}
                                  <path d="M 130 115 Q 155 155 158 250 L 140 370" fill="none" stroke="#f7e2a9" strokeWidth="2" />
                                  <path d="M 230 115 Q 205 155 202 250 L 220 370" fill="none" stroke="#f7e2a9" strokeWidth="2" />
                                  {/* A-Line Coat Skirt Sweep */}
                                  <path
                                    d="M 134 250 L 226 250 L 255 370 Q 180 385 105 370 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Gold Medallion Button */}
                                  <circle cx="180" cy="190" r="5" fill="url(#brassGrad)" stroke="#c99a45" strokeWidth="1" />
                                  {/* Tailored Angled Flap Pockets */}
                                  <path d="M 125 275 L 152 278 L 150 286 L 123 283 Z" fill="url(#brassGrad)" opacity="0.3" stroke="#dfb56c" strokeWidth="1" />
                                  <path d="M 235 275 L 208 278 L 210 286 L 237 283 Z" fill="url(#brassGrad)" opacity="0.3" stroke="#dfb56c" strokeWidth="1" />
                                </>
                              )}

                              {/* Angle / Side View */}
                              {(dummyAngle === 'angle' || dummyAngle === 'side') && (
                                <>
                                  <path
                                    d="M 152 76 L 138 250 L 222 250 L 216 76 L 184 135 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M 152 76 L 132 125 L 146 128 L 184 170" fill="url(#brassGrad)" opacity="0.4" stroke="#dfb56c" strokeWidth="1.5" />
                                  {/* Curved Side Princess Seam */}
                                  <path d="M 140 115 Q 165 160 168 250 L 155 370" fill="none" stroke="#f7e2a9" strokeWidth="2" />
                                  <path
                                    d="M 138 250 L 222 250 L 248 370 Q 180 385 115 370 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M 135 276 L 160 279 L 158 287 L 133 284 Z" fill="url(#brassGrad)" opacity="0.4" stroke="#dfb56c" strokeWidth="1" />
                                </>
                              )}

                              {/* Back View */}
                              {dummyAngle === 'back' && (
                                <>
                                  <path
                                    d="M 148 76 L 134 250 L 226 250 L 212 76 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Back Princess Seams */}
                                  <path d="M 136 100 Q 155 165 158 250 L 145 370" fill="none" stroke="#f7e2a9" strokeWidth="1.5" />
                                  <path d="M 224 100 Q 205 165 202 250 L 215 370" fill="none" stroke="#f7e2a9" strokeWidth="1.5" />
                                  <path
                                    d="M 134 250 L 226 250 L 255 370 Q 180 385 105 370 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Center Back Vent Line */}
                                  <line x1="180" y1="290" x2="180" y2="375" stroke="#f7e2a9" strokeWidth="2" />
                                </>
                              )}
                            </g>
                          )}

                          {/* 3. SHIFT / FIT DRESS: Draped Tulip Fitted Midi Dress */}
                          {dummyGarmentStyle === 'shift' && (
                            <g>
                              {/* Front View */}
                              {dummyAngle === 'front' && (
                                <>
                                  {/* Square Neckline Bodice */}
                                  <path
                                    d="M 152 80 L 132 250 L 228 250 L 208 80 Q 180 88 152 80 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* 3/4 Tailored Sleeves */}
                                  <path d="M 132 82 L 108 190 L 122 195 L 128 140 Z" fill="url(#selectedFabricGrad)" stroke="#dfb56c" strokeWidth="1" />
                                  <path d="M 228 82 L 252 190 L 238 195 L 232 140 Z" fill="url(#selectedFabricGrad)" stroke="#dfb56c" strokeWidth="1" />
                                  {/* Fitted Pencil Skirt with Asymmetrical Tulip Drape */}
                                  <path
                                    d="M 132 250 L 228 250 L 220 375 Q 180 382 140 375 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Diagonal Tulip Pleat Radiations */}
                                  <path d="M 228 250 Q 180 300 160 375" fill="none" stroke="#fff" strokeWidth="1.5" />
                                  <path d="M 224 260 Q 185 310 170 375" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 220 270 Q 190 320 180 375" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  {/* Front Overlap Walking Slit */}
                                  <line x1="160" y1="330" x2="160" y2="375" stroke="#f7e2a9" strokeWidth="2.5" />
                                </>
                              )}

                              {/* Angle / Side View */}
                              {(dummyAngle === 'angle' || dummyAngle === 'side') && (
                                <>
                                  <path
                                    d="M 158 80 L 138 250 L 222 250 L 212 80 Q 185 88 158 80 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M 138 82 L 118 190 L 130 195 L 134 140 Z" fill="url(#selectedFabricGrad)" stroke="#dfb56c" strokeWidth="1" />
                                  <path
                                    d="M 138 250 L 222 250 L 214 375 Q 180 382 146 375 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M 222 250 Q 185 305 168 375" fill="none" stroke="#fff" strokeWidth="1.5" />
                                  <line x1="168" y1="335" x2="168" y2="375" stroke="#f7e2a9" strokeWidth="2.5" />
                                </>
                              )}

                              {/* Back View */}
                              {dummyAngle === 'back' && (
                                <>
                                  <path
                                    d="M 152 78 L 132 250 L 228 250 L 208 78 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <path d="M 132 82 L 108 190 L 122 195 L 128 140 Z" fill="url(#selectedFabricGrad)" stroke="#dfb56c" strokeWidth="1" />
                                  <path d="M 228 82 L 252 190 L 238 195 L 232 140 Z" fill="url(#selectedFabricGrad)" stroke="#dfb56c" strokeWidth="1" />
                                  {/* Center Back Zip & Shaping */}
                                  <line x1="180" y1="80" x2="180" y2="300" stroke="#f7e2a9" strokeWidth="2" strokeDasharray="3 1" />
                                  <path
                                    d="M 132 250 L 228 250 L 220 375 Q 180 382 140 375 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  <line x1="180" y1="330" x2="180" y2="375" stroke="#f7e2a9" strokeWidth="2" />
                                </>
                              )}
                            </g>
                          )}

                          {/* 4. SKIRT: A-Line Pleated Maxi Skirt */}
                          {dummyGarmentStyle === 'skirt' && (
                            <g>
                              {/* Contoured 2" Waistband */}
                              <path
                                d="M 136 242 Q 180 252 224 242 L 225 254 Q 180 264 135 254 Z"
                                fill="url(#brassGrad)"
                                opacity="0.6"
                                stroke="#dfb56c"
                                strokeWidth="1.5"
                              />

                              {/* Front / Angle Pleated Skirt */}
                              {dummyAngle !== 'back' && (
                                <>
                                  <path
                                    d="M 135 254 L 225 254 L 268 410 Q 180 430 92 410 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Deep Box Pleat Crease Lines */}
                                  <path d="M 152 254 L 126 416" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 170 254 L 160 422" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 190 254 L 200 422" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 208 254 L 234 416" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 94 404 Q 180 424 266 404" fill="none" stroke="#dfb56c" strokeWidth="1" strokeDasharray="3 2" />
                                </>
                              )}

                              {/* Back View */}
                              {dummyAngle === 'back' && (
                                <>
                                  <path
                                    d="M 135 254 L 225 254 L 268 410 Q 180 430 92 410 Z"
                                    fill="url(#selectedFabricGrad)"
                                    stroke="#dfb56c"
                                    strokeWidth="1.5"
                                  />
                                  {/* Center Back Zip & Waistband Closure */}
                                  <line x1="180" y1="242" x2="180" y2="330" stroke="#f7e2a9" strokeWidth="2" strokeDasharray="3 1" />
                                  <circle cx="180" cy="244" r="2.5" fill="#dfb56c" />
                                  <path d="M 155 254 L 132 416" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 205 254 L 228 416" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                                  <path d="M 94 404 Q 180 424 266 404" fill="none" stroke="#dfb56c" strokeWidth="1" strokeDasharray="3 2" />
                                </>
                              )}
                            </g>
                          )}
                        </g>
                      )}

                      {/* Interactive Landmark Pins / Hotspots */}
                      {showDummyLandmarks && (
                        <g id="landmarks">
                          <g className="cursor-pointer transition-transform hover:scale-125" onClick={() => setActiveLandmark('apex')}>
                            <circle cx="156" cy="158" r="6" fill="#dfb56c" stroke="#0c090a" strokeWidth="2" filter="url(#goldGlow)" />
                            <circle cx="156" cy="158" r="2.5" fill="#0c090a" />
                          </g>

                          <g className="cursor-pointer transition-transform hover:scale-125" onClick={() => setActiveLandmark('apex')}>
                            <circle cx="204" cy="158" r="6" fill="#dfb56c" stroke="#0c090a" strokeWidth="2" filter="url(#goldGlow)" />
                            <circle cx="204" cy="158" r="2.5" fill="#0c090a" />
                          </g>

                          <g className="cursor-pointer transition-transform hover:scale-125" onClick={() => setActiveLandmark('waist')}>
                            <circle cx="180" cy="254" r="6" fill="#f7e2a9" stroke="#0c090a" strokeWidth="2" />
                            <circle cx="180" cy="254" r="2.5" fill="#9e1e2d" />
                          </g>

                          <g className="cursor-pointer transition-transform hover:scale-125" onClick={() => setActiveLandmark('armhole')}>
                            <circle cx="120" cy="120" r="5" fill="#dfb56c" stroke="#0c090a" strokeWidth="1.5" />
                          </g>

                          <g className="cursor-pointer transition-transform hover:scale-125" onClick={() => setActiveLandmark('hip')}>
                            <circle cx="180" cy="332" r="5" fill="#dfb56c" stroke="#0c090a" strokeWidth="1.5" />
                          </g>
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Bottom Turntable Slider & Quick Angle Guide */}
                  <div className="w-full mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#a89f91]">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Rotation: <strong className="text-white">{turntableDegree}°</strong></span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                      <button
                        onClick={() => setShowDummyLandmarks(!showDummyLandmarks)}
                        className={`hover:text-white transition-colors cursor-pointer ${showDummyLandmarks ? 'text-[#dfb56c]' : 'text-[#7a7268]'}`}
                      >
                        {showDummyLandmarks ? '● Landmarks On' : '○ Landmarks Off'}
                      </button>

                      <button
                        onClick={() => setShowPatternOverlay(!showPatternOverlay)}
                        className={`hover:text-white transition-colors cursor-pointer ${showPatternOverlay ? 'text-[#dfb56c]' : 'text-[#7a7268]'}`}
                      >
                        {showPatternOverlay ? '● Garment Mesh On' : '○ Garment Mesh Off'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Garment Anatomical Guidance Card */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Selected Garment Overview */}
                  <div className="p-6 rounded-xl bg-[#141011] border border-[#dfb56c]/30 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#dfb56c] font-bold tracking-widest block">
                          {isSinhalaMode ? 'තෝරාගත් ත්‍රිමාණ විලාසිතාව' : 'Selected 3D Garment'}
                        </span>
                        <h3 className="text-lg font-editorial font-bold text-[#f7f3eb]">
                          {isSinhalaMode ? activeGarmentData.titleSi : activeGarmentData.titleEn}
                        </h3>
                      </div>

                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#38070e] text-[#f7e2a9] border border-[#dfb56c]/30 font-bold">
                        {activeGarmentData.badgeEn}
                      </span>
                    </div>

                    <p className="text-xs text-[#d5cfc4] leading-relaxed font-sinhala">
                      {isSinhalaMode ? activeGarmentData.subtitleSi : activeGarmentData.subtitleEn}
                    </p>

                    {/* Technical Landmarks Info */}
                    <div className="p-3.5 rounded bg-black/60 border border-[#dfb56c]/20 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-[#dfb56c] font-mono text-[11px] font-bold">
                        <Ruler className="w-3.5 h-3.5" />
                        <span>
                          {activeLandmark === 'apex' && (isSinhalaMode ? 'පපුවේ උච්ච ලක්ෂ්‍යය (Bust Apex)' : 'Bust Apex Point')}
                          {activeLandmark === 'waist' && (isSinhalaMode ? 'ඉණ සමබරතා රේඛාව (Waist Balance Line)' : 'Waist Balance Line')}
                          {activeLandmark === 'armhole' && (isSinhalaMode ? 'කිහිලි වටය සහ නොච් (Armhole Scye & Notches)' : 'Armhole Scye & Notches')}
                          {activeLandmark === 'hip' && (isSinhalaMode ? 'උකුල් රේඛාව හා ෆ්ලෙයාර් (Hip Line & Flare)' : 'Hip Line & Drape Fall')}
                        </span>
                      </div>

                      <p className="text-[#a89f91] text-[11px] leading-relaxed font-sinhala">
                        {activeLandmark === 'apex' &&
                          (isSinhalaMode
                            ? 'පපුවේ උසම ලක්ෂ්‍යයයි. පැටර්න් එකක සියලුම ඩාට් (උරහිස් ඩාට්, ප්‍රංශ ඩාට්, ඉණ ඩාට්) මෙම ලක්ෂ්‍යය කේන්ද්‍ර කර ගනිමින් හැඩ ගැන්වේ.'
                            : 'The focal point for all dart rotations (French, shoulder, waist). Darts stop 1/2" back to prevent peaked seams.')}

                        {activeLandmark === 'waist' &&
                          (isSinhalaMode
                            ? 'ශරීරයේ පටුම ස්ථානයයි. බඳ කොටස සහ සාය කොටස එකිනෙකට සම්බන්ධ වන ප්‍රධාන සන්ධිස්ථානය මෙතැන පිහිටයි.'
                            : 'The foundational horizontal anchor of the torso. Balances bodice panels and controls garment weight.')}

                        {activeLandmark === 'armhole' &&
                          (isSinhalaMode
                            ? 'අත (Sleeve) බඳට එකතු වන ස්ථානයයි. ඉදිරිපසට තනි නොච් එකක්ද, පසුපසට ද්විත්ව නොච් එකක්ද සලකුණු කෙරේ.'
                            : 'Engineered scye opening. Single notch marks front chest; double notch marks back shoulder pitch.')}

                        {activeLandmark === 'hip' &&
                          (isSinhalaMode
                            ? 'ඉණෙන් අඟල් 7 සිට 9 දක්වා පහළින් පිහිටන පළල්ම වට මිණුමයි. සාය සහ ගවුම්වල නිවැරදි හැඩය තීරණය කරන්නේ මෙම රේඛාවෙනි.'
                            : 'Positioned 7" to 9" below natural waist. Serves as width anchor for skirts and floor-length sweeps.')}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1.5 border-t border-white/5">
                        {[
                          { id: 'apex', labelSi: 'Bust Apex', labelEn: 'Bust Apex' },
                          { id: 'waist', labelSi: 'Waistline', labelEn: 'Waistline' },
                          { id: 'armhole', labelSi: 'Armhole', labelEn: 'Armhole' },
                          { id: 'hip', labelSi: 'Hip Line', labelEn: 'Hip Line' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setActiveLandmark(btn.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                              activeLandmark === btn.id
                                ? 'bg-[#dfb56c] text-[#0c090a] font-bold'
                                : 'bg-[#1e1316] text-[#a89f91] hover:text-[#f7e2a9]'
                            }`}
                          >
                            {btn.labelEn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pattern Specs Checklist */}
                    <div className="space-y-1.5 text-xs text-[#d5cfc4] pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#a89f91]">Dart Engineering:</span>
                        <span className="text-[#f7e2a9] font-bold">{activeGarmentData.patternSpecs.dartType}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#a89f91]">Recommended Fabric:</span>
                        <span className="text-[#f7e2a9] text-right truncate max-w-[200px]">
                          {isSinhalaMode ? activeGarmentData.patternSpecs.recommendedFabricSi : activeGarmentData.patternSpecs.recommendedFabricEn}
                        </span>
                      </div>
                    </div>

                    {/* 3D Dress Official Design Board Image Card */}
                    <div className="p-3.5 rounded-lg bg-black/80 border border-[#dfb56c]/30 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#dfb56c] font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                          <span>{isSinhalaMode ? 'නිල ත්‍රිමාණ විලාසිතා බෝර්ඩ් එක' : 'Official 3D Design Board'}</span>
                        </span>
                        <span className="text-[10px] text-[#a89f91] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                          360° + CAD
                        </span>
                      </div>

                      <div
                        className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-[#0c090a] cursor-pointer"
                        onClick={() => setBoardModalImage(activeGarmentData.imageFilename)}
                        title={isSinhalaMode ? 'විශාල කර බැලීමට ක්ලික් කරන්න' : 'Click to inspect fullscreen'}
                      >
                        {Boolean(activeGarmentData?.imageFilename && activeGarmentData.imageFilename.trim()) ? (
                          <img
                            src={`/${encodeURIComponent(activeGarmentData.imageFilename.trim())}`}
                            alt={activeGarmentData.titleEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                          <span className="text-[10px] font-mono text-[#f7e2a9] truncate max-w-[200px]">
                            {activeGarmentData.imageFilename}
                          </span>
                          <span className="text-[10px] font-mono bg-[#dfb56c] text-black font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                            <Maximize2 className="w-3 h-3" />
                            <span>{isSinhalaMode ? 'විශාල කරන්න' : 'Inspect'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTAs to view Design Board & Flat CAD */}
                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setDummySubMode('design_board')}
                        className="btn-3d-gold py-2.5 text-xs uppercase tracking-wider font-bold text-black rounded flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isSinhalaMode ? 'විලාසිතා බෝර්ඩ්' : 'Design Board'}</span>
                      </button>

                      <button
                        onClick={() => setDummySubMode('flat_cad')}
                        className="btn-3d-secondary py-2.5 text-xs uppercase tracking-wider font-bold text-[#dfb56c] rounded flex items-center justify-center gap-1.5"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>{isSinhalaMode ? '2D පැටර්න් CAD' : '2D Flat CAD'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUB-MODE 2: DESIGN SHOWCASE BOARD & MACRO DETAIL CALLOUTS */}
            {/* ------------------------------------------------------------- */}
            {dummySubMode === 'design_board' && (
              <div className="space-y-6">
                <div className="p-5 sm:p-7 rounded-xl bg-[#141011] border border-[#dfb56c]/30 shadow-2xl space-y-6">
                  {/* Design Board Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                          HAUTE COUTURE ATELIER DESIGN BOARD
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                          360° Turntable + CAD Flat Sketches
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold font-editorial text-[#f7f3eb] mt-1">
                        {isSinhalaMode ? activeGarmentData.titleSi : activeGarmentData.titleEn}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBoardModalImage(activeGarmentData.imageFilename)}
                        className="btn-3d-secondary px-3 py-1.5 text-xs rounded flex items-center gap-1.5"
                        title="Expand Full Screen"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                        <span>Inspect Fullscreen</span>
                      </button>

                      <button
                        onClick={() => setDummySubMode('3d_turntable')}
                        className="btn-3d-gold px-3.5 py-1.5 text-xs uppercase tracking-wider rounded font-bold text-black flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Back to 3D</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Macro Detail Zoom Cards */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isSinhalaMode ? 'ප්‍රධාන තාක්ෂණික විස්තර 4' : '4 Precision Technical Detail Insets'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {activeGarmentData.details.map((detail, idx) => (
                        <div
                          key={detail.titleEn}
                          className="p-4 rounded-lg bg-black/60 border border-white/10 hover:border-[#dfb56c]/40 transition-colors space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#dfb56c] px-2 py-0.5 rounded bg-[#38070e] border border-[#dfb56c]/30">
                              DETAIL 0{idx + 1}
                            </span>
                            <ZoomIn className="w-3.5 h-3.5 text-[#a89f91] group-hover:text-[#dfb56c] transition-colors" />
                          </div>

                          <h5 className="text-xs sm:text-sm font-bold font-editorial text-white group-hover:text-[#f7e2a9] transition-colors">
                            {isSinhalaMode ? detail.titleSi : detail.titleEn}
                          </h5>

                          <p className="text-[11px] text-[#a89f91] leading-relaxed font-sinhala">
                            {isSinhalaMode ? detail.descSi : detail.descEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Board Preview Container */}
                  <div className="rounded-xl overflow-hidden border border-[#dfb56c]/30 bg-black/90 p-4 sm:p-6 text-center space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#a89f91] border-b border-white/10 pb-3">
                      <span>Image Spec: <strong>{activeGarmentData.imageFilename}</strong></span>
                      <span className="text-[#dfb56c]">Includes Front, 3/4, Profile, Back & 360° 8-Angle Turntable</span>
                    </div>

                    {/* Official Image with Fallback */}
                    <div className="relative rounded-lg overflow-hidden border border-white/10 max-h-[550px] flex items-center justify-center bg-[#0a0708]">
                      {Boolean(activeGarmentData?.imageFilename && activeGarmentData.imageFilename.trim()) ? (
                        <img
                          src={`/${encodeURIComponent(activeGarmentData.imageFilename.trim())}`}
                          alt={activeGarmentData.titleEn}
                          className="w-full h-auto max-h-[540px] object-contain cursor-pointer hover:scale-[1.01] transition-transform"
                          onClick={() => setBoardModalImage(activeGarmentData.imageFilename)}
                          onError={(e) => {
                            // Graceful fallback to styled visual design canvas if external file not locally present
                            (e.target as HTMLImageElement).style.display = 'none';
                            const fallbackEl = document.getElementById(`fallback-board-${activeGarmentData.id}`);
                            if (fallbackEl) fallbackEl.style.display = 'block';
                          }}
                        />
                      ) : null}

                      {/* Styled Vector Design Board Fallback */}
                      <div
                        id={`fallback-board-${activeGarmentData.id}`}
                        style={{ display: 'none' }}
                        className="w-full p-8 text-center space-y-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#540d18] border border-[#dfb56c] mx-auto flex items-center justify-center text-3xl">
                          👗
                        </div>
                        <h4 className="text-base font-editorial font-bold text-[#f7e2a9]">
                          {isSinhalaMode ? activeGarmentData.titleSi : activeGarmentData.titleEn} Showcase
                        </h4>
                        <p className="text-xs text-[#a89f91] max-w-md mx-auto">
                          Full 8-Angle Turntable (0° to 315°) and technical CAD diagrams available directly in the 3D Turntable view above.
                        </p>
                        <button
                          onClick={() => setDummySubMode('3d_turntable')}
                          className="btn-3d-gold px-4 py-2 text-xs uppercase tracking-wider font-bold text-black rounded inline-flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Switch to 3D Turntable</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUB-MODE 3: 2D TECHNICAL CAD PATTERN SPECIFICATIONS */}
            {/* ------------------------------------------------------------- */}
            {dummySubMode === 'flat_cad' && (
              <div className="space-y-6">
                <div className="p-5 sm:p-7 rounded-xl bg-[#141011] border border-[#dfb56c]/30 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                        2D TECHNICAL FLAT CAD BLUEPRINTS
                      </span>
                      <h3 className="text-lg sm:text-2xl font-bold font-editorial text-[#f7f3eb] mt-1">
                        {isSinhalaMode ? activeGarmentData.titleSi : activeGarmentData.titleEn} Technical Pattern Geometry
                      </h3>
                    </div>

                    <button
                      onClick={() => setDummySubMode('3d_turntable')}
                      className="btn-3d-secondary px-3.5 py-1.5 text-xs rounded flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#dfb56c]" />
                      <span>Back to 3D Studio</span>
                    </button>
                  </div>

                  {/* Technical CAD Spec Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-black/60 border border-white/10 space-y-2">
                      <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5" />
                        1. Front Flat Line Spec
                      </span>
                      <p className="text-xs text-[#d5cfc4] leading-relaxed font-sinhala">
                        {isSinhalaMode
                          ? 'ඉදිරිපස සමමිතික හෝ අසමමිතික රේඛා, ඩාට් දිශාවන් සහ මැහුම් වාසි (Seam Allowance) ගණනය කිරීම.'
                          : 'Front panel geometry, dart apex trajectory, walking vent overlap, and neck facing line art.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-black/60 border border-white/10 space-y-2">
                      <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5" />
                        2. Back Flat Line Spec
                      </span>
                      <p className="text-xs text-[#d5cfc4] leading-relaxed font-sinhala">
                        {isSinhalaMode
                          ? 'පසුපස කර වක්‍රය, නොපෙනෙන සිපර් රේඛාව සහ උරහිස් බ්ලේඩ් ඩාට් සමබරතාවය.'
                          : 'Back neck radius, invisible zipper channel, shoulder blade pitch, and center-back seam balance.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-black/60 border border-white/10 space-y-2">
                      <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        3. Side Profile & Grainline
                      </span>
                      <p className="text-xs text-[#d5cfc4] leading-relaxed font-sinhala">
                        {isSinhalaMode
                          ? 'සිරුරේ පැති සමබරතාවය, ධාන්‍ය රේඛා දිශාව (Warp Selvage) සහ වාටි සමතලා කිරීම.'
                          : 'True vertical side seam plumb line, true-bias grainline placement, and hem sweep leveling.'}
                      </p>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-lg bg-[#181114] border border-[#dfb56c]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold font-editorial text-[#f7e2a9]">
                        {isSinhalaMode ? 'මෙම විලාසිතාවේ සම්පූර්ණ Blueprint පත්‍රිකාව' : 'Official Course Blueprint Spec Available'}
                      </h4>
                      <p className="text-xs text-[#a89f91] mt-0.5">
                        {activeGarmentData.patternSpecs.keyTechniqueEn}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('blueprint')}
                      className="btn-3d-gold px-5 py-2 text-xs uppercase tracking-wider font-bold text-black rounded flex items-center gap-1.5 shrink-0"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{isSinhalaMode ? 'පැටර්න් අච්චු බ්ලූප්‍රින්ට් වෙත යන්න' : 'View Pattern Blueprints'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lightbox Zoom Modal for Design Boards */}
            {boardModalImage && (
              <div
                className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
                onClick={() => setBoardModalImage(null)}
              >
                <div
                  className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setBoardModalImage(null)}
                    className="absolute -top-10 right-0 text-white/70 hover:text-white p-2 text-sm font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                    <span>Close</span>
                  </button>

                  {boardModalImage ? (
                    <img
                      src={`/${encodeURIComponent(boardModalImage)}`}
                      alt="Design Board Fullscreen"
                      className="max-h-[85vh] w-auto object-contain rounded-lg border border-[#dfb56c]/40 shadow-2xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';
                      }}
                    />
                  ) : null}

                  <div className="mt-3 text-center text-xs font-mono text-[#dfb56c]">
                    {boardModalImage} • Click outside or press ESC to close
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ANATOMICAL BODY MEASUREMENTS GUIDE (ශරීර මිණුම් මාර්ගෝපදේශය) */}
        {/* ================================================================= */}
        {activeTab === 'measurements' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="bg-[#120a0d] border border-[#dfb56c]/30 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-[#dfb56c]" />
                  <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block">
                    {isSinhalaMode ? 'නිවැරදි ශරීර මිණුම් ලබාගැනීමේ මාර්ගෝපදේශය' : 'ANATOMICAL BODY MEASUREMENTS GUIDE'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#a89f91] font-sinhala mt-1">
                  {isSinhalaMode
                    ? 'ඇඳුමක් මනාව ශරීරයට ගැලපෙන සේ පැටර්න් ඇඳීම සඳහා අත්‍යවශ්‍ය වන ප්‍රධාන ශරීර මිණුම්, පටිය තැබිය යුතු නිවැරදි ස්ථාන සහ වැළැක්විය යුතු දෝෂ මෙහි දැක්වේ.'
                    : 'Select any anatomical measurement below to view its precise tape placement photo, measuring instructions, inch/cm range, and pattern drafting impact.'}
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {[
                  { id: 'all', labelEn: 'All', labelSi: 'සියල්ල' },
                  { id: 'circumference', labelEn: 'Circumference', labelSi: 'වට ප්‍රමාණ' },
                  { id: 'upper', labelEn: 'Upper Body', labelSi: 'ඉහළ බඳ' },
                  { id: 'length', labelEn: 'Lengths', labelSi: 'දිග ප්‍රමාණ' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMeasurementCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      measurementCategory === cat.id
                        ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                        : 'bg-[#181113] text-[#a89f91] hover:text-[#f7e2a9] border border-white/5'
                    }`}
                  >
                    {isSinhalaMode ? cat.labelSi : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Master Grid: Measurements List (Left) + Detail Inspector (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column: List of Body Measurements */}
              <div className="lg:col-span-5 space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {filteredMeasurements.map((m) => {
                  const isSelected = m.id === selectedMeasurementId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMeasurementId(m.id)}
                      className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#1e1316] border-[#dfb56c] shadow-lg shadow-[#c99a45]/20 ring-1 ring-[#dfb56c]'
                          : 'bg-[#141011] border-white/10 hover:border-[#dfb56c]/40 hover:bg-[#191315]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail image */}
                        <div className="w-14 h-14 rounded-lg bg-black border border-white/10 overflow-hidden shrink-0 relative">
                          <img
                            src={m.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38070e] text-[#dfb56c] font-bold border border-[#dfb56c]/30 uppercase">
                              {m.category}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#f7f3eb] font-sinhala truncate mt-0.5">
                            {isSinhalaMode ? m.nameSinhala : m.name}
                          </h4>
                          <span className="text-[11px] font-mono text-[#dfb56c] block">
                            {m.standardRange}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#dfb56c] translate-x-1' : 'text-[#a89f91]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed High-Definition Measurement Showcase */}
              <div className="lg:col-span-7 bg-[#0c090a] border-2 border-[#dfb56c]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                {/* Image and Header */}
                <div className="relative rounded-xl overflow-hidden border border-[#dfb56c]/30 shadow-xl bg-black">
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <img
                      src={currentMeasurement.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'}
                      alt={currentMeasurement.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                    {/* Zoom Button */}
                    <button
                      onClick={() => setMeasurementModalImage(currentMeasurement.imageUrl)}
                      className="absolute top-3 right-3 bg-black/80 hover:bg-[#dfb56c] text-white hover:text-black p-2 rounded-full border border-white/20 transition-all cursor-pointer shadow-lg"
                      title="Zoom Image"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Measurement Name Floating on Image */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#38070e] text-[#f7e2a9] border border-[#dfb56c]/30 inline-block mb-1">
                        ANATOMICAL LANDMARK • {currentMeasurement.category.toUpperCase()}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-editorial text-[#f7f3eb]">
                        {isSinhalaMode ? currentMeasurement.nameSinhala : currentMeasurement.name}
                      </h3>
                      <span className="text-xs font-mono text-[#dfb56c] font-bold block mt-0.5">
                        STANDARD RANGE: {currentMeasurement.standardRange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions Grid */}
                <div className="space-y-4 text-xs leading-relaxed">
                  {/* How to measure */}
                  <div className="p-4 rounded-lg bg-[#141011] border border-white/10 space-y-1.5">
                    <span className="font-bold text-[#dfb56c] font-mono uppercase text-[11px] flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#dfb56c]" />
                      {isSinhalaMode ? 'මිණුම නිවැරදිව ලබාගන්නා ආකාරය:' : 'How To Measure Correctly:'}
                    </span>
                    <p className="text-[#f7f3eb] font-sinhala leading-normal text-xs sm:text-sm">
                      {isSinhalaMode ? currentMeasurement.howToMeasureSinhala : currentMeasurement.howToMeasure}
                    </p>
                  </div>

                  {/* Atelier Pro Tip */}
                  <div className="p-4 rounded-lg bg-[#1e1316] border border-[#dfb56c]/30 space-y-1.5">
                    <span className="font-bold text-[#f7e2a9] font-mono uppercase text-[11px] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#dfb56c]" />
                      {isSinhalaMode ? '★ මාස්ටර් ටේලර් රහස (Pro Atelier Tip):' : '★ Master Atelier Tip:'}
                    </span>
                    <p className="text-[#f7e2a9]/90 font-sinhala leading-normal">
                      {isSinhalaMode ? currentMeasurement.tipSinhala : currentMeasurement.tip}
                    </p>
                  </div>

                  {/* Pattern Drafting Impact */}
                  <div className="p-4 rounded-lg bg-[#0b1016] border border-blue-500/20 space-y-1.5">
                    <span className="font-bold text-blue-300 font-mono uppercase text-[11px] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      {isSinhalaMode ? 'පැටර්න් එකලස් කිරීමට බලපාන ආකාරය:' : 'Pattern Drafting Impact:'}
                    </span>
                    <p className="text-blue-100/90 font-sinhala leading-normal">
                      {isSinhalaMode ? currentMeasurement.patternImpactSinhala : currentMeasurement.patternImpact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: INTERACTIVE PATTERN BLUEPRINT VIEWER */}
        {/* ================================================================= */}
        {activeTab === 'blueprint' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Pattern Piece Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#120a0d] border border-[#dfb56c]/30 p-4 rounded-xl shadow-lg">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#a89f91] block mb-1.5">
                  {isSinhalaMode ? 'පැටර්න් අච්චුව තෝරන්න (Select Pattern Piece)' : 'Select Pattern Piece Blueprint'}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {BLUEPRINT_PIECES.map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => setSelectedPieceId(piece.id)}
                      className={`px-3.5 py-2 rounded text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                        selectedPieceId === piece.id
                          ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                          : 'bg-[#1c1215] text-[#f7f3eb] hover:bg-[#28191e] border border-white/10'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isSinhalaMode ? piece.nameSi : piece.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blueprint Display Toggles */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGradingLines}
                    onChange={(e) => setShowGradingLines(e.target.checked)}
                    className="accent-[#dfb56c] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[#f7f3eb]">
                    {isSinhalaMode ? 'සයිස් ශ්‍රේණි (S/M/L Grading)' : 'Multi-Size Grading'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSeamAllowanceRuler}
                    onChange={(e) => setShowSeamAllowanceRuler(e.target.checked)}
                    className="accent-[#dfb56c] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[#f7f3eb]">
                    {isSinhalaMode ? 'මැහුම් වාසි ඉරි (Seam Allowance)' : 'Seam Allowance Margin'}
                  </span>
                </label>
              </div>
            </div>

            {/* Pattern Piece Specifications Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded bg-[#141011] border border-white/10">
                <span className="text-[10px] text-[#a89f91] font-mono uppercase block">Style Number</span>
                <strong className="text-xs text-[#dfb56c] font-mono block mt-0.5">
                  {currentBlueprintPiece.styleNo}
                </strong>
              </div>
              <div className="p-3.5 rounded bg-[#141011] border border-white/10">
                <span className="text-[10px] text-[#a89f91] font-mono uppercase block">Cut Quantity</span>
                <strong className="text-xs text-[#f7f3eb] font-mono block mt-0.5 line-clamp-1">
                  {isSinhalaMode ? currentBlueprintPiece.cutInstructionSi : currentBlueprintPiece.cutInstructionEn}
                </strong>
              </div>
              <div className="p-3.5 rounded bg-[#141011] border border-white/10">
                <span className="text-[10px] text-[#a89f91] font-mono uppercase block">Size & Specs</span>
                <strong className="text-xs text-[#f7f3eb] font-mono block mt-0.5">
                  {currentBlueprintPiece.sizeRange}
                </strong>
              </div>
              <div className="p-3.5 rounded bg-[#141011] border border-white/10">
                <span className="text-[10px] text-[#a89f91] font-mono uppercase block">Grainline</span>
                <strong className="text-xs text-[#dfb56c] font-mono block mt-0.5 line-clamp-1">
                  {isSinhalaMode ? currentBlueprintPiece.grainlineTypeSi : currentBlueprintPiece.grainlineType}
                </strong>
              </div>
            </div>

            {/* Interactive Architectural Blueprint Canvas */}
            <div className="bg-[#0b1016] border-2 border-[#dfb56c]/40 rounded-xl p-6 sm:p-10 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[520px]">
              {/* Blueprint Grid Lines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(#4a90e2 1px, transparent 1px), linear-gradient(90deg, #4a90e2 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Watermark / Brand Header */}
              <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-[#dfb56c]/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#dfb56c]" />
                <span>CEYLON STYLE STUDIO • MASTER ATELIER PATTERN BLUEPRINT</span>
              </div>

              {/* Live SVG Vector Pattern Diagram */}
              <div className="relative w-full max-w-[500px] h-[440px] flex items-center justify-center select-none">
                <svg viewBox="0 0 460 420" className="w-full h-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
                  {/* Pattern Paper Base Fill */}
                  <g id="pattern-sheet">
                    {currentBlueprintPiece.svgType === 'bodiceFront' && (
                      <g>
                        {/* Cut Line (Outer Perimeter with 1/2" Seam Allowance) */}
                        <path
                          d="M 60 40 
                             L 220 40 
                             L 230 65 
                             C 240 100, 260 135, 275 160 
                             L 250 240 
                             L 200 380 
                             L 60 380 
                             Z"
                          fill="#131b24"
                          stroke="#4a90e2"
                          strokeWidth="2"
                        />

                        {/* Stitched Seam Allowance Line (Dashed 1/2" Inside) */}
                        {showSeamAllowanceRuler && (
                          <path
                            d="M 60 52 
                               L 214 52 
                               L 222 72 
                               C 232 104, 250 135, 262 158 
                               L 238 234 
                               L 190 368 
                               L 60 368"
                            fill="none"
                            stroke="#dfb56c"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                          />
                        )}

                        {/* Multi-Size Grading Nesting Lines */}
                        {showGradingLines && (
                          <g opacity="0.6">
                            {/* Size S (Green Line) */}
                            <path d="M 60 44 L 210 44 L 218 67 C 228 98, 246 130, 260 152 L 236 230 L 188 368 L 60 368" fill="none" stroke="#2ecc71" strokeWidth="1" strokeDasharray="2 2" />
                            {/* Size L (Red Line) */}
                            <path d="M 60 36 L 230 36 L 242 63 C 252 102, 274 140, 290 168 L 264 250 L 212 392 L 60 392" fill="none" stroke="#e74c3c" strokeWidth="1" strokeDasharray="3 3" />
                          </g>
                        )}

                        {/* FOLD LINE SYMBOL (Left Edge - Center Front) */}
                        <g id="fold-symbol-mark">
                          <line x1="45" y1="80" x2="45" y2="340" stroke="#dfb56c" strokeWidth="2" />
                          <path d="M 45 80 L 52 90 L 45 85 L 38 90 Z" fill="#dfb56c" />
                          <path d="M 45 340 L 52 330 L 45 335 L 38 330 Z" fill="#dfb56c" />
                          <text x="30" y="215" fill="#dfb56c" fontSize="10" fontFamily="monospace" transform="rotate(-90, 30, 215)">
                            PLACE ON FOLD ⟵ ⊐ ⟶
                          </text>
                        </g>

                        {/* GRAINLINE ARROW (Straight Grain) */}
                        <g id="grainline-mark">
                          <line x1="130" y1="70" x2="130" y2="340" stroke="#dfb56c" strokeWidth="2" />
                          {/* Top Arrow */}
                          <path d="M 130 70 L 135 85 L 130 80 L 125 85 Z" fill="#dfb56c" />
                          {/* Bottom Arrow */}
                          <path d="M 130 340 L 135 325 L 130 330 L 125 325 Z" fill="#dfb56c" />
                          <text x="138" y="200" fill="#dfb56c" fontSize="10" fontFamily="monospace" transform="rotate(90, 138, 200)">
                            GRAINLINE ↕ PARALLEL TO SELVAGE
                          </text>
                        </g>

                        {/* FRENCH BUST DART */}
                        <g id="bust-dart">
                          {/* Dart legs from side seam */}
                          <line x1="250" y1="210" x2="175" y2="230" stroke="#dfb56c" strokeWidth="1.5" />
                          <line x1="240" y1="255" x2="175" y2="230" stroke="#dfb56c" strokeWidth="1.5" />
                          {/* Dart Center Fold line */}
                          <line x1="245" y1="232" x2="175" y2="230" stroke="#dfb56c" strokeWidth="1" strokeDasharray="3 2" />
                          {/* Apex Drill Hole (1/2" back from true apex) */}
                          <circle cx="175" cy="230" r="3.5" fill="#dfb56c" stroke="#0b1016" strokeWidth="1" />
                          <text x="160" y="215" fill="#f7e2a9" fontSize="9" fontFamily="monospace">
                            DART APEX PUNCH HOLE (1/2" BACK)
                          </text>
                        </g>

                        {/* WAIST SHAPING DART */}
                        <g id="waist-dart">
                          <line x1="120" y1="380" x2="135" y2="275" stroke="#dfb56c" strokeWidth="1.5" />
                          <line x1="150" y1="380" x2="135" y2="275" stroke="#dfb56c" strokeWidth="1.5" />
                          <circle cx="135" cy="275" r="3" fill="#dfb56c" />
                        </g>

                        {/* NOTCHES (▲ Single Notch on Front Armhole) */}
                        <g id="armhole-notches">
                          <polygon points="268,145 278,148 274,140" fill="#dfb56c" />
                          <text x="282" y="146" fill="#dfb56c" fontSize="9" fontFamily="monospace">
                            ▲ NOTCH
                          </text>
                        </g>

                        {/* PATTERN STAMP LABEL (Center Text) */}
                        <g id="pattern-stamp" transform="translate(70, 110)">
                          <rect x="0" y="0" width="130" height="75" fill="#0b1016" stroke="#dfb56c" strokeWidth="1" rx="3" />
                          <text x="8" y="16" fill="#dfb56c" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            STYLE: CSS-2026-DRS-01
                          </text>
                          <text x="8" y="29" fill="#f7f3eb" fontSize="8.5" fontFamily="monospace">
                            PIECE: BODICE FRONT
                          </text>
                          <text x="8" y="42" fill="#2ecc71" fontSize="8.5" fontFamily="monospace">
                            CUT: 1 ON FOLD (SELF)
                          </text>
                          <text x="8" y="55" fill="#f7e2a9" fontSize="8.5" fontFamily="monospace">
                            SIZE: M (UK 10 / BUST 36")
                          </text>
                          <text x="8" y="67" fill="#a89f91" fontSize="7" fontFamily="monospace">
                            DATE: 2026-03-15 • ATELIER
                          </text>
                        </g>
                      </g>
                    )}

                    {currentBlueprintPiece.svgType === 'bodiceBack' && (
                      <g>
                        {/* Back Bodice Block */}
                        <path
                          d="M 70 40 
                             L 220 40 
                             L 230 65 
                             C 240 100, 260 135, 275 160 
                             L 250 240 
                             L 200 380 
                             L 70 380 
                             Z"
                          fill="#131b24"
                          stroke="#4a90e2"
                          strokeWidth="2"
                        />

                        {/* Stitched Seam Allowance Line */}
                        {showSeamAllowanceRuler && (
                          <path
                            d="M 85 52 L 214 52 L 222 72 C 232 104, 250 135, 262 158 L 238 234 L 190 368 L 85 368 Z"
                            fill="none"
                            stroke="#dfb56c"
                            strokeWidth="1.2"
                            strokeDasharray="4 3"
                          />
                        )}

                        {/* Center Back Zipper Seam (3/4" SA) */}
                        <line x1="70" y1="40" x2="70" y2="380" stroke="#e74c3c" strokeWidth="2" />
                        <text x="52" y="220" fill="#e74c3c" fontSize="9" fontFamily="monospace" transform="rotate(-90, 52, 220)">
                          CENTER BACK ZIPPER (3/4" S.A.)
                        </text>

                        {/* Double Notch for Back Armhole (▲▲) */}
                        <g id="back-double-notch">
                          <polygon points="266,140 276,143 272,135" fill="#dfb56c" />
                          <polygon points="270,150 280,153 276,145" fill="#dfb56c" />
                          <text x="285" y="148" fill="#dfb56c" fontSize="9" fontFamily="monospace">
                            ▲▲ DOUBLE NOTCH
                          </text>
                        </g>

                        {/* Shoulder Blade Dart */}
                        <line x1="160" y1="40" x2="165" y2="105" stroke="#dfb56c" strokeWidth="1.5" />
                        <line x1="175" y1="40" x2="165" y2="105" stroke="#dfb56c" strokeWidth="1.5" />
                        <circle cx="165" cy="105" r="3" fill="#dfb56c" />

                        {/* Grainline */}
                        <line x1="120" y1="70" x2="120" y2="340" stroke="#dfb56c" strokeWidth="2" />
                        <path d="M 120 70 L 125 85 L 120 80 L 115 85 Z" fill="#dfb56c" />
                        <path d="M 120 340 L 125 325 L 120 330 L 115 325 Z" fill="#dfb56c" />

                        {/* Label Stamp */}
                        <g id="pattern-stamp-back" transform="translate(90, 150)">
                          <rect x="0" y="0" width="125" height="70" fill="#0b1016" stroke="#dfb56c" strokeWidth="1" rx="3" />
                          <text x="8" y="16" fill="#dfb56c" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            STYLE: CSS-2026-DRS-01
                          </text>
                          <text x="8" y="29" fill="#f7f3eb" fontSize="8.5" fontFamily="monospace">
                            PIECE: BODICE BACK
                          </text>
                          <text x="8" y="42" fill="#e74c3c" fontSize="8.5" fontFamily="monospace">
                            CUT: 2 (SELF) + 2 (LINING)
                          </text>
                          <text x="8" y="55" fill="#f7e2a9" fontSize="8.5" fontFamily="monospace">
                            SIZE: M (UK 10)
                          </text>
                        </g>
                      </g>
                    )}

                    {currentBlueprintPiece.svgType === 'sleeve' && (
                      <g>
                        {/* Set-in Sleeve Pattern */}
                        <path
                          d="M 110 380 
                             L 70 140 
                             C 70 110, 110 50, 220 50 
                             C 330 50, 370 110, 370 140 
                             L 330 380 
                             Z"
                          fill="#131b24"
                          stroke="#4a90e2"
                          strokeWidth="2"
                        />

                        {/* Crown Center Notch */}
                        <polygon points="217,50 223,50 220,40" fill="#dfb56c" />
                        <text x="200" y="35" fill="#dfb56c" fontSize="8.5" fontFamily="monospace">
                          ▲ CROWN NOTCH
                        </text>

                        {/* Front Single Notch */}
                        <polygon points="68,110 75,115 67,118" fill="#dfb56c" />
                        <text x="25" y="115" fill="#dfb56c" fontSize="8.5" fontFamily="monospace">
                          FRONT ▲
                        </text>

                        {/* Back Double Notch */}
                        <polygon points="372,110 365,115 373,118" fill="#dfb56c" />
                        <polygon points="372,122 365,127 373,130" fill="#dfb56c" />
                        <text x="380" y="120" fill="#dfb56c" fontSize="8.5" fontFamily="monospace">
                          ▲▲ BACK
                        </text>

                        {/* Center Straight Grainline */}
                        <line x1="220" y1="65" x2="220" y2="365" stroke="#dfb56c" strokeWidth="2" />
                        <path d="M 220 65 L 225 80 L 220 75 L 215 80 Z" fill="#dfb56c" />
                        <path d="M 220 365 L 225 350 L 220 355 L 215 350 Z" fill="#dfb56c" />

                        {/* Sleeve Label Stamp */}
                        <g id="sleeve-stamp" transform="translate(160, 180)">
                          <rect x="0" y="0" width="120" height="65" fill="#0b1016" stroke="#dfb56c" strokeWidth="1" rx="3" />
                          <text x="8" y="16" fill="#dfb56c" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            STYLE: CSS-2026-SLV-01
                          </text>
                          <text x="8" y="29" fill="#f7f3eb" fontSize="8.5" fontFamily="monospace">
                            PIECE: SET-IN SLEEVE
                          </text>
                          <text x="8" y="42" fill="#2ecc71" fontSize="8.5" fontFamily="monospace">
                            CUT: 1 PAIR (L & R)
                          </text>
                          <text x="8" y="55" fill="#f7e2a9" fontSize="8.5" fontFamily="monospace">
                            SIZE: M (BICEP 11.5")
                          </text>
                        </g>
                      </g>
                    )}

                    {currentBlueprintPiece.svgType === 'skirt' && (
                      <g>
                        {/* A-Line Skirt Pattern Piece */}
                        <path
                          d="M 80 80 
                             L 220 80 
                             C 240 120, 255 170, 265 210 
                             L 330 380 
                             L 80 380 
                             Z"
                          fill="#131b24"
                          stroke="#4a90e2"
                          strokeWidth="2"
                        />

                        {/* Fold Line on Left Edge */}
                        <line x1="68" y1="90" x2="68" y2="370" stroke="#dfb56c" strokeWidth="2" />
                        <text x="50" y="230" fill="#dfb56c" fontSize="9" fontFamily="monospace" transform="rotate(-90, 50, 230)">
                          PLACE ON FOLD ⟵ ⊐ ⟶
                        </text>

                        {/* Waist Darts */}
                        <line x1="140" y1="80" x2="148" y2="145" stroke="#dfb56c" strokeWidth="1.5" />
                        <line x1="156" y1="80" x2="148" y2="145" stroke="#dfb56c" strokeWidth="1.5" />
                        <circle cx="148" cy="145" r="3" fill="#dfb56c" />

                        {/* Bottom Hemline Allowance (1.5" Wide) */}
                        <line x1="80" y1="350" x2="320" y2="350" stroke="#dfb56c" strokeWidth="1.5" strokeDasharray="4 3" />
                        <text x="120" y="365" fill="#f7e2a9" fontSize="9" fontFamily="monospace">
                          HEM ALLOWANCE: 1.5" (3.8 CM)
                        </text>

                        {/* Grainline */}
                        <line x1="190" y1="100" x2="190" y2="330" stroke="#dfb56c" strokeWidth="2" />
                        <path d="M 190 100 L 195 115 L 190 110 L 185 115 Z" fill="#dfb56c" />
                        <path d="M 190 330 L 195 315 L 190 320 L 185 315 Z" fill="#dfb56c" />

                        {/* Skirt Label */}
                        <g id="skirt-stamp" transform="translate(100, 180)">
                          <rect x="0" y="0" width="125" height="65" fill="#0b1016" stroke="#dfb56c" strokeWidth="1" rx="3" />
                          <text x="8" y="16" fill="#dfb56c" fontSize="9" fontFamily="monospace" fontWeight="bold">
                            STYLE: CSS-2026-SKT-01
                          </text>
                          <text x="8" y="29" fill="#f7f3eb" fontSize="8.5" fontFamily="monospace">
                            PIECE: SKIRT FRONT
                          </text>
                          <text x="8" y="42" fill="#2ecc71" fontSize="8.5" fontFamily="monospace">
                            CUT: 1 ON FOLD (SELF)
                          </text>
                          <text x="8" y="55" fill="#f7e2a9" fontSize="8.5" fontFamily="monospace">
                            SIZE: M (WAIST 28")
                          </text>
                        </g>
                      </g>
                    )}
                  </g>
                </svg>
              </div>

              {/* Bottom Instructions */}
              <div className="mt-4 text-center">
                <span className="text-[11px] font-mono text-[#a89f91]">
                  {isSinhalaMode
                    ? '★ ඉහත දැක්වෙන්නේ කාර්මික සම්මතයන්ට අනුකූලව සකස් කරන ලද නිල පැටර්න් අච්චුවකි.'
                    : '★ Architectural pattern blueprint rendered to international apparel engineering standards.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MANDATORY 8 PATTERN ELEMENTS CHECKLIST */}
        {/* ================================================================= */}
        {activeTab === 'checklist' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="bg-[#120a0d] border border-[#dfb56c]/30 p-5 rounded-xl text-center max-w-3xl mx-auto shadow-lg">
              <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block mb-1">
                {isSinhalaMode
                  ? 'පැටර්න් එකකට අනිවාර්යයෙන්ම තිබිය යුතු අංග 8'
                  : '8 MANDATORY APPAREL PATTERN ELEMENTS'}
              </span>
              <p className="text-xs sm:text-sm text-[#a89f91] font-sinhala leading-relaxed">
                {isSinhalaMode
                  ? 'වෘත්තීය මට්ටමේ ඇඳුම් පැටර්න් එකක් සකස් කිරීමේදී පහත සඳහන් අංග 8න් එකක් හෝ අතපසු වුවහොත්, ඇඳුම් කැපීමේදී හෝ මැසීමේදී බරපතල වැරදි සිදු වී මුළු ඇඳුමම අපතේ යයි.'
                  : 'Every professional garment pattern piece must contain these 8 mandatory markings. Omitting even one causes disastrous cutting and sewing mistakes in the atelier.'}
              </p>
            </div>

            {/* Grid of 8 Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {MANDATORY_PATTERN_ELEMENTS.map((elem) => {
                const isSelected = highlightedElement === elem.id;
                return (
                  <div
                    key={elem.id}
                    onClick={() => setHighlightedElement(elem.id)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#1e1316] border-[#dfb56c] shadow-xl shadow-[#c99a45]/20 ring-1 ring-[#dfb56c]'
                        : 'bg-[#141011] border-white/10 hover:border-[#dfb56c]/40 hover:bg-[#191315]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38070e] text-[#dfb56c] font-bold border border-[#dfb56c]/30">
                          {elem.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#dfb56c]" />}
                      </div>

                      <h3 className="text-sm font-bold text-[#f7f3eb] font-sinhala">
                        {isSinhalaMode ? elem.titleSi : elem.titleEn}
                      </h3>

                      <p className="text-xs text-[#a89f91] font-sinhala mt-1 line-clamp-2">
                        {isSinhalaMode ? elem.shortDescSi : elem.shortDescEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-[#dfb56c] flex items-center justify-between">
                      <span>{isSinhalaMode ? 'විස්තර බලන්න' : 'View Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspector for Selected Mandatory Element */}
            {currentHighlightElement && (
              <div className="p-6 sm:p-8 rounded-xl bg-[#0c090a] border-2 border-[#dfb56c]/40 shadow-2xl space-y-5 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#dfb56c] text-[#0c090a] font-bold">
                        {currentHighlightElement.badge}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-[#f7f3eb] font-sinhala">
                        {isSinhalaMode ? currentHighlightElement.titleSi : currentHighlightElement.titleEn}
                      </h3>
                    </div>
                    <span className="text-xs text-[#a89f91] font-sinhala">
                      {isSinhalaMode ? currentHighlightElement.shortDescSi : currentHighlightElement.shortDescEn}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#dfb56c] px-3 py-1 rounded bg-[#1e1316] border border-[#dfb56c]/30">
                    Industrial Standard ISO 23606
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
                  {/* Column 1: Why Mandatory */}
                  <div className="space-y-2 p-4 rounded-lg bg-[#141011] border border-white/5">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb56c]" />
                      {isSinhalaMode ? 'අනිවාර්ය වන්නේ ඇයි?' : 'Why It Is Mandatory'}
                    </span>
                    <p className="text-[#a89f91] font-sinhala">
                      {isSinhalaMode
                        ? currentHighlightElement.whyMandatorySi
                        : currentHighlightElement.whyMandatoryEn}
                    </p>
                  </div>

                  {/* Column 2: Industry Standard Notation */}
                  <div className="space-y-2 p-4 rounded-lg bg-[#141011] border border-white/5">
                    <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#dfb56c]" />
                      {isSinhalaMode ? 'ජාත්‍යන්තර සම්මතය' : 'Industry Standard'}
                    </span>
                    <p className="text-[#a89f91] font-sinhala">
                      {isSinhalaMode
                        ? currentHighlightElement.industryStandardSi
                        : currentHighlightElement.industryStandardEn}
                    </p>
                  </div>

                  {/* Column 3: Catastrophic Risk If Missing */}
                  <div className="space-y-2 p-4 rounded-lg bg-[#250d11] border border-red-500/30">
                    <span className="text-xs font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      {isSinhalaMode ? 'නොතිබුණහොත් සිදුවන හානිය' : 'Catastrophic Risk'}
                    </span>
                    <p className="text-red-200/80 font-sinhala">
                      {isSinhalaMode
                        ? currentHighlightElement.riskIfMissingSi
                        : currentHighlightElement.riskIfMissingEn}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: COMPLETE TECHNICAL GLOSSARY (සිංහල සහ ඉංග්‍රීසි තේරුම්) */}
        {/* ================================================================= */}
        {activeTab === 'glossary' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Search & Filter Bar */}
            <div className="bg-[#120a0d] border border-[#dfb56c]/30 p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#a89f91] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder={
                    isSinhalaMode
                      ? 'පැටර්න් වචන සොයන්න (e.g. Grainline, ධාන්‍ය, Seam, Dart, Notch)...'
                      : 'Search terminology (e.g. Grainline, Dart, Seam, Notch, Ease)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0a0708] border border-white/10 rounded-lg text-xs text-[#f7f3eb] placeholder-[#a89f91]/60 focus:border-[#dfb56c] outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {[
                  { id: 'all', labelEn: 'All (සියල්ල)', labelSi: 'සියල්ල' },
                  { id: 'lines', labelEn: 'Lines & Marks', labelSi: 'රේඛා හා ලකුණු' },
                  { id: 'seams', labelEn: 'Seam & Darts', labelSi: 'මැහුම් හා ඩාට්' },
                  { id: 'fitting', labelEn: 'Fitting & Shaping', labelSi: 'හැඩ ගැන්වීම' },
                  { id: 'cutting', labelEn: 'Cutting & Labels', labelSi: 'කැපුම් හා ලේබල්' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setGlossaryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      glossaryCategory === cat.id
                        ? 'bg-[#dfb56c] text-[#0c090a] font-bold shadow'
                        : 'bg-[#181113] text-[#a89f91] hover:text-[#f7e2a9] border border-white/5'
                    }`}
                  >
                    {isSinhalaMode ? cat.labelSi : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Glossary Flashcards List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredGlossary.map((item) => {
                const isExpanded = expandedTermId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-xl bg-[#141011] border border-white/10 hover:border-[#dfb56c]/40 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Term Title & Symbol */}
                      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-[#dfb56c] font-editorial">
                              {item.termEn}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38070e] text-[#f7e2a9] border border-[#dfb56c]/30">
                              {isSinhalaMode ? item.categoryLabelSi : item.categoryLabelEn}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-[#f7f3eb] font-sinhala block mt-0.5">
                            {item.termSi}
                          </span>
                        </div>

                        <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#0a0708] border border-white/10 text-[#dfb56c] shrink-0 font-bold">
                          {item.symbol}
                        </span>
                      </div>

                      {/* Technical Definition (Bilingual) */}
                      <div className="space-y-2 mt-3 text-xs leading-relaxed">
                        <div>
                          <span className="font-bold text-[#a89f91] font-mono text-[10px] uppercase block">
                            {isSinhalaMode ? 'සිංහල තේරුම:' : 'Sinhala Definition:'}
                          </span>
                          <p className="text-[#f7f3eb] font-sinhala mt-0.5">{item.meaningSi}</p>
                        </div>

                        <div>
                          <span className="font-bold text-[#a89f91] font-mono text-[10px] uppercase block">
                            {isSinhalaMode ? 'ඉංග්‍රීසි තේරුම (English Meaning):' : 'English Definition:'}
                          </span>
                          <p className="text-[#a89f91] mt-0.5">{item.meaningEn}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pro Atelier Importance & Tip */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="p-2.5 rounded bg-[#0c090a] border border-[#dfb56c]/20">
                        <span className="text-[10px] font-mono text-[#dfb56c] font-bold block mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#dfb56c]" />
                          {isSinhalaMode ? 'ඇඳුම් මැසීමේදී වැදගත්කම:' : 'Why It Matters in Atelier:'}
                        </span>
                        <p className="text-[11px] text-[#f7e2a9]/90 font-sinhala leading-normal">
                          {isSinhalaMode ? item.importanceSi : item.importanceEn}
                        </p>
                      </div>

                      <div className="text-[11px] text-[#a89f91] font-sinhala flex items-start gap-1.5">
                        <span className="text-[#dfb56c] font-bold shrink-0">Tip:</span>
                        <span>{isSinhalaMode ? item.atelierTipSi : item.atelierTipEn}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredGlossary.length === 0 && (
              <div className="text-center py-12 bg-[#120a0d] border border-white/10 rounded-xl">
                <p className="text-sm text-[#a89f91]">
                  {isSinhalaMode
                    ? 'සෙවූ වචනයට අදාළ පැටර්න් පද හමු නොවීය. කරුණාකර වෙනත් වචනයක් යොදන්න.'
                    : 'No matching pattern terms found. Please try a different search keyword.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: STUDENT KNOWLEDGE CHECK (QUIZ) */}
        {/* ================================================================= */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-[#120a0d] border border-[#dfb56c]/30 p-5 rounded-xl text-center shadow-lg">
              <span className="text-xs font-mono uppercase text-[#dfb56c] font-bold block mb-1">
                {isSinhalaMode ? 'පැටර්න් දැනුම පරීක්ෂාව' : 'STUDENT PATTERN KNOWLEDGE QUIZ'}
              </span>
              <p className="text-xs sm:text-sm text-[#a89f91] font-sinhala">
                {isSinhalaMode
                  ? 'ඇඳුම් පැටර්න් අච්චුවල ඇති ලකුණු සහ නීති පිළිබඳ ඔබගේ දැනුම මැන බලන්න.'
                  : 'Test your understanding of garment pattern markings, notches, fold rules, and true bias angles.'}
              </p>
            </div>

            <div className="space-y-6">
              {PATTERN_QUIZ_QUESTIONS.map((q, qIndex) => {
                const selectedOpt = quizAnswers[qIndex];
                const isCorrect = selectedOpt === q.correctIndex;

                return (
                  <div
                    key={qIndex}
                    className="p-5 sm:p-6 rounded-xl bg-[#141011] border border-white/10 space-y-4 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#dfb56c] text-[#0c090a] font-bold text-xs flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#f7f3eb] font-sinhala leading-snug">
                        {isSinhalaMode ? q.questionSi : q.questionEn}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {(isSinhalaMode ? q.optionsSi : q.optionsEn).map((opt, optIndex) => {
                        const isChosen = selectedOpt === optIndex;
                        let btnStyle = 'bg-[#1c1215] text-[#f7f3eb] border-white/10 hover:border-[#dfb56c]/40';

                        if (quizSubmitted) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'bg-emerald-900/60 text-emerald-200 border-emerald-500 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-900/60 text-rose-200 border-rose-500';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-[#dfb56c] text-[#0c090a] font-bold border-[#dfb56c]';
                        }

                        return (
                          <button
                            key={optIndex}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers({ ...quizAnswers, [qIndex]: optIndex });
                              }
                            }}
                            className={`p-3 rounded-lg text-xs font-sinhala text-left border transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono mr-2 text-[11px] font-bold">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submit */}
                    {quizSubmitted && (
                      <div
                        className={`p-3 rounded-lg text-xs font-sinhala ${
                          isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        <strong className="block mb-0.5">
                          {isCorrect
                            ? (isSinhalaMode ? '✓ නිවැරදියි!' : '✓ Correct!')
                            : (isSinhalaMode ? '✗ වැරදියි!' : '✗ Incorrect!')}
                        </strong>
                        <p>{isSinhalaMode ? q.explanationSi : q.explanationEn}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Button & Score Display */}
            <div className="text-center pt-4">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < PATTERN_QUIZ_QUESTIONS.length}
                  className="btn-3d-primary px-8 py-3 rounded-full text-xs sm:text-sm font-bold disabled:opacity-50 cursor-pointer"
                >
                  {isSinhalaMode ? 'පිළිතුරු පරීක්ෂා කරන්න (Submit Answers)' : 'Submit Answers'}
                </button>
              ) : (
                <div className="p-6 rounded-xl bg-[#141011] border-2 border-[#dfb56c] space-y-4">
                  <div className="inline-flex items-center gap-2 text-[#dfb56c]">
                    <Award className="w-6 h-6" />
                    <span className="font-editorial text-xl font-bold">
                      {isSinhalaMode
                        ? `ඔබගේ ලකුණු: 4න් ${quizScore}`
                        : `Your Score: ${quizScore} / 4`}
                    </span>
                  </div>
                  <p className="text-xs text-[#a89f91] font-sinhala">
                    {quizScore === 4
                      ? (isSinhalaMode ? 'විශිෂ්ටයි! ඔබ ඇඳුම් පැටර්න් පිළිබඳ සම්පූර්ණ ප්‍රවීණත්වයක් ලබා ඇත.' : 'Outstanding! You have mastered garment pattern markings and industry standards.')
                      : (isSinhalaMode ? 'නැවත වරක් ඉහත නාමාවලිය සහ අනිවාර්ය අංග අධ්‍යයනය කර නැවත උත්සාහ කරන්න.' : 'Review the mandatory markings and terminology above to sharpen your expertise.')}
                  </p>
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="btn-3d-secondary px-6 py-2 rounded-full text-xs font-mono cursor-pointer"
                  >
                    {isSinhalaMode ? 'නැවත පරීක්ෂණය කරන්න (Retake Quiz)' : 'Retake Quiz'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal for Body Measurement Image */}
      {measurementModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setMeasurementModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMeasurementModalImage(null)}
              className="absolute -top-12 right-0 bg-[#dfb56c] text-black p-2 rounded-full hover:bg-white transition-all cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-xl overflow-hidden border-2 border-[#dfb56c] shadow-2xl bg-[#0c090a]">
              {Boolean(measurementModalImage && measurementModalImage.trim()) && (
                <img
                  src={measurementModalImage.trim()}
                  alt="Measurement Guide"
                  className="w-full max-h-[85vh] object-contain mx-auto"
                />
              )}
              <div className="p-3 bg-[#141011] border-t border-white/10 text-center">
                <span className="text-xs font-mono text-[#dfb56c] uppercase">
                  CEYLON STYLE STUDIO • ANATOMICAL MEASUREMENT GUIDE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
