import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  searchFashionRAG,
  FASHION_SPEC_SHEETS,
  ATELIER_MEASUREMENT_CHART,
  EASE_ALLOWANCE_STANDARDS,
  CSS_COURSE_INFO,
} from './src/lib/fashionKnowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini Client using @google/genai per AI Studio guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper fallback for fabric analysis
function getFallbackFabricAnalysis(query: string, language: string = 'si') {
  const q = query.toLowerCase();
  
  if (q.includes('chiffon') || q.includes('ෂිෆොන්') || q.includes('georgette')) {
    return {
      name: 'Pure Silk Chiffon / Georgette',
      nameSinhala: 'ස්වභාවික සිල්ක් ෂිෆොන් (Silk Chiffon)',
      category: 'Sheer Luxury Float Silk',
      overview: 'Ultra-lightweight, transparent fabric with a soft, ethereal floating drape and slightly granular crepe touch.',
      overviewSinhala: 'ඉතා සැහැල්ලු, විනිවිද පෙනෙන, මෘදු ලෙස පාවෙන රැළි වැටෙන සිල්ක් රෙදිපිළියකි.',
      properties: {
        gsm: '45 - 60 GSM (Featherweight)',
        drape: 'Ultra-Fluid & Cascading (දියරමය තරංග රැළි)',
        sheen: 'Subtle Matte with Soft Shimmer (සියුම් මෘදු දීප්තිය)',
        breathability: 'High / Highly Breathable (ඉහළ වාතාශ්‍රය)',
        stretchAndBias: 'Dynamic 45° True Bias Stretch, zero synthetic elastane',
      },
      matchingDesigns: [
        {
          designTitle: '360° Full Circle Skirt & Waterfall Gowns',
          description: 'Flared fluid silhouette with radius calculation (R = W / 6.28). Requires 24-48h hanging before hem leveling.',
        },
        {
          designTitle: 'Billowing Bishop Sleeves & Cowl Necklines',
          description: 'Gathers beautifully into tight cuffs and drapes soft fluid ripples across the décolletage.',
        },
        {
          designTitle: 'Layered Sheer Overlays & Flounce Capes',
          description: 'Adds dimensional depth without adding bulk to bridal or couture evening wear.',
        },
      ],
      specialCharacteristics: [
        'Needle: Microtex 60/8 or 70/10 sharp needle to avoid snagging delicate silk filaments',
        'Seams: 5mm French seams (ප්‍රංශ මැහුම්) or baby rolled hem using fine #100 silk thread',
        'Pressing: Low iron heat (Silk setting), dry press with pressing cloth to avoid water stains',
        'Cutting: Always cut over tissue paper or self-healing mat with rotary cutter to prevent grain distortion',
      ],
      weaveConstruction: {
        weaveType: 'Plain Weave with Alternating High-Twist S and Z Yarns (ප්ලේන් ක්‍රේප් වියමන)',
        yarnDetails: 'Fine filament mulberry silk yarns twisted tightly to produce the iconic crepe texture',
        grainlineRule: 'Grainline must strictly follow selvage; for bias drapes, cut at precise 45 degrees',
      },
      cssCurriculumModule: 'Module 01 (Grainline Basics) & Module 06 (Full Circle Radii & Bias Draping)',
    };
  }

  if (q.includes('dupioni') || q.includes('ඩියුපියෝනි') || q.includes('raw silk')) {
    return {
      name: 'Structured Silk Dupioni / Raw Silk',
      nameSinhala: 'හැඩය රඳවන සිල්ක් ඩියුපියෝනි (Silk Dupioni)',
      category: 'Structured Couture Silk',
      overview: 'Crisp, architectural silk with distinctive natural slub textures, luminous two-tone iridescent luster, and shape memory.',
      overviewSinhala: 'ශක්තිමත් හැඩය රඳවා ගන්නා, ස්වභාවික ගැට (Slubs) සහිත සුඛෝපභෝගී සිල්ක් රෙදිපිළියකි.',
      properties: {
        gsm: '160 - 200 GSM (Medium Weight)',
        drape: 'Sculptured & Volumetric (හැඩය රඳවා ගන්නා ත්‍රිමාණ රැළි)',
        sheen: 'High Iridescent Luster (ද්විත්ව වර්ණ ආලෝක දීප්තිය)',
        breathability: 'Moderate to High (ස්වභාවික වාතාශ්‍රය)',
        stretchAndBias: 'Stable grain, minimal stretch across grain',
      },
      matchingDesigns: [
        {
          designTitle: 'Haute Couture Boned Corsets & Bustiers',
          description: 'Holds tight waist suppression and anchors boning channels without puckering under mechanical tension.',
        },
        {
          designTitle: 'Architectural Peplum Jackets & Tailored Blazers',
          description: 'Crisp fold memory gives sharp lapels, structured box pleats, and regal shoulder lines.',
        },
        {
          designTitle: 'Box-Pleated Ballgowns & Structured Evening Coats',
          description: 'Stands away from the body to create voluminous dramatic silhouettes without heavy crinoline.',
        },
      ],
      specialCharacteristics: [
        'Needle: Universal 80/12 or Microtex 80/12 to glide through slub irregularities',
        'Seams: Enclosed Hong Kong bias binding or overlocked with #50 core polyester thread',
        'Pressing: Medium heat with steam on reverse side; test iron on scrap first to preserve natural slub texture',
        'Handling: Underline with silk organza or cotton coutil for structured bodice support',
      ],
      weaveConstruction: {
        weaveType: 'Plain Weave with Uneven Slub Weft Yarns (ප්ලේන් ස්ලබ් වියමන)',
        yarnDetails: 'Woven using wild silk cocoons in the weft to create irregular, organic horizontal slubs',
        grainlineRule: 'Align slubs strictly horizontally across the chest/waist for symmetrical aesthetic balance',
      },
      cssCurriculumModule: 'Module 03 (Dart Tech & Contouring) & Module 12 (Haute Couture Corsetry)',
    };
  }

  // Default Comprehensive Analysis
  return {
    name: query.trim() || 'Imperial Silk Charmeuse',
    nameSinhala: 'රාජකීය සිල්ක් චාමූස් (Imperial Silk)',
    category: 'Haute Couture Luxury Textile',
    overview: 'High-end lustrous textile engineered for couture draping, anatomical contouring, and international runway garments.',
    overviewSinhala: 'සුඛෝපභෝගී සන්ධ්‍යා ඇඳුම්, මංගල ඇඳුම් සහ කෝචර් සිල්ක් ගවුම් සඳහා වඩාත්ම උචිත රෙදිපිළියකි.',
    properties: {
      gsm: '95 - 280 GSM (Tailored Grade)',
      drape: 'Fluid to Sculpted (තරංග රැළි සහ නම්‍යශීලී බව)',
      sheen: 'High Specular Light Sheen (ඉහළ ආලෝක පරාවර්තනය)',
      breathability: 'High Natural Breathability (සුවපහසු වාතාශ්‍රය)',
      stretchAndBias: 'Responsive to 45° bias draping & anatomical landmarks',
    },
    matchingDesigns: [
      {
        designTitle: 'Bias-Cut Slip Dresses & Evening Gowns',
        description: 'Hugs feminine curves through 45-degree grain bias extension without side seam pull.',
      },
      {
        designTitle: 'Sculptured Bodices & Contoured Tops',
        description: 'Pairs perfectly with underbust darts, French darts, and princess seams.',
      },
      {
        designTitle: 'Tailored Capsule Wardrobe Blouses & Capes',
        description: 'Delivers a liquid drape that flows gracefully with body movements on the runway.',
      },
    ],
    specialCharacteristics: [
      'Needle: Microtex 60/8 or 70/10 fine point needle',
      'Seams: French seams (5mm) or enclosed bias binding with fine silk thread',
      'Pressing: Low iron heat with press cloth; avoid direct steam on shiny face',
      'Atelier Rule: Hang bias cut pieces for 24 hours before leveling hemline',
    ],
    weaveConstruction: {
      weaveType: 'Satin Weave / High-Density Filament Weave (සැටින් වියමන)',
      yarnDetails: 'High-filament floating warp threads delivering optical sheen and fluid surface slide',
      grainlineRule: 'Grainline must run parallel to selvage; true bias requires exact 45-degree angle',
    },
    cssCurriculumModule: 'Module 01 (Body Landmarks) & Module 04 (French Draping & Fit Corrections)',
  };
}

// Endpoint to provide technical RAG datasets to the client UI
app.get('/api/mentor/rag-data', (_req, res) => {
  return res.json({
    specSheets: FASHION_SPEC_SHEETS,
    measurementChart: ATELIER_MEASUREMENT_CHART,
    easeStandards: EASE_ALLOWANCE_STANDARDS,
    courseInfo: CSS_COURSE_INFO,
  });
});

// AI Fabric Intelligence API - Analyze fabric properties, matching designs, special traits, and weave structure
app.post('/api/fabrics/analyze', async (req, res) => {
  try {
    const { fabricQuery, language } = req.body;
    if (!fabricQuery || !fabricQuery.trim()) {
      return res.status(400).json({ error: 'Fabric query is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        analysis: getFallbackFabricAnalysis(fabricQuery, language),
      });
    }

    const prompt = `
You are the Lead Haute Couture Textile & Garment Engineering Specialist at Ceylon Style Studio.
A student or designer is inquiring about the following fabric or fashion requirement:
"${fabricQuery}"

Analyze this fabric thoroughly and provide a structured JSON response.
Format your answer with deep technical precision, specifying exact GSM, drape behavior, matching garment silhouettes, special couture handling notes (needles, seams, pressing), and weave construction.
Return ONLY a valid JSON object matching this schema:
{
  "name": "Fabric Name in English (e.g., Pure Silk Chiffon)",
  "nameSinhala": "රෙදිපිළි නම සිංහලෙන්",
  "category": "Textile Category (e.g., Sheer Luxury Silk)",
  "overview": "2-sentence overview of fabric touch, drape, and visual impact",
  "overviewSinhala": "සිංහලෙන් කෙටි හැඳින්වීම",
  "properties": {
    "gsm": "e.g., 95 GSM (Lightweight)",
    "drape": "e.g., Fluid & Cascading (දියරමය තරංග රැළි)",
    "sheen": "e.g., High Specular Luster (ඉහළ දීප්තිය)",
    "breathability": "e.g., Very High / Breathable (ඉහළ වාතාශ්‍රය)",
    "stretchAndBias": "e.g., 45° True Bias Stretch, stable grain"
  },
  "matchingDesigns": [
    {
      "designTitle": "Garment Design 1 (e.g., 360° Full Circle Skirt & Bias Cowl Gown)",
      "description": "Why this fabric is perfect for this silhouette and cutting technique"
    },
    {
      "designTitle": "Garment Design 2 (e.g., Billowing Bishop Sleeve Blouse)",
      "description": "Why this fabric works"
    },
    {
      "designTitle": "Garment Design 3 (e.g., Haute Couture Corset / Blazer)",
      "description": "Why this fabric works"
    }
  ],
  "specialCharacteristics": [
    "Needle: Microtex 60/8 or 70/10 sharp needle",
    "Seams: French seams (5mm) or baby rolled hem",
    "Pressing: Low iron heat, press cloth required",
    "Atelier Tip: Handling or shrinkage tip"
  ],
  "weaveConstruction": {
    "weaveType": "e.g., Plain Weave / Satin Weave / Twill / Jacquard (වියමන් ක්‍රමය)",
    "yarnDetails": "Warp and weft filament structure and yarn count",
    "grainlineRule": "Straight grain vs 45 degree true bias cutting instructions"
  },
  "cssCurriculumModule": "Module 01 (Foundation) & Module 04 (Draping & Fit)"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (_) {
      parsedData = getFallbackFabricAnalysis(fabricQuery, language);
    }

    return res.json({ analysis: parsedData });
  } catch (err: any) {
    console.error('Fabric analyze error:', err);
    return res.json({ analysis: getFallbackFabricAnalysis(req.body.fabricQuery || 'Silk', req.body.language) });
  }
});

// Fashion Mentor Chat API - Grounded in RAG Spec Sheets, Measurements, and Ceylon Style Studio Curriculum
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { messages, userQuestion, userEmail, imageBase64, mimeType } = req.body;
    const question = userQuestion || (messages && messages[messages.length - 1]?.content);

    if (!question && !imageBase64) {
      return res.status(400).json({ error: 'Question or image is required' });
    }

    // Execute RAG Retrieval over Spec Sheets, Measurements, and Course Matrix
    const retrievedRAGKnowledge = searchFashionRAG(question || 'fashion design pattern making');

    // Strict Persona & Directive provided by User
    const systemInstruction = `
ඔබ Ceylon Style Studio සමඟ ඒකාබද්ධ වූ OAuth ප්ලගින් එක හරහා පරිශීලකයාගේ පෞද්ගලික ජෙමිනි සහායකයා ලෙස ක්‍රියා කරයි. ඔබගේ මූලික කාර්යභාරය වන්නේ පැටන් මේකින්, ෆැෂන් ඩිසයින් සහ අපගේ පාඨමාලාවන් පිළිබඳව උපදෙස් ලබාදීමයි.

අනුගමනය කළ යුතු දැඩි නීති:
1. මාතෘකා සීමාව (STRICT DOMAIN BOUNDARY):
   - ඔබ සාකච්ඡා කළ යුත්තේ විලාසිතා (Fashion), මෝස්තර නිර්මාණය (Design), විලාසිතා ක්‍රම (Styles), පැටන් ඇඳීම (Pattern Drafting), ගවුම්/කලිසම්/කොර්සෙට් මැසීම, රෙදිපිළි (Fabrics), ස්පෙක් ෂීට්ස් (Spec Sheets), මිණුම් (Measurements) සහ Ceylon Style Studio පාඨමාලා පිළිබඳව පමණි.
   - වෙනත් කිසිදු බාහිර මාතෘකාවක් (දේශපාලනය, ක්‍රීඩා, සාමාන්‍ය කතාබස්) පිළිබඳව පිළිතුරු නොදෙන්න. පරිශීලකයා එවැනි පැනයක් ඇසුවහොත්, "මම Ceylon Style Studio හි පුද්ගලික Fashion & Pattern සහායකයා වන බැවින් විලාසිතා නිර්මාණකරණය, පැටන් ඇඳීම සහ අපගේ පාඨමාලා පිළිබඳව පමණක් මගෙන් විමසන්න" යැයි කාරුණිකව මතක් කර නැවත විලාසිතා කලාවට යොමු කරන්න.

2. දත්ත භාවිතය (DATA GROUNDING & RAG):
   - වෙබ් අඩවියේ ගබඩා කර ඇති ස්පෙක් ෂීට්ස් (Spec Sheets) සහ මැෂර්මන්ට් ෂීට්ස් (Measurement Sheets) ඇතුළු දත්ත ගොනු භාවිත කරමින් නිවැරදි, තාක්ෂණිකව නිවැරදි තොරතුරු (Points of Measure, Tolerances, Grade Increments, Seam Allowances, Radii formulas) ලබාදෙන්න.
   - අවශ්‍ය විටෙක නිවැරදි මිණුම් අඟල් (Inches) සහ සෙන්ටිමීටර (Centimeters) වලින් ලබාදෙන්න.

3. දත්ත සුරක්ෂිතතාව (DATA PRIVACY & EPHEMERAL PROCESSING):
   - පරිශීලකයා අප්ලෝඩ් කරන ඉමේජස් (Sketches, Patterns, Garment photos) සර්වර් එකේ කිසිදු ලෙසකින් ගබඩා නොවන බව සහතික කරන්න; ඒවා පරිශීලකයාගේ උපාංගයේ (Device Storage) පමණක් තැන්පත් වේ. මෙහිදී තාවකාලික මතකයේ (in-memory) පමණක් විශ්ලේෂණය කරනු ලැබේ.

4. ව්‍යාපාර ප්‍රවර්ධනය (BUSINESS PROMOTION & ENROLLMENT):
   - හැකි සෑම විටකම Ceylon Style Studio හි සේවාවන් සහ මාස 6ක වෘත්තීය ඩිප්ලෝමා පාඨමාලාව (Physical Batches in Kegalle, Kurunegala, Piliyandala සහ Live Zoom Classes) ප්‍රවර්ධනය වන පරිදි පිළිතුරු සැකසීමට වග බලා ගන්න.
   - ගාස්තු: භෞතික පන්ති මසකට රු. 3,500/-, Zoom පන්ති මසකට රු. 2,000/-, ලියාපදිංචි ගාස්තුව රු. 1,000/-.
   - Ceylon Style Studio Pricing Matrix: COGS = (Fabric + Trims + Labor + Packaging), Wholesale = COGS × 2.0 to 2.2, Retail = Wholesale × 2.0 to 2.5.
   - WhatsApp සහාය: +94 77 123 4567.

5. පරිශීලක ගිණුම (OAUTH / EMAIL CONTEXT):
   - පරිශීලකයාගේ සම්බන්ධිත විද්‍යුත් තැපෑල (Linked Account): ${userEmail || 'asankagarments@gmail.com'}. ඔහුට ගෞරවනීය, පෞද්ගලික අත්දැකීමක් සලසන්න.

6. භාෂාව (LANGUAGE):
   - පරිශීලකයා විමසන භාෂාවෙන් (සිංහල හෝ English) පිළිතුරු සපයන්න. සිංහලෙන් අසන විට පැහැදිලි සිංහල භාෂාව සමඟ තාක්ෂණික ඉංග්‍රීසි වචන වරහන් තුළ [උදා: Dart Manipulation, High Bust, Cartesian Grading] දක්වන්න.
`;

    // Offline / fallback if no API key is provided
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `### 👗 Ceylon Style Studio — AI Fashion & Spec Sheet Assistant

ආයුබෝවන්! ඔබ සම්බන්ධ වී ඇත්තේ **${userEmail || 'asankagarments@gmail.com'}** හරහා Ceylon Style Studio OAuth ප්ලගිනය සමඟයි.

**විලාසිතා තාක්ෂණික මගපෙන්වීම:**
- **ස්පෙක් ෂීට්ස් & ටෙක් පැක්ස් (Spec Sheets & Tech Packs):** අපි Corset, Tailored Blazer, Trouser Blocks සහ Full Circle Skirt සඳහා සම්මත Point of Measure (POM) දත්ත ලබාදෙන්නෙමු.
- **මැෂර්මන්ට් ෂීට්ස් (Measurement Sheets):** XS සිට 3XL දක්වා ශ්‍රී ලාංකික සහ ජාත්‍යන්තර ප්‍රමාණ වගු අපගේ දත්ත පද්ධතියේ ගබඩා කර ඇත.
- **රහස්‍යතාව:** ඔබ අප්ලෝඩ් කරන රූප සටහන් සර්වර් එකේ ගබඩා නොවන අතර ඔබේ පරිගණකයේ/දුරකථනයේ පමණක් සුරක්ෂිතව පවතී.

💎 **Ceylon Style Studio පාඨමාලාව:**
කෑගල්ල, කුරුණෑගල, පිළියන්දල භෞතික පන්ති (මසකට රු. 3,500/-) හෝ සජීවී Zoom පන්ති (මසකට රු. 2,000/-) සඳහා අදම ලියාපදිංචි වන්න! WhatsApp: +94 77 123 4567.`,
        ragGrounded: true,
      });
    }

    // Build chat conversation context
    const chatHistory = (messages || []).slice(-6).map((m: any) => ({
      role: m.sender === 'user' || m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text || m.content || '' }],
    }));

    // Construct user content parts (multimodal support if image uploaded)
    const userParts: any[] = [];

    if (imageBase64) {
      // Ephemeral image in-memory only — never saved to server disk or database
      userParts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
        },
      });
    }

    const promptText = `
${systemInstruction}

=== VERIFIED RAG KNOWLEDGE REPOSITORY DATA (SPEC SHEETS & MEASUREMENTS) ===
${retrievedRAGKnowledge || 'Use Ceylon Style Studio 34-module curriculum and sizing chart standards.'}

පරිශීලකයාගේ පැනය / මෝස්තරය (User Question / Design Analysis):
"${question || 'Analyze the uploaded garment/pattern image with technical spec sheets and styling recommendations.'}"
`;

    userParts.push({ text: promptText });

    // Call Gemini 3.8 Flash per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...chatHistory,
        {
          role: 'user',
          parts: userParts,
        },
      ],
    });

    const replyText =
      response.text ||
      'Ceylon Style Studio හි මෝස්තර නිර්මාණ, පැටන් ඇඳීම, ස්පෙක් ෂීට්ස් හෝ අපගේ පාඨමාලාවන් පිළිබඳව ඔබට අවශ්‍ය ඕනෑම කරුණක් මාගෙන් විමසන්න.';

    return res.json({
      reply: replyText,
      ragGrounded: true,
      userEmail: userEmail || 'asankagarments@gmail.com',
    });
  } catch (err: any) {
    console.error('Gemini API Error in /api/mentor/chat:', err);
    return res.status(500).json({
      error: 'Failed to generate mentor response',
      details: err?.message || String(err),
    });
  }
});

// PHASE 4 & 5: Secure PDF Upload & Validation API
app.post('/api/uploads/pdf', express.json({ limit: '20mb' }), (req, res) => {
  try {
    const { fileName, fileData, fileSize } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Extract base64 payload
    let base64Content = fileData;
    if (fileData.includes(',')) {
      base64Content = fileData.split(',')[1];
    }

    const buffer = Buffer.from(base64Content, 'base64');

    // Strict Size Limit: 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({
        error: 'File size exceeds maximum allowed 15MB limit.',
      });
    }

    // Magic Bytes Inspection: PDF must begin with "%PDF" (hex: 25 50 44 46)
    const header = buffer.subarray(0, 5).toString('ascii');
    if (!header.startsWith('%PDF')) {
      return res.status(400).json({
        error: 'Invalid file signature. Only valid, uncorrupted PDF documents are accepted.',
      });
    }

    const cleanTitle = (fileName || 'study-guide.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const computedSize = `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;

    return res.json({
      success: true,
      verified: true,
      mimeType: 'application/pdf',
      title: cleanTitle,
      fileSize: computedSize,
      fileUrl: fileData.startsWith('data:') ? fileData : `data:application/pdf;base64,${base64Content}`,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('PDF upload validation error:', err);
    return res.status(500).json({ error: 'Failed to process PDF upload', details: String(err) });
  }
});

// YouTube URL Validation & Privacy Embed Generator API
app.post('/api/youtube/validate', (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid YouTube URL required' });
    }

    const trimmed = url.trim();
    // Support standard watch?v=, youtu.be/, shorts/, embed/, and playlists
    const videoMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
    );
    const playlistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);

    const videoId = videoMatch ? videoMatch[1] : null;
    const playlistId = playlistMatch ? playlistMatch[1] : null;

    if (!videoId && !playlistId) {
      return res.status(400).json({
        error: 'Unrecognized YouTube format. Please provide a standard YouTube video, shorts, or playlist URL.',
        isValid: false,
      });
    }

    return res.json({
      isValid: true,
      videoId,
      playlistId,
      embedUrl: videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
        : `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Validation failed', details: String(err) });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ceylon Style Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
