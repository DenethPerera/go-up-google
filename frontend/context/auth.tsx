import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "../config/firebase";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// Configure Google Sign-In for Native platforms
if (Platform.OS !== "web") {
  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
      offlineAccess: true,
    });
  } catch (error) {
    console.warn(
      "Google Sign-In is not initialized because the native module 'RNGoogleSignin' was not found. " +
      "This is expected when running in Expo Go. To use Google Sign-In on mobile, you must run a Development Build."
    );
  }
}

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithEmail: (email:string, password:string) => Promise<any>;
  signUpWithEmail: (email:string, password:string, displayName:string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email:string, password:string, displayName:string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile display name immediately
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  };

  const signInWithGoogle = async () => {
    if (Platform.OS === "web") {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(auth, provider);
    } else {
      // Native Google Sign-In
      try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        // Handle different versions of @react-native-google-signin/google-signin response shape
        const idToken = response.data?.idToken || (response as any).idToken;
        
        if (!idToken) {
          throw new Error("Google Sign-In: No ID Token received.");
        }
        
        const credential = GoogleAuthProvider.credential(idToken);
        return signInWithCredential(auth, credential);
      } catch (error: any) {
        // Handle case where native module is not present (e.g. running in Expo Go)
        if (
          error?.message?.includes("RNGoogleSignin") ||
          error?.message?.includes("TurboModuleRegistry") ||
          error?.message?.includes("null is not an object")
        ) {
          throw new Error(
            "Google Sign-In is not supported in Expo Go. " +
            "Please run the app using a Development Build ('npx expo run:android' or 'npx expo run:ios')."
          );
        }
        throw error;
      }
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    if (Platform.OS !== "web") {
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Safe to ignore if not signed in via Google
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
