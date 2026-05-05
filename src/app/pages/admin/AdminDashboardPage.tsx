import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockOrderService, mockProductService } from '../../services/mockService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../../utils/constants';
import {
  Boxes,
  ClipboardList,
  DollarSign,
  LogOut,
  Minus,
  Package,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import { Product } from '../../types/product';

type AdminTab = 'overview' | 'pos' | 'orders' | 'inventory';
type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface PosItem {
  product: Product;
  quantity: number;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [posSearch, setPosSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [posCart, setPosCart] = useState<PosItem[]>([]);
  const [checkoutNote, setCheckoutNote] = useState('');

  if (!isAuthenticated) {
    window.location.href = '/admin';
    return null;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          mockOrderService.getAll(),
          mockProductService.getAll({ per_page: 100 }),
        ]);

        setOrders(ordersData);
        setProducts(productsData.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.order_status === 'pending').length;
    const paidOrders = orders.filter(order => order.payment_status === 'paid').length;
    const lowStock = products.filter(product => product.stock_quantity <= 50).length;

    return {
      totalOrders: orders.length,
      pendingOrders,
      paidOrders,
      totalRevenue,
      totalProducts: products.length,
      lowStock,
    };
  }, [orders, products]);

  const filteredPosProducts = useMemo(() => {
    const term = posSearch.toLowerCase().trim();
    return products
      .filter(product =>
        term
          ? product.name.toLowerCase().includes(term) ||
            product.sku?.toLowerCase().includes(term) ||
            product.category.name.toLowerCase().includes(term)
          : true
      )
      .slice(0, 12);
  }, [posSearch, products]);

  const filteredOrders = useMemo(() => {
    const term = orderSearch.toLowerCase().trim();
    return orders.filter(order =>
      term
        ? order.order_number.toLowerCase().includes(term) ||
          order.customer_name.toLowerCase().includes(term) ||
          order.customer_phone.toLowerCase().includes(term)
        : true
    );
  }, [orderSearch, orders]);

  const filteredInventory = useMemo(() => {
    const term = inventorySearch.toLowerCase().trim();
    return products.filter(product =>
      term
        ? product.name.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term) ||
          product.category.name.toLowerCase().includes(term)
        : true
    );
  }, [inventorySearch, products]);

  const posSubtotal = posCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/admin';
  };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
      case 'shipped':
      case 'delivered':
      case 'paid':
        return 'success';
      case 'cancelled':
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  };

  const addToPos = (product: Product) => {
    setPosCart(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  };

  const updatePosQuantity = (productId: number, change: number) => {
    setPosCart(current =>
      current
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearPos = () => {
    setPosCart([]);
    setCheckoutNote('');
  };

  const completeCounterSale = () => {
    if (posCart.length === 0) return;

    const order: Order = {
      id: Date.now(),
      order_number: `POS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
        orders.length + 1
      ).padStart(4, '0')}`,
      customer_name: 'Counter Sale',
      customer_phone: 'N/A',
      delivery_address: 'In-store',
      subtotal: posSubtotal,
      delivery_fee: 0,
      tax: 0,
      total: posSubtotal,
      payment_method: 'cash_on_delivery',
      payment_status: 'paid',
      order_status: 'delivered',
      notes: checkoutNote,
      created_at: new Date().toISOString(),
      items: posCart.map((item, index) => ({
        id: Date.now() + index,
        order_id: Date.now(),
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.product.price * item.quantity,
      })),
    };

    setOrders(current => [order, ...current]);
    clearPos();
  };

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    await mockOrderService.updateStatus(id, status);
    setOrders(current =>
      current.map(order =>
        order.id === id ? { ...order, order_status: status } : order
      )
    );
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Muhtasari', icon: <TrendingUp size={18} /> },
    { id: 'pos', label: 'POS', icon: <ReceiptText size={18} /> },
    { id: 'orders', label: 'Oda', icon: <ClipboardList size={18} /> },
    { id: 'inventory', label: 'Stoo', icon: <Boxes size={18} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mkwazu Hardware Admin</h1>
              <p className="text-sm text-gray-600">
                Karibu, <span className="font-semibold">{user?.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={18} />
                Toka
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatTile label="Jumla ya Oda" value={stats.totalOrders} icon={<ShoppingCart />} tone="blue" />
          <StatTile label="Oda Zinazosubiri" value={stats.pendingOrders} icon={<Package />} tone="yellow" />
          <StatTile label="Mapato" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign />} tone="green" />
          <StatTile label="Bidhaa Chache" value={stats.lowStock} icon={<Boxes />} tone="red" />
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold">Oda za Hivi Karibuni</h2>
              </div>
              <OrdersTable
                orders={orders.slice(0, 8)}
                getStatusVariant={getStatusVariant}
                onStatusChange={updateOrderStatus}
              />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Hali ya Duka</h2>
              <div className="space-y-4">
                <Insight label="Oda zilizolipwa" value={stats.paidOrders} />
                <Insight label="Bidhaa zote" value={stats.totalProducts} />
                <Insight label="Bidhaa za stoo ya chini" value={stats.lowStock} />
                <Insight label="Wastani wa oda" value={orders.length ? formatCurrency(stats.totalRevenue / orders.length) : formatCurrency(0)} />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-bold">Point of Sale</h2>
                <div className="relative sm:w-80">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    value={posSearch}
                    onChange={event => setPosSearch(event.target.value)}
                    placeholder="Tafuta bidhaa au SKU..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPosProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToPos(product)}
                    className="text-left border rounded-lg p-4 hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <div className="font-semibold text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{product.sku || product.category.name}</div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-bold text-blue-600">{formatCurrency(product.price)}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.stock_quantity} stoo</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <aside className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold mb-4">Risiti ya Mauzo</h2>
              {posCart.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">Chagua bidhaa kuanza mauzo</p>
              ) : (
                <div className="space-y-4">
                  {posCart.map(item => (
                    <div key={item.product.id} className="flex items-start justify-between gap-3 border-b pb-3">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.product.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updatePosQuantity(item.product.id, -1)} className="p-1 border rounded">
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button onClick={() => updatePosQuantity(item.product.id, 1)} className="p-1 border rounded">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                        <button onClick={() => updatePosQuantity(item.product.id, -item.quantity)} className="text-red-600 mt-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <textarea
                    value={checkoutNote}
                    onChange={event => setCheckoutNote(event.target.value)}
                    placeholder="Maelezo ya mauzo..."
                    className="w-full border border-gray-300 rounded-lg p-3 min-h-20 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Jumla</span>
                    <span>{formatCurrency(posSubtotal)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={clearPos} className="px-4 py-3 border rounded-lg hover:bg-gray-50">
                      Futa
                    </button>
                    <button onClick={completeCounterSale} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Kamilisha
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {activeTab === 'orders' && (
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold">Usimamizi wa Oda</h2>
              <div className="relative sm:w-80">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  value={orderSearch}
                  onChange={event => setOrderSearch(event.target.value)}
                  placeholder="Tafuta oda, jina au simu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <OrdersTable orders={filteredOrders} getStatusVariant={getStatusVariant} onStatusChange={updateOrderStatus} />
          </section>
        )}

        {activeTab === 'inventory' && (
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold">Bidhaa na Stoo</h2>
              <div className="relative sm:w-80">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  value={inventorySearch}
                  onChange={event => setInventorySearch(event.target.value)}
                  placeholder="Tafuta bidhaa, SKU au aina..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHead>Bidhaa</TableHead>
                    <TableHead>Aina</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Bei</TableHead>
                    <TableHead>Stoo</TableHead>
                    <TableHead>Hali</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.sku || '-'}</td>
                      <td className="px-6 py-4 font-semibold">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4">{product.stock_quantity}</td>
                      <td className="px-6 py-4">
                        <Badge variant={product.stock_quantity <= 50 ? 'warning' : 'success'}>
                          {product.stock_quantity <= 50 ? 'Stoo ndogo' : 'Inatosha'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const StatTile: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone: 'blue' | 'yellow' | 'green' | 'red';
}> = ({ label, value, icon, tone }) => {
  const tones = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tones[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const Insight: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between border-b pb-3 last:border-b-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
    {children}
  </th>
);

const OrdersTable: React.FC<{
  orders: Order[];
  getStatusVariant: (status: string) => BadgeVariant;
  onStatusChange: (id: number, status: OrderStatus) => void;
}> = ({ orders, getStatusVariant, onStatusChange }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <TableHead>Namba ya Oda</TableHead>
          <TableHead>Mteja</TableHead>
          <TableHead>Jumla</TableHead>
          <TableHead>Malipo</TableHead>
          <TableHead>Hali</TableHead>
          <TableHead>Tarehe</TableHead>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {orders.map(order => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap font-medium">
              {order.order_number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-sm text-gray-500">{order.customer_phone}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-semibold">
              {formatCurrency(order.total)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant={getStatusVariant(order.payment_status)}>
                {PAYMENT_STATUS_LABELS[order.payment_status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <select
                value={order.order_status}
                onChange={event => onStatusChange(order.id, event.target.value as OrderStatus)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                  <option key={status} value={status}>
                    {label}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(order.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
