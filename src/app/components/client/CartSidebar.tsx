import React from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { DEFAULT_DELIVERY_FEE } from '../../utils/constants';

export const CartSidebar: React.FC = () => {
  const { items, isCartOpen, toggleCart, removeItem, updateQuantity, getTotal } = useCart();

  if (!isCartOpen) return null;

  const subtotal = getTotal();
  const total = subtotal + DEFAULT_DELIVERY_FEE;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={toggleCart}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} />
            Kikapu Changu
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Kikapu chako ni tupu</p>
              <button
                onClick={toggleCart}
                className="mt-4 text-blue-600 hover:underline"
              >
                Endelea kununua
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={item.product.primary_image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatCurrency(item.product.price)}/{item.product.unit}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-200"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Jumla ya bidhaa:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gharama ya usafirishaji:</span>
              <span>{formatCurrency(DEFAULT_DELIVERY_FEE)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Jumla:</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
            <a
              href="/malipo"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Endelea na Malipo
            </a>
          </div>
        )}
      </div>
    </>
  );
};
