import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const CartSidebar = ({ onCheckout }) => {
  const {
    items,
    subtotal,
    discount,
    discountAmount,
    total,
    updateQuantity,
    removeItem,
    applyDiscount,
    clearCart,
  } = useCart();

  const [discountInput, setDiscountInput] = useState(discount);

  const handleDiscountApply = () => {
    applyDiscount(discountInput);
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Cart</h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center">No items in cart</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">Rs. {item.price}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
                <div className="ml-4 w-20 text-right">
                  Rs. {item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discount Section */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="number"
              value={discountInput}
              onChange={(e) => setDiscountInput(Number(e.target.value))}
              placeholder="Discount %"
              className="w-24 border rounded px-2 py-1"
            />
            <button
              onClick={handleDiscountApply}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Totals */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({discount}%):</span>
              <span>- Rs. {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>Rs. {total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={onCheckout}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Checkout
          </button>
          <button
            onClick={clearCart}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;