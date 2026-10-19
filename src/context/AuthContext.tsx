import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isUserAdmin } from '../lib/firebase';
import { Registration } from '../types';

export const ADMIN_CONFIG = {
  email: 'asankagarments@gmail.com',
  password: 'As0703755312',
};

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (email: string, pass: string) => Promise<User>;
  signOut: () => Promise<void>;
  loginAdminWithCredentials: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  simulateAdminMode: () => void;
  isSimulatedAdmin: boolean;
  studentUser: Registration | null;
  setStudentUser: (student: Registration | null) => void;
  logoutStudent: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => ({} as User),
  signUpWithEmail: async () => ({} as User),
  signOut: async () => {},
  loginAdminWithCredentials: () => false,
  logoutAdmin: () => {},
  simulateAdminMode: () => {},
  isSimulatedAdmin: false,
  studentUser: null,
  setStudentUser: () => {},
  logoutStudent: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('css_admin_authenticated') === 'true';
  });
  const [isSimulatedAdmin, setIsSimulatedAdmin] = useState<boolean>(() => {
    return localStorage.getItem('css_admin_authenticated') === 'true';
  });

  const [studentUser, setStudentUserState] = useState<Registration | null>(() => {
    const saved = localStorage.getItem('css_logged_in_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      const code = error?.code || '';
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/popup-closed-by-user'
      ) {
        // Sandboxed preview iframe or popup blocker: throw lightweight error object without noisy stack
        const friendlyError: any = new Error('Google Sign-in popup was blocked or closed. Use Master Credentials.');
        friendlyError.code = code;
        throw friendlyError;
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return cred.user;
    } catch (error) {
      console.error('Email Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<User> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      return cred.user;
    } catch (error) {
      console.error('Email Sign Up Error:', error);
      throw error;
    }
  };

  const loginAdminWithCredentials = (email: string, pass: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (
      normalizedEmail === ADMIN_CONFIG.email.toLowerCase() &&
      pass === ADMIN_CONFIG.password
    ) {
      setIsAdminAuthenticated(true);
      setIsSimulatedAdmin(false);
      localStorage.setItem('css_admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsSimulatedAdmin(false);
    localStorage.removeItem('css_admin_authenticated');
    localStorage.removeItem('css_simulated_admin');
    fbSignOut(auth).catch(() => {});
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      logoutAdmin();
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  const simulateAdminMode = () => {
    // Kept for backward compatibility if needed, but redirects to auth state
    setIsAdminAuthenticated((prev) => !prev);
  };

  const setStudentUser = (student: Registration | null) => {
    setStudentUserState(student);
    if (student) {
      localStorage.setItem('css_logged_in_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('css_logged_in_student');
    }
  };

  const logoutStudent = () => {
    setStudentUser(null);
  };

  const isAdmin = isAdminAuthenticated || isUserAdmin(user?.email);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        loginAdminWithCredentials,
        logoutAdmin,
        simulateAdminMode,
        isSimulatedAdmin: isAdminAuthenticated,
        studentUser,
        setStudentUser,
        logoutStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
