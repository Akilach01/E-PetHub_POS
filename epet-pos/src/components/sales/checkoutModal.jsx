import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveSale } from '../../services/saleService';

const CheckoutModal = ({ isOpen, onClose, onSuccess }) => {
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const change = cashReceived ? parseFloat(cashReceived) - total : 0;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) {
      setError('Cash received is less than total amount');
      return;
    }

    setLoading(true);
    setError('');

    const saleData = {
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      subtotal: total + (useCart().discountAmount), // original subtotal before discount
      discount: useCart().discount,
      discountAmount: useCart().discountAmount,
      total,
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : null,
      change: paymentMethod === 'cash' ? change : null,
      createdBy: currentUser.uid,
      createdAt: new Date(),
    };

    try {
      await saveSale(saleData);
      clearCart();
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to save sale: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Order Summary */}
        <div className="mb-4 max-h-60 overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>{item.quantity}x {item.name}</span>
              <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 font-bold flex justify-between">
            <span>Total:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
          </select>
        </div>

        {paymentMethod === 'cash' && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Cash Received</label>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="w-full border rounded px-3 py-2"
              step="0.01"
            />
            {cashReceived && change >= 0 && (
              <div className="text-green-600 mt-1">Change: Rs. {change.toFixed(2)}</div>
            )}
            {cashReceived && change < 0 && (
              <div className="text-red-600 mt-1">Insufficient amount</div>
            )}
          </div>
        )}

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;