"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { StorageService } from "@/lib/storage";
import { FirestoreService } from "@/lib/firestore";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    department: string,
    designation: string,
    location: string
  ) => Promise<{ success: boolean; error?: string; verificationSent?: boolean }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fastLoginAs: (role: UserRole) => void;
  updateCurrentUserProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize from session / localStorage
  useEffect(() => {
    const savedUid = typeof window !== "undefined" ? sessionStorage.getItem("capacity_active_uid") : null;
    if (savedUid) {
      const user = StorageService.getUserById(savedUid);
      if (user) {
        setCurrentUser(user);
      }
    }

// AuthContext.tsx modified for Firestore
    if (auth && isFirebaseConfigured()) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const existing = await FirestoreService.getUserById(fbUser.uid);
          if (existing) {
            existing.emailVerified = fbUser.emailVerified;
            setCurrentUser(existing);
            sessionStorage.setItem("capacity_active_uid", existing.uid);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (auth && googleProvider && isFirebaseConfigured()) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        let profile = await FirestoreService.getUserById(fbUser.uid);

        if (!profile) {
          profile = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            displayName: fbUser.displayName || "Officer / Scientist",
            role: "trainee",
            status: "pending",
            emailVerified: fbUser.emailVerified,
            department: "India Meteorological Department (MoES)",
            designation: "Meteorologist / Researcher",
            location: "Regional Station",
            qualifications: [],
            experience: [],
            skills: [],
            interests: [],
            certificates: [],
            createdAt: new Date().toISOString(),
          };
          await FirestoreService.saveUser(profile);
        } else {
          profile.emailVerified = fbUser.emailVerified;
          await FirestoreService.saveUser(profile);
        }

        setCurrentUser(profile);
        sessionStorage.setItem("capacity_active_uid", profile.uid);
        return { success: true };
      } else {
        return { success: false, error: "Firebase not configured." };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication error";
      return { success: false, error: msg };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (auth && isFirebaseConfigured()) {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        const fbUser = result.user;
        let profile = await FirestoreService.getUserById(fbUser.uid);

        if (!profile) {
          const allUsers = await FirestoreService.getUsers();
          profile = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
        }

        if (profile) {
          profile.emailVerified = fbUser.emailVerified;
          setCurrentUser(profile);
          sessionStorage.setItem("capacity_active_uid", profile.uid);
          return { success: true };
        }
      }

      return { success: false, error: "Invalid credentials or user not registered." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      return { success: false, error: msg };
    }
  };

  const signupWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole,
    department: string,
    designation: string,
    location: string
  ): Promise<{ success: boolean; error?: string; verificationSent?: boolean }> => {
    try {
      let uid = `user-${Date.now()}`;
      let verificationSent = false;

      if (auth && isFirebaseConfigured()) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        uid = userCredential.user.uid;
        await sendEmailVerification(userCredential.user);
        verificationSent = true;
      }

      const newProfile: UserProfile = {
        uid,
        email,
        displayName,
        role,
        status: "pending",
        emailVerified: false,
        department: department || "India Meteorological Department (MoES)",
        designation: designation || (role === "trainer" ? "Senior Scientist / Instructor" : "Scientific Officer / Trainee"),
        location: location || "IMD Field Station",
        qualifications: [],
        experience: [],
        skills: [],
        interests: [],
        certificates: [],
        createdAt: new Date().toISOString(),
      };

      await FirestoreService.saveUser(newProfile);
      setCurrentUser(newProfile);
      sessionStorage.setItem("capacity_active_uid", newProfile.uid);

      return { success: true, verificationSent };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup registration failed";
      return { success: false, error: msg };
    }
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (auth && auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification email";
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    if (auth && isFirebaseConfigured()) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("capacity_active_uid");
    }
  };

  const fastLoginAs = () => {}; // Deprecated in production

  const updateCurrentUserProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updated };
    await FirestoreService.saveUser(merged);
    setCurrentUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resendVerificationEmail,
        logout,
        fastLoginAs,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
