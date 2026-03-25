import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import CartSidebar from '../components/pos/CartSidebar';
import CheckoutModal from '../components/pos/CheckoutModal';

const Dashboard = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="flex h-full">
      {/* Product Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
        {showSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            Sale completed successfully!
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
              onClick={() => addToCart(product)}
            >
              <div className="font-semibold text-lg">{product.name}</div>
              <div className="text-gray-600 text-sm">{product.sku}</div>
              <div className="text-blue-600 font-bold mt-2">
                Rs. {product.price}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Stock: {product.stock}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar onCheckout={handleCheckoutClick} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default Dashboard;