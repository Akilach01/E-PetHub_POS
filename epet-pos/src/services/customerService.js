import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';

const customersCollection = collection(db, 'customers');

export const getCustomers = async () => {
  const q = query(customersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addCustomer = async (customerData) => {
  return await addDoc(customersCollection, {
    ...customerData,
    createdAt: new Date(),
    loyaltyPoints: customerData.loyaltyPoints || 0,
    totalSpent: customerData.totalSpent || 0,
  });
};

export const updateCustomer = async (id, customerData) => {
  const customerRef = doc(db, 'customers', id);
  await updateDoc(customerRef, customerData);
};

export const deleteCustomer = async (id) => {
  const customerRef = doc(db, 'customers', id);
  await deleteDoc(customerRef);
};