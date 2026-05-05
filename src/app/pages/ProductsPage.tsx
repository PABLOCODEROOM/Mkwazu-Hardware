import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/client/ProductCard';
import { Spinner } from '../components/common/Spinner';
import { mockProductService, mockCategoryService } from '../services/mockService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Filter } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || '';
    setSelectedCategory(category);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, cats] = await Promise.all([
          mockProductService.getAll({
            category: selectedCategory || undefined,
            search: searchTerm || undefined,
          }),
          mockCategoryService.getAll(),
        ]);
        setProducts(productsData.data);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name || 'Bidhaa Zote'
              : 'Bidhaa Zote'}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border"
          >
            <Filter size={20} />
            Chuja
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 bg-white rounded-lg p-6 h-fit sticky top-24`}
          >
            <h3 className="font-bold mb-4">Aina za Bidhaa</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedCategory === '' ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                Zote
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    selectedCategory === category.slug
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                  <span className="text-sm text-gray-500 ml-2">({category.product_count})</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Hakuna bidhaa zilizopatikana</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => (window.location.href = `/bidhaa/${product.slug}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
