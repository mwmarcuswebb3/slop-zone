import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
  collection, getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvZvCnOi8qCEt3AhnR9NliiYLZFZ7yPTE",
  authDomain: "slopzone.firebaseapp.com",
  databaseURL: "https://slopzone-default-rtdb.firebaseio.com",
  projectId: "slopzone",
  storageBucket: "slopzone.firebasestorage.app",
  messagingSenderId: "1077230223408",
  appId: "1:1077230223408:web:2e105002d7771cdfbaedf5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const safe = (key) => key.replace(/\//g, "_");

window.storage = {
  get: async (key, shared = false) => {
    if (!shared) {
      const val = localStorage.getItem(key);
      if (val === null) throw new Error("Key not found");
      return { key, value: val, shared: false };
    }
    const snap = await getDoc(doc(db, "shared", safe(key)));
    if (!snap.exists()) throw new Error("Key not found");
    return { key, value: snap.data().value, shared: true };
  },
  set: async (key, value, shared = false) => {
    if (!shared) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    }
    await setDoc(doc(db, "shared", safe(key)), { value, updatedAt: Date.now() });
    return { key, value, shared: true };
  },
  delete: async (key, shared = false) => {
    if (!shared) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    }
    await deleteDoc(doc(db, "shared", safe(key)));
    return { key, deleted: true, shared: true };
  },
  list: async (prefix = "", shared = false) => {
    if (!shared) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      return { keys, prefix, shared: false };
    }
    const snap = await getDocs(collection(db, "shared"));
    const keys = snap.docs.map(d => d.id).filter(k => k.startsWith(safe(prefix)));
    return { keys, prefix, shared: true };
  },
};
