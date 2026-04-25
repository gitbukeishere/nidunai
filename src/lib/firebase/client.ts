import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics is browser-only and depends on indexedDB / window — never import
// it eagerly at the module top level, or SSR will crash. Call this from a
// `useEffect` (or any client-side code) and ignore the resolved value if
// `isSupported()` returned false (e.g. in older browsers, SSR, or when the
// page is opened in an environment without indexedDB).
export async function getAnalyticsClient(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  if (!(await isSupported())) return null;
  return getAnalytics(firebaseApp);
}
