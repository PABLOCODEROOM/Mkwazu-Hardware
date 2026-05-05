export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  product_count?: number;
  is_active: boolean;
}
