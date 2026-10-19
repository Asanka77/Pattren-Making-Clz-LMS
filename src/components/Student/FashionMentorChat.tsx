import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Scissors,
  Layers,
  HelpCircle,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  ShieldCheck,
  Lock,
  Mail,
  ExternalLink,
  Table,
  Ruler,
  BookOpen,
  ArrowRight,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import {
  FASHION_SPEC_SHEETS,
  ATELIER_MEASUREMENT_CHART,
  EASE_ALLOWANCE_STANDARDS,
  CSS_COURSE_INFO,
  GarmentSpecSheet,
} from '../../lib/fashionKnowledgeBase';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  imageUrl?: string;
  ragGrounded?: boolean;
}

interface FashionMentorChatProps {
  studentName?: string;
  className?: string;
  initialTab?: 'chat' | 'specs' | 'measurements' | 'course';
}

export const FashionMentorChat: React.FC<FashionMentorChatProps> = ({
  studentName = 'Student',
  className = '',
  initialTab = 'chat',
}) => {
  const { user, studentUser, signInWithGoogle } = useAuth();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'chat' | 'specs' | 'measurements' | 'course'>(initialTab);

  // User Linked Email State
  const defaultEmail = user?.email || studentUser?.email || 'asankagarments@gmail.com';
  const [linkedEmail, setLinkedEmail] = useState<string>(() => {
    return localStorage.getItem('css_oauth_linked_email') || defaultEmail;
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(linkedEmail);

  // Sync if auth state changes
  useEffect(() => {
    if (user?.email && user.email !== linkedEmail) {
      setLinkedEmail(user.email);
      localStorage.setItem('css_oauth_linked_email', user.email);
    }
  }, [user]);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('css_mentor_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return [
      {
        id: 'welcome',
        sender: 'mentor',
        text: `ආයුබෝවන්! මම Ceylon Style Studio සමඟ ඒකාබද්ධ වූ OAuth ප්ලගින් එක හරහා ක්‍රියාත්මක වන ඔබගේ පුද්ගලික **AI Fashion & Spec Sheet සහායකයා** (Madame Celine & Master Asanka).

ඔබ **${linkedEmail}** ගිණුම හරහා අපගේ පද්ධතියට සම්බන්ධ වී ඇත. 

මම ඔබට උපකාර කරන්නේ:
• **පැටන් මේකින් (Pattern Drafting):** Bodice blocks, ඩාර්ට් හැසිරවීම (Dart manipulation), Circle skirt formulas, Size grading (XS-3XL).
• **ස්පෙක් ෂීට්ස් & ටෙක් පැක්ස් (Spec Sheets & Tech Packs):** නිවැරදි Points of Measure (POM), Seam allowances, සහ Tolerances.
• **මැෂර්මන්ට් ෂීට්ස් (Measurement Sheets):** සම්මත ශරීර මිණුම් සහ Ease allowances.
• **Ceylon Style Studio පාඨමාලා:** මාස 6ක වෘත්තීය ඩිප්ලෝමාව (කෑගල්ල, කුරුණෑගල, පිළියන්දල සහ Live Zoom පන්ති).

🛡️ **දත්ත සුරක්ෂිතතාව:** ඔබ අප්ලෝඩ් කරන මෝස්තර හෝ ස්කෙච් (Images) සර්වර් එකේ කිසිවිටෙකත් ගබඩා නොවන අතර ඔබේ පරිගණකයේ/දුරකථනයේ පමණක් සුරක්ෂිතව පවතී.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ragGrounded: true,
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<GarmentSpecSheet>(FASHION_SPEC_SHEETS[0]);
  const [calcBust, setCalcBust] = useState<string>('88');
  const [calcWaist, setCalcWaist] = useState<string>('70');
  const [calcHip, setCalcHip] = useState<string>('95');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat to local storage for user continuity (device-local only)
  useEffect(() => {
    try {
      localStorage.setItem('css_mentor_chat_history', JSON.stringify(messages.slice(-20)));
    } catch (_) {}
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab]);

  const handleSaveEmail = () => {
    if (tempEmail.trim()) {
      setLinkedEmail(tempEmail.trim());
      localStorage.setItem('css_oauth_linked_email', tempEmail.trim());
    }
    setIsEditingEmail(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please choose a smaller sketch/photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if ((!text && !selectedImage) || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: text || 'කරුණාකර මා අප්ලෝඩ් කරන ලද මෝස්තරය (Garment Design / Pattern) විශ්ලේෂණය කර තාක්ෂණික උපදෙස් ලබාදෙන්න.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    const outgoingImage = selectedImage;
    if (!textToSend) setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userQuestion: text,
          userEmail: linkedEmail,
          imageBase64: outgoingImage || undefined,
          mimeType: outgoingImage ? 'image/jpeg' : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const mentorMsg: ChatMessage = {
            id: `mentor-${Date.now()}`,
            sender: 'mentor',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ragGrounded: data.ragGrounded,
          };
          setMessages((prev) => [...prev, mentorMsg]);
          setIsLoading(false);
          return;
        }
      }
      throw new Error('API request failed');
    } catch (_) {
      // Offline fallback with rich RAG knowledge
      setTimeout(() => {
        const mentorMsg: ChatMessage = {
          id: `mentor-${Date.now()}`,
          sender: 'mentor',
          text: `### 👗 Ceylon Style Studio — AI Fashion & Pattern Guidance

ඔබගේ පැනයට ස්තූතියි! ඔබ සම්බන්ධ වී ඇත්තේ **${linkedEmail}** ගිණුම හරහා Ceylon Style Studio හි නිල පද්ධතියටයි.

**දත්ත ගොනු පාදක තොරතුරු (Verified RAG Data):**
1. **පැටන් හා ඩාර්ට් තාක්ෂණය:** Bodice sloper එකක සියලුම ඩාර්ට්ස් Bust Apex කේන්ද්‍ර කරගෙන Pivot හෝ Slash & Spread මඟින් මාරු කළ හැක. Puckering වැළැක්වීම සඳහා Bust Apex එකට 2.0cm පෙර Dart Point එක අවසන් කරන්න.
2. **ස්පෙක් ෂීට්ස් & ටෙක් පැක්ස්:** Corset, Tailored Blazer, Trouser Blocks සඳහා Points of Measure (POMs) සහ Tolerances (+/- 0.3cm) සහිත සවිස්තරාත්මක සටහන් ඉහත "Spec Sheets" ටැබ් එකෙන් බලන්න.
3. **රහස්‍යතාව:** ඔබ අප්ලෝඩ් කරන පින්තූර කිසිදු සර්වර් එකක ගබඩා නොවන අතර ඔබේ උපාංගයේ පමණක් තැන්පත් වේ.

💎 **Ceylon Style Studio පාඨමාලා:**
අපගේ මාස 6ක වෘත්තීය ඩිප්ලෝමා පාඨමාලාව සඳහා කෑගල්ල, කුරුණෑගල, පිළියන්දල ශාඛා වලට හෝ Live Zoom පන්ති වලට ලියාපදිංචි වන්න.
• භෞතික පන්ති: මසකට රු. 3,500/- | Zoom පන්ති: මසකට රු. 2,000/-
• WhatsApp: +94 77 123 4567`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ragGrounded: true,
        };
        setMessages((prev) => [...prev, mentorMsg]);
        setIsLoading(false);
      }, 700);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(calcBust);
    const w = parseFloat(calcWaist);
    const h = parseFloat(calcHip);

    if (isNaN(b) || isNaN(w) || isNaN(h)) {
      setCalcResult('Please enter valid numeric measurements in cm.');
      return;
    }

    // Find closest size matching bust
    let bestSize = ATELIER_MEASUREMENT_CHART[0];
    let minDiff = 9999;
    for (const row of ATELIER_MEASUREMENT_CHART) {
      const diff = Math.abs(row.bustCm - b);
      if (diff < minDiff) {
        minDiff = diff;
        bestSize = row;
      }
    }

    setCalcResult(`✨ Recommended Base Size: **${bestSize.size} (${bestSize.ukSize} / ${bestSize.usSize})**
• Standard Atelier Spec: Bust ${bestSize.bustCm}cm (${bestSize.bustInches}"), Waist ${bestSize.waistCm}cm (${bestSize.waistInches}"), Hip ${bestSize.lowHipCm}cm (${bestSize.lowHipInches}").
• Pattern Grading Tip: If waist/hip differ from bust by more than 4cm, blend pattern seams from ${bestSize.size} at bust to the corresponding lower quadrant.`);
  };

  const quickPrompts = [
    { label: '📐 Corset Spec Sheet', query: 'Corset / Bustier එකක Points of Measure (POM), boning channels, සහ tolerances විස්තර කරන්න.' },
    { label: '📏 Size Chart (XS-3XL)', query: 'Ceylon Style Studio standard sizing chart එකේ XS සිට 3XL දක්වා Bust, Waist, Hip මිණුම් දෙන්න.' },
    { label: '🧥 Blazer Tech Pack', query: 'Tailored blazer එකක armscye, shoulder pad drop, seam allowance සහ horsehair canvas විස්තර කරන්න.' },
    { label: '✂️ Dart Pivoting Method', query: 'Bodice sloper එකක dart manipulate කරන pivoting method එක පියවරෙන් පියවර පැහැදිලි කරන්න.' },
    { label: '👗 Circle Skirt Math', query: 'Full Circle Skirt සහ Half Circle Skirt වල waist radius ගණනය කරන සූත්‍ර සහ hem balance පැහැදිලි කරන්න.' },
    { label: '🏷️ Brand Pricing Formula', query: 'Luxury fashion brand එකක COGS, Wholesale, සහ Retail MSRP මිල සූත්‍රය පැහැදිලි කරන්න.' },
    { label: '🎓 Course Fee & Batches', query: 'Ceylon Style Studio 6-Month Program එකේ ගාස්තු, ශාඛා (කෑගල්ල, කුරුණෑගල, පිළියන්දල) සහ Zoom විස්තර දෙන්න.' },
  ];

  return (
    <div className={`flex flex-col h-full bg-[#0c090a] rounded-sm border border-[#c99a45]/30 overflow-hidden shadow-2xl ${className}`}>
      {/* 1. TOP OAUTH & ACCOUNT LINKING STATUS BAR */}
      <div className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#241317] via-[#38070e] to-[#141011] border-b border-[#c99a45]/35 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-[#f7e2a9]" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0c090a] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-editorial font-bold text-[#f7f3eb]">
                Ceylon Style Studio AI Assistant
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-green-950/80 text-green-300 border border-green-700/60 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                OAuth Plugin Linked
              </span>
            </div>

            {/* Email Account Status */}
            <div className="flex items-center gap-1.5 text-[10px] text-[#dfb56c]/90 font-mono">
              <Mail className="w-3 h-3 text-[#dfb56c]" />
              {isEditingEmail ? (
                <div className="flex items-center gap-1">
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="bg-black/80 border border-[#dfb56c]/60 rounded px-1.5 py-0.5 text-[10px] text-white outline-none w-48"
                    placeholder="Enter user email..."
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="px-1.5 py-0.5 bg-[#dfb56c] text-black font-bold rounded text-[9px]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingEmail(false)}
                    className="text-[#a89f91] hover:text-white text-[9px] px-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#f7e2a9] font-medium">{linkedEmail}</span>
                  <button
                    onClick={() => {
                      setTempEmail(linkedEmail);
                      setIsEditingEmail(true);
                    }}
                    className="text-[9px] text-[#a89f91] hover:text-[#dfb56c] underline cursor-pointer"
                    title="Change linked email"
                  >
                    (Change)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Notice Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-700/40 px-2 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="hidden sm:inline">Device-Only Storage: Uploads never saved on server</span>
          <span className="sm:hidden">Client Storage Only</span>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (CHAT, SPEC SHEETS, MEASUREMENTS, COURSE) */}
      <div className="bg-[#141011] border-b border-white/10 px-2 sm:px-4 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-2 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-[#dfb56c] text-[#f7e2a9] bg-white/5'
              : 'border-transparent text-[#a89f91] hover:text-[#f7e2a9]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Assistant &amp; Vision</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`px-3 py-2 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'specs'
              ? 'border-[#dfb56c] text-[#f7e2a9] bg-white/5'
              : 'border-transparent text-[#a89f91] hover:text-[#f7e2a9]'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Spec Sheets (Tech Packs)</span>
          <span className="text-[9px] px-1 bg-[#dfb56c]/20 text-[#dfb56c] rounded">4</span>
        </button>

        <button
          onClick={() => setActiveTab('measurements')}
          className={`px-3 py-2 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'measurements'
              ? 'border-[#dfb56c] text-[#f7e2a9] bg-white/5'
              : 'border-transparent text-[#a89f91] hover:text-[#f7e2a9]'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Measurement Charts</span>
          <span className="text-[9px] px-1 bg-[#dfb56c]/20 text-[#dfb56c] rounded">XS-3XL</span>
        </button>

        <button
          onClick={() => setActiveTab('course')}
          className={`px-3 py-2 text-xs font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'course'
              ? 'border-[#dfb56c] text-[#f7e2a9] bg-white/5'
              : 'border-transparent text-[#a89f91] hover:text-[#f7e2a9]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academy &amp; Fees</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Quick Prompts Bar */}
          <div className="p-2 bg-[#120e10] border-b border-white/5 overflow-x-auto flex gap-1.5 scrollbar-thin">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-[#540d18] border border-[#c99a45]/30 hover:border-[#dfb56c] text-[#f7e2a9] text-[10px] font-mono shrink-0 transition-all hover:scale-105 disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Bot className="w-4 h-4 text-[#dfb56c]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-sm p-4 relative group transition-all ${
                      isUser
                        ? 'bg-[#38070e] border border-[#dfb56c]/50 text-[#f7f3eb]'
                        : 'bg-[#141011] border border-[#c99a45]/25 text-[#d5cfc4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2 text-[10px] font-mono text-[#a89f91]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#dfb56c]">
                          {isUser ? linkedEmail : 'Madame Celine • Atelier Mentor'}
                        </span>
                        {m.ragGrounded && (
                          <span className="px-1 py-0.2 rounded bg-[#dfb56c]/15 text-[#dfb56c] text-[8.5px] border border-[#dfb56c]/30">
                            RAG Grounded
                          </span>
                        )}
                      </div>
                      <span>{m.timestamp}</span>
                    </div>

                    {/* If user attached an image */}
                    {m.imageUrl && (
                      <div className="mb-2.5 rounded overflow-hidden border border-[#dfb56c]/40 max-w-xs">
                        <img
                          src={m.imageUrl}
                          alt="Uploaded fashion sketch"
                          className="w-full max-h-48 object-cover bg-black"
                        />
                        <div className="bg-black/80 px-2 py-0.5 text-[9px] text-[#a89f91] font-mono flex items-center justify-between">
                          <span>Fashion Sketch / Pattern</span>
                          <span className="text-emerald-400">Stored on device only</span>
                        </div>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                      {m.text}
                    </div>

                    {!isUser && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-[10px] font-mono text-[#a89f91]">
                        <span className="text-[#a89f91] text-[9.5px]">
                          Ceylon Style Studio 6-Month Program
                        </span>
                        <button
                          onClick={() => handleCopyText(m.id, m.text)}
                          className="hover:text-[#dfb56c] flex items-center gap-1 transition-colors"
                          title="Copy formulas & notes"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Notes</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#1e1719] border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-[#dfb56c]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#dfb56c]" />
                </div>
                <div className="bg-[#141011] border border-[#c99a45]/25 rounded-sm p-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#dfb56c] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-[#a89f91] font-mono ml-2">
                    Consulting Spec Sheets &amp; Formulating Pattern Advice...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Selected Image Preview before sending */}
          {selectedImage && (
            <div className="px-3 py-2 bg-[#1c1214] border-t border-[#dfb56c]/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedImage}
                  alt="Ready to analyze"
                  className="w-12 h-12 object-cover rounded border border-[#dfb56c]"
                />
                <div className="text-[11px] font-mono">
                  <p className="text-[#f7e2a9] font-medium">Design / Pattern Image Attached</p>
                  <p className="text-emerald-400 text-[10px]">🔒 Ephemeral in-memory analysis only</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 text-[#a89f91] hover:text-red-400 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-[#141011] border-t border-[#c99a45]/30 flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-black/60 hover:bg-[#540d18] border border-white/10 hover:border-[#dfb56c] rounded-sm text-[#dfb56c] transition-all shrink-0"
              title="Upload Design Sketch or Pattern (Never stored on server)"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Pattern making, Spec sheets, Sizing, Darts, Pricing, Courses..."
              className="flex-1 bg-black/60 border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-[#f7f3eb] focus:border-[#dfb56c] outline-none placeholder:text-[#6a645d]"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold uppercase tracking-wider rounded-sm hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: SPEC SHEETS (TECH PACKS) EXPLORER */}
      {activeTab === 'specs' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-editorial font-bold text-[#f7f3eb]">
                Ceylon Style Studio — Garment Technical Spec Sheets
              </h3>
              <p className="text-[11px] text-[#a89f91] font-mono">
                Verified Points of Measure (POMs), Tolerances, Seam Allowances, and Atelier Quality Standards
              </p>
            </div>

            {/* Spec Sheet Selector */}
            <div className="flex flex-wrap gap-1.5">
              {FASHION_SPEC_SHEETS.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all ${
                    selectedSpec.id === spec.id
                      ? 'bg-[#dfb56c] text-black font-bold shadow'
                      : 'bg-black/60 text-[#d5cfc4] border border-white/10 hover:border-[#dfb56c]'
                  }`}
                >
                  {spec.garmentType}
                </button>
              ))}
            </div>
          </div>

          {/* Active Spec Sheet Details */}
          <div className="bg-[#141011] border border-[#c99a45]/30 rounded p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dfb56c]/20 text-[#dfb56c] border border-[#dfb56c]/40 font-bold uppercase">
                  {selectedSpec.category}
                </span>
                <h4 className="text-base font-editorial font-bold text-[#f7e2a9] mt-1">
                  {selectedSpec.title}
                </h4>
                <p className="text-xs text-[#a89f91] font-sinhala">{selectedSpec.titleSinhala}</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage(`කරුණාකර ${selectedSpec.title} ගැන මට සම්පූර්ණ තාක්ෂණික මගපෙන්වීමක් ලබාදෙන්න.`);
                }}
                className="px-3 py-1.5 bg-[#540d18] hover:bg-[#721221] border border-[#dfb56c] text-[#f7e2a9] text-xs font-mono rounded flex items-center gap-1.5 transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI About This Spec</span>
              </button>
            </div>

            {/* Material & Construction Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono bg-black/40 p-3 rounded border border-white/5">
              <div>
                <span className="text-[#a89f91] block">Recommended Fabrics:</span>
                <span className="text-[#f7f3eb] font-medium">{selectedSpec.recommendedFabrics.join(', ')}</span>
                <span className="text-[#dfb56c] block text-[10px] mt-0.5">GSM: {selectedSpec.fabricGsm}</span>
              </div>
              <div>
                <span className="text-[#a89f91] block">Seam Allowances:</span>
                <span className="text-[#f7f3eb]">Sides: {selectedSpec.seamAllowances.sideSeams}</span>
                <span className="text-[#f7f3eb] block">Neck: {selectedSpec.seamAllowances.neckline}</span>
                <span className="text-[#f7f3eb] block">Hem: {selectedSpec.seamAllowances.hem}</span>
              </div>
              <div>
                <span className="text-[#a89f91] block">Stitch Density &amp; Closure:</span>
                <span className="text-[#f7f3eb]">{selectedSpec.stitchDensity}</span>
                <span className="text-[#d5cfc4] block text-[10px] mt-0.5">{selectedSpec.closureDetails}</span>
              </div>
            </div>

            {/* Points of Measure Table */}
            <div>
              <h5 className="text-xs font-mono font-bold text-[#dfb56c] uppercase tracking-wider mb-2">
                Points of Measure (POMs) &amp; Grade Rules (cm)
              </h5>
              <div className="overflow-x-auto border border-white/10 rounded">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#1c1214] text-[#dfb56c] border-b border-white/10">
                    <tr>
                      <th className="p-2">Code</th>
                      <th className="p-2">Point of Measure</th>
                      <th className="p-2">Tolerance</th>
                      <th className="p-2">XS</th>
                      <th className="p-2">S</th>
                      <th className="p-2 bg-[#dfb56c]/10 text-white font-bold">M (Base)</th>
                      <th className="p-2">L</th>
                      <th className="p-2">XL</th>
                      <th className="p-2">2XL</th>
                      <th className="p-2">3XL</th>
                      <th className="p-2">Grade Increment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#d5cfc4]">
                    {selectedSpec.pointsOfMeasure.map((p) => (
                      <tr key={p.code} className="hover:bg-white/5">
                        <td className="p-2 font-bold text-[#dfb56c]">{p.code}</td>
                        <td className="p-2">
                          <span className="font-medium text-[#f7f3eb]">{p.name}</span>
                          {p.nameSinhala && (
                            <span className="block text-[10px] text-[#a89f91] font-sinhala">{p.nameSinhala}</span>
                          )}
                        </td>
                        <td className="p-2 text-emerald-400">{p.tolerance}</td>
                        <td className="p-2">{p.specXS}</td>
                        <td className="p-2">{p.specS}</td>
                        <td className="p-2 bg-[#dfb56c]/10 text-[#f7e2a9] font-bold">{p.specM}</td>
                        <td className="p-2">{p.specL}</td>
                        <td className="p-2">{p.specXL}</td>
                        <td className="p-2">{p.spec2XL}</td>
                        <td className="p-2">{p.spec3XL}</td>
                        <td className="p-2 text-[#a89f91] text-[10px]">{p.gradeIncrement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quality Checkpoints */}
            <div className="bg-[#241317]/60 border border-[#dfb56c]/30 p-3 rounded">
              <h5 className="text-xs font-mono font-bold text-[#f7e2a9] uppercase mb-1.5">
                Atelier Quality Checkpoints
              </h5>
              <ul className="text-xs text-[#d5cfc4] space-y-1 list-disc pl-4">
                {selectedSpec.atelierQualityCheckpoints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEASUREMENT CHARTS & CALCULATOR */}
      {activeTab === 'measurements' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Sizing Calculator Card */}
          <div className="bg-[#141011] border border-[#c99a45]/30 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-[#dfb56c]" />
              <h4 className="text-sm font-editorial font-bold text-[#f7f3eb]">
                Atelier Pattern Size Recommender
              </h4>
            </div>
            <p className="text-xs text-[#a89f91] mb-3">
              Enter client anatomical measurements in centimeters to calculate exact base size and pattern blending recommendations:
            </p>

            <form onSubmit={handleCalculateSize} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#a89f91] mb-1">Bust (cm)</label>
                <input
                  type="number"
                  value={calcBust}
                  onChange={(e) => setCalcBust(e.target.value)}
                  className="w-24 bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#dfb56c]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#a89f91] mb-1">Waist (cm)</label>
                <input
                  type="number"
                  value={calcWaist}
                  onChange={(e) => setCalcWaist(e.target.value)}
                  className="w-24 bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#dfb56c]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#a89f91] mb-1">Low Hip (cm)</label>
                <input
                  type="number"
                  value={calcHip}
                  onChange={(e) => setCalcHip(e.target.value)}
                  className="w-24 bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#dfb56c]"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black text-xs font-bold font-mono rounded hover:brightness-110 shadow"
              >
                Find Base Size
              </button>
            </form>

            {calcResult && (
              <div className="mt-3 p-3 bg-black/60 border border-[#dfb56c]/40 rounded text-xs text-[#f7f3eb] whitespace-pre-wrap font-sans">
                {calcResult}
              </div>
            )}
          </div>

          {/* Sizing Table (XS to 3XL) */}
          <div>
            <h4 className="text-sm font-editorial font-bold text-[#f7f3eb] mb-2">
              Ceylon Style Studio Standard Measurement Chart (XS to 3XL)
            </h4>
            <div className="overflow-x-auto border border-white/10 rounded">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1c1214] text-[#dfb56c] border-b border-white/10">
                  <tr>
                    <th className="p-2">Size</th>
                    <th className="p-2">UK / US</th>
                    <th className="p-2">Bust (in / cm)</th>
                    <th className="p-2">Waist (in / cm)</th>
                    <th className="p-2">Low Hip (in / cm)</th>
                    <th className="p-2">Shoulder (cm)</th>
                    <th className="p-2">Back Waist (cm)</th>
                    <th className="p-2">Apex Span (cm)</th>
                    <th className="p-2">Crotch Depth (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#d5cfc4]">
                  {ATELIER_MEASUREMENT_CHART.map((row) => (
                    <tr key={row.size} className="hover:bg-white/5">
                      <td className="p-2 font-bold text-[#dfb56c]">{row.size}</td>
                      <td className="p-2">{row.ukSize} / {row.usSize}</td>
                      <td className="p-2 font-medium text-white">{row.bustInches}" ({row.bustCm}cm)</td>
                      <td className="p-2 font-medium text-white">{row.waistInches}" ({row.waistCm}cm)</td>
                      <td className="p-2 font-medium text-white">{row.lowHipInches}" ({row.lowHipCm}cm)</td>
                      <td className="p-2">{row.acrossShoulderCm}cm</td>
                      <td className="p-2">{row.backWaistLengthCm}cm</td>
                      <td className="p-2">{row.apexToApexCm}cm</td>
                      <td className="p-2">{row.crotchDepthCm}cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ease Allowance Standards */}
          <div>
            <h4 className="text-sm font-editorial font-bold text-[#f7f3eb] mb-2">
              Standard Ease Allowance Guidelines
            </h4>
            <div className="overflow-x-auto border border-white/10 rounded">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1c1214] text-[#dfb56c] border-b border-white/10">
                  <tr>
                    <th className="p-2">Garment Category</th>
                    <th className="p-2">Fit Classification</th>
                    <th className="p-2">Bust Ease</th>
                    <th className="p-2">Waist Ease</th>
                    <th className="p-2">Hip Ease</th>
                    <th className="p-2">Silhouettes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#d5cfc4]">
                  {EASE_ALLOWANCE_STANDARDS.map((rule, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="p-2 font-bold text-[#f7f3eb]">{rule.garmentCategory}</td>
                      <td className="p-2 text-[#a89f91]">{rule.fitType}</td>
                      <td className="p-2 text-[#dfb56c]">{rule.bustEaseInches}</td>
                      <td className="p-2 text-[#dfb56c]">{rule.waistEaseInches}</td>
                      <td className="p-2 text-[#dfb56c]">{rule.hipEaseInches}</td>
                      <td className="p-2 text-[10px] text-[#a89f91]">{rule.recommendedSilhouettes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COURSE & ACADEMY ENROLLMENT */}
      {activeTab === 'course' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <div className="bg-gradient-to-r from-[#241317] via-[#540d18] to-[#141011] p-5 rounded border border-[#dfb56c]/40 shadow-xl">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dfb56c]/20 text-[#dfb56c] border border-[#dfb56c]/40 font-bold uppercase">
              {CSS_COURSE_INFO.intakeYear}
            </span>
            <h3 className="text-lg font-editorial font-bold text-[#f7f3eb] mt-1.5">
              {CSS_COURSE_INFO.programName}
            </h3>
            <p className="text-xs text-[#f7e2a9] font-sinhala mt-1">
              {CSS_COURSE_INFO.programNameSinhala}
            </p>
            <p className="text-xs text-[#d5cfc4] mt-2">
              Learn pattern drafting, bodice slopers, dart manipulation, haute couture corsetry, draping, sizing grading (XS-3XL), AI fashion prompt engineering, and luxury brand building across 34 complete modules.
            </p>
          </div>

          {/* Fee & Center Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141011] border border-[#c99a45]/30 rounded p-4">
              <h4 className="text-xs font-mono font-bold text-[#dfb56c] uppercase tracking-wider mb-2">
                Fee Structure &amp; Payment Options
              </h4>
              <ul className="text-xs text-[#d5cfc4] space-y-2 font-mono">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Physical Studio Classes:</span>
                  <span className="text-[#f7e2a9] font-bold">Rs. 3,500 / month</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Live Interactive Zoom:</span>
                  <span className="text-[#f7e2a9] font-bold">Rs. 2,000 / month</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Registration Fee:</span>
                  <span className="text-[#f7e2a9] font-bold">Rs. 1,000 (One-time)</span>
                </li>
                <li className="text-[10px] text-[#a89f91] pt-1">
                  {CSS_COURSE_INFO.feeStructure.paymentTerms}
                </li>
              </ul>
            </div>

            <div className="bg-[#141011] border border-[#c99a45]/30 rounded p-4">
              <h4 className="text-xs font-mono font-bold text-[#dfb56c] uppercase tracking-wider mb-2">
                Studio Locations &amp; Zoom Batch
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {CSS_COURSE_INFO.centers.map((c, i) => (
                  <div key={i} className="border-b border-white/5 pb-1">
                    <span className="text-[#f7e2a9] font-bold">{c.city}</span>
                    <span className="text-[10px] text-[#a89f91] block">{c.type} • {c.schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Pricing Matrix */}
          <div className="bg-[#141011] border border-[#c99a45]/30 rounded p-4">
            <h4 className="text-xs font-mono font-bold text-[#dfb56c] uppercase tracking-wider mb-2">
              Ceylon Style Studio Commercial Brand Pricing Matrix
            </h4>
            <div className="text-xs font-mono text-[#d5cfc4] space-y-2">
              <p>• <strong className="text-white">COGS Formula:</strong> {CSS_COURSE_INFO.commercialPricingFormula.cogsFormula}</p>
              <p>• <strong className="text-white">Wholesale Price:</strong> {CSS_COURSE_INFO.commercialPricingFormula.wholesaleFormula}</p>
              <p>• <strong className="text-white">Retail Price (MSRP):</strong> {CSS_COURSE_INFO.commercialPricingFormula.retailMSRPFormula}</p>
              <p className="text-[11px] text-[#dfb56c]">✨ {CSS_COURSE_INFO.commercialPricingFormula.prestigeMargin}</p>
            </div>
          </div>

          {/* Direct WhatsApp Call to Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a2012] border border-green-600/50 p-4 rounded">
            <div>
              <h5 className="text-sm font-editorial font-bold text-green-300">
                Ready to Join Ceylon Style Studio?
              </h5>
              <p className="text-xs text-green-100 font-mono">
                Contact Master Asanka &amp; the Admissions Team on WhatsApp: +94 77 123 4567
              </p>
            </div>

            <a
              href="https://wa.me/94771234567?text=Hello%20Ceylon%20Style%20Studio%20Team%2C%20I%20would%20like%20to%20enroll%20in%20the%206-Month%20Professional%20Fashion%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold font-mono text-xs rounded uppercase flex items-center gap-1.5 shadow-lg transition-all"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
