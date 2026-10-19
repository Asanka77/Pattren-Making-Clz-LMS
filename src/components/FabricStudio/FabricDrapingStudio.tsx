import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Layers,
  Scissors,
  CheckCircle2,
  Info,
  Sliders,
  Eye,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wind,
  Cpu,
  RefreshCw,
  X,
  Compass,
  Tag
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface FabricDetailType {
  id: string;
  name: string;
  nameSinhala: string;
  category: string;
  categorySinhala: string;
  overview: string;
  overviewSinhala: string;
  properties: {
    gsm: number;
    gsmCategory: 'Lightweight' | 'Medium Weight' | 'Heavyweight' | 'Ultra Heavy';
    gsmCategorySinhala: string;
    sheen: number; // 0 to 100%
    sheenDescription: string;
    sheenDescriptionSinhala: string;
    stiffness: number; // 1 to 10
    stiffnessDescription: string;
    stiffnessDescriptionSinhala: string;
    drapeFall: string;
    drapeFallSinhala: string;
    breathability: string;
    breathabilitySinhala: string;
    elasticityAndBias: string;
    elasticityAndBiasSinhala: string;
    composition: string;
    compositionSinhala: string;
  };
  matchingDesigns: {
    title: string;
    titleSinhala: string;
    silhouette: string;
    description: string;
    descriptionSinhala: string;
    patternTip: string;
    patternTipSinhala: string;
  }[];
  unsuitableDesigns?: {
    title: string;
    titleSinhala: string;
    reason: string;
    reasonSinhala: string;
  }[];
  specialCharacteristics: {
    grainlineRule: string;
    grainlineRuleSinhala: string;
    needleSize: string;
    needleSizeSinhala: string;
    threadSpec: string;
    seamFinishes: string;
    seamFinishesSinhala: string;
    pressingHeat: string;
    pressingHeatSinhala: string;
    shrinkageCare: string;
    shrinkageCareSinhala: string;
  };
  weaveConstruction: {
    weaveType: string;
    weaveTypeSinhala: string;
    yarnDetails: string;
    yarnDetailsSinhala: string;
    warpWeftDensity: string;
    textureFeel: string;
    textureFeelSinhala: string;
    microscopicStructure: string;
    microscopicStructureSinhala: string;
  };
  cssModule: string;
  colors: { name: string; hex: string; specular: string }[];
}

export const LUXURY_FABRICS_CATALOG: FabricDetailType[] = [
  {
    id: 'silk-charmeuse',
    name: 'Imperial Silk Charmeuse',
    nameSinhala: 'රාජකීය සිල්ක් චාමූස් (100% Pure Silk)',
    category: 'Couture Silk',
    categorySinhala: 'සුඛෝපභෝගී කෝචර් සිල්ක්',
    overview:
      'Ultra-fluid, highly lustrous 100% mulberry silk characterized by a radiant reflective satin face and a dull crepe reverse. Celebrated globally for fluid sensual draping.',
    overviewSinhala:
      'අතිශය සුඛෝපභෝගී 100% ස්වභාවික මල්බෙරි සිල්ක් රෙදිපිළියකි. ආලෝකය පරාවර්තනය කරන දිදුලන ඉදිරිපසක් සහ සියුම් මැට් පසුපසකින් යුක්ත වන අතර තරංග රැළි සදහා වඩාත් ප්‍රසිද්ධය.',
    properties: {
      gsm: 95,
      gsmCategory: 'Lightweight',
      gsmCategorySinhala: 'සැහැල්ලු බර (Lightweight 95 GSM)',
      sheen: 95,
      sheenDescription: 'High Specular Gloss & Fluid Radiance',
      sheenDescriptionSinhala: 'ඉහළ ආලෝක පරාවර්තනය සහ දියරමය දීප්තිය (95%)',
      stiffness: 1.8,
      stiffnessDescription: 'Ultra-Fluid Liquid Drape (1.8 / 10)',
      stiffnessDescriptionSinhala: 'අතිශය නම්‍යශීලී දියරමය හැසිරීම (1.8 / 10)',
      drapeFall: 'Cascading liquid ripples with zero structural stiffness',
      drapeFallSinhala: 'ශරීර හැඩයට අනුව දියරක් මෙන් ගලා හැලෙන සිනිඳු තරංග රැළි',
      breathability: 'Very High Natural Thermal Regulation',
      breathabilitySinhala: 'ඉහළ ස්වභාවික වාතාශ්‍රය සහ ශරීර උෂ්ණත්ව පාලනය',
      elasticityAndBias: 'Zero mechanical elastane; 45° True Bias extends by 25-30%',
      elasticityAndBiasSinhala: 'ඉලාස්ටේන් නොමැත; අංශක 45 Bias කැපුමේදී 25-30% ක් ස්වභාවිකව ඇදේ',
      composition: '100% Mulberry Filament Silk (Grade 6A)',
      compositionSinhala: '100% ස්වභාවික මල්බෙරි සිල්ක් (ග්‍රේඩ් 6A)',
    },
    matchingDesigns: [
      {
        title: 'Bias-Cut Slip Dresses & Cowl Necklines',
        titleSinhala: 'අංශක 45 බයස්-කට් ස්ලිප් ගවුම් සහ කවුල් නෙක්ලයින්',
        silhouette: 'Hourglass Fluid Column',
        description:
          'Drapes across female anatomical landmarks effortlessly without side seam puckering.',
        descriptionSinhala:
          'ශරීරයේ උකුල් සහ පපුව වටා ඇති ස්වභාවික වක්‍රතාවයන් ඉතා අලංකාරව ඉස්මතු කරමින් රැළි වැටේ.',
        patternTip: 'Draft pattern on true 45° grainline; add 3.5cm hang allowance for 24h drop before hem trimming.',
        patternTipSinhala: 'නියම අංශක 45 බයස් අක්ෂය මත පතරොම කපන්න; වාටිය කැපීමට පෙර පැය 24 ක් එල්ලා තබන්න.',
      },
      {
        title: 'Haute Couture Waterfall Capes & Slit Evening Gowns',
        titleSinhala: 'කෝචර් වෝටර්ෆෝල් කේප් සහ සන්ධ්‍යා ඇඳුම්',
        silhouette: 'Cascading Grecian Drape',
        description: 'Creates breathtaking liquid ripples as the wearer walks the red carpet or runway.',
        descriptionSinhala: 'රෙඩ් කාපට් සහ විලාසිතා සංදර්ශන වලදී චලනය සමග පාවෙන රාජකීය පෙනුමක් ලබාදේ.',
        patternTip: 'Use slash-and-spread method to introduce radial drape fullness from shoulder landmarks.',
        patternTipSinhala: 'උරහිස් ලක්ෂ්‍යයේ සිට විහිදෙන රැළි නිර්මාණයට Slash and Spread ක්‍රමය යොදාගන්න.',
      },
      {
        title: 'Luxury Camisoles & French Cuff Blouses',
        titleSinhala: 'සුඛෝපභෝගී කැමිසෝල් සහ ප්‍රංශ කෆ් බ්ලවුස්',
        silhouette: 'Soft Tailored Feminine',
        description: 'Delivers next-to-skin buttery softness with executive luxury appeal.',
        descriptionSinhala: 'සමට මෘදු ස්පර්ශයක් ලබාදෙන ඉහළ පෙළේ සුඛෝපභෝගී විලාසිතාවකි.',
        patternTip: 'Use self-bias binding for neckline and 5mm baby French seams throughout.',
        patternTipSinhala: 'කර වටා තමන්ගේම බයස් පටි සහ මි.මී. 5 ප්‍රංශ මැහුම් (French Seams) භාවිත කරන්න.',
      },
    ],
    unsuitableDesigns: [
      {
        title: 'Structured Boxy Blazers & Outerwear',
        titleSinhala: 'හැඩය තදින් රඳවාගත යුතු බ්ලේසර් කබා',
        reason: 'Lacks structural firmness; collapses without heavy fusible interlinings.',
        reasonSinhala: 'රෙදිපිළියට තද හැඩයක් නොමැති බැවින් බ්ලේසර් වල ස්ථිර හැඩය රඳවාගත නොහැක.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'Grainline must run strictly parallel to selvage. When cutting on bias, mark grain precisely at 45°.',
      grainlineRuleSinhala: 'Grainline එක Selvage එකට සමාන්තර විය යුතුය. Bias කපන විට නිවැරදිව අංශක 45 කෝණය ලකුණු කරන්න.',
      needleSize: 'Microtex 60/8 or 70/10 Sharp Needle',
      needleSizeSinhala: 'Microtex 60/8 හෝ 70/10 අතිශය තියුණු ඉඳිකටුවක් පමණක් භාවිත කරන්න',
      threadSpec: '#100 Extra-Fine Silk Thread or Gutermann Mara 120',
      seamFinishes: '5mm French Seam (ප්‍රංශ මැහුම්) or Hand-Rolled Baby Hem',
      seamFinishesSinhala: 'මි.මී. 5 ප්‍රංශ මැහුම් හෝ අතින් රෝල් කරන ලද බේබි වාටි මැහුම් (Rolled Hem)',
      pressingHeat: 'Low Heat (Silk Setting, 120°C max); always use pure silk press cloth; NO steam drops on face',
      pressingHeatSinhala: 'අඩු උෂ්ණත්වය (සිල්ක් සෙටින්ග්, 120°C); සිල්ක් ප්‍රෙස් රෙද්දක් තබා මදින්න; කෙලින්ම වතුර ස්ප්‍රේ නොකරන්න',
      shrinkageCare: 'Dry Clean Only or Cold Hand Soak with neutral silk wash. Shrinkage ~3-5% upon initial moisture.',
      shrinkageCareSinhala: 'ඩ්‍රයි ක්ලීන් පමණි හෝ සීතල ජලයේ මෘදු ෂැම්පු භාවිතයෙන් සෝදන්න. ඇකිලීම 3-5% පමණ වේ.',
    },
    weaveConstruction: {
      weaveType: 'Satin Weave (4/1 Floating Warp System)',
      weaveTypeSinhala: 'සැටින් වියමන (Satin Weave - නූල් 4ක් උඩින් නූල් 1ක් යටින්)',
      yarnDetails: 'Fine degummed continuous filament mulberry silk; high warp density over crepe weft.',
      yarnDetailsSinhala: 'අඛණ්ඩ මල්බෙරි සිල්ක් කෙඳි; ඉදිරිපස නූල් ඝනත්වය ඉතා ඉහළ වන අතර පසුපස ක්‍රේප් නූල් පිහිටයි.',
      warpWeftDensity: 'Warp: 180 threads/cm • Weft: 90 threads/cm',
      textureFeel: 'Ultra-slippery, buttery cool hand on face; soft crepe texture on back',
      textureFeelSinhala: 'ඉදිරිපස අතිශය ලිස්සන සුළු මෘදු සිනිඳු ස්පර්ශය; පිටුපස මදක් රළු ක්‍රේප් ගතිය',
      microscopicStructure: 'Triangular prism silk fibers reflecting light at varying angles to generate deep shimmer.',
      microscopicStructureSinhala: 'ප්‍රිස්ම හැඩැති ත්‍රිකෝණාකාර සිල්ක් කෙඳි මගින් ආලෝකය විවිධ කෝණ වලින් පරාවර්තනය කර දිදුලන පෙනුම සදයි.',
    },
    cssModule: 'Module 01 (Grainlines & Body Anatomy) & Module 04 (French Draping & Fit Correction)',
    colors: [
      { name: 'Royal Gold', hex: '#dfb56c', specular: '#fff5da' },
      { name: 'Imperial Burgundy', hex: '#631020', specular: '#e08395' },
      { name: 'Champagne Pearl', hex: '#f4ede1', specular: '#ffffff' },
      { name: 'Noir Onyx', hex: '#161314', specular: '#948a8c' },
    ],
  },
  {
    id: 'venetian-velvet',
    name: 'Royal Venetian Velvet',
    nameSinhala: 'රාජකීය වැනීසියන් වෙල්වට් (Haute Velvet)',
    category: 'Haute Velvet',
    categorySinhala: 'රාජකීය ඝන වෙල්වට්',
    overview:
      'Heavyweight cut-pile fabric celebrated for its plush dimensional depth, optical light absorption, and regal sculptural presence. Teaches students nap alignment and pressing discipline.',
    overviewSinhala:
      'අතිශය ගැඹුරු ආලෝක උරාගැනීමක් සහ රාජකීය ත්‍රිමාණ පෙනුමක් ලබාදෙන ඝන වෙල්වට් රෙදිපිළියකි. මෙහිදී කෙඳි පිහිටි දිශාව (Nap Direction) නිවැරදිව හඳුනාගැනීම අත්‍යවශ්‍ය වේ.',
    properties: {
      gsm: 380,
      gsmCategory: 'Heavyweight',
      gsmCategorySinhala: 'ඝන බර (Heavyweight 380 GSM)',
      sheen: 45,
      sheenDescription: 'Light-Absorbing Deep Optical Pile Lustre',
      sheenDescriptionSinhala: 'ආලෝකය උරාගන්නා ගැඹුරු ත්‍රිමාණ වෙල්වට් දීප්තිය (45%)',
      stiffness: 5.2,
      stiffnessDescription: 'Sculpted Dramatic Weight (5.2 / 10)',
      stiffnessDescriptionSinhala: 'ගැඹුරු හැඩයක් දරන ශක්තිමත් බර (5.2 / 10)',
      drapeFall: 'Rich, dramatic sculptural folds with high volume retention',
      drapeFallSinhala: 'ස්ථිර හැඩයක් සහ ඝනකමක් සහිත ආකර්ෂණීය රාජකීය රැළි',
      breathability: 'Moderate (Warm, insulating pile layer)',
      breathabilitySinhala: 'මධ්‍යස්ථ (ශීතලට ඔරොත්තු දෙන උණුසුම් කෙඳි තට්ටුව)',
      elasticityAndBias: 'Low stretch on grain; minor give on true bias; stable woven backing',
      elasticityAndBiasSinhala: 'සාමාන්‍ය දිශාවට ඇදීමක් නැත; Bias දිශාවට සුළු නම්‍යශීලී බවක් ඇත',
      composition: 'Silk/Rayon Pile over Premium Cotton Foundation Ground',
      compositionSinhala: 'සිල්ක්/රේයොන් කෙඳි තට්ටුව සහ 100% කපු මූලික වියමන',
    },
    matchingDesigns: [
      {
        title: 'Structured Tuxedos & Hourglass Blazers',
        titleSinhala: 'රාජකීය ටක්සීඩෝ සහ අලංකාර බ්ලේසර් කබා',
        silhouette: 'Sculptured Architectural Tailoring',
        description: 'Imparts unparalleled luxury to peak lapels, double-breasted closures, and shoulder contours.',
        descriptionSinhala: 'කබා වල උරහිස්, කොලර සහ බොත්තම් දාර වලට අතිවිශිෂ්ට සුඛෝපභෝගී බවක් එක් කරයි.',
        patternTip: 'Ensure ALL pattern pieces are cut in the SAME nap direction (nap running UP for richest black/bordeaux depth).',
        patternTipSinhala: 'සියලුම පතරොම් කොටස් එකම Nap දිශාවට කපන්න (වඩාත් ගැඹුරු පැහැය සඳහා Nap එක ඉහළට තබන්න).',
      },
      {
        title: 'Couture Boned Corsets & Victorian Bustiers',
        titleSinhala: 'කෝචර් බෝන්ඩ් කෝර්සෙට් සහ වික්ටෝරියානු බස්ටියර්',
        silhouette: 'Hourglass Waist Suppression',
        description: 'Smooth plush exterior conceals rigid internal steel boning and waist stays cleanly.',
        descriptionSinhala: 'කෝර්සෙට් වල අභ්‍යන්තර වානේ කූරු සහ ලයිනින් ඉතා අලංකාරව පිටතට නොපෙනෙන සේ ආවරණය කරයි.',
        patternTip: 'Underline with heavy cotton coutil to prevent mechanical stretch under tight lacing.',
        patternTipSinhala: 'තදින් ලේස් ගැටගැසීමේදී ඇදීම වැළැක්වීමට Cotton Coutil රෙද්දෙන් Underline කරන්න.',
      },
      {
        title: 'Royal Ceremonial Capes & Winter Opera Coats',
        titleSinhala: 'රාජකීය උත්සව කේප් සහ ශීත සෘතු කෝචර් කබා',
        silhouette: 'Volumetric Regal Flow',
        description: 'Heavy GSM yields stunning swinging motion while holding deep sweeping fold geometry.',
        descriptionSinhala: 'ඉහළ GSM බර නිසා ඇවිදින විට ස්ථිර හැඩයක් සහිතව රාජකීය රැළි මතුකරයි.',
        patternTip: 'Calculate generous flare radius with reinforced canvas interfacing along hem circumference.',
        patternTipSinhala: 'වාටිය වටා කැනවස් යොදා ශක්තිමත් කරමින් විහිදෙන රැළි අරය ගණනය කරන්න.',
      },
    ],
    unsuitableDesigns: [
      {
        title: 'Fine Shirred Ruffles & Lightweight Draping',
        titleSinhala: 'සිහින් රැලි සහිත සැහැල්ලු ඇඳුම්',
        reason: 'Too heavy and bulky; seam intersections become excessively thick and stiff.',
        reasonSinhala: 'අධික ඝනකම නිසා මැහුම් හන්දියන් අනවශ්‍ය ලෙස තද සහ මහත වේ.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'CRITICAL: Must determine pile nap direction. Brush hand along fabric: smooth feel = nap down; rough resistance = nap up.',
      grainlineRuleSinhala: 'අනිවාර්ය නීතිය: කෙඳි පිහිටි දිශාව (Nap) හඳුනාගන්න. අතින් පිරිමැද බැලූ විට සිනිඳු නම් Nap Down; විරුද්ධ පැත්ත Nap Up වේ.',
      needleSize: 'Universal 90/14 or Jeans 100/16 with Teflon / Walking Foot',
      needleSizeSinhala: 'Universal 90/14 හෝ Jeans 100/16 ඉඳිකටුව; ටෙෆ්ලෝන් හෝ වෝකින් ෆුට් භාවිත කරන්න',
      threadSpec: '#50 Core-Spun Polyester Thread (Gutermann Mara 70/100)',
      seamFinishes: 'Hong Kong Bias Binding or Rayon Seam Binding; never press seams flat without needle board',
      seamFinishesSinhala: 'Hong Kong Bias බයින්ඩින්ග්; Needle Board එකක් නොමැතිව කිසිවිටෙකත් මැහුම් තද කර මැද නොදමන්න',
      pressingHeat: 'NEVER press directly with an iron on face! Use a Velvet Needle Board or steam from wrong side while suspending.',
      pressingHeatSinhala: 'ඉදිරිපස කෙලින්ම ඉස්ත්‍රික්කයෙන් තද නොකරන්න! වෙල්වට් ඉඳිකටු ලෑල්ලක් (Needle Board) හෝ පිටුපසින් ස්ටීම් පමණක් යොදන්න.',
      shrinkageCare: 'Professional dry cleaning only; brush with soft velvet pile brush to remove surface lint.',
      shrinkageCareSinhala: 'වෘත්තීය ඩ්‍රයි ක්ලීන් පමණි; මෘදු බ්‍රෂ් එකකින් මතුපිට දූවිලි පිරිසිදු කරන්න.',
    },
    weaveConstruction: {
      weaveType: 'Double Cloth Cut Warp-Pile Weave',
      weaveTypeSinhala: 'ඩබල් ක්ලෝත් කට් වෝප්-පයිල් වියමන (රෙදි දෙකක් එකවර වියමින් මැදින් කපන ක්‍රමය)',
      yarnDetails: 'Two ground fabrics woven face-to-face connected by pile warp threads, sheared in half by a reciprocating blade.',
      yarnDetailsSinhala: 'රෙදි තට්ටු දෙකක් එකවර වියමින් නූල් වලින් සම්බන්ධ කර තලය මගින් දෙකට කපා කෙඳි නිර්මාණය කරයි.',
      warpWeftDensity: 'Ground Density: 65 threads/cm • Pile Density: 120,000 tufts/m²',
      textureFeel: 'Sensual, plush, velvety cushion with directional resistance',
      textureFeelSinhala: 'අතිශය මෘදු, සුවපහසු වෙල්වට් කෙඳි ස්පර්ශය',
      microscopicStructure: 'Dense forest of vertical sheared filament tufts trapping microscopic air pockets to absorb light.',
      microscopicStructureSinhala: 'සිරස් අතට කපන ලද කෙඳි දහස් ගණනක් මගින් ආලෝකය උරාගනිමින් ගැඹුරු කළු/රතු පැහැය මතු කරයි.',
    },
    cssModule: 'Module 02 (Fabric Nap Engineering) & Module 12 (Haute Couture Corsetry & Velvet Tailoring)',
    colors: [
      { name: 'Bordeaux Red', hex: '#540d18', specular: '#b83b4f' },
      { name: 'Midnight Navy', hex: '#111827', specular: '#4f6b9c' },
      { name: 'Burnished Gold', hex: '#a87a2c', specular: '#f0d28b' },
      { name: 'Emerald Forest', hex: '#0f3829', specular: '#4ca37d' },
    ],
  },
  {
    id: 'metallic-brocade',
    name: 'Italian Metallic Brocade',
    nameSinhala: 'ඉතාලි මෙටලික් බ්‍රෝකේඩ් (Architectural Jacquard)',
    category: 'Architectural Jacquard',
    categorySinhala: 'වාස්තු විද්‍යාත්මක ජැකාඩ් වියමන',
    overview:
      'Elaborately patterned jacquard fabric woven with supplementary lurex gold metallic filaments. Endowed with permanent memory, crisp body, and red-carpet dramatic volume.',
    overviewSinhala:
      'රන්වන් මෙටලික් ලුරෙක්ස් නූල් මගින් වියන ලද ත්‍රිමාණ මෝස්තර සහිත ජැකාඩ් රෙදිපිළියකි. ඇඳුමේ හැඩය කිසිලෙසකත් නොබිඳී ස්ථිරව තබාගැනීමේ ඉහළ හැකියාවක් ඇත.',
    properties: {
      gsm: 440,
      gsmCategory: 'Ultra Heavy',
      gsmCategorySinhala: 'අධික ඝන බර (Ultra Heavy 440 GSM)',
      sheen: 85,
      sheenDescription: 'Brilliant Metallic Lurex Shimmer & Golden Relief',
      sheenDescriptionSinhala: 'රන්වන් ලුරෙක්ස් නූල් වල ත්‍රිමාණ දීප්තිය (85%)',
      stiffness: 7.8,
      stiffnessDescription: 'Architectural Standing Memory (7.8 / 10)',
      stiffnessDescriptionSinhala: 'වාස්තු විද්‍යාත්මක ස්ථිර හැඩය (7.8 / 10)',
      drapeFall: 'Crisp standing architectural folds with structural rigidity',
      drapeFallSinhala: 'ශරීරයෙන් ඈත්ව පිහිටන ස්ථිර ත්‍රිමාණ රැළි සහ වාස්තු විද්‍යාත්මක හැඩතල',
      breathability: 'Low to Moderate (Tightly locked decorative filigree)',
      breathabilitySinhala: 'අඩු/මධ්‍යස්ථ (තදින් වියන ලද මෝස්තර සහිත නූල් තට්ටුව)',
      elasticityAndBias: 'Zero stretch; completely stable in warp, weft, and bias',
      elasticityAndBiasSinhala: 'ඇදීමක් නොමැත; ඕනෑම දිශාවකට අතිශය ස්ථාවරය',
      composition: '55% Silk, 30% Metallic Lurex, 15% Polyester Base',
      compositionSinhala: '55% සිල්ක්, 30% මෙටලික් ලුරෙක්ස්, 15% පොලියෙස්ටර්',
    },
    matchingDesigns: [
      {
        title: 'Architectural Peplum Jackets & Statement Blazers',
        titleSinhala: 'වාස්තු විද්‍යාත්මක පෙප්ලම් ජැකට් සහ බ්ලේසර්',
        silhouette: 'Structured Hourglass Flare',
        description: 'Holds a crisp flared waist peplum without dropping or softening over time.',
        descriptionSinhala: 'ඉණ වටා ඇති පෙප්ලම් රැළි කිසිදා එල්ලා නොවැටී ස්ථිරව රඳවා තබාගනී.',
        patternTip: 'Reinforce waist seams with stay-tape; interface facings with crisp woven hair-canvas.',
        patternTipSinhala: 'ඉණ මැහුම Stay-tape මගින් ශක්තිමත් කර කොලර සඳහා වියන ලද හෙයාර්-කැනවස් යොදන්න.',
      },
      {
        title: 'Ceremonial Volumetric Ballgowns & Gala Skirts',
        titleSinhala: 'උත්සව රාජකීය බෝල්ගවුන් සහ නවීන සායවල්',
        silhouette: 'Volumetric Standing Bell',
        description: 'Commands the room with deep architectural box pleats and regal presence.',
        descriptionSinhala: 'ගැඹුරු බොක්ස් ප්ලීට්ස් (Box Pleats) මගින් රජවරුන්ගේ මාලිගා ඇඳුම් වැනි රාජකීය පෙනුමක් ලබාදේ.',
        patternTip: 'Use deep 8cm inverted box pleat calculations with crinoline horsehair braid inside hem.',
        patternTipSinhala: 'සෙන්ටිමීටර 8 ගැඹුරු Inverted Box Pleat යොදා වාටිය තුළට Horsehair Braid එකතු කරන්න.',
      },
      {
        title: 'Avant-Garde Structured Mini-Dresses & Capes',
        titleSinhala: 'නවීන ඇවන්ගාඩ් ත්‍රිමාණ මිනි-ගවුම් සහ කේප්',
        silhouette: 'Geometric Sculpture',
        description: 'Enables high-fashion designers to realize bold angular runway concepts.',
        descriptionSinhala: 'ජාත්‍යන්තර විලාසිතා නිර්මාණකරුවන්ට නිර්මාණශීලී ජ්‍යාමිතික හැඩතල සැබෑ කිරීමට ඉඩදේ.',
        patternTip: 'Line entire garment with smooth silk habotai to protect skin from abrasive metallic underside threads.',
        patternTipSinhala: 'මෙටලික් නූල් සමේ ගැටීම වැළැක්වීමට ඇඳුම සම්පූර්ණයෙන්ම සිනිඳු Silk Habotai වලින් ලයිනින් කරන්න.',
      },
    ],
    unsuitableDesigns: [
      {
        title: 'Fluid Cowl Necklines & Bias-Cut Slips',
        titleSinhala: 'තරංග රැළි සහිත කවුල් නෙක්ලයින් සහ ස්ලිප් ගවුම්',
        reason: 'Too rigid; brocade will stand stiffly rather than cascading softly against the body.',
        reasonSinhala: 'රෙදිපිළිය අනවශ්‍ය ලෙස තද බැවින් ශරීරය මත මෘදු ලෙස එල්ලා වැටෙන්නේ නැත.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'Motif alignment is paramount! Center large medallion motifs symmetrically down center front and back.',
      grainlineRuleSinhala: 'මෝස්තර සමමිතිකව පිහිටුවීම අනිවාර්යයි! ඉදිරිපස සහ පසුපස මැදට ලොකු මල් මෝස්තර සමානව තබන්න.',
      needleSize: 'Topstitch 90/14 or Sharp/Jeans 90/14 (metallic threads dull needle tips quickly)',
      needleSizeSinhala: 'Topstitch 90/14 හෝ Sharp 90/14 (මෙටලික් නූල් නිසා ඉඳිකටු ඉක්මනින් මොට විය හැක)',
      threadSpec: '#50 Premium Poly-Wrapped Core Thread (Gutermann Sew-All)',
      seamFinishes: 'Fully enclosed lining or Hong Kong binding; raw cut edges fray easily and scratch skin',
      seamFinishesSinhala: 'සම්පූර්ණ ලයිනින් කිරීම හෝ Hong Kong Bias Binding; කැපූ දාර සම සීරීමට ඉඩ ඇති බැවින් සම්පූර්ණයෙන්ම ආවරණය කරන්න',
      pressingHeat: 'Medium heat ONLY with damp press cloth from REVERSE side; never touch iron to metallic face directly',
      pressingHeatSinhala: 'පිටුපසින් තෙත රෙද්දක් තබා මධ්‍යස්ථ උෂ්ණත්වයෙන් පමණක් මදින්න; ඉස්ත්‍රික්කය කෙලින්ම ඉදිරිපස නොතබන්න',
      shrinkageCare: 'Strictly dry clean; do not wring or fold sharply to avoid permanent metallic yarn creases.',
      shrinkageCareSinhala: 'ඩ්‍රයි ක්ලීන් පමණි; මෙටලික් නූල් කැඩී යාම වැළැක්වීමට තදින් නමන්න හෝ මිරිකන්න එපා.',
    },
    weaveConstruction: {
      weaveType: 'Supplementary Weft Jacquard (Broché Weave)',
      weaveTypeSinhala: 'සප්ලිමෙන්ටරි වෙෆ්ට් ජැකාඩ් වියමන (රන්වන් නූල් වෙනම මතුපිට මෝස්තරයට වියන ක්‍රමය)',
      yarnDetails: 'Core warp threads interlace with ground weft, while floating metallic gold lurex wefts weave the raised relief motif.',
      yarnDetailsSinhala: 'මූලික නූල් සමග රන්වන් ලුරෙක්ස් නූල් එකතුවී මතුපිටින් එසවුණු ත්‍රිමාණ මෝස්තර රටා නිර්මාණය කරයි.',
      warpWeftDensity: 'Warp: 120 threads/cm • Supplementary Weft: 85 picks/cm',
      textureFeel: 'Substantial, textured, embossed floral/geometric relief with dry metallic grip',
      textureFeelSinhala: 'ශක්තිමත්, එසවුණු ත්‍රිමාණ මෝස්තර සහිත වියලි ලෝහමය ස්පර්ශය',
      microscopicStructure: 'Metallic foil wrapped around synthetic core yarns, locked into position by tight ground weave binders.',
      microscopicStructureSinhala: 'කෝර් නූල් වටා එතූ ලෝහමය පටි තදින් වියන ලද නූල් මගින් අගුළු ලා ඇත.',
    },
    cssModule: 'Module 08 (Advanced Outerwear Tailoring) & Module 10 (Ceremonial Gala Construction)',
    colors: [
      { name: 'Gilded Filigree', hex: '#c99a45', specular: '#fff2ce' },
      { name: 'Crimson & Gold', hex: '#7a1926', specular: '#e5aa65' },
      { name: 'Obsidian Brocade', hex: '#1c1917', specular: '#cca862' },
      { name: 'Royal Emerald', hex: '#133926', specular: '#70b991' },
    ],
  },
  {
    id: 'raw-linen',
    name: 'Pure Handwoven Flax Linen',
    nameSinhala: 'අත්යන්ත්‍ර ස්වභාවික ලිනන් (Artisanal Flax Linen)',
    category: 'Artisanal Natural',
    categorySinhala: 'ස්වභාවික නිවර්තන ලිනන්',
    overview:
      'Eco-conscious, highly breathable natural flax textile endowed with organic slub textures, crisp tactile drape, and characteristic living creases. Essential for tropical luxury brands.',
    overviewSinhala:
      'ස්වභාවික හණ කෙඳි (Flax) වලින් වියන ලද පරිසර හිතකාමී, ඉහළ වාතාශ්‍රයක් සහිත රෙදිපිළියකි. ශ්‍රී ලංකාවේ නිවර්තන දේශගුණයට සහ සුඛෝපභෝගී රිසෝර්ට් විලාසිතා සඳහා අත්‍යවශ්‍ය වේ.',
    properties: {
      gsm: 210,
      gsmCategory: 'Medium Weight',
      gsmCategorySinhala: 'මධ්‍යස්ථ බර (Medium Weight 210 GSM)',
      sheen: 15,
      sheenDescription: 'Natural Organic Matte with Artisanal Texture',
      sheenDescriptionSinhala: 'ස්වභාවික මැට් පෙනුම සහ අත්යන්ත්‍ර ගුණාංගය (15%)',
      stiffness: 4.8,
      stiffnessDescription: 'Crisp Organic Body with Softening Memory (4.8 / 10)',
      stiffnessDescriptionSinhala: 'පැළඳීමේදී මෘදු වන ස්වභාවික ශක්තිමත් බව (4.8 / 10)',
      drapeFall: 'Crisp organic drape with distinctive natural crease memory',
      drapeFallSinhala: 'නැවුම්, සුවපහසු සහ ස්වභාවික රැළි හැඩතල',
      breathability: 'Maximum Air Permeability & Moisture Absorption (Wicking)',
      breathabilitySinhala: 'උපරිම වාතාශ්‍රය සහ දහඩිය උරාගැනීමේ හැකියාව',
      elasticityAndBias: 'Zero mechanical stretch; modest diagonal bias give; stabilizes after steam pressing',
      elasticityAndBiasSinhala: 'ඇදීමක් නැත; ස්ටීම් කිරීමෙන් පසු නියමිත හැඩයේ ස්ථාවර වේ',
      composition: '100% Long-Staple European Flax Linen Yarn',
      compositionSinhala: '100% දිගු කෙඳි සහිත යුරෝපීය හණ කෙඳි (Flax)',
    },
    matchingDesigns: [
      {
        title: 'Tropical Unstructured Blazers & Safari Jackets',
        titleSinhala: 'නිවර්තන සැහැල්ලු බ්ලේසර් සහ සෆාරි ජැකට්',
        silhouette: 'Relaxed Tailored Luxury',
        description: 'Offers sophisticated gentleman or resort elegance that breathes freely in Colombo humidity.',
        descriptionSinhala: 'ලංකාවේ උණුසුම් කාලගුණයට ඉතා ගැලපෙන සැහැල්ලු සහ ගෞරවනීය පෙනුමක් ලබාදේ.',
        patternTip: 'Use half-canvas or unlined internal construction with French taped seams for maximum ventilation.',
        patternTipSinhala: 'උපරිම වාතාශ්‍රය සඳහා ලයිනින් නොමැතිව Half-canvas ක්‍රමයට මැහුම් පටි (Taped Seams) යොදන්න.',
      },
      {
        title: 'Modern Resortwear Maxi Dresses & Jumpsuits',
        titleSinhala: 'සුඛෝපභෝගී රිසෝර්ට් මැක්සි ගවුම් සහ ජම්ප්සූට්',
        silhouette: 'Effortless Flared Ease',
        description: 'Effortlessly combines high fashion aesthetics with barefoot luxury beachside ease.',
        descriptionSinhala: 'විලාසිතාමය පෙනුම සහ උපරිම නිදහස් සුවපහසුව එකට මුසු වූ මෝස්තර සඳහා උචිතය.',
        patternTip: 'Incorporate 4-6cm wearing ease at bust and hips to accommodate natural fiber drape.',
        patternTipSinhala: 'පපුව සහ උකුල ප්‍රදේශයට සෙන්ටිමීටර 4-6 ක Wearing Ease එකක් එකතු කරන්න.',
      },
      {
        title: 'Contemporary Artisanal Sarees & Wrap Tunic Ensembles',
        titleSinhala: 'නූතන අත්යන්ත්‍ර ලිනන් සාරි සහ ටියුනික් කට්ටල',
        silhouette: 'Sculptured Draped Pleats',
        description: 'Holds crisp, neat pleats across the shoulder pallu while exuding modern Sri Lankan identity.',
        descriptionSinhala: 'සාරියේ පොටේ ප්ලීට්ස් ඉතා තදින් සහ පැහැදිලිව රඳවා තබාගන්නා නූතන ලාංකීය අනන්‍යතාවයකි.',
        patternTip: 'Preserve artisanal selvage as the finished outer border to celebrate raw handcrafted heritage.',
        patternTipSinhala: 'අත්යන්ත්‍ර Selvage වාටිය සාරියේ කෙළවර ලෙස එලෙසම තබාගැනීමෙන් වටිනාකම වැඩි වේ.',
      },
    ],
    unsuitableDesigns: [
      {
        title: 'Tight Skin-Tight Bodycon Dresses',
        titleSinhala: 'තද බොඩිකොන් ඇඳුම්',
        reason: 'Lacks elastane; will bag out at elbows/knees and restrict body mobility.',
        reasonSinhala: 'ඉලාස්ටේන් නොමැති බැවින් ශරීරයට තද ඇඳුම් වල දණහිස් සහ වැලමිට ප්‍රදේශ ඇදී විකෘති විය හැක.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'ALWAYS pre-wash and steam-press before cutting! Flax shrinks 6-8% in warp length on first wet cycle.',
      grainlineRuleSinhala: 'කැපීමට පෙර අනිවාර්යයෙන්ම සෝදා ස්ටීම් කර මදින්න! මුල් සේදීමේදී දිග අතට 6-8% ක් ඇකිලේ.',
      needleSize: 'Universal 80/12 or Sharp 80/12 needle',
      needleSizeSinhala: 'Universal 80/12 හෝ Sharp 80/12 ඉඳිකටුව භාවිත කරන්න',
      threadSpec: '#50 100% Mercerized Cotton Thread or Polyester-Cotton Core',
      seamFinishes: 'Flat-felled seams (කමිස මැහුම්) or bound seams; raw edges fray moderately',
      seamFinishesSinhala: 'Flat-felled seams (කමිස වල යොදන ශක්තිමත් මැහුම්) හෝ බයින්ඩින්ග් මැහුම්',
      pressingHeat: 'High heat (Linen setting 200°C) with generous steam when slightly damp for crisp razor-sharp creases',
      pressingHeatSinhala: 'ඉහළ උෂ්ණත්වය (ලිනන් සෙටින්ග් 200°C) සහ තෙතමනය සහිතව ස්ටීම් කර මැදීමෙන් තියුණු වාටි ලැබේ',
      shrinkageCare: 'Machine wash gentle cold or hand soak; line dry in shade. Avoid tumble dryers to prevent brittle fibers.',
      shrinkageCareSinhala: 'සීතල ජලයෙන් සෝදා සෙවනේ වියලන්න. කෙඳි කැඩීයාම වැළැක්වීමට ටම්බල් ඩ්‍රයර් භාවිත නොකරන්න.',
    },
    weaveConstruction: {
      weaveType: 'Plain Weave (Tabby Weave with Uneven Flax Slubs)',
      weaveTypeSinhala: 'ප්ලේන් වියමන (Plain Weave - එකක් යටින් එකක් උඩින් ස්වභාවික ගැට සහිත වියමන)',
      yarnDetails: 'Spun from natural bast fibers harvested from flax stems; irregular slub diameter gives organic textural richness.',
      yarnDetailsSinhala: 'හණ ගසේ කඳෙන් ලබාගන්නා ස්වභාවික කෙඳි; නූල් වල ඇති ස්වභාවික ඝනකම් ගැට මගින් අලංකාර රටාවක් මවයි.',
      warpWeftDensity: 'Warp: 28 threads/cm • Weft: 24 threads/cm (Balanced Plain Weave)',
      textureFeel: 'Cool, crisp, tactile hand initially; softens luxuriously with each successive wash',
      textureFeelSinhala: 'පළමුව තරමක් වියලි හා තද ස්පර්ශයක් ඇත; සේදීමත් සමග ක්‍රමයෙන් අතිශය මෘදු වේ',
      microscopicStructure: 'Cellulose polygonal fiber bundles with natural nodes and cross-markings that wick moisture instantly.',
      microscopicStructureSinhala: 'බහුඅස්‍ර සෙලියුලෝස් කෙඳි ක්ෂණිකව තෙතමනය උරාගෙන වාතයට මුදාහරිමින් සිසිලස ලබාදේ.',
    },
    cssModule: 'Module 04 (Tropical Climate Textiles) & Module 05 (Casual Luxury Pattern Engineering)',
    colors: [
      { name: 'Oatmeal Natural', hex: '#cfc4b2', specular: '#ffffff' },
      { name: 'Ceylon Terracotta', hex: '#a65437', specular: '#df9277' },
      { name: 'Olive Slub', hex: '#4d5238', specular: '#94997c' },
      { name: 'Bleached Ivory', hex: '#f0ece1', specular: '#ffffff' },
    ],
  },
  {
    id: 'silk-chiffon',
    name: 'Pure Silk Chiffon & Georgette',
    nameSinhala: 'ස්වභාවික සිල්ක් ෂිෆොන් සහ ජෝර්ජට් (Pure Silk Chiffon)',
    category: 'Sheer Luxury Float',
    categorySinhala: 'විනිවිද පෙනෙන කෝචර් සිල්ක්',
    overview:
      'Ultra-featherweight transparent silk fabric with a delicate crepe hand, whispering lightness, and ethereal floating movement. Mastered for romantic draping and multi-tier volume.',
    overviewSinhala:
      'ඉතා සැහැල්ලු, විනිවිද පෙනෙන, මෘදු ලෙස සුළඟේ පාවෙන සිල්ක් රෙදිපිළියකි. සියුම් ක්‍රේප් ස්පර්ශයකින් යුක්ත වන අතර මංගල ඇඳුම් සහ කෝචර් ගවුම් වල තට්ටු (Layers) නිර්මාණයට වඩාත්ම යෝග්‍ය වේ.',
    properties: {
      gsm: 48,
      gsmCategory: 'Lightweight',
      gsmCategorySinhala: 'අතිශය සැහැල්ලු බර (Featherweight 48 GSM)',
      sheen: 35,
      sheenDescription: 'Delicate Sheer Glow & Ethereal Translucency',
      sheenDescriptionSinhala: 'සියුම් විනිවිද පෙනෙන මෘදු දීප්තිය (35%)',
      stiffness: 1.2,
      stiffnessDescription: 'Floating Featherweight Drape (1.2 / 10)',
      stiffnessDescriptionSinhala: 'සුළඟේ පාවෙන අතිශය සැහැල්ලු හැසිරීම (1.2 / 10)',
      drapeFall: 'Whispering floating folds that drift gently with the slightest air current',
      drapeFallSinhala: 'සුළු සුළඟකටත් පාවෙන අතිශය සියුම් දියරමය තරංග රැළි',
      breathability: 'Extreme (Porous sheer mesh weave)',
      breathabilitySinhala: 'ඉතා ඉහළ (විනිවිද පෙනෙන දැල් ආකාර වියමන)',
      elasticityAndBias: 'Dynamic bias stretch of 35-40%; grainline requires tissue paper stabilization',
      elasticityAndBiasSinhala: 'Bias දිශාවට 35-40% ක් ඇදේ; කැපීමේදී ටිෂූ කඩදාසි යෙදීම අනිවාර්යයි',
      composition: '100% High-Twist Crepe Filament Mulberry Silk',
      compositionSinhala: '100% ඉහළ ආතතියෙන් ඇඹරූ මල්බෙරි සිල්ක් නූල්',
    },
    matchingDesigns: [
      {
        title: '360° Full Circle Skirts & Tiered Gowns',
        titleSinhala: 'අංශක 360 ෆුල් සර්කල් සායවල් සහ තට්ටු ගවුම්',
        silhouette: 'Ethereal Cloud Float',
        description: 'Creates breathtaking cloud-like volume without weighing down the wearer.',
        descriptionSinhala: 'ඇඳුමේ බරක් නොදැනෙන අයුරින් වළාකුළක් මෙන් පාවෙන volumetric පෙනුමක් ලබාදේ.',
        patternTip: 'Use full circle formula (R = Waist / 6.28); hang hem for 48 hours to balance bias stretch before leveling.',
        patternTipSinhala: 'අරය R = ඉණ / 6.28 සූත්‍රයෙන් ගණනය කරන්න; වාටිය කැපීමට පෙර පැය 48 ක් එල්ලා තබන්න.',
      },
      {
        title: 'Billowing Bishop Sleeves & Poet Blouses',
        titleSinhala: 'විශාල බිෂොප් අත් සහ කෝචර් බ්ලවුස්',
        silhouette: 'Romantic Volume Gather',
        description: 'Gathers into tight cuffs with spectacular romantic billow.',
        descriptionSinhala: 'මැණික් කටුව ළඟින් තද කෆ් එකකට එකතුවෙමින් අලංකාරව පිරුණු අත් නිර්මාණය කරයි.',
        patternTip: 'Double the standard sleeve bicep width for runway dramatic volume.',
        patternTipSinhala: 'නාට්‍යමය පිරුණු පෙනුම සඳහා සාමාන්‍ය අතේ පළල දෙගුණ කර පතරොම සකසන්න.',
      },
      {
        title: 'Floating Cowl Capes & Sheer Bridal Overlays',
        titleSinhala: 'මංගල ගවුම් වල විනිවිද පෙනෙන කේප් සහ වේල්ස්',
        silhouette: 'Translucent Ethereal Shroud',
        description: 'Adds multi-dimensional luxury over satin bases without concealing bodice details.',
        descriptionSinhala: 'යටින් ඇති සැටින් ඇඳුමේ විස්තර වසා නොදමමින් ත්‍රිමාණ අලංකාරයක් එක් කරයි.',
        patternTip: 'Finish all exterior perimeters with a 2mm micro baby-hem sewn with #120 silk filament thread.',
        patternTipSinhala: 'සියලු බාහිර දාර මි.මී. 2 ක් වූ අතිශය සියුම් Baby-hem මැහුමකින් නිම කරන්න.',
      },
    ],
    unsuitableDesigns: [
      {
        title: 'Tailored Trousers & Pencil Skirts',
        titleSinhala: 'කලිසම් සහ තද පැන්සල් සායවල්',
        reason: 'Too sheer and fragile; seam slippage occurs rapidly under mechanical stress.',
        reasonSinhala: 'විනිවිද පෙනෙන බැවින් සහ සියුම් බැවින් ශරීර පීඩනයට ඔරොත්තු නොදී මැහුම් ගැලවී යා හැක.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'Fabric shifts easily! Pin fabric between two sheets of tissue paper before rotary cutting.',
      grainlineRuleSinhala: 'රෙද්ද පහසුවෙන් ලිස්සා යයි! රොටරි කටරයෙන් කැපීමට පෙර ටිෂූ කඩදාසි දෙකක් අතර රෙද්ද රඳවන්න.',
      needleSize: 'Microtex 60/8 Sharp Needle (replace every 4 hours of sewing)',
      needleSizeSinhala: 'Microtex 60/8 අතිශය සිහින් ඉඳිකටුව (මැහුම් පැය 4 කට වරක් මාරු කරන්න)',
      threadSpec: '#120 or #100 Ultra-Fine Silk Thread (Gutermann Silk S303)',
      seamFinishes: 'Narrow 3mm French Seams (ප්‍රංශ මැහුම්) or Hand-Rolled Scarf Hem',
      seamFinishesSinhala: 'මි.මී. 3 පටු ප්‍රංශ මැහුම් හෝ අතින් රෝල් කරන ලද ස්කාෆ් වාටි',
      pressingHeat: 'Low heat with dry iron; water drops will produce permanent water rings on silk chiffon',
      pressingHeatSinhala: 'අඩු උෂ්ණත්වය සහ වියලි ඉස්ත්‍රික්කය; වතුර බින්දු වැටුණහොත් සිල්ක් මත සදාකාලික ලප ඇතිවේ',
      shrinkageCare: 'Professional dry cleaning; handle gently with clean dry hands to prevent snagging filaments.',
      shrinkageCareSinhala: 'වෘත්තීය ඩ්‍රයි ක්ලීන් පමණි; කෙඳි ඇදීම වැළැක්වීමට පිරිසිදු වියලි දෑතින් අල්ලන්න.',
    },
    weaveConstruction: {
      weaveType: 'Balanced Plain Crepe Weave (Alternating S and Z Twist Yarns)',
      weaveTypeSinhala: 'ප්ලේන් ක්‍රේප් වියමන (වම සහ දකුණ මාරුවෙන් මාරුවට තදින් ඇඹරූ S සහ Z නූල්)',
      yarnDetails: 'Crepe filament silk yarns given 2,000 to 3,000 twists per meter in alternating sequence, creating tiny crinkles upon degumming.',
      yarnDetailsSinhala: 'මීටරයකට වට 2,000-3,000 ක් ඇඹරූ සිල්ක් නූල් එකිනෙක ගැටගැසීමෙන් මයික්‍රෝ ක්‍රේප් රැළි නිර්මාණය වේ.',
      warpWeftDensity: 'Warp: 45 threads/cm • Weft: 40 threads/cm (Open Porous Grid)',
      textureFeel: 'Slightly pebbled, airy, whisper-soft with a dry tactile bounce',
      textureFeelSinhala: 'සියුම් කැට සහිත, පාවෙන, අතිශය සැහැල්ලු මෘදු ස්පර්ශය',
      microscopicStructure: 'Alternating torsion forces in opposing S/Z twisted threads buckle gently in both axes.',
      microscopicStructureSinhala: 'ප්‍රතිවිරුද්ධ දිශාවන්ට කරකවන ලද නූල් එකිනෙක ගැටීමෙන් ස්වභාවික තරංග ඇතිවේ.',
    },
    cssModule: 'Module 01 (Sheer Fabric Stabilization) & Module 06 (Full Circle Radii & Bias Engineering)',
    colors: [
      { name: 'Bridal Alabaster', hex: '#faf7f2', specular: '#ffffff' },
      { name: 'Blush Rose', hex: '#e8b4b8', specular: '#ffffff' },
      { name: 'Noir Chiffon', hex: '#1c1b1c', specular: '#737072' },
      { name: 'Dusty Lavender', hex: '#b4a7d6', specular: '#ffffff' },
    ],
  },
  {
    id: 'silk-duchesse',
    name: 'Architectural Silk Duchesse Satin',
    nameSinhala: 'රාජකීය ඩචස් සැටින් (Silk Duchesse Satin)',
    category: 'Structured Royal Silk',
    categorySinhala: 'රාජකීය ස්ථිර සිල්ක් සැටින්',
    overview:
      'Ultra-dense, heavyweight couture silk satin combining high pearlescent luster with firm architectural body. The indisputable global standard for royal bridal gowns and couture sculpting.',
    overviewSinhala:
      'අධික නූල් ඝනත්වයකින් යුත්, මුතු කැට බඳු මෘදු දීප්තියක් සහ ස්ථිර හැඩයක් දරන රාජකීය සිල්ක් රෙදිපිළියකි. රාජකීය මංගල ගවුම් සහ ජාත්‍යන්තර කෝචර් නිර්මාණ සඳහා ප්‍රමුඛතම තේරීමයි.',
    properties: {
      gsm: 280,
      gsmCategory: 'Heavyweight',
      gsmCategorySinhala: 'ඝන බර (Heavyweight 280 GSM)',
      sheen: 80,
      sheenDescription: 'Deep Pearlescent Luster with Zero Glare',
      sheenDescriptionSinhala: 'මුතු කැට බඳු ගැඹුරු රාජකීය දීප්තිය (80%)',
      stiffness: 6.5,
      stiffnessDescription: 'Sculptured Firm Support (6.5 / 10)',
      stiffnessDescriptionSinhala: 'ශක්තිමත් හැඩය රඳවන ස්ථිර බව (6.5 / 10)',
      drapeFall: 'Deep sculptural folds that stand away from the body majestically',
      drapeFallSinhala: 'ශරීරයෙන් ඈත්ව රාජකීය ලෙස පිහිටන ගැඹුරු ත්‍රිමාණ රැළි',
      breathability: 'Moderate (Tightly woven warp face)',
      breathabilitySinhala: 'මධ්‍යස්ථ (තදින් වියන ලද මතුපිට)',
      elasticityAndBias: 'Extremely stable; zero mechanical stretch; holds crisp bias shape firmly',
      elasticityAndBiasSinhala: 'අතිශය ස්ථාවරය; ඇදීමක් නැත; Bias කැපුමේදී පවා ස්ථිර හැඩය රඳවයි',
      composition: '100% High-Density Mulberry Silk',
      compositionSinhala: '100% ඉහළ ඝනත්ව මල්බෙරි සිල්ක්',
    },
    matchingDesigns: [
      {
        title: 'Royal Bridal Cathedral Gowns & Structured Bodices',
        titleSinhala: 'රාජකීය මංගල ගවුම් සහ හැඩය රඳවන බොඩිස්',
        silhouette: 'Architectural Fit-and-Flare',
        description: 'Creates breathtaking clean silhouettes with spotless smooth surface finish.',
        descriptionSinhala: 'කිසිදු රැළියක් හෝ ඇදීමක් නොපෙන්වන අතිශය පිරිසිදු රාජකීය නිමාවක් ලබාදේ.',
        patternTip: 'Use multiple vertical contour seams (Princess Seams) with boning anchored to waistline stays.',
        patternTipSinhala: 'ප්‍රින්සස් මැහුම් (Princess Seams) යොදා වානේ කූරු ඉණ පටියට අගුළු ලන්න.',
      },
      {
        title: 'Sculptural Peplum Jackets & Couture Ballgowns',
        titleSinhala: 'පෙප්ලම් ජැකට් සහ රාජකීය බෝල්ගවුන්',
        silhouette: 'Structured Hourglass Volume',
        description: 'Supports oversized origami folds, bow details, and dramatic flared hips.',
        descriptionSinhala: 'විශාල දුනු (Bows) සහ ඔරිගාමි හැඩතල කිසිදා කඩා නොවැටී රඳවා තබාගනී.',
        patternTip: 'Underline panels with silk organza to maintain crisp edge geometry without bulky interfacing.',
        patternTipSinhala: 'මහත නොවී තියුණු වාටි තබාගැනීමට Silk Organza රෙද්දෙන් Underline කරන්න.',
      },
    ],
    specialCharacteristics: {
      grainlineRule: 'Grainline must be squared accurately. Press folds carefully as creases are difficult to remove once pressed.',
      grainlineRuleSinhala: 'Grainline නිවැරදිව සමචතුරස්‍ර විය යුතුය. වැරදි ලෙස මැදීමෙන් වැටෙන රැළි ඉවත් කිරීම අපහසුය.',
      needleSize: 'Microtex 70/10 or Sharp 80/12 needle',
      needleSizeSinhala: 'Microtex 70/10 හෝ Sharp 80/12 ඉඳිකටුව',
      threadSpec: '#100 Silk Thread or Fine Core-Spun Polyester',
      seamFinishes: 'Hong Kong bias binding or clean-finish enclosed lining',
      seamFinishesSinhala: 'Hong Kong bias බයින්ඩින්ග් හෝ සම්පූර්ණ ලයිනින් ආවරණය',
      pressingHeat: 'Medium heat with silk press cloth; press open using wooden tailor’s clapper for crisp seamlines',
      pressingHeatSinhala: 'මධ්‍යස්ථ උෂ්ණත්වය; මැහුම් තියුණු කිරීමට Tailor’s Clapper ලී කොටය භාවිත කරන්න',
      shrinkageCare: 'Strictly dry clean; store hanging in breathable cotton garment bag.',
      shrinkageCareSinhala: 'ඩ්‍රයි ක්ලීන් පමණි; කපු ඇඳුම් බෑගයක එල්ලා තබන්න.',
    },
    weaveConstruction: {
      weaveType: 'Heavy Satin Weave (7/1 or 8/1 Filament System)',
      weaveTypeSinhala: 'අධි ඝනත්ව සැටින් වියමන (නූල් 7-8ක් උඩින් නූල් 1ක් යටින්)',
      yarnDetails: 'Extraordinary number of fine warp threads hiding the weft entirely to create a seamless pearlescent plane.',
      yarnDetailsSinhala: 'පසුපස නූල් සම්පූර්ණයෙන්ම සඟවන අධික ඉදිරිපස නූල් සංඛ්‍යාවක් මගින් මුතු කැට බඳු තලය මවයි.',
      warpWeftDensity: 'Warp: 240 threads/cm • Weft: 80 threads/cm',
      textureFeel: 'Substantial, smooth, crisp, and regal with rich tactile stiffness',
      textureFeelSinhala: 'ශක්තිමත්, සිනිඳු, රාජකීය ගෞරවනීය ස්පර්ශය',
      microscopicStructure: 'Extremely compacted continuous filaments producing uninterrupted specular reflection.',
      microscopicStructureSinhala: 'අතිශය තදින් අසුරන ලද අඛණ්ඩ සිල්ක් කෙඳි මගින් ඒකාකාරී ආලෝක පරාවර්තනයක් ලබාදේ.',
    },
    cssModule: 'Module 03 (Dart Tech & Sculpting) & Module 11 (Royal Bridal Pattern Engineering)',
    colors: [
      { name: 'Royal Ivory', hex: '#fdfbf7', specular: '#ffffff' },
      { name: 'Imperial Midnight', hex: '#0f172a', specular: '#64748b' },
      { name: 'Champagne Gold', hex: '#e2cfab', specular: '#ffffff' },
      { name: 'Scarlet Regal', hex: '#881337', specular: '#fda4af' },
    ],
  },
];

export const FabricDrapingStudio: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const [selectedFabric, setSelectedFabric] = useState<FabricDetailType>(LUXURY_FABRICS_CATALOG[0]);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'properties' | 'designs' | 'special' | 'weave'>('properties');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiCustomResult, setAiCustomResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showWeaveMicroscope, setShowWeaveMicroscope] = useState<boolean>(false);

  // Quick preset search tags for one-click discovery
  const QUICK_SEARCH_CHIPS = [
    { label: '👗 Evening Gown', query: 'evening gown bias cut' },
    { label: '🧥 Structured Blazer', query: 'structured blazer' },
    { label: '👑 Haute Corset', query: 'boned corset bustier' },
    { label: '🌴 Tropical Resort', query: 'tropical linen resort' },
    { label: '✨ Gilded Ballgown', query: 'metallic brocade ballgown' },
    { label: '🥻 Saree Drape', query: 'handwoven saree drape' },
  ];

  // Filter fabrics based on search query
  const filteredFabrics = useMemo(() => {
    if (!searchQuery.trim()) return LUXURY_FABRICS_CATALOG;
    const q = searchQuery.toLowerCase().trim();
    return LUXURY_FABRICS_CATALOG.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.nameSinhala.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.properties.gsmCategory.toLowerCase().includes(q) ||
        f.matchingDesigns.some(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.titleSinhala.toLowerCase().includes(q) ||
            d.description.toLowerCase().includes(q)
        ) ||
        f.weaveConstruction.weaveType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Handle AI Search / Analysis invocation
  const handleAiSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setIsAiAnalyzing(true);
    setAiError(null);
    try {
      const response = await fetch('/api/fabrics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fabricQuery: queryToSearch,
          language: isSinhalaMode ? 'si' : 'en',
        }),
      });
      if (!response.ok) {
        throw new Error('AI analysis service error');
      }
      const data = await response.json();
      if (data?.analysis) {
        setAiCustomResult(data.analysis);
      }
    } catch (err: any) {
      console.warn('AI Fabric Analyze error:', err);
      setAiError(isSinhalaMode ? 'AI සෙවුම සම්පූර්ණ කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.' : 'Could not complete AI search. Please try again.');
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const currentColor = selectedFabric.colors[selectedColorIndex] || selectedFabric.colors[0];

  return (
    <section id="fabrics" className="py-20 bg-[#0e0a0c] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Background radial luxury lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#540d18]/25 via-[#c99a45]/10 to-transparent blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#540d18]/40 border border-[#dfb56c]/30 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-[#dfb56c]" />
            <span>
              {isSinhalaMode
                ? 'මොඩියුල 01 • රෙදිපිළි විද්‍යාව සහ AI විලාසිතා බුද්ධිය'
                : 'Module 01 • Haute Couture Textile Science & AI Intelligence'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold tracking-tight text-[#f7f3eb] mb-4">
            {isSinhalaMode ? (
              <>
                සුඛෝපභෝගී රෙදිපිළි <span className="gold-gradient-text">විලාසිතා බුද්ධි වේදිකාව</span>
              </>
            ) : (
              <>
                Haute Couture <span className="gold-gradient-text">Fabric Intelligence &amp; AI Studio</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'විලාසිතා නිර්මාණකරුවෙකු ලෙස සාර්ථක වීමට රෙදිපිළි වල බර (GSM), නම්‍යශීලී බව, වියමන් ක්‍රමය සහ ඒවට ගැලපෙන නිවැරදි ඩිසයින් තේරීම අනිවාර්ය වේ. පහත AI සෙවුමෙන් ඕනෑම රෙදිපිළියක් හෝ විලාසිතා අවශ්‍යතාවයක් පරික්ෂා කරන්න.'
              : 'Master fabric physics (GSM, drape, sheen, weave architecture) and discover perfect garment silhouettes. Search below with AI or explore our curriculum textile library.'}
          </p>
        </div>

        {/* AI FABRIC SEARCH & CONSULTATION BAR */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-[#141011] p-3 sm:p-4 rounded-sm border border-[#c99a45]/40 shadow-2xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#dfb56c] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAiSearch(searchQuery);
                    }
                  }}
                  placeholder={
                    isSinhalaMode
                      ? 'රෙදිපිළිය, මෝස්තරය හෝ අවශ්‍යතාවය මෙහි සොයන්න (e.g. Red carpet gown, Linen blazer, Corset)...'
                      : 'Search fabrics, matching silhouettes, or ask AI (e.g., Bias-cut silk gown, velvet corsetry)...'
                  }
                  className="w-full pl-10 pr-9 py-2.5 bg-[#0a0708] border border-white/10 rounded-sm text-xs sm:text-sm text-[#f7f3eb] placeholder-[#7d7568] focus:border-[#dfb56c] outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setAiCustomResult(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d7568] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => handleAiSearch(searchQuery || selectedFabric.name)}
                disabled={isAiAnalyzing}
                className="px-5 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-md transition-all shrink-0 disabled:opacity-60 cursor-pointer"
              >
                {isAiAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isSinhalaMode ? 'AI විශ්ලේෂණය වේ...' : 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSinhalaMode ? 'AI මගින් සොයන්න' : 'Ask AI Textile Specialist'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Filter Prompts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-[#7d7568] mr-1">
                {isSinhalaMode ? 'ක්ෂණික AI සෙවුම්:' : 'Quick Ideas:'}
              </span>
              {QUICK_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSearchQuery(chip.query);
                    handleAiSearch(chip.query);
                  }}
                  className="px-2.5 py-1 text-[11px] rounded-sm bg-[#0c090a] hover:bg-[#1f1416] border border-white/10 hover:border-[#dfb56c]/40 text-[#d5cfc4] hover:text-[#dfb56c] transition-all cursor-pointer font-sinhala"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Custom Analysis Result Modal / Card */}
          {aiCustomResult && (
            <div className="mt-4 p-5 rounded-sm bg-gradient-to-br from-[#1c1214] via-[#140d0f] to-[#0a0708] border-2 border-[#dfb56c] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setAiCustomResult(null)}
                className="absolute top-3 right-3 text-xs text-[#a89f91] hover:text-white px-2 py-0.5 border border-white/10 rounded cursor-pointer"
              >
                ✕ Close
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] font-bold">
                  {isSinhalaMode ? 'AI විශේෂඥ නිර්දේශය හා විශ්ලේෂණය' : 'AI Textile Engineering Intelligence Dossier'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-lg font-editorial font-bold text-[#f7f3eb]">
                    {aiCustomResult.name}
                  </h4>
                  {aiCustomResult.nameSinhala && (
                    <span className="text-xs text-[#dfb56c] font-sinhala block">
                      {aiCustomResult.nameSinhala}
                    </span>
                  )}
                  <span className="text-[11px] text-[#a89f91] font-mono mt-1 block">
                    Category: {aiCustomResult.category || 'Couture Textile'}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-[#d5cfc4] font-sinhala leading-relaxed">
                    {isSinhalaMode && aiCustomResult.overviewSinhala
                      ? aiCustomResult.overviewSinhala
                      : aiCustomResult.overview}
                  </p>
                </div>
              </div>

              {/* AI Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-xs font-mono">
                <div className="p-2.5 bg-black/50 border border-white/10 rounded">
                  <span className="text-[10px] text-[#a89f91] block">GSM WEIGHT</span>
                  <span className="text-[#f7e2a9] font-bold">{aiCustomResult.properties?.gsm || 'Optimal Weight'}</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded">
                  <span className="text-[10px] text-[#a89f91] block">DRAPE BEHAVIOR</span>
                  <span className="text-[#f7e2a9] font-bold">{aiCustomResult.properties?.drape || 'Fluid / Memory'}</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded">
                  <span className="text-[10px] text-[#a89f91] block">SHEEN &amp; LUSTER</span>
                  <span className="text-[#f7e2a9] font-bold">{aiCustomResult.properties?.sheen || 'Lustrous'}</span>
                </div>
                <div className="p-2.5 bg-black/50 border border-white/10 rounded">
                  <span className="text-[10px] text-[#a89f91] block">BREATHABILITY</span>
                  <span className="text-[#f7e2a9] font-bold">{aiCustomResult.properties?.breathability || 'High'}</span>
                </div>
              </div>

              {/* AI Matching Designs */}
              {aiCustomResult.matchingDesigns && (
                <div className="mt-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#dfb56c] block mb-2 font-bold">
                    {isSinhalaMode ? 'මෙම රෙදිපිළිය සඳහා වඩාත්ම ගැලපෙන ඩිසයින්:' : 'Optimal Fashion Silhouettes:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {aiCustomResult.matchingDesigns.map((d: any, idx: number) => (
                      <div key={idx} className="p-3 bg-black/60 border border-[#dfb56c]/30 rounded text-xs space-y-1">
                        <span className="font-bold text-[#f7f3eb] block font-editorial">
                          {d.designTitle || d.title}
                        </span>
                        <p className="text-[11px] text-[#b8afa2] font-sinhala leading-relaxed">
                          {d.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Special Characteristics & Weave */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {aiCustomResult.specialCharacteristics && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
                    <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                      {isSinhalaMode ? 'විශේෂ මැහුම් හා සැලකිලිමත් විය යුතු කරුණු:' : 'Atelier Precautions & Needles:'}
                    </span>
                    <ul className="text-[11px] text-[#d5cfc4] space-y-1 list-disc list-inside font-sinhala">
                      {Array.isArray(aiCustomResult.specialCharacteristics) ? (
                        aiCustomResult.specialCharacteristics.map((trait: string, idx: number) => (
                          <li key={idx}>{trait}</li>
                        ))
                      ) : (
                        <li>{String(aiCustomResult.specialCharacteristics)}</li>
                      )}
                    </ul>
                  </div>
                )}

                {aiCustomResult.weaveConstruction && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded space-y-1">
                    <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                      {isSinhalaMode ? 'වියමන් ක්‍රමය හා සැකැස්ම (Weave Structure):' : 'Weave Architecture:'}
                    </span>
                    <span className="text-xs font-bold text-white block">
                      {aiCustomResult.weaveConstruction.weaveType}
                    </span>
                    <p className="text-[11px] text-[#b8afa2] font-sinhala">
                      {aiCustomResult.weaveConstruction.yarnDetails || aiCustomResult.weaveConstruction.grainlineRule}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {aiError && (
            <div className="mt-3 p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs rounded text-center">
              {aiError}
            </div>
          )}
        </div>

        {/* MAIN FABRIC INTELLIGENCE STUDIO INTERACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: COMPREHENSIVE 4-PILLAR DEEP DIVE DOSSIER */}
          <div className="lg:col-span-7 bg-[#141011] rounded-sm border border-[#c99a45]/30 p-5 sm:p-6 shadow-2xl space-y-6">
            {/* Header of Active Fabric */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                    {selectedFabric.properties.gsmCategory} • {selectedFabric.properties.gsm} GSM
                  </span>
                  <span className="text-[11px] font-mono text-[#a89f91]">
                    {selectedFabric.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-[#f7f3eb]">
                  {isSinhalaMode ? selectedFabric.nameSinhala : selectedFabric.name}
                </h3>
              </div>

              {/* Colorway Swatches */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#a89f91] hidden sm:inline">Colorways:</span>
                {selectedFabric.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative ${
                      selectedColorIndex === idx
                        ? 'border-[#dfb56c] scale-110 shadow-[0_0_10px_rgba(223,181,108,0.5)]'
                        : 'border-white/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColorIndex === idx && (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold drop-shadow">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Synopsis */}
            <div className="p-4 rounded bg-[#0a0708] border border-white/5 space-y-2">
              <p className="text-xs sm:text-sm text-[#d5cfc4] font-sinhala leading-relaxed">
                {isSinhalaMode ? selectedFabric.overviewSinhala : selectedFabric.overview}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#a89f91] font-mono pt-2 border-t border-white/5">
                <span>Active Swatch: <strong className="text-[#f7e2a9]">{currentColor.name}</strong></span>
                <span className="text-[#dfb56c]">{selectedFabric.cssModule}</span>
              </div>
            </div>

            {/* 4 PILLAR TABS (ගුණාංග • ඩිසයින් • විශේෂ ලක්ෂණ • සැකැස්ම) */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 cursor-pointer font-sinhala ${
                    activeTab === 'properties'
                      ? 'bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/40'
                      : 'text-[#a89f91] hover:text-white bg-[#0c090a] border border-white/10'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isSinhalaMode ? '1. රෙදිවල ගුණාංග (Properties)' : '1. Textile Properties'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('designs')}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 cursor-pointer font-sinhala ${
                    activeTab === 'designs'
                      ? 'bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/40'
                      : 'text-[#a89f91] hover:text-white bg-[#0c090a] border border-white/10'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isSinhalaMode ? '2. ගැලපෙන ඩිසයින් (Silhouettes)' : '2. Ideal Silhouettes'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('special')}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 cursor-pointer font-sinhala ${
                    activeTab === 'special'
                      ? 'bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/40'
                      : 'text-[#a89f91] hover:text-white bg-[#0c090a] border border-white/10'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{isSinhalaMode ? '3. විශේෂ ලක්ෂණ (Atelier Notes)' : '3. Special Characteristics'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('weave')}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all flex items-center gap-1.5 cursor-pointer font-sinhala ${
                    activeTab === 'weave'
                      ? 'bg-[#540d18] text-[#f7e2a9] font-bold border border-[#dfb56c]/40'
                      : 'text-[#a89f91] hover:text-white bg-[#0c090a] border border-white/10'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{isSinhalaMode ? '4. Fabric සැකැස්ම (Weave Architecture)' : '4. Weave Architecture'}</span>
                </button>
              </div>

              {/* TAB 1: FABRIC PROPERTIES & CHARACTERISTICS */}
              {activeTab === 'properties' && (
                <div className="pt-5 space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Weight / GSM */}
                    <div className="p-3.5 rounded bg-[#0a0708] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#a89f91] uppercase">WEIGHT / GSM</span>
                        <span className="text-[#dfb56c] font-bold">{selectedFabric.properties.gsm} GSM</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-[#dfb56c]"
                          style={{ width: `${Math.min(100, (selectedFabric.properties.gsm / 450) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#d5cfc4] font-sinhala block">
                        {isSinhalaMode ? selectedFabric.properties.gsmCategorySinhala : selectedFabric.properties.gsmCategory}
                      </span>
                    </div>

                    {/* Lustre & Sheen */}
                    <div className="p-3.5 rounded bg-[#0a0708] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#a89f91] uppercase">SHEEN / LUSTER</span>
                        <span className="text-[#dfb56c] font-bold">{selectedFabric.properties.sheen}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-300 to-amber-500"
                          style={{ width: `${selectedFabric.properties.sheen}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#d5cfc4] font-sinhala block">
                        {isSinhalaMode ? selectedFabric.properties.sheenDescriptionSinhala : selectedFabric.properties.sheenDescription}
                      </span>
                    </div>

                    {/* Drape & Stiffness Index */}
                    <div className="p-3.5 rounded bg-[#0a0708] border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#a89f91] uppercase">STIFFNESS / DRAPE</span>
                        <span className="text-[#dfb56c] font-bold">{selectedFabric.properties.stiffness} / 10</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 via-rose-500 to-amber-500"
                          style={{ width: `${selectedFabric.properties.stiffness * 10}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#d5cfc4] font-sinhala block">
                        {isSinhalaMode ? selectedFabric.properties.stiffnessDescriptionSinhala : selectedFabric.properties.stiffnessDescription}
                      </span>
                    </div>

                    {/* Composition */}
                    <div className="p-3.5 rounded bg-[#0a0708] border border-white/10 space-y-1.5">
                      <span className="text-[10px] text-[#a89f91] font-mono uppercase block">COMPOSITION &amp; FIBER</span>
                      <span className="text-xs font-bold text-[#f7e2a9] block">
                        {isSinhalaMode ? selectedFabric.properties.compositionSinhala : selectedFabric.properties.composition}
                      </span>
                      <span className="text-[11px] text-[#a89f91] font-sinhala block">
                        Certified Haute Couture Grade (Mastered at CSS Academy)
                      </span>
                    </div>
                  </div>

                  {/* Drape Fall and Bias Elasticity Full Width Card */}
                  <div className="p-4 rounded bg-[#100b0d] border border-[#dfb56c]/25 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#dfb56c] font-mono font-bold">
                      <Wind className="w-4 h-4" />
                      <span>{isSinhalaMode ? 'රෙදිපිළියේ රැළි හැසිරීම (Drape Fall Physics):' : 'Drape Behavior & Bias Mechanics:'}</span>
                    </div>
                    <p className="text-[#d5cfc4] font-sinhala leading-relaxed">
                      {isSinhalaMode ? selectedFabric.properties.drapeFallSinhala : selectedFabric.properties.drapeFall}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#a89f91]">
                      <span>{isSinhalaMode ? 'වාතාශ්‍රය සහ සුවපහසුව:' : 'Breathability:'}</span>
                      <strong className="text-white font-sinhala">
                        {isSinhalaMode ? selectedFabric.properties.breathabilitySinhala : selectedFabric.properties.breathability}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#a89f91]">
                      <span>{isSinhalaMode ? 'නම්‍යතාවය හා Bias හැසිරීම:' : 'Bias & Elasticity:'}</span>
                      <strong className="text-[#dfb56c] font-sinhala">
                        {isSinhalaMode ? selectedFabric.properties.elasticityAndBiasSinhala : selectedFabric.properties.elasticityAndBias}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MATCHING DESIGNS & SILHOUETTES */}
              {activeTab === 'designs' && (
                <div className="pt-5 space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#dfb56c] block font-bold">
                      {isSinhalaMode ? 'මෙම රෙදිපිළිය සඳහා විශේෂඥ මට්ටමින් ගැලපෙන ඩිසයින්:' : 'Optimal Fashion Silhouettes & Garments:'}
                    </span>

                    {selectedFabric.matchingDesigns.map((design, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-sm bg-[#0a0708] border border-white/10 hover:border-[#dfb56c]/40 transition-all space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-editorial font-bold text-sm text-[#f7f3eb]">
                            {isSinhalaMode ? design.titleSinhala : design.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1c1214] text-[#dfb56c] border border-[#dfb56c]/30">
                            {design.silhouette}
                          </span>
                        </div>

                        <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed">
                          {isSinhalaMode ? design.descriptionSinhala : design.description}
                        </p>

                        <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-[11px] text-[#dfb56c] font-sinhala">
                          <Compass className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#dfb56c]" />
                          <span>
                            <strong>{isSinhalaMode ? 'පතරොම් උපදෙස:' : 'Pattern Drafting Note:'}</strong>{' '}
                            {isSinhalaMode ? design.patternTipSinhala : design.patternTip}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Silhouettes to Avoid */}
                  {selectedFabric.unsuitableDesigns && selectedFabric.unsuitableDesigns.length > 0 && (
                    <div className="p-3.5 rounded bg-red-950/20 border border-red-500/30 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-red-300 font-bold font-mono">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        <span>{isSinhalaMode ? 'මෙම රෙදිපිළිය නොගැලපෙන විලාසිතා (Silhouettes to Avoid):' : 'Silhouettes to Avoid with this Fabric:'}</span>
                      </div>
                      {selectedFabric.unsuitableDesigns.map((un, idx) => (
                        <div key={idx} className="text-[11px] text-red-200/90 font-sinhala">
                          <strong>{isSinhalaMode ? un.titleSinhala : un.title}:</strong> {isSinhalaMode ? un.reasonSinhala : un.reason}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SPECIAL CHARACTERISTICS & ATELIER HANDLING */}
              {activeTab === 'special' && (
                <div className="pt-5 space-y-3.5 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Grainline & Cutting */}
                    <div className="p-3.5 bg-[#0a0708] border border-white/10 rounded space-y-1">
                      <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                        {isSinhalaMode ? 'කැපුම් දිශාව හා Grainline නීති:' : 'Grainline & Cutting Rules:'}
                      </span>
                      <p className="text-[11px] text-[#d5cfc4] font-sinhala leading-relaxed">
                        {isSinhalaMode ? selectedFabric.specialCharacteristics.grainlineRuleSinhala : selectedFabric.specialCharacteristics.grainlineRule}
                      </p>
                    </div>

                    {/* Needle & Thread Spec */}
                    <div className="p-3.5 bg-[#0a0708] border border-white/10 rounded space-y-1">
                      <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                        {isSinhalaMode ? 'මහන මැෂින් ඉඳිකටු සහ නූල් වර්ගය:' : 'Machine Needle & Thread Spec:'}
                      </span>
                      <strong className="text-white block font-mono">
                        {isSinhalaMode ? selectedFabric.specialCharacteristics.needleSizeSinhala : selectedFabric.specialCharacteristics.needleSize}
                      </strong>
                      <span className="text-[11px] text-[#a89f91] font-mono block">
                        Thread: {selectedFabric.specialCharacteristics.threadSpec}
                      </span>
                    </div>

                    {/* Seam Finishes */}
                    <div className="p-3.5 bg-[#0a0708] border border-white/10 rounded space-y-1">
                      <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                        {isSinhalaMode ? 'මැහුම් දාර ආවරණය (Seam Finishes):' : 'Haute Couture Seam Finishes:'}
                      </span>
                      <p className="text-[11px] text-[#d5cfc4] font-sinhala leading-relaxed">
                        {isSinhalaMode ? selectedFabric.specialCharacteristics.seamFinishesSinhala : selectedFabric.specialCharacteristics.seamFinishes}
                      </p>
                    </div>

                    {/* Pressing & Heat Rules */}
                    <div className="p-3.5 bg-[#0a0708] border border-white/10 rounded space-y-1">
                      <span className="text-[10px] font-mono text-[#dfb56c] uppercase block font-bold">
                        {isSinhalaMode ? 'මැදීම හා උෂ්ණත්ව පාලනය (Pressing Heat):' : 'Ironing & Heat Regulations:'}
                      </span>
                      <p className="text-[11px] text-[#d5cfc4] font-sinhala leading-relaxed">
                        {isSinhalaMode ? selectedFabric.specialCharacteristics.pressingHeatSinhala : selectedFabric.specialCharacteristics.pressingHeat}
                      </p>
                    </div>
                  </div>

                  {/* Shrinkage & Washing */}
                  <div className="p-3 bg-[#100b0d] border border-[#dfb56c]/25 rounded text-[11px] text-[#d5cfc4] font-sinhala flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#dfb56c] shrink-0 mt-0.5" />
                    <span>
                      <strong>{isSinhalaMode ? 'ඇකිලීම සහ පිරිසිදු කිරීමේ උපදෙස්:' : 'Care & Pre-Shrinkage Protocol:'}</strong>{' '}
                      {isSinhalaMode ? selectedFabric.specialCharacteristics.shrinkageCareSinhala : selectedFabric.specialCharacteristics.shrinkageCare}
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 4: FABRIC WEAVE ARCHITECTURE & CONSTRUCTION */}
              {activeTab === 'weave' && (
                <div className="pt-5 space-y-4 text-xs animate-in fade-in duration-200">
                  <div className="p-4 bg-[#0a0708] border border-white/10 rounded space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#dfb56c] uppercase tracking-wider block">
                          WEAVE ARCHITECTURE
                        </span>
                        <h4 className="text-base font-editorial font-bold text-white">
                          {isSinhalaMode ? selectedFabric.weaveConstruction.weaveTypeSinhala : selectedFabric.weaveConstruction.weaveType}
                        </h4>
                      </div>
                      <button
                        onClick={() => setShowWeaveMicroscope(!showWeaveMicroscope)}
                        className="px-2.5 py-1 text-xs rounded bg-[#1e1316] border border-[#dfb56c]/40 text-[#dfb56c] flex items-center gap-1.5 cursor-pointer hover:bg-[#2b1b1f]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{showWeaveMicroscope ? 'Hide Fiber View' : 'Microscope View'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-[#a89f91] font-mono block">YARN DETAILS &amp; FILAMENT TWIST</span>
                        <p className="text-[11px] text-[#d5cfc4] font-sinhala mt-0.5 leading-relaxed">
                          {isSinhalaMode ? selectedFabric.weaveConstruction.yarnDetailsSinhala : selectedFabric.weaveConstruction.yarnDetails}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#a89f91] font-mono block">WARP &amp; WEFT THREAD DENSITY</span>
                        <strong className="text-white font-mono block mt-0.5">
                          {selectedFabric.weaveConstruction.warpWeftDensity}
                        </strong>
                      </div>
                    </div>

                    {/* Microscopic Fiber Canvas / Pattern View */}
                    {showWeaveMicroscope && (
                      <div className="my-2 p-4 bg-[#060405] rounded border border-[#dfb56c]/50 flex items-center justify-center relative overflow-hidden h-36 animate-in fade-in zoom-in-95">
                        <div
                          className="absolute inset-0 opacity-40"
                          style={{
                            backgroundImage: `radial-gradient(${currentColor.hex} 2px, transparent 2px), radial-gradient(${currentColor.specular} 1px, transparent 1px)`,
                            backgroundSize: '14px 14px',
                            backgroundPosition: '0 0, 7px 7px',
                          }}
                        />
                        <div className="relative text-center z-10 space-y-1">
                          <span className="text-xs font-mono uppercase tracking-widest text-[#dfb56c] block font-bold">
                            Microscopic Fiber Mesh • {selectedFabric.name}
                          </span>
                          <span className="text-xs text-[#d5cfc4] font-sinhala block max-w-md">
                            {isSinhalaMode ? selectedFabric.weaveConstruction.microscopicStructureSinhala : selectedFabric.weaveConstruction.microscopicStructure}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#a89f91]">
                      <span>{isSinhalaMode ? 'ස්පර්ශ ගුණය (Hand Feel):' : 'Tactile Hand Feel:'}</span>
                      <strong className="text-[#f7e2a9] font-sinhala">
                        {isSinhalaMode ? selectedFabric.weaveConstruction.textureFeelSinhala : selectedFabric.weaveConstruction.textureFeel}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 5 COLS: CURRICULUM TEXTILES LIBRARY SELECTOR */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono text-[#dfb56c] tracking-widest block font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#dfb56c]" />
                {isSinhalaMode ? 'හැදෑරීමට නියමිත රෙදිපිළි වර්ග' : 'Curriculum Textiles Library'}
              </span>
              <span className="text-[10px] font-mono text-[#a89f91]">
                {filteredFabrics.length} Available
              </span>
            </div>

            {/* Fabric List */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredFabrics.map((fabric) => {
                const isSelected = selectedFabric.id === fabric.id;
                return (
                  <div
                    key={fabric.id}
                    onClick={() => {
                      setSelectedFabric(fabric);
                      setSelectedColorIndex(0);
                    }}
                    className={`p-3.5 rounded-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e1316] border-[#dfb56c] shadow-lg scale-[1.01]'
                        : 'bg-[#141011] border-white/10 hover:border-white/25 hover:bg-[#191415]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-editorial font-bold text-sm text-[#f7f3eb]">
                        {isSinhalaMode ? fabric.nameSinhala : fabric.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#dfb56c] px-2 py-0.5 rounded bg-black/40 border border-[#dfb56c]/30">
                        {fabric.properties.gsm} GSM
                      </span>
                    </div>

                    <p className="text-xs text-[#b8afa2] line-clamp-2 font-sinhala leading-relaxed">
                      {isSinhalaMode ? fabric.overviewSinhala : fabric.overview}
                    </p>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#a89f91]">
                      <span>{fabric.category}</span>
                      <span className="text-[#dfb56c]">
                        {fabric.matchingDesigns[0]?.silhouette || 'Couture Silhouette'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Fabric Academy Callout Card */}
            <div className="p-4 rounded-sm bg-gradient-to-br from-[#1a1214] to-[#0c090a] border border-[#c99a45]/30 space-y-2.5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-[#dfb56c]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="font-bold">
                  {isSinhalaMode ? 'කෝචර් ඇකඩමි ප්‍රායෝගික පුහුණුව' : 'Atelier Practical Hands-on Training'}
                </span>
              </div>

              <p className="text-xs text-[#d5cfc4] font-sinhala leading-relaxed">
                {isSinhalaMode
                  ? 'Ceylon Style Studio හි පළමු සහ දෙවන මොඩියුල වලදී මෙම සියලු රෙදිපිළි වර්ග සැබෑ ලෙස අතින් ස්පර්ශ කරමින්, මැහුම් ආතතිය සහ Bias හැසිරීම ප්‍රායෝගිකව ප්‍රගුණ කරනු ලබයි.'
                  : 'At Ceylon Style Studio, students physically handle, drape, cut, and construct with all these high-end fabrics during Module 01 and 02.'}
              </p>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#a89f91]">
                <span>{isSinhalaMode ? 'පාඨමාලා මොඩියුලය:' : 'Academy Module:'}</span>
                <span className="text-[#dfb56c] font-bold font-mono">{selectedFabric.cssModule}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
