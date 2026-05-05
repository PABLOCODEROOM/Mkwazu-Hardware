import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { DEFAULT_DELIVERY_FEE, REGIONS, PAYMENT_METHOD_LABELS } from '../utils/constants';
import { mockOrderService } from '../services/mockService';
import { CreateOrderData, PaymentMethod } from '../types/order';
import { Spinner } from '../components/common/Spinner';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    delivery_region: '',
    payment_method: 'cash_on_delivery' as PaymentMethod,
    notes: '',
  });

  const subtotal = getTotal();
  const total = subtotal + DEFAULT_DELIVERY_FEE;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData: CreateOrderData = {
        ...formData,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const result = await mockOrderService.create(orderData);
      setOrderNumber(result.order_number);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      alert('Kuna tatizo. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Kikapu chako ni tupu</p>
          <a href="/bidhaa" className="text-blue-600 hover:underline">
            Rudi kununua
          </a>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold mb-4">Oda Yako Imetumwa!</h2>
          <p className="text-gray-600 mb-2">Namba ya oda yako ni:</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">{orderNumber}</p>
          <p className="text-sm text-gray-500 mb-8">
            Tutawasiliana nawe kupitia simu ili kuthibitisha oda yako.
            Asante kwa kununua!
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Rudi Mwanzoni
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="/bidhaa" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <ArrowLeft size={20} />
          Rudi kununua
        </a>

        <h1 className="text-3xl font-bold mb-8">Thibitisha Oda Yako</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Taarifa za Watoaji</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Jina Kamili *</label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Namba ya Simu *</label>
                <input
                  type="tel"
                  required
                  placeholder="+255..."
                  value={formData.customer_phone}
                  onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Barua Pepe (hiari)</label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={e => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mkoa *</label>
                <select
                  required
                  value={formData.delivery_region}
                  onChange={e => setFormData({ ...formData, delivery_region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Chagua mkoa...</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Anwani Kamili *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.delivery_address}
                  onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Mtaa, Kitongoji, Namba ya Nyumba..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Njia ya Malipo *</label>
                <select
                  required
                  value={formData.payment_method}
                  onChange={e => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Maelezo ya Ziada (hiari)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Maelekezo maalum..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
              >
                {loading ? <Spinner size="sm" /> : 'Tuma Oda'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Muhtasari wa Oda</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Jumla ya bidhaa:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usafirishaji:</span>
                  <span>{formatCurrency(DEFAULT_DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Jumla:</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
