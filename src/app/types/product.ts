import { Category } from './category';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  unit: string;
  stock_quantity: number;
  min_order_quantity: number;
  sku?: string;
  weight?: number;
  dimensions?: string;
  is_featured: boolean;
  is_active: boolean;
  primary_image: string;
  category: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  per_page?: number;
  featured?: boolean;
}
