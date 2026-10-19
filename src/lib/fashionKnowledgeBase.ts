/**
 * CEYLON STYLE STUDIO — RAG KNOWLEDGE BASE
 * Technical Fashion Engineering, Pattern Drafting, Spec Sheets, Measurement Charts,
 * Couture Construction, Sizing Standards & Course Curriculum Intelligence.
 */

export interface SpecSheetPointOfMeasure {
  code: string;
  name: string;
  nameSinhala?: string;
  description: string;
  tolerance: string; // e.g. "+/- 0.5 cm"
  specXS: number;
  specS: number;
  specM: number;
  specL: number;
  specXL: number;
  spec2XL: number;
  spec3XL: number;
  gradeIncrement: string; // e.g. "1.0 cm"
}

export interface GarmentSpecSheet {
  id: string;
  title: string;
  titleSinhala: string;
  garmentType: string;
  category: 'Haute Couture' | 'Ready to Wear' | 'Bridal' | 'Tailoring';
  description: string;
  descriptionSinhala: string;
  recommendedFabrics: string[];
  fabricGsm: string;
  seamAllowances: {
    neckline: string;
    armhole: string;
    sideSeams: string;
    hem: string;
    waistbandOrCasing: string;
  };
  stitchDensity: string; // e.g. "12-14 Stitches Per Inch (SPI)"
  closureDetails: string;
  pointsOfMeasure: SpecSheetPointOfMeasure[];
  atelierQualityCheckpoints: string[];
  moduleReference: string;
}

export interface MeasurementSizeRow {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
  ukSize: string;
  usSize: string;
  bustInches: number;
  bustCm: number;
  highBustCm: number;
  underBustCm: number;
  waistInches: number;
  waistCm: number;
  highHipCm: number;
  lowHipInches: number;
  lowHipCm: number;
  acrossShoulderCm: number;
  backWaistLengthCm: number;
  frontShoulderToApexCm: number;
  apexToApexCm: number;
  armholeDepthCm: number;
  sleeveLengthCm: number;
  crotchDepthCm: number;
}

export interface EaseAllowanceRule {
  garmentCategory: string;
  fitType: string;
  bustEaseInches: string;
  waistEaseInches: string;
  hipEaseInches: string;
  recommendedSilhouettes: string;
}

// 1. COMPREHENSIVE SPEC SHEETS (TECH PACKS)
export const FASHION_SPEC_SHEETS: GarmentSpecSheet[] = [
  {
    id: 'spec-corset-bustier',
    title: 'Haute Couture Boned Corset & Bustier Spec Sheet',
    titleSinhala: 'හොට් කුටූර් කොර්සෙට් සහ බස්ටියර් තාක්ෂණික ස්පෙක් ෂීට් (Tech Pack)',
    garmentType: 'Structured Corset / Bustier',
    category: 'Haute Couture',
    description: 'Precision multi-panel boned evening corsetry with underbust contouring and waist suppression.',
    descriptionSinhala: 'ශරීරයටම ඇලී පවතින බෝන් කළ කොර්සෙට් නිමාව, Underbust contouring සහ Waist suppression සහිතයි.',
    recommendedFabrics: ['Silk Dupioni (180 GSM)', 'Silk Brocade (220 GSM)', 'Cotton Coutil Lining (280 GSM)'],
    fabricGsm: '180 - 280 GSM with rigid fusible interfacing',
    seamAllowances: {
      neckline: '6mm (1/4") binding',
      armhole: '6mm (1/4") underarm curve',
      sideSeams: '12mm (1/2") enclosed boning channel',
      hem: '10mm (3/8") double fold binding',
      waistbandOrCasing: 'Internal 25mm waist stay grosgrain ribbon',
    },
    stitchDensity: '12 - 14 Stitches Per Inch (SPI), Lockstitch #301',
    closureDetails: 'Heavy-duty open-end brass zipper or 24-eyelet back lacing with modesty panel',
    moduleReference: 'Module 03 (Dart Tech & Contouring) & Module 12 (Couture Corsetry)',
    atelierQualityCheckpoints: [
      'Waist stay must be anchored to side seams to absorb mechanical tension',
      'All boning channels must terminate 15mm before seam ends to avoid seam puncture',
      'Underbust cup curvature must maintain 0mm ease for sculptured anatomical fit',
    ],
    pointsOfMeasure: [
      {
        code: 'POM-01',
        name: 'Full Bust Circumference (Apex)',
        nameSinhala: 'සම්පූර්ණ පපුව වට ප්‍රමාණය',
        description: 'Measured horizontally around the fullest part of bust over foundation cups',
        tolerance: '+/- 0.3 cm',
        specXS: 80.0,
        specS: 85.0,
        specM: 90.0,
        specL: 95.0,
        specXL: 101.5,
        spec2XL: 109.0,
        spec3XL: 117.0,
        gradeIncrement: '5.0 cm (XS-L), 7.0 cm (XL-3XL)',
      },
      {
        code: 'POM-02',
        name: 'Underbust Circumference',
        nameSinhala: 'යටි පපුව (Underbust) වට ප්‍රමාණය',
        description: 'Ribcage circumference directly at inframammary fold',
        tolerance: '+/- 0.3 cm',
        specXS: 68.0,
        specS: 72.0,
        specM: 76.0,
        specL: 81.0,
        specXL: 87.0,
        spec2XL: 94.0,
        spec3XL: 102.0,
        gradeIncrement: '4.0 cm to 6.0 cm',
      },
      {
        code: 'POM-03',
        name: 'Natural Waist Circumference',
        nameSinhala: 'ස්වභාවික ඉණ වට ප්‍රමාණය (Waist Suppression)',
        description: 'At narrowest waist indentation with 2.5cm waist cinch reduction applied',
        tolerance: '+/- 0.3 cm',
        specXS: 59.5,
        specS: 64.5,
        specM: 69.5,
        specL: 74.5,
        specXL: 81.5,
        spec2XL: 89.0,
        spec3XL: 96.5,
        gradeIncrement: '5.0 cm (XS-L), 7.0 cm (XL-3XL)',
      },
      {
        code: 'POM-04',
        name: 'Center Front Length',
        nameSinhala: 'ඉදිරිපස මැද දිග (Center Front Length)',
        description: 'From sternum notch to bottom peak point along center seam',
        tolerance: '+/- 0.2 cm',
        specXS: 34.0,
        specS: 34.5,
        specM: 35.0,
        specL: 35.5,
        specXL: 36.0,
        spec2XL: 36.5,
        spec3XL: 37.0,
        gradeIncrement: '0.5 cm',
      },
      {
        code: 'POM-05',
        name: 'Apex to Apex Span',
        nameSinhala: 'පපු කේන්ද්‍ර දෙක අතර දුර (Apex Span)',
        description: 'Distance between two bust point apex landmarks',
        tolerance: '+/- 0.2 cm',
        specXS: 17.0,
        specS: 18.0,
        specM: 19.0,
        specL: 20.0,
        specXL: 21.0,
        spec2XL: 22.0,
        spec3XL: 23.0,
        gradeIncrement: '1.0 cm',
      },
    ],
  },
  {
    id: 'spec-tailored-blazer',
    title: 'Precision Tailored Haute Couture Blazer Spec Sheet',
    titleSinhala: 'පැටර්න් ඉංජිනේරු බ්ලේසර් / කෝට් තාක්ෂණික ස්පෙක් ෂීට්',
    garmentType: 'Single-Breasted Tailored Jacket',
    category: 'Tailoring',
    description: 'Bespoke women’s tailored blazer with two-piece sleeve, notch lapels, shoulder pads, and chest canvas.',
    descriptionSinhala: 'ද්විත්ව කෑලි අත (Two-piece sleeve), නොච් ලැපෙල් (Notch lapel), හෝර්ස්හයාර් කැන්වස් සහිත සුඛෝපභෝගී බ්ලේසර්.',
    recommendedFabrics: ['Tropical Wool (240 GSM)', 'Raw Silk Matka (210 GSM)', 'Linen Suiting (260 GSM)'],
    fabricGsm: '210 - 280 GSM with hair canvas chest piece',
    seamAllowances: {
      neckline: '10mm (3/8") undercollar seam',
      armhole: '12mm (1/2") armscye seam with sleeve roll header',
      sideSeams: '15mm (5/8") for fitting adjustment',
      hem: '40mm (1.5") mitered corner tailored blind hem',
      waistbandOrCasing: 'Not applicable (structured body waist shaping)',
    },
    stitchDensity: '10 - 12 SPI on main seams, 4 SPI pick-stitching along lapel edge',
    closureDetails: '2-button horn closure with keyhole buttonholes and 3 functional cuff kissing buttons',
    moduleReference: 'Module 02 (Collars & Sleeves) & Module 14 (Tailoring Anatomy)',
    atelierQualityCheckpoints: [
      'Lapel roll line must roll naturally 1.5cm beyond break point without hard press',
      'Sleeve head must have 3.5cm ease cleanly shrunken with iron without pleating',
      'Center back vent overlap must be 3.5cm right-over-left',
    ],
    pointsOfMeasure: [
      {
        code: 'POM-10',
        name: 'Across Shoulder Width',
        nameSinhala: 'උරහිස් පළල (Across Shoulder)',
        description: 'From shoulder bone tip to tip across back neck base',
        tolerance: '+/- 0.4 cm',
        specXS: 37.0,
        specS: 38.5,
        specM: 40.0,
        specL: 41.5,
        specXL: 43.0,
        spec2XL: 44.5,
        spec3XL: 46.0,
        gradeIncrement: '1.5 cm',
      },
      {
        code: 'POM-11',
        name: 'Jacket Chest Width (1" below armhole)',
        nameSinhala: 'බ්ලේසර් පපුව පළල (Armhole යටින් 2.5cm)',
        description: 'Flat measurement across front chest with button closed',
        tolerance: '+/- 0.5 cm',
        specXS: 44.0,
        specS: 46.5,
        specM: 49.0,
        specL: 51.5,
        specXL: 54.5,
        spec2XL: 58.0,
        spec3XL: 62.0,
        gradeIncrement: '2.5 cm (XS-L), 3.5 cm (XL-3XL)',
      },
      {
        code: 'POM-12',
        name: 'Waist Width (At Narrowest Shaping)',
        nameSinhala: 'බ්ලේසර් ඉණ පළල (Waist Indentation)',
        description: 'Measured flat at button fastening waist level',
        tolerance: '+/- 0.5 cm',
        specXS: 39.0,
        specS: 41.5,
        specM: 44.0,
        specL: 46.5,
        specXL: 49.5,
        spec2XL: 53.0,
        spec3XL: 57.0,
        gradeIncrement: '2.5 cm to 3.5 cm',
      },
      {
        code: 'POM-13',
        name: 'Sleeve Length (Overarm)',
        nameSinhala: 'අතෙහි දිග (Shoulder seam to cuff edge)',
        description: 'From shoulder crown seam along outer sleeve curve to cuff edge',
        tolerance: '+/- 0.4 cm',
        specXS: 58.5,
        specS: 59.5,
        specM: 60.5,
        specL: 61.5,
        specXL: 62.0,
        spec2XL: 62.5,
        spec3XL: 63.0,
        gradeIncrement: '1.0 cm (XS-L), 0.5 cm (XL-3XL)',
      },
      {
        code: 'POM-14',
        name: 'Center Back Jacket Length',
        nameSinhala: 'පසුපස මැද සම්පූර්ණ දිග (Nape to Hem)',
        description: 'From collar neck seam straight down to bottom hem',
        tolerance: '+/- 0.5 cm',
        specXS: 68.0,
        specS: 69.0,
        specM: 70.0,
        specL: 71.0,
        specXL: 72.0,
        spec2XL: 73.0,
        spec3XL: 74.0,
        gradeIncrement: '1.0 cm',
      },
    ],
  },
  {
    id: 'spec-circle-skirt',
    title: 'Circle Skirt & Flared Evening Silhouette Spec Sheet',
    titleSinhala: 'සර්කල් සාය සහ ෆ්ලෙයාර් සිලවට් තාක්ෂණික ස්පෙක් ෂීට්',
    garmentType: '360° Full Circle & 180° Half Circle Skirt',
    category: 'Ready to Wear',
    description: 'Flared drape skirt with exact mathematical radius cutting formulas and bias drop hanging allowance.',
    descriptionSinhala: 'පූර්ණ (Full) සහ අර්ධ (Half) සර්කල් සායවල් සඳහා ගණිතමය රේඩියස් සූත්‍ර සහ බයස් එල්ලීමේ නිමාව.',
    recommendedFabrics: ['Ceylon Handloom Silk (140 GSM)', 'Silk Chiffon (45 GSM)', 'Heavy Satin (190 GSM)'],
    fabricGsm: '45 - 190 GSM',
    seamAllowances: {
      neckline: 'N/A',
      armhole: 'N/A',
      sideSeams: '12mm (1/2") French seam or overlocked join',
      hem: '6mm (1/4") baby rolled hem or 50mm horsehair braid finish',
      waistbandOrCasing: '35mm finished straight or contoured waistband with 12mm seam',
    },
    stitchDensity: '12 - 14 SPI, hem rolled with hemmer foot',
    closureDetails: 'Concealed invisible zipper at center back or side left with hook & eye at waistband',
    moduleReference: 'Module 06 (Skirt Blocks & Full Circle Radii)',
    atelierQualityCheckpoints: [
      'CRITICAL: Cut garment must hang freely on mannequin for 24-48 hours before marking hem line to allow bias to drop naturally',
      'Full Circle Waist Radius: R = Waist Circumference / 6.28 (2 * pi)',
      'Half Circle Waist Radius: R = Waist Circumference / 3.14 (pi)',
    ],
    pointsOfMeasure: [
      {
        code: 'POM-20',
        name: 'Finished Waistband Circumference',
        nameSinhala: 'නිමි ඉණ පටිය වට ප්‍රමාණය',
        description: 'Interior circumference of the waistband with hook fastened',
        tolerance: '+/- 0.3 cm',
        specXS: 63.5,
        specS: 68.5,
        specM: 73.5,
        specL: 78.5,
        specXL: 85.5,
        spec2XL: 93.0,
        spec3XL: 101.0,
        gradeIncrement: '5.0 cm to 7.5 cm',
      },
      {
        code: 'POM-21',
        name: 'Calculated Full Circle Radius (R)',
        nameSinhala: 'ගණනය කළ රේඩියස් අරය (Radius = W / 6.28)',
        description: 'Cutting radius from center point to chalk cut line',
        tolerance: '+/- 0.1 cm',
        specXS: 10.1,
        specS: 10.9,
        specM: 11.7,
        specL: 12.5,
        specXL: 13.6,
        spec2XL: 14.8,
        spec3XL: 16.1,
        gradeIncrement: '0.8 cm',
      },
      {
        code: 'POM-22',
        name: 'Midi Skirt Finished Length',
        nameSinhala: 'සායෙහි නිමි දිග (Waist to Hem)',
        description: 'From bottom edge of waistband vertically down to hem',
        tolerance: '+/- 0.5 cm',
        specXS: 75.0,
        specS: 75.0,
        specM: 76.0,
        specL: 76.0,
        specXL: 77.0,
        spec2XL: 77.0,
        spec3XL: 78.0,
        gradeIncrement: '0.0 to 1.0 cm',
      },
      {
        code: 'POM-23',
        name: 'Hemline Sweep Circumference (360°)',
        nameSinhala: 'සායෙහි පහළ වාටිය වට ප්‍රමාණය (Sweep)',
        description: 'Complete hemline perimeter distance',
        tolerance: '+/- 2.0 cm',
        specXS: 535.0,
        specS: 540.0,
        specM: 551.0,
        specL: 556.0,
        specXL: 569.0,
        spec2XL: 577.0,
        spec3XL: 591.0,
        gradeIncrement: '5.0 cm to 10.0 cm',
      },
    ],
  },
  {
    id: 'spec-tailored-trousers',
    title: 'High-Waisted Tailored Trouser Spec Sheet',
    titleSinhala: 'උසස් මැහුම් කලාවේ කලිසම් තාක්ෂණික ස්පෙක් ෂීට් (Trouser Block)',
    garmentType: 'Tailored Wide-Leg & Straight Trouser',
    category: 'Tailoring',
    description: 'High-waisted trousers with front pleats, slant pockets, fly front zipper, and calibrated crotch pitch.',
    descriptionSinhala: 'ඉණ උස කලිසම්, ප්ලීට්ස්, ඉදිරිපස සිපර් ෆ්ලයි (Fly zip) සහ ක්‍රොච් (Crotch curve) හැඩය සහිතයි.',
    recommendedFabrics: ['Tencel Twill (210 GSM)', 'Cotton Linen Suiting (240 GSM)', 'Crepe De Chine (180 GSM)'],
    fabricGsm: '180 - 240 GSM',
    seamAllowances: {
      neckline: 'N/A',
      armhole: 'N/A',
      sideSeams: '15mm (5/8") for ease of alteration',
      hem: '40mm (1.5") blind catch-stitch hem with bias binding finish',
      waistbandOrCasing: '40mm finished waistband with interfaced extension and prong hook',
    },
    stitchDensity: '10 - 12 SPI, reinforced double lockstitch on crotch curve',
    closureDetails: '18cm metal or coil trouser zipper with concealed J-stitch fly front & extension button tab',
    moduleReference: 'Module 04 (Trouser Blocks, Crotch Curves & Fit Corrections)',
    atelierQualityCheckpoints: [
      'Inseam balance must align grainline directly down center crease line (Plumb line)',
      'Back rise extension must be curved with 45° iron stretch to hug gluteal contour without horizontal fold lines',
      'Pocket stay fabric must be anchored into center front fly to keep pockets flat',
    ],
    pointsOfMeasure: [
      {
        code: 'POM-30',
        name: 'Waistband Circumference',
        nameSinhala: 'ඉණ වට ප්‍රමාණය',
        description: 'Inside top edge of waistband with hook closed',
        tolerance: '+/- 0.3 cm',
        specXS: 65.0,
        specS: 70.0,
        specM: 75.0,
        specL: 80.0,
        specXL: 87.0,
        spec2XL: 94.5,
        spec3XL: 102.0,
        gradeIncrement: '5.0 cm to 7.5 cm',
      },
      {
        code: 'POM-31',
        name: 'Low Hip Circumference (20cm below waist)',
        nameSinhala: 'යටි උකුල වට ප්‍රමාණය (Low Hip)',
        description: 'Around the fullest projection of the seat',
        tolerance: '+/- 0.5 cm',
        specXS: 89.0,
        specS: 94.0,
        specM: 99.0,
        specL: 104.0,
        specXL: 111.0,
        spec2XL: 118.5,
        spec3XL: 126.0,
        gradeIncrement: '5.0 cm to 7.5 cm',
      },
      {
        code: 'POM-32',
        name: 'Front Rise (Excluding Waistband)',
        nameSinhala: 'ඉදිරිපස ක්‍රොච් උස (Front Rise)',
        description: 'From crotch seam cross point to waistband seam at center front',
        tolerance: '+/- 0.3 cm',
        specXS: 26.5,
        specS: 27.5,
        specM: 28.5,
        specL: 29.5,
        specXL: 31.0,
        spec2XL: 32.5,
        spec3XL: 34.0,
        gradeIncrement: '1.0 cm to 1.5 cm',
      },
      {
        code: 'POM-33',
        name: 'Back Rise (Excluding Waistband)',
        nameSinhala: 'පසුපස ක්‍රොච් උස (Back Rise)',
        description: 'From crotch seam cross point along back curve to waistband seam',
        tolerance: '+/- 0.4 cm',
        specXS: 37.0,
        specS: 38.5,
        specM: 40.0,
        specL: 41.5,
        specXL: 43.5,
        spec2XL: 45.5,
        spec3XL: 47.5,
        gradeIncrement: '1.5 cm to 2.0 cm',
      },
      {
        code: 'POM-34',
        name: 'Inseam Length (Crotch to Hem)',
        nameSinhala: 'කලිසම ඇතුල් පැත්තේ දිග (Inseam)',
        description: 'From crotch intersection down inner leg seam to bottom hem',
        tolerance: '+/- 0.5 cm',
        specXS: 78.0,
        specS: 78.0,
        specM: 79.0,
        specL: 79.0,
        specXL: 79.5,
        spec2XL: 80.0,
        spec3XL: 80.0,
        gradeIncrement: '0.0 cm to 1.0 cm',
      },
    ],
  },
];

// 2. COMPLETE MEASUREMENT SHEETS (SRI LANKAN & INTERNATIONAL ATELIER SIZING)
export const ATELIER_MEASUREMENT_CHART: MeasurementSizeRow[] = [
  {
    size: 'XS',
    ukSize: 'UK 6',
    usSize: 'US 2',
    bustInches: 31.5,
    bustCm: 80.0,
    highBustCm: 76.0,
    underBustCm: 68.0,
    waistInches: 24.5,
    waistCm: 62.0,
    highHipCm: 76.0,
    lowHipInches: 34.0,
    lowHipCm: 86.5,
    acrossShoulderCm: 36.0,
    backWaistLengthCm: 39.5,
    frontShoulderToApexCm: 24.5,
    apexToApexCm: 17.0,
    armholeDepthCm: 19.5,
    sleeveLengthCm: 57.5,
    crotchDepthCm: 25.5,
  },
  {
    size: 'S',
    ukSize: 'UK 8',
    usSize: 'US 4',
    bustInches: 33.5,
    bustCm: 85.0,
    highBustCm: 81.0,
    underBustCm: 72.0,
    waistInches: 26.5,
    waistCm: 67.0,
    highHipCm: 81.0,
    lowHipInches: 36.0,
    lowHipCm: 91.5,
    acrossShoulderCm: 37.5,
    backWaistLengthCm: 40.0,
    frontShoulderToApexCm: 25.5,
    apexToApexCm: 18.0,
    armholeDepthCm: 20.5,
    sleeveLengthCm: 58.5,
    crotchDepthCm: 26.5,
  },
  {
    size: 'M',
    ukSize: 'UK 10',
    usSize: 'US 6',
    bustInches: 35.5,
    bustCm: 90.0,
    highBustCm: 86.0,
    underBustCm: 76.0,
    waistInches: 28.5,
    waistCm: 72.0,
    highHipCm: 86.0,
    lowHipInches: 38.0,
    lowHipCm: 96.5,
    acrossShoulderCm: 39.0,
    backWaistLengthCm: 40.5,
    frontShoulderToApexCm: 26.5,
    apexToApexCm: 19.0,
    armholeDepthCm: 21.5,
    sleeveLengthCm: 59.5,
    crotchDepthCm: 27.5,
  },
  {
    size: 'L',
    ukSize: 'UK 12',
    usSize: 'US 8',
    bustInches: 37.5,
    bustCm: 95.0,
    highBustCm: 91.0,
    underBustCm: 81.0,
    waistInches: 30.5,
    waistCm: 77.0,
    highHipCm: 91.0,
    lowHipInches: 40.0,
    lowHipCm: 101.5,
    acrossShoulderCm: 40.5,
    backWaistLengthCm: 41.0,
    frontShoulderToApexCm: 27.5,
    apexToApexCm: 20.0,
    armholeDepthCm: 22.5,
    sleeveLengthCm: 60.5,
    crotchDepthCm: 28.5,
  },
  {
    size: 'XL',
    ukSize: 'UK 14',
    usSize: 'US 10',
    bustInches: 40.0,
    bustCm: 101.5,
    highBustCm: 97.0,
    underBustCm: 87.0,
    waistInches: 33.0,
    waistCm: 84.0,
    highHipCm: 98.0,
    lowHipInches: 42.5,
    lowHipCm: 108.0,
    acrossShoulderCm: 42.0,
    backWaistLengthCm: 41.8,
    frontShoulderToApexCm: 28.5,
    apexToApexCm: 21.0,
    armholeDepthCm: 23.5,
    sleeveLengthCm: 61.5,
    crotchDepthCm: 29.5,
  },
  {
    size: '2XL',
    ukSize: 'UK 16',
    usSize: 'US 12',
    bustInches: 43.0,
    bustCm: 109.0,
    highBustCm: 104.0,
    underBustCm: 94.0,
    waistInches: 36.0,
    waistCm: 91.5,
    highHipCm: 105.5,
    lowHipInches: 45.5,
    lowHipCm: 115.5,
    acrossShoulderCm: 43.5,
    backWaistLengthCm: 42.5,
    frontShoulderToApexCm: 29.5,
    apexToApexCm: 22.0,
    armholeDepthCm: 24.5,
    sleeveLengthCm: 62.0,
    crotchDepthCm: 30.5,
  },
  {
    size: '3XL',
    ukSize: 'UK 18',
    usSize: 'US 14',
    bustInches: 46.0,
    bustCm: 117.0,
    highBustCm: 112.0,
    underBustCm: 102.0,
    waistInches: 39.0,
    waistCm: 99.0,
    highHipCm: 113.0,
    lowHipInches: 48.5,
    lowHipCm: 123.0,
    acrossShoulderCm: 45.0,
    backWaistLengthCm: 43.0,
    frontShoulderToApexCm: 30.5,
    apexToApexCm: 23.0,
    armholeDepthCm: 25.5,
    sleeveLengthCm: 62.5,
    crotchDepthCm: 31.5,
  },
];

// 3. EASE ALLOWANCE STANDARDS
export const EASE_ALLOWANCE_STANDARDS: EaseAllowanceRule[] = [
  {
    garmentCategory: 'Corsetry / Boned Bustier',
    fitType: 'Anatomical Sculpted (Minus ease to zero ease)',
    bustEaseInches: '0" to -1.0" (-2.5 cm cinch)',
    waistEaseInches: '-1.5" to -2.5" (-4 to -6 cm cinch)',
    hipEaseInches: '0" to +0.5" (0 to 1.2 cm)',
    recommendedSilhouettes: 'Victorian Corset, Empire Bustier, Structured Bridal Bodice',
  },
  {
    garmentCategory: 'Fitted Dress / Sheath Gown',
    fitType: 'Close-Fitting Atelier Standard',
    bustEaseInches: '+1.5" to +2.0" (+3.8 to +5.0 cm)',
    waistEaseInches: '+1.0" to +1.5" (+2.5 to +3.8 cm)',
    hipEaseInches: '+1.5" to +2.0" (+3.8 to +5.0 cm)',
    recommendedSilhouettes: 'Cocktail Dress, Mermaid Silhouette, Pencil Dress',
  },
  {
    garmentCategory: 'Tailored Blazer / Fitted Jacket',
    fitType: 'Semi-Fitted Tailored Layer',
    bustEaseInches: '+3.5" to +4.5" (+9.0 to +11.5 cm)',
    waistEaseInches: '+3.0" to +4.0" (+7.5 to +10.0 cm)',
    hipEaseInches: '+3.5" to +4.5" (+9.0 to +11.5 cm)',
    recommendedSilhouettes: 'Single/Double Breasted Blazer, Peplum Jacket, Trench Coat',
  },
  {
    garmentCategory: 'A-Line / Flared Skirt',
    fitType: 'Fitted Waist with Free Falling Flare',
    bustEaseInches: 'N/A',
    waistEaseInches: '+0.5" to +1.0" (+1.2 to +2.5 cm)',
    hipEaseInches: '+6.0" to +30.0" (+15 to +75 cm sweep)',
    recommendedSilhouettes: 'Full Circle Skirt, Accordion Pleat Skirt, Dirndl',
  },
  {
    garmentCategory: 'Tailored Trousers (Straight / Wide)',
    fitType: 'Clean Seat with Relaxed Leg',
    bustEaseInches: 'N/A',
    waistEaseInches: '+0.75" to +1.25" (+2.0 to +3.0 cm)',
    hipEaseInches: '+2.0" to +3.5" (+5.0 to +9.0 cm)',
    recommendedSilhouettes: 'Palazzo Pants, High-Waist Cigarette Trousers, Pleated Slacks',
  },
];

// 4. CEYLON STYLE STUDIO COURSE PROMOTION & PRICING INTELLIGENCE
export const CSS_COURSE_INFO = {
  programName: '6-Month Professional Fashion & Branding Program',
  programNameSinhala: 'මාස 6ක වෘත්තීය විලාසිතා නිර්මාණ, පැටන් ඉංජිනේරු සහ සන්නාමකරණ ඩිප්ලෝමා වැඩසටහන',
  intakeYear: '2026 Academic Intake',
  curriculumModulesCount: 34,
  centers: [
    { city: 'Kegalle', type: 'Physical Atelier Studio', schedule: 'Weekend & Weekday Batches' },
    { city: 'Kurunegala', type: 'Physical Atelier Studio', schedule: 'Weekend Batches' },
    { city: 'Piliyandala', type: 'Physical Atelier Studio', schedule: 'Sunday Intensive Batch' },
    { city: 'Islandwide & Worldwide', type: 'Live Interactive Zoom Batch', schedule: 'Evening Interactive Sessions with Full Video LMS Replay' },
  ],
  feeStructure: {
    physicalMonthlyFee: 3500,
    zoomMonthlyFee: 2000,
    registrationFee: 1000,
    currency: 'Rs.',
    paymentTerms: 'Easy monthly installments. No bulk upfront payment required.',
  },
  commercialPricingFormula: {
    cogsFormula: 'COGS = Fabric Cost + Trims (Zippers, Buttons, Threads) + Labor (Sewing) + Packaging & Labels',
    wholesaleFormula: 'Wholesale Price = COGS × 2.0 to 2.2',
    retailMSRPFormula: 'Retail Price (MSRP) = Wholesale Price × 2.0 to 2.5 (Direct to Consumer: COGS × 4.0 to 5.0)',
    prestigeMargin: 'For luxury runway/bespoke collections, add a 15-20% brand value prestige markup.',
  },
  contact: {
    phone: '+94 77 123 4567',
    whatsapp: 'https://wa.me/94771234567',
    email: 'asankagarments@gmail.com',
  },
};

// 5. RAG RETRIEVAL FUNCTION
export function searchFashionRAG(query: string): string {
  const q = query.toLowerCase();
  const contextParts: string[] = [];

  // Match Spec Sheets
  const matchedSpecs = FASHION_SPEC_SHEETS.filter(
    (s) =>
      q.includes(s.garmentType.toLowerCase()) ||
      q.includes(s.title.toLowerCase()) ||
      (q.includes('corset') && s.id.includes('corset')) ||
      (q.includes('blazer') && s.id.includes('blazer')) ||
      (q.includes('skirt') && s.id.includes('skirt')) ||
      (q.includes('circle') && s.id.includes('skirt')) ||
      (q.includes('trouser') && s.id.includes('trouser')) ||
      (q.includes('pant') && s.id.includes('trouser')) ||
      q.includes('spec') ||
      q.includes('tech pack') ||
      q.includes('pom')
  );

  if (matchedSpecs.length > 0) {
    contextParts.push('=== RETRIEVED SPEC SHEETS (CEYLON STYLE STUDIO TECH PACKS) ===');
    for (const spec of matchedSpecs) {
      contextParts.push(`\n[SPEC SHEET: ${spec.title}]`);
      contextParts.push(`Category: ${spec.category} | Recommended Fabrics: ${spec.recommendedFabrics.join(', ')} (${spec.fabricGsm})`);
      contextParts.push(`Seam Allowances: Neckline: ${spec.seamAllowances.neckline}, Armhole: ${spec.seamAllowances.armhole}, Side: ${spec.seamAllowances.sideSeams}, Hem: ${spec.seamAllowances.hem}`);
      contextParts.push(`Stitch Density: ${spec.stitchDensity} | Closure: ${spec.closureDetails}`);
      contextParts.push(`Quality Checkpoints:\n${spec.atelierQualityCheckpoints.map((c) => `- ${c}`).join('\n')}`);
      contextParts.push(`Key Points of Measure (POMs):`);
      for (const p of spec.pointsOfMeasure) {
        contextParts.push(`  * ${p.code} - ${p.name} (${p.nameSinhala || ''}): Tolerance: ${p.tolerance} | M-Size Spec: ${p.specM}cm (XS: ${p.specXS}cm, S: ${p.specS}cm, L: ${p.specL}cm, XL: ${p.specXL}cm, 2XL: ${p.spec2XL}cm, 3XL: ${p.spec3XL}cm) | Grade Rule: ${p.gradeIncrement}`);
      }
    }
  }

  // Match Measurement Charts
  if (
    q.includes('measurement') ||
    q.includes('size') ||
    q.includes('chart') ||
    q.includes('මිණුම්') ||
    q.includes('ප්‍රමාණ') ||
    q.includes('bust') ||
    q.includes('waist') ||
    q.includes('hip') ||
    q.includes('xs') ||
    q.includes('xl') ||
    q.includes('grading')
  ) {
    contextParts.push('\n=== RETRIEVED ATELIER MEASUREMENT CHART (XS TO 3XL) ===');
    contextParts.push('Size | UK / US | Bust (in/cm) | Waist (in/cm) | Low Hip (in/cm) | Shoulder | Back Waist | Apex-Apex | Crotch Depth');
    for (const row of ATELIER_MEASUREMENT_CHART) {
      contextParts.push(
        `${row.size} | ${row.ukSize}/${row.usSize} | ${row.bustInches}" (${row.bustCm}cm) | ${row.waistInches}" (${row.waistCm}cm) | ${row.lowHipInches}" (${row.lowHipCm}cm) | ${row.acrossShoulderCm}cm | ${row.backWaistLengthCm}cm | ${row.apexToApexCm}cm | ${row.crotchDepthCm}cm`
      );
    }
  }

  // Match Ease Allowance
  if (q.includes('ease') || q.includes('ලිහිල්') || q.includes('allowance') || q.includes('comfort')) {
    contextParts.push('\n=== RETRIEVED EASE ALLOWANCE STANDARDS ===');
    for (const rule of EASE_ALLOWANCE_STANDARDS) {
      contextParts.push(`* ${rule.garmentCategory} (${rule.fitType}): Bust Ease: ${rule.bustEaseInches}, Waist Ease: ${rule.waistEaseInches}, Hip Ease: ${rule.hipEaseInches}`);
    }
  }

  // Match Business / Pricing / Promotion
  if (
    q.includes('price') ||
    q.includes('fee') ||
    q.includes('cost') ||
    q.includes('cogs') ||
    q.includes('markup') ||
    q.includes('wholesale') ||
    q.includes('retail') ||
    q.includes('පාඨමාලා') ||
    q.includes('ගාස්තු') ||
    q.includes('course') ||
    q.includes('class')
  ) {
    contextParts.push('\n=== CEYLON STYLE STUDIO BUSINESS & PROGRAM DETAILS ===');
    contextParts.push(`Program: ${CSS_COURSE_INFO.programName} (${CSS_COURSE_INFO.curriculumModulesCount} Intensive Modules)`);
    contextParts.push(`Fees: Physical: Rs. ${CSS_COURSE_INFO.feeStructure.physicalMonthlyFee}/mo, Zoom: Rs. ${CSS_COURSE_INFO.feeStructure.zoomMonthlyFee}/mo, Registration: Rs. ${CSS_COURSE_INFO.feeStructure.registrationFee}`);
    contextParts.push(`Centers: Kegalle, Kurunegala, Piliyandala Physical Studios & Live Zoom Batches`);
    contextParts.push(`Pricing Matrix: ${CSS_COURSE_INFO.commercialPricingFormula.cogsFormula}`);
    contextParts.push(`Wholesale: ${CSS_COURSE_INFO.commercialPricingFormula.wholesaleFormula} | Retail: ${CSS_COURSE_INFO.commercialPricingFormula.retailMSRPFormula}`);
    contextParts.push(`Contact: WhatsApp ${CSS_COURSE_INFO.contact.phone} | ${CSS_COURSE_INFO.contact.email}`);
  }

  return contextParts.join('\n\n');
}
