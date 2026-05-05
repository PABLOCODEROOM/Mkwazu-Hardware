<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Saruji (Category 1)
            [
                'category_id' => 1,
                'name' => 'Saruji Mtwara Grade 32.5',
                'slug' => 'saruji-mtwara-325',
                'description' => 'Saruji bora ya uzalishaji wa Tanzania yenye ubora wa kimataifa. Inafaa kwa ujenzi wa kawaida na matengenezo.',
                'short_description' => 'Saruji bora kwa ujenzi wa nyumba',
                'price' => 18500,
                'compare_price' => 20000,
                'unit' => 'gunia',
                'stock_quantity' => 500,
                'min_order_quantity' => 1,
                'sku' => 'SAR-MTW-325',
                'weight' => 50,
                'dimensions' => '60x40x15 cm',
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=800'],
            ],
            [
                'category_id' => 1,
                'name' => 'Saruji Tanga Grade 42.5',
                'slug' => 'saruji-tanga-425',
                'description' => 'Saruji yenye nguvu zaidi, inayofaa kwa ujenzi wa miradi mikubwa, madaraja, na ujenzi wenye msukumo mkubwa.',
                'short_description' => 'Saruji yenye nguvu kwa miradi mikubwa',
                'price' => 22000,
                'unit' => 'gunia',
                'stock_quantity' => 300,
                'min_order_quantity' => 1,
                'sku' => 'SAR-TNG-425',
                'weight' => 50,
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1763839479257-b2ae0bc4c928?w=800'],
            ],

            // Mabati (Category 2)
            [
                'category_id' => 2,
                'name' => 'Bati la Aluminium 30 Gauge',
                'slug' => 'bati-aluminium-30',
                'description' => 'Mabati mazuri ya aluminium yenye uhai wa miaka mingi. Hayachafuki wala kutu.',
                'short_description' => 'Bati la aluminium lenye ubora',
                'price' => 25000,
                'unit' => 'kipande',
                'stock_quantity' => 200,
                'min_order_quantity' => 1,
                'sku' => 'BAT-ALU-30',
                'weight' => 8.5,
                'dimensions' => '366x76 cm',
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1639129797888-13598d02775e?w=800'],
            ],
            [
                'category_id' => 2,
                'name' => 'Bati la Rangi Kijani 28 Gauge',
                'slug' => 'bati-rangi-kijani-28',
                'description' => 'Mabati yenye rangi ya kijani ya kudumu, yanayofaa kwa mazingira ya vijijini.',
                'short_description' => 'Bati lenye rangi ya kijani',
                'price' => 28000,
                'compare_price' => 30000,
                'unit' => 'kipande',
                'stock_quantity' => 150,
                'sku' => 'BAT-RNG-28',
                'weight' => 9.2,
                'is_featured' => false,
                'images' => ['https://images.unsplash.com/photo-1628002881911-8bcdfbdf320e?w=800'],
            ],

            // Matofali (Category 3)
            [
                'category_id' => 3,
                'name' => 'Tofali Jekundu la Kawaida',
                'slug' => 'tofali-jekundu',
                'description' => 'Matofali mekundu ya kawaida yenye nguvu kubwa. Yanafaa kwa ujenzi wa kuta za ndani na nje.',
                'short_description' => 'Matofali imara kwa ujenzi',
                'price' => 450,
                'unit' => 'kipande',
                'stock_quantity' => 10000,
                'min_order_quantity' => 100,
                'sku' => 'TOF-JEK-001',
                'weight' => 3.5,
                'dimensions' => '20x10x7 cm',
                'is_featured' => false,
                'images' => ['https://images.unsplash.com/photo-1771575522109-caee5ff9e8b3?w=800'],
            ],

            // Mabomba (Category 4)
            [
                'category_id' => 4,
                'name' => 'Bomba la PVC 1/2 inch',
                'slug' => 'bomba-pvc-half-inch',
                'description' => 'Mabomba ya PVC yenye ubora wa hali ya juu kwa mfumo wa maji safi.',
                'short_description' => 'Bomba la PVC kwa maji safi',
                'price' => 3500,
                'unit' => 'kipande (3m)',
                'stock_quantity' => 400,
                'sku' => 'BOM-PVC-05',
                'weight' => 1.2,
                'dimensions' => '300x1.27 cm',
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1611236544238-2d272eff2cd6?w=800'],
            ],

            // Rangi (Category 5)
            [
                'category_id' => 5,
                'name' => 'Rangi ya Kuta - Nyeupe (20L)',
                'slug' => 'rangi-kuta-nyeupe-20l',
                'description' => 'Rangi nzuri ya kuta, nyeupe safi, inayofaa kwa ndani na nje.',
                'short_description' => 'Rangi nyeupe kwa kuta',
                'price' => 45000,
                'compare_price' => 50000,
                'unit' => 'ndoo (20L)',
                'stock_quantity' => 80,
                'sku' => 'RNG-KUT-W20',
                'weight' => 22,
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1560400692-3d860fd45eeb?w=800'],
            ],

            // Nondo (Category 6)
            [
                'category_id' => 6,
                'name' => 'Misumari ya Kawaida (1kg)',
                'slug' => 'misumari-kawaida-1kg',
                'description' => 'Misumari ya kawaida kwa ujenzi wa kila aina.',
                'short_description' => 'Misumari ya ujenzi',
                'price' => 5500,
                'unit' => 'kilo',
                'stock_quantity' => 300,
                'sku' => 'MIS-KAW-1K',
                'weight' => 1,
                'is_featured' => false,
                'images' => ['https://images.unsplash.com/photo-1631342816586-30462a1d30d0?w=800'],
            ],

            // Madirisha (Category 7)
            [
                'category_id' => 7,
                'name' => 'Mlango wa Kioo - Mita 2',
                'slug' => 'mlango-kioo-2m',
                'description' => 'Milango ya kioo ya kisasa yenye fremu za aluminium.',
                'short_description' => 'Mlango wa kioo wa kisasa',
                'price' => 185000,
                'unit' => 'kipande',
                'stock_quantity' => 25,
                'sku' => 'MLG-KIO-2M',
                'weight' => 45,
                'dimensions' => '200x90x4 cm',
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1771366260867-7e07094579d7?w=800'],
            ],

            // Vigae (Category 8)
            [
                'category_id' => 8,
                'name' => 'Vigae vya Sakafu - Nyeupe',
                'slug' => 'vigae-sakafu-nyeupe',
                'description' => 'Vigae vya sakafu vya ceramic, nyeupe safi.',
                'short_description' => 'Vigae vya ceramic kwa sakafu',
                'price' => 18000,
                'unit' => 'mita ya mraba',
                'stock_quantity' => 150,
                'sku' => 'VIG-SAK-NYE',
                'weight' => 18,
                'is_featured' => true,
                'images' => ['https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=800'],
            ],
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            unset($productData['images']);

            $product = Product::create($productData);

            // Add images
            foreach ($images as $index => $imageUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl,
                    'alt_text' => $product->name,
                    'display_order' => $index,
                    'is_primary' => $index === 0,
                ]);
            }
        }
    }
}
