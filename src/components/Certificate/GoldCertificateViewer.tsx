import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  Sparkles,
  Download,
  CheckCircle,
  Shield,
  Printer,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Crown
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import jsPDF from 'jspdf';

export const GoldCertificateViewer: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const { studentUser } = useAuth();
  const { siteSettings } = useData();

  // Template settings from backend CMS (with robust fallbacks)
  const certLogo = (siteSettings.certLogoUrl && siteSettings.certLogoUrl.trim()) || (siteSettings.logoUrl && siteSettings.logoUrl.trim()) || null;
  const academyTitle = siteSettings.certAcademyTitle || 'CEYLON STYLE STUDIO';
  const academySubTitle =
    siteSettings.certSubTitle ||
    'GOVERNMENT REGISTERED PROFESSIONAL ACADEMY OF APPAREL & BRAND DESIGN';
  const awardPhrase = siteSettings.certAwardText || 'This is to solemnly certify that';
  const defaultCourseTitle =
    siteSettings.certCourseTitle ||
    'Professional Diploma in Haute Couture & Fashion Brand Architecture';
  const curriculumDescription =
    siteSettings.certDescription ||
    'Demonstrating mastery in haute couture garment construction, computer-aided apparel design, digital branding, and luxury atelier business execution.';
  const signatory1Name = siteSettings.certSignatory1Name || 'Asanka Garments & Design';
  const signatory1Title = siteSettings.certSignatory1Title || 'Lead Couturier & Master Designer';
  const signatory2Name =
    siteSettings.certSignatory2Name || 'Academic Council & Examination Board';
  const signatory2Title = siteSettings.certSignatory2Title || 'Registrar & Examination Board';
  const certAccentColor = siteSettings.certBorderColor || '#dfb56c';

  const [studentName, setStudentName] = useState<string>(
    studentUser?.fullName || 'Kavindu Dilshan Perera'
  );
  const [regNumber, setRegNumber] = useState<string>(
    studentUser?.regNumber || 'CSS-2026-0842'
  );
  const [specialization, setSpecialization] = useState<string>(defaultCourseTitle);
  const [issueDate] = useState<string>('October 2026');
  const [copied, setCopied] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Update default specialization when backend template changes
  useEffect(() => {
    if (siteSettings.certCourseTitle && !studentUser) {
      setSpecialization(siteSettings.certCourseTitle);
    }
  }, [siteSettings.certCourseTitle, studentUser]);

  const certRef = useRef<HTMLDivElement | null>(null);

  // Dynamic metallic light sheen calculation based on mouse hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Direct PDF Download of the Official Diploma
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background Luxury Dark Tint
      doc.setFillColor(14, 10, 11);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Outer Gold Guilloche Border
      doc.setDrawColor(201, 154, 69);
      doc.setLineWidth(1.5);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // Inner Fine Gold Line
      doc.setDrawColor(223, 181, 108);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Corner Accents
      const drawCorner = (x: number, y: number) => {
        doc.setFillColor(223, 181, 108);
        doc.circle(x, y, 2, 'F');
      };
      drawCorner(15, 15);
      drawCorner(pageWidth - 15, 15);
      drawCorner(15, pageHeight - 15);
      drawCorner(pageWidth - 15, pageHeight - 15);

      // Academy Header
      doc.setFont('times', 'bold');
      doc.setTextColor(223, 181, 108);
      doc.setFontSize(22);
      doc.text(academyTitle.toUpperCase(), pageWidth / 2, 38, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(184, 175, 162);
      doc.setFontSize(8.5);
      doc.text(academySubTitle.toUpperCase(), pageWidth / 2, 45, {
        align: 'center',
      });

      // Diploma Title / Awarding Phrase
      doc.setFont('times', 'italic');
      doc.setTextColor(247, 243, 235);
      doc.setFontSize(13);
      doc.text(awardPhrase, pageWidth / 2, 60, { align: 'center' });

      // Student Name in Gold
      doc.setFont('times', 'bold');
      doc.setTextColor(247, 226, 169);
      doc.setFontSize(26);
      doc.text(studentName.toUpperCase(), pageWidth / 2, 75, { align: 'center' });

      // Fine Underline
      doc.setDrawColor(201, 154, 69);
      doc.setLineWidth(0.8);
      doc.line(pageWidth / 2 - 50, 78, pageWidth / 2 + 50, 78);

      // Conferral Text
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(213, 207, 196);
      doc.setFontSize(10);
      doc.text(
        'has successfully completed the comprehensive curriculum and demonstrated distinction in',
        pageWidth / 2,
        90,
        { align: 'center' }
      );

      // Specialization
      doc.setFont('times', 'bold');
      doc.setTextColor(223, 181, 108);
      doc.setFontSize(14.5);
      doc.text(specialization, pageWidth / 2, 101, { align: 'center' });

      // Curriculum Details
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(168, 159, 145);
      doc.setFontSize(8.5);
      doc.text(curriculumDescription, pageWidth / 2, 111, {
        align: 'center',
        maxWidth: 220,
      });

      // Metadata Block
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(201, 154, 69);
      doc.text(
        `REG NO: ${regNumber}    |    DATE: ${issueDate}    |    SECURITY ID: CSS-SL-VERIFIED`,
        pageWidth / 2,
        132,
        {
          align: 'center',
        }
      );

      // Signatures
      doc.setDrawColor(201, 154, 69);
      doc.setLineWidth(0.4);
      doc.line(40, 165, 95, 165);
      doc.line(pageWidth - 95, 165, pageWidth - 40, 165);

      doc.setFont('times', 'bold');
      doc.setTextColor(247, 243, 235);
      doc.setFontSize(10);
      doc.text(signatory1Name, 67.5, 171, { align: 'center' });
      doc.text(signatory2Name, pageWidth - 67.5, 171, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 130, 120);
      doc.setFontSize(8);
      doc.text(signatory1Title, 67.5, 176, { align: 'center' });
      doc.text(signatory2Title, pageWidth - 67.5, 176, { align: 'center' });

      // Save PDF
      doc.save(`CSS_Diploma_${studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(`https://ceylonstylestudio.lk/verify/${regNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="certificate" className="py-24 bg-[#0c090a] relative border-t border-[#c99a45]/20 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#dfb56c]/10 via-[#540d18]/15 to-[#dfb56c]/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#540d18]/40 border border-[#dfb56c]/30 text-[#dfb56c] text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>
              {isSinhalaMode
                ? 'නිල පිළිගත් ඩිප්ලෝමා සහතිකය'
                : 'Accredited Fashion Diploma'}
            </span>
          </div>

          {/* User Request: Title in PURE GOLD COLOR for every character! */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-editorial font-bold tracking-tight mb-4">
            {isSinhalaMode ? (
              <span className="gold-gradient-text tracking-wide drop-shadow-[0_2px_12px_rgba(201,154,69,0.5)]">
                රන් ආලේපිත ඩිප්ලෝමා සහතික පෙරදසුන
              </span>
            ) : (
              <span className="gold-gradient-text tracking-wide drop-shadow-[0_2px_12px_rgba(201,154,69,0.5)]">
                Official Gold-Foil Embossed Diploma
              </span>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#b8afa2] font-sinhala leading-relaxed">
            {isSinhalaMode
              ? 'මාස 6ක පූර්ණ පාඨමාලාව සාර්ථකව අවසන් කරන ශිෂ්‍යයින්ට පිරිනැමෙන නිල රාජකීය ඩිප්ලෝමා සහතිකය. ඔබගේ නම ඇතුළත් කර සහතිකයේ රන් ආලේපිත පෙනුම සජීවීව පරීක්ෂා කරන්න (Interactive Live Preview).'
              : 'Presented to graduates upon completing the 6-Month Professional Program. Enter your name below to experience the real-time embossed gold-foil reflection, wax seal, and cryptographic verification.'}
          </p>
        </div>

        {/* Certificate Customizer Bar */}
        <div className="max-w-4xl mx-auto mb-8 bg-[#141011] p-4 rounded-sm border border-[#c99a45]/30 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-mono uppercase text-[#dfb56c] mb-1 font-semibold">
              {isSinhalaMode ? 'ඔබගේ නම (Student Full Name)' : 'Student Name (On Certificate)'}
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Kavindu Perera"
              className="w-full px-3 py-2 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-mono uppercase text-[#dfb56c] mb-1 font-semibold">
              {isSinhalaMode ? 'විශේෂීකරණ ක්ෂේත්‍රය' : 'Specialization Track'}
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 bg-[#0c090a] border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] outline-none cursor-pointer"
            >
              <option value={defaultCourseTitle}>
                {defaultCourseTitle}
              </option>
              <option value="Mastery in AI Fashion Technology & 3D Pattern CAD">
                AI Fashion Tech &amp; Digital CAD
              </option>
              <option value="Luxury Fashion Business & Global E-Commerce Launch">
                Fashion Business &amp; E-Commerce
              </option>
              <option value="Advanced Haute Couture Draping & Tailoring Masterclass">
                Haute Couture Draping &amp; Tailoring
              </option>
            </select>
          </div>

          <div className="sm:col-span-3 flex sm:justify-end gap-2 pt-2 sm:pt-4">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-2 px-3 bg-gradient-to-r from-[#dfb56c] to-[#c99a45] hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              title="Download A4 PDF Diploma"
            >
              <Download className="w-3.5 h-3.5 fill-black" />
              <span>{isSinhalaMode ? 'PDF බාගන්න' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* The Luxury Certificate Interactive Canvas Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={certRef}
            onMouseMove={handleMouseMove}
            className="relative bg-[#110d0f] rounded-sm p-6 sm:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-2 select-none transition-all duration-300 overflow-hidden"
            style={{
              borderColor: certAccentColor,
              backgroundImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(247, 226, 169, 0.18) 0%, rgba(201, 154, 69, 0.05) 35%, transparent 70%)`,
            }}
          >
            {/* Watermark of Academy Brand Logo in Certificate Background */}
            {certLogo && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06] select-none z-0 overflow-hidden"
                style={{ filter: 'grayscale(100%) brightness(180%)' }}
              >
                <img src={certLogo} alt="Watermark Crest" className="w-80 h-80 object-contain" />
              </div>
            )}

            {/* Guilloche Fine Gold Inner Border */}
            <div className="border border-[#dfb56c]/60 p-4 sm:p-8 relative z-10">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#dfb56c]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#dfb56c]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#dfb56c]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#dfb56c]" />

              {/* Certificate Header with DYNAMIC LOGO */}
              <div className="text-center space-y-1 mb-8">
                {/* Dynamically Rendered Brand Logo or Royal Crest */}
                <div className="w-14 h-14 rounded-full bg-[#1e1316] border-2 border-[#dfb56c] flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_15px_rgba(223,181,108,0.4)] overflow-hidden p-1.5">
                  {certLogo ? (
                    <img
                      src={certLogo}
                      alt={academyTitle}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  ) : (
                    <Shield className="w-7 h-7 text-[#f7e2a9]" />
                  )}
                </div>

                <h3 className="text-lg sm:text-2xl font-editorial font-bold tracking-widest text-[#dfb56c] uppercase">
                  {academyTitle}
                </h3>
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#a89f91] block max-w-xl mx-auto">
                  {academySubTitle}
                </span>
              </div>

              {/* Certificate Body */}
              <div className="text-center space-y-4 max-w-2xl mx-auto my-6">
                <p className="text-xs sm:text-sm font-serif-luxury italic text-[#b8afa2]">
                  {awardPhrase}
                </p>

                {/* Embossed Gold Name with Live Shimmer */}
                <div className="py-2">
                  <h4 className="text-2xl sm:text-4xl md:text-5xl font-editorial font-bold text-[#f7e2a9] tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(201,154,69,0.4)]">
                    {studentName || 'STUDENT FULL NAME'}
                  </h4>
                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#dfb56c] to-transparent mx-auto mt-2" />
                </div>

                <p className="text-xs sm:text-sm text-[#d5cfc4] leading-relaxed">
                  has with distinction satisfied all theoretical and practical competencies required for the
                </p>

                <h5 className="text-base sm:text-xl font-editorial font-bold text-[#dfb56c] tracking-wide">
                  {specialization}
                </h5>

                <p className="text-[11px] sm:text-xs text-[#a89f91] max-w-xl mx-auto leading-relaxed">
                  {curriculumDescription}
                </p>
              </div>

              {/* Bottom Footer: Signatures, 3D Wax Seal & Security Code */}
              <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left Signature */}
                <div className="text-center sm:text-left order-2 sm:order-1">
                  <div className="font-editorial text-sm italic text-[#f7e2a9] font-bold mb-0.5 font-serif-luxury">
                    {signatory1Name}
                  </div>
                  <div className="w-36 h-px bg-[#dfb56c]/40 mb-1 mx-auto sm:mx-0" />
                  <span className="text-[10px] uppercase font-mono text-[#a89f91] block">
                    {signatory1Title}
                  </span>
                </div>

                {/* Center 3D Gold Wax Seal */}
                <div className="order-1 sm:order-2 flex flex-col items-center">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#dfb56c] via-[#c99a45] to-[#8c6722] p-1 shadow-[0_6px_20px_rgba(201,154,69,0.5)] flex items-center justify-center border-2 border-[#fff2ce]">
                    <div className="w-full h-full rounded-full border border-dashed border-[#540d18]/60 flex flex-col items-center justify-center text-center overflow-hidden p-1">
                      {certLogo ? (
                        <img
                          src={certLogo}
                          alt="Seal Emblem"
                          className="w-7 h-7 object-contain opacity-90 drop-shadow"
                        />
                      ) : (
                        <Crown className="w-5 h-5 text-[#540d18]" />
                      )}
                      <span className="text-[7px] font-mono font-bold text-[#380910] uppercase tracking-tighter block mt-0.5">
                        OFFICIAL
                      </span>
                      <span className="text-[8px] font-bold text-[#540d18] tracking-widest block">
                        SEAL
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-[#dfb56c] mt-1 tracking-widest uppercase">
                    VERIFIED ACADEMY
                  </span>
                </div>

                {/* Right Signature & Metadata */}
                <div className="text-center sm:text-right order-3">
                  <div className="font-editorial text-sm italic text-[#f7e2a9] font-bold mb-0.5 font-serif-luxury">
                    {signatory2Name}
                  </div>
                  <div className="w-36 h-px bg-[#dfb56c]/40 mb-1 mx-auto sm:ml-auto" />
                  <span className="text-[10px] uppercase font-mono text-[#a89f91] block">
                    {signatory2Title}
                  </span>
                  <span className="text-[9px] font-mono text-[#dfb56c] block mt-1">
                    ID: {regNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Bar Below */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#a89f91] px-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#dfb56c]" />
              <span>
                {isSinhalaMode
                  ? 'ලියාපදිංචි අංකය මගින් ලොව පුරා තහවුරු කළ හැකි සහතිකයකි.'
                  : 'Globally cryptographically verifiable diploma recognized in apparel exports.'}
              </span>
            </div>

            <button
              onClick={handleCopyVerification}
              className="flex items-center gap-1.5 text-[#dfb56c] hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Verification Link Copied!' : 'Copy Verification Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
