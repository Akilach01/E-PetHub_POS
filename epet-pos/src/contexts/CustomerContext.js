import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customerService';

const CustomersContext = createContext();

export const useCustomers = () => useContext(CustomersContext);

export const CustomersProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const add = async (customer) => {
    const docRef = await addCustomer(customer);
    setCustomers(prev => [{ id: docRef.id, ...customer }, ...prev]);
  };

  const update = async (id, customer) => {
    await updateCustomer(id, customer);
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const remove = async (id) => {
    await deleteCustomer(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CustomersContext.Provider value={{ customers, loading, add, update, remove, refresh: fetchCustomers }}>
      {children}
    </CustomersContext.Provider>
  );
};