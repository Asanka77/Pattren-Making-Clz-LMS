import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Send,
  Copy,
  Check,
  Building,
  Video,
  AlertCircle,
  MessageSquare,
  Lock,
  Heart,
  Target,
  Clock,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { CourseType } from '../types';
import { SRI_LANKA_DISTRICTS } from '../lib/defaults';

interface RegistrationFormProps {
  onOpenStudentDashboard?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onOpenStudentDashboard }) => {
  const { locations, submitRegistration, siteSettings, courses } = useData();
  const { isSinhalaMode } = useLanguage();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [registeredRegNo, setRegisteredRegNo] = useState<string | null>(null);
  const [copiedRegNo, setCopiedRegNo] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    email: '',
    age: '',
    occupation: '',
    district: 'Kegalle',
    city: '',
    courseId: courses[0]?.id || 'course-01',
    courseTitle: courses[0]?.title || '6-Month Professional Fashion & Branding Diploma',
    courseType: 'PHYSICAL CLASS' as CourseType,
    location: 'KEGALLE',
    educationalQualification: 'G.C.E. O/L or Above',
    previousPatternCourse: 'NO' as 'YES' | 'NO',
    previousCourseDetails: '',
    whyJoin: '',
    expectedAchievements: '',
    preferredContactTime: 'Anytime',
    password: '',
    consent: false,
  });

  const activeLocations = locations.filter((l) => l.isActive !== false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setValidationError('');
  };

  const validateStep = (step: number): boolean => {
    setValidationError('');
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setValidationError('කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න (Please enter your full name).');
        return false;
      }
      const cleanPhone = formData.whatsappNumber.replace(/[\s-]/g, '');
      if (!cleanPhone || cleanPhone.length < 9) {
        setValidationError('වලංගු WhatsApp දුරකථන අංකයක් ඇතුළත් කරන්න (Valid WhatsApp number is required).');
        return false;
      }
      if (!formData.district) {
        setValidationError('කරුණාකර ඔබගේ දිස්ත්‍රික්කය තෝරන්න (Please select your district).');
        return false;
      }
    }

    if (step === 2) {
      if (formData.courseType === 'PHYSICAL CLASS' && !formData.location) {
        setValidationError('කරුණාකර ඔබගේ Physical පන්තිය සඳහා නගරය තෝරන්න (Please select your studio location).');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.educationalQualification.trim()) {
        setValidationError('කරුණාකර ඔබගේ අධ්‍යාපන සුදුසුකම තෝරන්න (Please select your qualification).');
        return false;
      }
      if (formData.previousPatternCourse === 'YES' && !formData.previousCourseDetails.trim()) {
        setValidationError('කරුණාකර ඔබ කලින් කළ පාඨමාලාව පිළිබඳ කෙටි විස්තරයක් සඳහන් කරන්න (Please provide details of prior course).');
        return false;
      }
    }

    if (step === 5) {
      if (!formData.consent) {
        setValidationError('කරුණාකර ලබාදුන් තොරතුරු නිවැරදි බවට වන එකඟතාවය සනාථ කරන්න (Please confirm consent).');
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setSubmitting(true);
    try {
      const createdRecord = await submitRegistration({
        fullName: formData.fullName.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        email: formData.email.trim(),
        district: formData.district,
        city: formData.city.trim(),
        age: formData.age.trim(),
        occupation: formData.occupation.trim(),
        educationalQualification: formData.educationalQualification.trim(),
        courseId: formData.courseId,
        courseTitle: formData.courseTitle,
        courseType: formData.courseType,
        location: formData.courseType === 'PHYSICAL CLASS' ? formData.location : 'ONLINE ZOOM',
        previousPatternCourse: formData.previousPatternCourse,
        previousCourseDetails: formData.previousCourseDetails.trim(),
        whyJoin: formData.whyJoin.trim(),
        expectedAchievements: formData.expectedAchievements.trim(),
        preferredContactTime: formData.preferredContactTime,
        password: formData.password.trim(),
      });

      setRegisteredRegNo(createdRecord.regNumber);
    } catch (err) {
      console.error('Registration failed:', err);
      setValidationError('ලියාපදිංචි කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න (Registration error).');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRegNumber = () => {
    if (registeredRegNo) {
      navigator.clipboard.writeText(registeredRegNo);
      setCopiedRegNo(true);
      setTimeout(() => setCopiedRegNo(false), 2500);
    }
  };

  const getDirectWhatsAppUrl = () => {
    const rawPhone = siteSettings.whatsappContactNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello CEYLON STYLE STUDIO, my registration is submitted!\nMy Reg No: ${registeredRegNo}\nName: ${formData.fullName}\nCourse Type: ${formData.courseType}`
    );
    return `https://wa.me/${rawPhone}?text=${text}`;
  };

  // Preset motivation reasons for quick select
  const presetReasons = [
    'මගේම Luxury Fashion Brand එකක් ආරම්භ කිරීමට (Start My Own Fashion Brand)',
    'ඇඟලුම් ක්ෂේත්‍රයේ වෘත්තීය Designer කෙනෙකු වීමට (Become Industry Fashion Designer)',
    'දැනට කරගෙන යන Boutique / මැහුම් ව්‍යාපාරය දියුණු කිරීමට (Scale Boutique Business)',
    'AI Fashion තාක්ෂණය හා ගෝලීය අපනයනය ඉගෙනීමට (Master AI Fashion & Exports)',
  ];

  return (
    <section id="register" className="py-20 sm:py-24 bg-[#0a0708] relative border-t border-[#c99a45]/20">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#540d18]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Dual Language */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#dfb56c] font-semibold block mb-2 font-mono">
            {isSinhalaMode ? 'නිල ශිෂ්‍ය ලියාපදිංචි කිරීම' : 'Official Academic Enrollment (2026 Batch)'}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-editorial text-[#f7f3eb] tracking-wide text-balance luxury-heading-anim">
            ඔබේ Fashion Journey එක අදම ආරම්භ කරන්න.
          </h2>
          <p className="text-xs sm:text-sm text-[#dfb56c] font-mono uppercase tracking-wider mt-1">
            Start Your Fashion &amp; Branding Journey Today
          </p>
          <p className="mt-3 text-xs sm:text-sm text-[#b8afa2] font-sinhala max-w-xl mx-auto leading-relaxed">
            පහත පියවර සම්පූර්ණ කර ඔබගේ නිල ලියාපදිංචි අංකය සහ සම්මුඛ පරීක්ෂණ විස්තර ලබාගන්න.
            <span className="block text-[11px] text-[#8e8579] font-mono mt-0.5">
              (Complete the quick bilingual form below to get your official Registration Number)
            </span>
          </p>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-5" />
        </div>

        {/* If submitted, show luxury success card */}
        {registeredRegNo ? (
          <div className="p-6 sm:p-12 rounded-sm bg-gradient-to-br from-[#1c1214] via-[#241317] to-[#141011] border-2 border-[#dfb56c] shadow-2xl text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-[#540d18] border-2 border-[#dfb56c] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#dfb56c]/20">
              <CheckCircle2 className="w-8 h-8 text-[#f7e2a9]" />
            </div>

            <span className="text-xs uppercase font-mono tracking-widest text-[#dfb56c] block mb-1">
              REGISTRATION RECEIVED • ලියාපදිංචිය සාර්ථකයි
            </span>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-editorial text-[#f7f3eb] mb-2 luxury-heading-anim">
              Thank You For Registering!
            </h3>
            <p className="text-sm text-[#d5cfc4] font-sinhala max-w-lg mx-auto mb-6">
              ඔබේ ලියාපදිංචි කිරීම Ceylon Style Studio පද්ධතියට සාර්ථකව ඇතුළත් විය.
              <span className="block text-xs text-[#a89f91] mt-1 font-mono">
                Your application has been registered into our student admissions roster.
              </span>
            </p>

            {/* Registration Number Highlight Box */}
            <div className="max-w-md mx-auto p-5 sm:p-6 rounded bg-black/60 border border-[#c99a45]/40 mb-8">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#a89f91] block mb-1">
                Your Official Registration Number • ඔබගේ ලියාපදිංචි අංකය
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#f7e2a9] tracking-wider">
                  {registeredRegNo}
                </span>
                <button
                  onClick={copyRegNumber}
                  className="btn-3d-secondary p-2 rounded"
                  title="Copy Registration Number"
                >
                  {copiedRegNo ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#a89f91] mt-2 font-sinhala">
                කරුණාකර මෙම අංකය සටහන් කර තබාගන්න. (Please save this registration number)
              </p>
            </div>

            {/* Official Bank Account Details Card from Backend Settings */}
            {siteSettings.bankAccountNumber && (
              <div className="max-w-md mx-auto p-4 sm:p-5 rounded bg-[#181113] border border-[#dfb56c]/30 text-left mb-8 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#dfb56c] font-bold block pb-1 border-b border-white/10">
                  🏛️ නිල බැංකු ගිණුම් විස්තර (Official Bank Account for Transfers)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#a89f91] block font-mono">බැංකුව (Bank):</span>
                    <strong className="text-[#f7f3eb]">{siteSettings.bankName || 'Commercial Bank'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a89f91] block font-mono">ශාඛාව (Branch):</span>
                    <span className="text-[#f7f3eb]">{siteSettings.bankBranch || 'Kegalle'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a89f91] block font-mono">ගිණුම් නම (Account Name):</span>
                    <span className="text-[#f7f3eb]">{siteSettings.bankAccountName || 'Ceylon Style Studio'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a89f91] block font-mono">ගිණුම් අංකය (Account No):</span>
                    <strong className="text-[#f7e2a9] font-mono text-sm tracking-wider">{siteSettings.bankAccountNumber}</strong>
                  </div>
                </div>
                {siteSettings.paymentInstructions && (
                  <p className="text-[11px] text-[#d5cfc4] font-sinhala pt-2 border-t border-white/5 leading-relaxed">
                    {siteSettings.paymentInstructions}
                  </p>
                )}
              </div>
            )}

            {/* 3D Action Buttons: Enter LMS Portal, WhatsApp, New Registration */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {onOpenStudentDashboard && (
                <button
                  type="button"
                  onClick={onOpenStudentDashboard}
                  className="btn-3d-gold w-full sm:w-auto px-7 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>ශිෂ්‍ය Dashboard පිවිසුම (Enter LMS Portal)</span>
                </button>
              )}

              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-whatsapp w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp සම්බන්ධ වන්න (Chat Now)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setRegisteredRegNo(null);
                  setCurrentStep(1);
                  setFormData({
                    fullName: '',
                    whatsappNumber: '',
                    email: '',
                    age: '',
                    occupation: '',
                    district: 'Kegalle',
                    city: '',
                    courseId: courses[0]?.id || 'course-01',
                    courseTitle: courses[0]?.title || '6-Month Professional Fashion & Branding Diploma',
                    courseType: 'PHYSICAL CLASS',
                    location: 'KEGALLE',
                    educationalQualification: 'G.C.E. O/L or Above',
                    previousPatternCourse: 'NO',
                    previousCourseDetails: '',
                    whyJoin: '',
                    expectedAchievements: '',
                    preferredContactTime: 'Anytime',
                    password: '',
                    consent: false,
                  });
                }}
                className="btn-3d-secondary w-full sm:w-auto px-5 py-3 text-xs uppercase tracking-wider"
              >
                තවත් ලියාපදිංචියක් (New Application)
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Registration Form Card */
          <div className="p-5 sm:p-9 rounded-sm bg-[#141011] border border-[#c99a45]/30 shadow-2xl">
            {/* Step Progress Bar - Bilingual */}
            <div className="mb-8 pb-5 border-b border-white/10">
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center mb-3">
                {[
                  { step: 1, labelSi: 'පෞද්ගලික', labelEn: 'Personal' },
                  { step: 2, labelSi: 'පන්ති ක්‍රමය', labelEn: 'Mode' },
                  { step: 3, labelSi: 'පළපුරුද්ද', labelEn: 'Experience' },
                  { step: 4, labelSi: 'අරමුණු', labelEn: 'Goals' },
                  { step: 5, labelSi: 'තහවුරු', labelEn: 'Confirm' },
                ].map((s) => (
                  <div key={s.step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                        currentStep === s.step
                          ? 'bg-[#540d18] border-2 border-[#dfb56c] text-[#f7e2a9] shadow-lg shadow-[#c99a45]/30 scale-110'
                          : currentStep > s.step
                          ? 'bg-[#dfb56c] text-black font-bold'
                          : 'bg-[#1c1416] text-[#6b625b] border border-white/10'
                      }`}
                    >
                      {currentStep > s.step ? '✓' : s.step}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-sinhala font-bold mt-1 text-[#f7e2a9] hidden xs:block">
                      {s.labelSi}
                    </span>
                    <span className="hidden sm:block text-[9px] uppercase tracking-wider text-[#a89f91] font-mono">
                      {s.labelEn}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 bg-[#1c1416] rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#540d18] via-[#dfb56c] to-[#f7e2a9] transition-all duration-300"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message Box */}
            {validationError && (
              <div className="mb-6 p-3 rounded bg-[#540d18]/50 border border-[#dfb56c] text-[#f7e2a9] text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#dfb56c]" />
                <span className="font-sinhala">{validationError}</span>
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={handleSubmit}>
              {/* STEP 01: PERSONAL DETAILS (පෞද්ගලික තොරතුරු) */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#dfb56c]" />
                      <span>පියවර 01: පෞද්ගලික තොරතුරු (STEP 01: PERSONAL DETAILS)</span>
                    </h3>
                    <span className="text-xs font-mono text-[#dfb56c]">1/5</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Q1: FULL NAME */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        සම්පූර්ණ නම <span className="font-mono text-[#a89f91]">(Full Name)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="උදා: නිමාෂා පෙරේරා (e.g. Nimasha Perera)"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Q2: WHATSAPP NUMBER */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        WhatsApp දුරකථන අංකය <span className="font-mono text-[#a89f91]">(WhatsApp Number)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="උදා: 077 123 4567"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Q3: EMAIL */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        විද්‍යුත් තැපෑල <span className="font-mono text-[#a89f91]">(Email Address - Optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="උදා: nimasha@example.com"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Q4: DISTRICT */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        පදිංචි දිස්ත්‍රික්කය <span className="font-mono text-[#a89f91]">(District)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#141011] border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                      >
                        {SRI_LANKA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Q5: CITY */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        ආසන්නතම නගරය / ප්‍රදේශය <span className="font-mono text-[#a89f91]">(Nearest City / Town)</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="උදා: කෑගල්ල නගරය / මාවනැල්ල (e.g. Kegalle Town)"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Q6: AGE */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        වයස <span className="font-mono text-[#a89f91]">(Age - Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="උදා: 22"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Q7: OCCUPATION */}
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                        වත්මන් රැකියාව හෝ තත්ත්වය <span className="font-mono text-[#a89f91]">(Occupation / Status)</span>
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        placeholder="උදා: ශිෂ්‍ය / රැකියාවක් කරන / ස්වයං රැකියා (e.g. Student / Designer)"
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 02: CLASS SELECTION & LOCATION (පන්ති ක්‍රමය හා ස්ථානය) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9] flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#dfb56c]" />
                      <span>පියවර 02: පන්ති ක්‍රමය තෝරාගැනීම (STEP 02: CLASS MODE &amp; STUDIO)</span>
                    </h3>
                    <span className="text-xs font-mono text-[#dfb56c]">2/5</span>
                  </div>

                  {/* SELECT COURSE PROGRAM */}
                  {courses.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-[#d5cfc4] mb-2 font-sinhala">
                        ලියාපදිංචි වන පාඨමාලා වැඩසටහන <span className="font-mono text-[#a89f91]">(Select Course Program)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <select
                        value={formData.courseId}
                        onChange={(e) => {
                          const sel = courses.find((c) => c.id === e.target.value);
                          setFormData({
                            ...formData,
                            courseId: e.target.value,
                            courseTitle: sel?.title || formData.courseTitle,
                          });
                        }}
                        className="w-full px-4 py-3 bg-[#141011] border border-[#c99a45]/40 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7e2a9] focus:outline-none font-medium"
                      >
                        {courses.filter((c) => c.isPublished !== false).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} • {c.duration} (Physical: Rs. {c.physicalFee.toLocaleString()} | Zoom: Rs. {c.zoomFee.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-3 font-sinhala">
                      ඔබ සම්බන්ධ වීමට කැමති පන්ති මාදිලිය කුමක්ද? <span className="font-mono text-[#a89f91]">(Select Class Mode)</span>{' '}
                      <span className="text-[#dfb56c]">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Option 1: PHYSICAL CLASS */}
                      <div
                        onClick={() => setFormData({ ...formData, courseType: 'PHYSICAL CLASS' })}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          formData.courseType === 'PHYSICAL CLASS'
                            ? 'bg-[#540d18]/50 border-[#dfb56c] shadow-lg shadow-[#c99a45]/20'
                            : 'bg-black/40 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-editorial font-bold text-base text-[#f7f3eb]">
                            භෞතික පන්ති (PHYSICAL CLASS)
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              formData.courseType === 'PHYSICAL CLASS'
                                ? 'border-[#dfb56c] bg-[#dfb56c] text-black font-bold text-xs'
                                : 'border-white/20'
                            }`}
                          >
                            {formData.courseType === 'PHYSICAL CLASS' && '✓'}
                          </div>
                        </div>
                        <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed">
                          අපගේ Studio ආයතනයට සෘජුව පැමිණ ප්‍රායෝගික පුහුණුව (Hands-on atelier practical training at Kegalle, Kurunegala, or Piliyandala).
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#dfb56c]">මාසික ගාස්තුව:</span>
                          <span className="text-xs font-mono font-bold text-[#f7e2a9]">
                            {siteSettings.currency}{' '}
                            {(
                              (courses.find((c) => c.id === formData.courseId)?.physicalFee ?? siteSettings.physicalFee)
                            ).toLocaleString()}{' '}
                            / Month
                          </span>
                        </div>
                      </div>

                      {/* Option 2: ZOOM CLASS */}
                      <div
                        onClick={() => setFormData({ ...formData, courseType: 'ZOOM CLASS' })}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          formData.courseType === 'ZOOM CLASS'
                            ? 'bg-[#540d18]/50 border-[#dfb56c] shadow-lg shadow-[#c99a45]/20'
                            : 'bg-black/40 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-editorial font-bold text-base text-[#f7f3eb]">
                            සජීවී ඔන්ලයින් පන්ති (ONLINE ZOOM)
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              formData.courseType === 'ZOOM CLASS'
                                ? 'border-[#dfb56c] bg-[#dfb56c] text-black font-bold text-xs'
                                : 'border-white/20'
                            }`}
                          >
                            {formData.courseType === 'ZOOM CLASS' && '✓'}
                          </div>
                        </div>
                        <p className="text-xs text-[#b8afa2] font-sinhala leading-relaxed">
                          නිවසේ සිට සජීවීව ප්‍රශ්න අසමින් ඉගෙනීම + LMS වීඩියෝ රෙකෝඩින්ග්ස් (Live interactive Zoom classes with recordings &amp; digital patterns).
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#dfb56c]">මාසික ගාස්තුව:</span>
                          <span className="text-xs font-mono font-bold text-[#f7e2a9]">
                            {siteSettings.currency}{' '}
                            {(
                              (courses.find((c) => c.id === formData.courseId)?.zoomFee ?? siteSettings.zoomFee)
                            ).toLocaleString()}{' '}
                            / Month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STUDIO LOCATION IF PHYSICAL CLASS */}
                  {formData.courseType === 'PHYSICAL CLASS' && (
                    <div className="p-5 rounded-sm bg-[#1c1316] border border-[#c99a45]/30 animate-in fade-in duration-300">
                      <label className="block text-xs font-medium text-[#f7e2a9] mb-2 font-sinhala">
                        භෞතික පන්තිය සඳහා ඔබගේ පහසු ආසන්නතම Studio ශාඛාව තෝරන්න{' '}
                        <span className="font-mono text-[#a89f91]">(Select Physical Studio Branch)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#141011] border border-[#c99a45]/40 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                      >
                        {activeLocations.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name === 'KEGALLE'
                              ? 'කෑගල්ල මධ්‍යස්ථානය (Kegalle Main Studio - ' + loc.address + ')'
                              : loc.name === 'KURUNEGALA'
                              ? 'කුරුණෑගල මධ්‍යස්ථානය (Kurunegala Studio - ' + loc.address + ')'
                              : loc.name === 'PILIYANDALA'
                              ? 'පිළියන්දල / කොළඹ මධ්‍යස්ථානය (Piliyandala Studio - ' + loc.address + ')'
                              : `${loc.name} Studio (${loc.address})`}
                          </option>
                        ))}
                      </select>
                      <span className="text-[11px] text-[#a89f91] block mt-2 font-sinhala">
                        සෑම ශාඛාවකම ආසන සංඛ්‍යාව සීමිත බැවින් කල්තියා ලියාපදිංචි වීම අත්‍යවශ්‍ය වේ.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 03: PRIOR KNOWLEDGE & EDUCATION (පෙර දැනුම හා අධ්‍යාපනය) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#dfb56c]" />
                      <span>පියවර 03: අධ්‍යාපනය හා පෙර පළපුරුද්ද (STEP 03: EXPERIENCE &amp; EDUCATION)</span>
                    </h3>
                    <span className="text-xs font-mono text-[#dfb56c]">3/5</span>
                  </div>

                  {/* Q: EDUCATIONAL QUALIFICATION */}
                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                      ඉහළම අධ්‍යාපන සුදුසුකම <span className="font-mono text-[#a89f91]">(Highest Educational Qualification)</span>{' '}
                      <span className="text-[#dfb56c]">*</span>
                    </label>
                    <select
                      name="educationalQualification"
                      value={formData.educationalQualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#141011] border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                    >
                      <option value="G.C.E. O/L or Above">අ.පො.ස. සාමාන්‍ය පෙළ හෝ ඊට ඉහළ (G.C.E. O/L or Above)</option>
                      <option value="G.C.E. A/L">අ.පො.ස. උසස් පෙළ (G.C.E. A/L)</option>
                      <option value="Undergraduate / Degree">උපාධිධාරී / උසස් ඩිප්ලෝමා (Degree / Higher Diploma)</option>
                      <option value="Diploma / Vocational">වෘත්තීය තාක්ෂණික සහතිකපත් (NVQ / Vocational Diploma)</option>
                      <option value="School Leaver">පාසල් හැදෑරීම / නවක සිසුවියන් (School Leaver / Self-Taught)</option>
                      <option value="Other">වෙනත් සුදුසුකම් (Other Qualification)</option>
                    </select>
                  </div>

                  {/* Q: PREVIOUS PATTERN EXPERIENCE */}
                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-2 font-sinhala">
                      ඔබ මීට පෙර Fashion Design හෝ Pattern Making පාඨමාලාවක් හදාරා තිබේද?{' '}
                      <span className="font-mono text-[#a89f91]">(Have you previously studied Pattern Making?)</span>{' '}
                      <span className="text-[#dfb56c]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* NO Option */}
                      <label
                        className={`p-3.5 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          formData.previousPatternCourse === 'NO'
                            ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold'
                            : 'bg-black/40 border-white/10 text-[#d5cfc4]'
                        }`}
                      >
                        <span className="text-xs font-sinhala">
                          නැත - මම මුල සිටම ආරම්භ කරන නවකයෙකි (NO - Beginner)
                        </span>
                        <input
                          type="radio"
                          name="previousPatternCourse"
                          value="NO"
                          checked={formData.previousPatternCourse === 'NO'}
                          onChange={() => setFormData({ ...formData, previousPatternCourse: 'NO' })}
                          className="accent-[#dfb56c]"
                        />
                      </label>

                      {/* YES Option */}
                      <label
                        className={`p-3.5 rounded border cursor-pointer transition-all flex items-center justify-between ${
                          formData.previousPatternCourse === 'YES'
                            ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9] font-bold'
                            : 'bg-black/40 border-white/10 text-[#d5cfc4]'
                        }`}
                      >
                        <span className="text-xs font-sinhala">
                          ඔව් - මම මීට පෙර හදාරා ඇත්තෙමි (YES - Previously Studied)
                        </span>
                        <input
                          type="radio"
                          name="previousPatternCourse"
                          value="YES"
                          checked={formData.previousPatternCourse === 'YES'}
                          onChange={() => setFormData({ ...formData, previousPatternCourse: 'YES' })}
                          className="accent-[#dfb56c]"
                        />
                      </label>
                    </div>
                  </div>

                  {/* IF YES, COURSE DETAILS */}
                  {formData.previousPatternCourse === 'YES' && (
                    <div className="p-4 rounded-sm bg-[#1c1316] border border-[#c99a45]/30 animate-in fade-in duration-300">
                      <label className="block text-xs font-medium text-[#f7e2a9] mb-1.5 font-sinhala">
                        කලින් හැදෑරූ පාඨමාලාව, ආයතනය හෝ දැනුම මට්ටම පිළිබඳ කෙටි විස්තරයක්{' '}
                        <span className="font-mono text-[#a89f91]">(Previous Course Details)</span>{' '}
                        <span className="text-[#dfb56c]">*</span>
                      </label>
                      <textarea
                        name="previousCourseDetails"
                        value={formData.previousCourseDetails}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="උදා: මම මීට පෙර මූලික මැහුම් පාඨමාලාවක් කර ඇත, නමුත් Pattern Accuracy සහ Grading ගැන ඉගෙනීමට අවශ්‍යයි..."
                        className="w-full px-4 py-2.5 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 04: GOALS & MOTIVATION (අරමුණු හා අනාගත ඉලක්ක) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#dfb56c]" />
                      <span>පියවර 04: ඔබගේ අරමුණු හා අපේක්ෂාවන් (STEP 04: GOALS &amp; ASPIRATIONS)</span>
                    </h3>
                    <span className="text-xs font-mono text-[#dfb56c]">4/5</span>
                  </div>

                  {/* Q: WHY DO YOU WANT TO JOIN */}
                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                      ඔබ මෙම පාඨමාලාවට සම්බන්ධ වීමට ප්‍රධාන හේතුව කුමක්ද?{' '}
                      <span className="font-mono text-[#a89f91]">(Why do you want to join this program?)</span>
                    </label>

                    {/* Quick Preset Reason Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
                      {presetReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setFormData({ ...formData, whyJoin: reason })}
                          className={`text-left p-2 rounded text-[11px] font-sinhala border transition-all ${
                            formData.whyJoin === reason
                              ? 'bg-[#540d18] border-[#dfb56c] text-[#f7e2a9]'
                              : 'bg-black/30 border-white/10 text-[#a89f91] hover:border-[#dfb56c]/50'
                          }`}
                        >
                          + {reason}
                        </button>
                      ))}
                    </div>

                    <textarea
                      name="whyJoin"
                      value={formData.whyJoin}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="ඔබේ අරමුණ කෙටියෙන් ලියන්න (e.g. මට මගේම Fashion Brand එකක් පටන්ගන්න සහ රටින් පිටට export කරන්න අවශ්‍යයි...)"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                    />
                  </div>

                  {/* Q: WHAT DO YOU EXPECT TO ACHIEVE */}
                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                      පාඨමාලාවෙන් ඔබ බලාපොරොත්තු වන ජයග්‍රහණ මොනවාද?{' '}
                      <span className="font-mono text-[#a89f91]">(Expected Achievements)</span>
                    </label>
                    <textarea
                      name="expectedAchievements"
                      value={formData.expectedAchievements}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="උදා: මාස 6 අවසානයේ මගේම පළමු Fashion Collection එක එළිදැක්වීම (e.g. Launching my first capsule collection)..."
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                    />
                  </div>

                  {/* Q: PREFERRED CONTACT TIME */}
                  <div>
                    <label className="block text-xs font-medium text-[#d5cfc4] mb-1.5 font-sinhala">
                      අපගේ උපදේශක කණ්ඩායම විසින් ඔබව සම්බන්ධ කර ගැනීමට සුදුසුම වේලාව{' '}
                      <span className="font-mono text-[#a89f91]">(Preferred Contact Time)</span>
                    </label>
                    <select
                      name="preferredContactTime"
                      value={formData.preferredContactTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#141011] border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none"
                    >
                      <option value="Anytime">ඕනෑම වේලාවක (Anytime)</option>
                      <option value="Morning (9 AM - 12 PM)">උදෑසන (Morning: 9.00 AM - 12.00 PM)</option>
                      <option value="Afternoon (1 PM - 5 PM)">දහවල් (Afternoon: 1.00 PM - 5.00 PM)</option>
                      <option value="Evening (5 PM - 8 PM)">සවස (Evening: 5.00 PM - 8.30 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 05: REVIEW & CONFIRMATION (සමාලෝචනය හා තහවුරු කිරීම) */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-editorial font-bold text-[#f7e2a9] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#dfb56c]" />
                      <span>පියවර 05: තොරතුරු තහවුරු කිරීම (STEP 05: REVIEW &amp; CONFIRMATION)</span>
                    </h3>
                    <span className="text-xs font-mono text-[#dfb56c]">5/5</span>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 rounded bg-black/50 border border-white/10 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#a89f91] font-sinhala">ශිෂ්‍ය නම (Full Name):</span>
                      <strong className="text-[#f7f3eb]">{formData.fullName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#a89f91] font-sinhala">WhatsApp අංකය (WhatsApp):</span>
                      <strong className="text-[#dfb56c] font-mono">{formData.whatsappNumber}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#a89f91] font-sinhala">දිස්ත්‍රික්කය (District):</span>
                      <span className="text-[#f7f3eb]">{formData.district} {formData.city ? `(${formData.city})` : ''}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#a89f91] font-sinhala">පන්ති මාදිලිය (Class Mode):</span>
                      <span className="text-[#f7e2a9] font-bold">
                        {formData.courseType === 'PHYSICAL CLASS' ? 'භෞතික පන්ති (PHYSICAL)' : 'සජීවී ඔන්ලයින් (ZOOM)'}
                        {formData.courseType === 'PHYSICAL CLASS' ? ` - ${formData.location} Studio` : ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-[#a89f91] font-sinhala">මාසික ගාස්තුව (Monthly Fee):</span>
                      <span className="text-[#f7e2a9] font-mono font-bold">
                        {siteSettings.currency}{' '}
                        {formData.courseType === 'PHYSICAL CLASS'
                          ? siteSettings.physicalFee.toLocaleString()
                          : siteSettings.zoomFee.toLocaleString()}{' '}
                        / Monthly
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#a89f91] font-sinhala">පෙර පළපුරුද්ද (Prior Experience):</span>
                      <span className="text-[#f7f3eb]">{formData.previousPatternCourse === 'YES' ? 'ඔව් (Studied)' : 'නැත (Beginner)'}</span>
                    </div>
                  </div>

                  {/* Student LMS Password */}
                  <div className="p-4 rounded-sm bg-black/40 border border-white/10 space-y-1.5">
                    <label className="block text-xs font-mono text-[#f7e2a9] font-bold">
                      ශිෂ්‍ය LMS පිවිසුම් මුරපදය (Student Portal Password - Optional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="ශිෂ්‍ය ගිණුමට ඇතුළු වීමට මුරපදයක් සාදන්න (Or leave blank)"
                      className="w-full px-4 py-2.5 bg-[#141011] border border-white/10 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#a89f91] block font-sinhala">
                      මෙම මුරපදය මඟින් පසුව ශිෂ්‍ය Dashboard එකට ඇතුළු වී වීඩියෝ නැරඹීමට සහ ගෙවීම් රිසිට්පත් උඩුගත කිරීමට හැකිය.
                    </span>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="p-4 rounded-sm bg-[#1c1316] border border-[#c99a45]/30 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded text-[#540d18] focus:ring-[#dfb56c] accent-[#dfb56c]"
                    />
                    <label htmlFor="consent" className="text-xs text-[#d5cfc4] cursor-pointer leading-relaxed font-sinhala">
                      <strong>තොරතුරු සත්‍ය බවට වන එකඟතාවය:</strong> මා විසින් ඉහත සපයන ලද සියලු තොරතුරු සත්‍ය හා නිවැරදි බවත්, Ceylon Style Studio ආයතනයේ නීති රීතිවලට එකඟ වන බවත් මෙයින් සහතික කරමි.
                      <span className="block text-[11px] text-[#a89f91] font-mono mt-0.5">
                        (I hereby confirm that all details provided are true and accurate, and accept CSS academic terms.)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons with 3D Look */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-3d-secondary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ආපසු (Previous)</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-3d-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>මීළඟ පියවර (Next Step)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-3d-gold px-8 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>ලියාපදිංචි වෙමින්...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>දැන්ම ලියාපදිංචි වන්න (REGISTER NOW)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
