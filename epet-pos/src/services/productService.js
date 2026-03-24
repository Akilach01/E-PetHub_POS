import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

const productsCollection = collection(db, 'products');

// Get all products
export const getProducts = async () => {
  const q = query(productsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add new product
export const addProduct = async (productData) => {
  return await addDoc(productsCollection, {
    ...productData,
    createdAt: new Date(),
    stock: productData.stock || 0
  });
};

// Update product
export const updateProduct = async (id, productData) => {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, productData);
};

// Delete product
export const deleteProduct = async (id) => {
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
};