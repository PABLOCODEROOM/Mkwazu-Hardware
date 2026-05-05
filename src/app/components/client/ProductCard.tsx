import React from 'react';
import { Product } from '../../types/product';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.primary_image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.compare_price && product.compare_price > product.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            Inayopendekezwa
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.short_description}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">
            {formatCurrency(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.compare_price)}
            </span>
          )}
          <span className="text-sm text-gray-500">/{product.unit}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {product.stock_quantity > 0 ? 'Inapatikana' : 'Haipo stock'}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            <span className="text-sm">Ongeza</span>
          </button>
        </div>
      </div>
    </div>
  );
};
