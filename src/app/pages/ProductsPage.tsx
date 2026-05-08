import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/client/ProductCard';
import { Spinner } from '../components/common/Spinner';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Filter, Search, X } from 'lucide-react';

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
    const search = params.get('search') || '';
    setSelectedCategory(category);
    setSearchTerm(search);
  }, []);

  const updateUrl = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    const query = params.toString();
    window.history.pushState({}, '', query ? `/bidhaa?${query}` : '/bidhaa');
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateUrl(category, searchTerm);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(selectedCategory, searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    updateUrl(selectedCategory, '');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, cats] = await Promise.all([
          productService.getAll({
            category: selectedCategory || undefined,
            search: searchTerm || undefined,
          }),
          categoryService.getAll(),
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

        <form onSubmit={handleSearchSubmit} className="mb-6 bg-white rounded-lg border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tafuta bidhaa kwa jina, maelezo au SKU..."
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700"
                aria-label="Futa utafutaji"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

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
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left px-3 py-2 rounded ${
                  selectedCategory === '' ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                Zote
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
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
                <p className="text-gray-500 text-lg">
                  Hakuna bidhaa zilizopatikana{searchTerm ? ` kwa "${searchTerm}"` : ''}
                </p>
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
