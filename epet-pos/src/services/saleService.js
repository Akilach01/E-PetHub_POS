import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, increment, writeBatch } from 'firebase/firestore';

const salesCollection = collection(db, 'sales');

export const saveSale = async (saleData) => {
  // Use a batch to update both sale and product stock atomically
  const batch = writeBatch(db);

  // Add sale document
  const saleRef = doc(salesCollection);
  batch.set(saleRef, saleData);

  // Update product stock for each item
  for (const item of saleData.items) {
    const productRef = doc(db, 'products', item.productId);
    batch.update(productRef, {
      stock: increment(-item.quantity),
    });
  }

  await batch.commit();
  return saleRef.id;
};