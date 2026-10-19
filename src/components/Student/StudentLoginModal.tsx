import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Shield,
  KeyRound,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  onOpenRegister: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  onOpenRegister,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    setStudentUser,
  } = useAuth();
  const {
    registrations,
    courses,
    loginStudentWithCredentials,
    loginOrRegisterFirebaseStudent,
  } = useData();

  // Mode: 'firebase' (Email/Google Auth) vs 'credentials' (Reg No / WhatsApp)
  const [authMethod, setAuthMethod] = useState<'firebase' | 'credentials'>('firebase');
  // Firebase Auth submode: 'signin' vs 'signup'
  const [firebaseMode, setFirebaseMode] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('course-01');

  // Credentials Mode fields
  const [identifier, setIdentifier] = useState('');
  const [credPassword, setCredPassword] = useState('');

  // Lookup state
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);
  const [showLookup, setShowLookup] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // 1. Google One-Click Sign In (Firebase Authentication)
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signInWithGoogle();
      // Auth state changes, Firebase user is available
      // Note: DataContext auto-provisions or we can explicitly sync
      setSuccessMsg('Google Authentication successful! Launching your Student Portal...');
      setTimeout(() => {
        onClose();
        onOpenDashboard();
      }, 700);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('බ්‍රවුසරය මගින් Google Popup අවහිර කර ඇත (Popup Blocked). කරුණාකර පහත ඇති Email & Password හෝ Student Registration ID මගින් Login වන්න.');
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMsg('Google Sign-In window was closed. Please try again or log in with Email.');
      } else {
        setErrorMsg(err.message || 'Google Sign-In was cancelled or failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Firebase Email & Password (Sign In or Sign Up)
  const handleFirebaseEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('කරුණාකර වලංගු Email ලිපිනයක් සහ මුරපදයක් (Password) ඇතුළත් කරන්න.');
      setIsLoading(false);
      return;
    }

    try {
      if (firebaseMode === 'signup') {
        if (password.length < 6) {
          setErrorMsg('මුරපදය සඳහා අවම වශයෙන් අක්ෂර 6ක්වත් ඇතුළත් කරන්න (Minimum 6 characters required).');
          setIsLoading(false);
          return;
        }

        const user = await signUpWithEmail(email.trim(), password);
        await loginOrRegisterFirebaseStudent(user, {
          fullName: fullName.trim() || undefined,
          whatsappNumber: whatsappNumber.trim() || undefined,
          courseId: selectedCourseId,
        });

        setSuccessMsg('ගිණුම සාර්ථකව නිර්මාණය විය! Student Membership Portal විවෘත වේ...');
      } else {
        const user = await signInWithEmail(email.trim(), password);
        await loginOrRegisterFirebaseStudent(user, {
          courseId: selectedCourseId,
        });

        setSuccessMsg('පිවිසුම සාර්ථකයි! Student Membership Portal විවෘත වේ...');
      }

      setTimeout(() => {
        onClose();
        onOpenDashboard();
      }, 700);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      const code = err.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMsg('Email ලිපිනය හෝ මුරපදය වැරදියි. කරුණාකර නැවත පරීක්ෂා කරන්න (හෝ Sign Up වන්න).');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('මෙම Email ලිපිනයෙන් දැනටමත් ගිණුමක් ලියාපදිංචි වී ඇත. කරුණාකර Sign In තෝරන්න.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Reg Number / WhatsApp direct login (For offline / phone enrolled students)
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setErrorMsg('කරුණාකර WhatsApp අංකය, Email හෝ Reg Number ඇතුළත් කරන්න.');
      setIsLoading(false);
      return;
    }

    const student = await loginStudentWithCredentials(identifier.trim(), credPassword.trim());
    if (student) {
      setSuccessMsg('පිවිසුම සාර්ථකයි! Student Dashboard විවෘත වේ...');
      setTimeout(() => {
        onClose();
        onOpenDashboard();
      }, 500);
    } else {
      setErrorMsg(
        'ගිණුමක් සොයාගත නොහැකි විය. කරුණාකර WhatsApp අංකය හෝ Reg Number නිවැරදිදැයි පරීක්ෂා කරන්න (හෝ Firebase Sign Up තෝරන්න).'
      );
    }
    setIsLoading(false);
  };

  const handleLookupRegNo = () => {
    const clean = lookupPhone.replace(/[\s-]/g, '');
    const found = registrations.find(
      (r) => r.whatsappNumber.replace(/[\s-]/g, '') === clean
    );
    if (found) {
      setLookupResult(`ඔබගේ ලියාපදිංචි අංකය: ${found.regNumber} (Name: ${found.fullName})`);
      setIdentifier(found.regNumber);
    } else {
      setLookupResult('මෙම WhatsApp අංකයට ලියාපදිංචි වූ සිසුවෙකු හමු නොවීය.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#141011] rounded-sm border border-[#c99a45]/50 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a89f91] hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#540d18] border border-[#dfb56c] flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-[#c99a45]/20">
            <Lock className="w-5 h-5 text-[#f7e2a9]" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#dfb56c] block font-bold">
            CEYLON STYLE STUDIO • MEMBERSHIP PORTAL
          </span>
          <h3 className="text-xl sm:text-2xl font-editorial font-bold text-[#f7f3eb] mt-1 tracking-wider luxury-heading-anim">
            STUDENT &amp; MEMBER LOGIN
          </h3>
          <p className="text-xs text-[#b8afa2] font-sinhala mt-1">
            Firebase Authentication හෝ ඔබගේ ලියාපදිංචි විස්තර මගින් ප්‍රවේශ වන්න.
          </p>
        </div>

        {/* Auth Method Switcher Tabs */}
        <div className="flex border-b border-white/10 mb-5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('firebase');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 pb-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              authMethod === 'firebase'
                ? 'border-[#dfb56c] text-[#f7e2a9]'
                : 'border-transparent text-[#7a7266] hover:text-[#d5cfc4]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Firebase Auth (Email / Google)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('credentials');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 pb-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
              authMethod === 'credentials'
                ? 'border-[#dfb56c] text-[#f7e2a9]'
                : 'border-transparent text-[#7a7266] hover:text-[#d5cfc4]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Reg No / WhatsApp ID</span>
          </button>
        </div>

        {/* Notification Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-[#540d18]/70 border border-[#dfb56c] text-[#f7e2a9] text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#dfb56c]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded bg-green-950/70 border border-green-500 text-green-300 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {authMethod === 'firebase' ? (
            <div className="space-y-4">
              {/* One-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1f191b] hover:bg-[#2b2225] border border-white/20 hover:border-[#dfb56c] rounded-sm text-xs font-bold text-white transition-all flex items-center justify-center gap-3 shadow-md"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Account</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] font-mono text-[#a89f91] uppercase tracking-widest">
                  OR WITH FIREBASE EMAIL
                </span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              {/* Mode Toggle: Sign In vs Sign Up */}
              <div className="flex bg-black/60 p-1 rounded border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setFirebaseMode('signin')}
                  className={`flex-1 py-1.5 rounded text-center font-mono font-bold transition-all ${
                    firebaseMode === 'signin'
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/50'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Sign In (පිවිසෙන්න)
                </button>
                <button
                  type="button"
                  onClick={() => setFirebaseMode('signup')}
                  className={`flex-1 py-1.5 rounded text-center font-mono font-bold transition-all ${
                    firebaseMode === 'signup'
                      ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/50'
                      : 'text-[#a89f91] hover:text-white'
                  }`}
                >
                  Create Account (අලුතින් ලියාපදිංචි වන්න)
                </button>
              </div>

              <form onSubmit={handleFirebaseEmailAuth} className="space-y-3">
                {firebaseMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1">
                        Full Name (සම්පූර්ණ නම)
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kasun Fernando"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                        required={firebaseMode === 'signup'}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 077 123 4567"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                        required={firebaseMode === 'signup'}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1">
                        Enrolled Course
                      </label>
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-[#d5cfc4] mb-1">
                    Password (මුරපදය)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#dfb56c] rounded-sm text-xs text-[#f7f3eb] focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 shadow-lg shadow-[#c99a45]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Authenticating with Firebase...</span>
                  ) : firebaseMode === 'signup' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account &amp; Access Portal</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Log In With Firebase</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Reg Number / WhatsApp Credentials Mode */
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-[#d5cfc4] mb-1.5">
                  WhatsApp Number / Reg No / Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 077 123 4567 or CSS-2026-0001"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs uppercase font-mono text-[#d5cfc4]">
                    Password (Optional if not set)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLookup(!showLookup)}
                    className="text-[11px] text-[#dfb56c] hover:underline"
                  >
                    Forgot Reg No?
                  </button>
                </div>
                <input
                  type="password"
                  value={credPassword}
                  onChange={(e) => setCredPassword(e.target.value)}
                  placeholder="Enter password or leave blank if first login"
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 focus:border-[#dfb56c] rounded-sm text-sm text-[#f7f3eb] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#dfb56c] via-[#f7e2a9] to-[#c99a45] text-black font-bold text-xs uppercase tracking-widest rounded-sm hover:brightness-110 shadow-lg shadow-[#c99a45]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Log In To Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Lookup Reg No Helper Drawer */}
              {showLookup && (
                <div className="p-4 rounded bg-black/60 border border-white/15 text-xs animate-in fade-in duration-200">
                  <span className="font-semibold text-[#f7e2a9] block mb-1">
                    Find My Registration Number
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter your WhatsApp number"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#141011] border border-white/20 rounded text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleLookupRegNo}
                      className="px-3 py-1.5 bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] rounded text-xs font-bold"
                    >
                      Find
                    </button>
                  </div>
                  {lookupResult && (
                    <p className="mt-2 text-[11px] text-[#dfb56c] font-medium font-sinhala">
                      {lookupResult}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Bottom Footer Notice */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center shrink-0">
          <p className="text-xs text-[#a89f91] font-sinhala">
            නව පාඨමාලා සඳහා ලියාපදිංචි වීමට අවශ්‍යද?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="text-[#dfb56c] font-bold hover:underline ml-1"
            >
              Course Registration Form
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
