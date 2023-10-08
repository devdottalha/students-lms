import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const getCollectionDetails = (collectionName, callback) => {
  onSnapshot(collection(db, collectionName), (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    if (!documents.length) {
      callback(null);
    } else {
      callback(documents);
    }
  });
};

const getUser = () => {};

const updateDocument = async (collectionName, documentId, newData) => {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, newData);
};

const deleteDocument = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
};

const setDocument = async (collectionName, documentId, data) => {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, data);
};

const getDocumentById = async (collectionName, documentId) => {
  const docRef = doc(db, collectionName, documentId);

  const documentSnapshot = await getDoc(docRef);

  if (documentSnapshot.exists()) {
    return {
      id: documentSnapshot.id,
      data: documentSnapshot.data(),
    };
  }
  return null;
};

const signInWithEmailPassword = async (email, password) => {
  email = email.toLowerCase();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  if (!user) return null;
  return user;
};
const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    alert('Document written with ID: ', docRef.id);
    return docRef.id; // Return the ID of the created document if needed
  } catch (e) {
    alert('Error adding document: ');
    throw e; // Handle the error according to your needs
  }
};

const logout = async () => {
  const done = await auth.signOut();
  if (done) return done;
  return null;
};

export {
  getCollectionDetails,
  updateDocument,
  deleteDocument,
  setDocument,
  getDocumentById,
  signInWithEmailPassword,
  getUser,
  logout,
  createDocument,
};
