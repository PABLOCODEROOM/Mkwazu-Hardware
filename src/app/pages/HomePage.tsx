import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/client/ProductCard';
import { Spinner } from '../components/common/Spinner';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { ArrowRight, Package } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, cats] = await Promise.all([
          productService.getFeatured(),
          categoryService.getAll(),
        ]);
        setFeaturedProducts(products);
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mkwazu Hardware
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Pata vifaa vyote vya ujenzi vinavyohitajika kwa bei nzuri. Tunasafirisha hadi mlangoni mwako.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/bidhaa"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                Angalia Bidhaa
                <ArrowRight size={20} />
              </a>
              <a
                href="#categories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Aina za Bidhaa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Aina za Vifaa</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <a
                key={category.id}
                href={`/bidhaa?category=${category.slug}`}
                className="group bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200">
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-center mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 text-center">
                  {category.product_count || 0} bidhaa
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Bidhaa Zinazopendwa</h2>
            <a
              href="/bidhaa"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              Angalia zote
              <ArrowRight size={20} />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => (window.location.href = `/bidhaa/${product.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Ubora wa Juu</h3>
              <p className="text-gray-600">
                Tunauza vifaa vya ubora wa hali ya juu tu kutoka kwa wazalishaji waaminifu
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-blue-600" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Bei Nzuri</h3>
              <p className="text-gray-600">
                Tunatoa bei za ushindani na punguzo kwa ununuzi wa wingi
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="text-blue-600" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Usafirishaji Haraka</h3>
              <p className="text-gray-600">
                Tunasafirisha bidhaa zako haraka na salama hadi mlangoni mwako
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
