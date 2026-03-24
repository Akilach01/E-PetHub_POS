import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/productService';

const ProductsContext = createContext();

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const add = async (product) => {
    const docRef = await addProduct(product);
    setProducts(prev => [{ id: docRef.id, ...product }, ...prev]);
  };

  const update = async (id, product) => {
    await updateProduct(id, product);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const remove = async (id) => {
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, loading, add, update, remove, refresh: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};