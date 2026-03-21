import { db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";

export interface UserFormData {
  company: string;
  project: string;
  name: string;
  age: number;
  contractor: string;
  bloodGroup: string;
  emergencyContact: string;
}

export interface Personnel {
  id: string;
  name: string;
  age: number;
  company: string;
  project: string;
  contractor: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyContact2: string;
  manualId: string;
  createdAt?: any;
}

export const loginUser = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerUser = async (email: string, pass: string) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const addUserToFirestore = async (data: UserFormData) => {
  // Firestore will automatically create the 'users' collection if it doesn't exist
  return await addDoc(collection(db, "users"), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getPersonnelList = async () => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getPersonnelById = async (id: string): Promise<Personnel | null> => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Personnel;
  } else {
    return null;
  }
};