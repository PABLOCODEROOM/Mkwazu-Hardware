<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Saruji',
                'slug' => 'saruji',
                'description' => 'Aina mbalimbali za saruji kwa ajili ya ujenzi',
                'image_url' => 'https://images.unsplash.com/photo-1730627283177-f43b83c3850c?w=400',
                'display_order' => 1,
            ],
            [
                'name' => 'Mabati',
                'slug' => 'mabati',
                'description' => 'Mabati ya aina tofauti kwa paa',
                'image_url' => 'https://images.unsplash.com/photo-1639129797888-13598d02775e?w=400',
                'display_order' => 2,
            ],
            [
                'name' => 'Matofali',
                'slug' => 'matofali',
                'description' => 'Matofali na vigae vya ujenzi',
                'image_url' => 'https://images.unsplash.com/photo-1771575522109-caee5ff9e8b3?w=400',
                'display_order' => 3,
            ],
            [
                'name' => 'Mabomba',
                'slug' => 'mabomba',
                'description' => 'Mabomba ya maji na safi',
                'image_url' => 'https://images.unsplash.com/photo-1611236544238-2d272eff2cd6?w=400',
                'display_order' => 4,
            ],
            [
                'name' => 'Rangi',
                'slug' => 'rangi',
                'description' => 'Rangi za kuta na chuma',
                'image_url' => 'https://images.unsplash.com/photo-1560400692-3d860fd45eeb?w=400',
                'display_order' => 5,
            ],
            [
                'name' => 'Nondo na Vifaa vya Kufunga',
                'slug' => 'nondo',
                'description' => 'Nondo, misumari na vifaa vya kufunga',
                'image_url' => 'https://images.unsplash.com/photo-1631342816586-30462a1d30d0?w=400',
                'display_order' => 6,
            ],
            [
                'name' => 'Madirisha na Milango',
                'slug' => 'madirisha-milango',
                'description' => 'Madirisha na milango ya kisasa',
                'image_url' => 'https://images.unsplash.com/photo-1771366260867-7e07094579d7?w=400',
                'display_order' => 7,
            ],
            [
                'name' => 'Vigae',
                'slug' => 'vigae',
                'description' => 'Vigae vya sakafu na ukuta',
                'image_url' => 'https://images.unsplash.com/photo-1762633203398-d4432b5269b1?w=400',
                'display_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
