<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Get all products for admin
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'images']);

        // Search
        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        // Pagination
        $products = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'total_pages' => $products->lastPage(),
                'total_items' => $products->total(),
                'per_page' => $products->perPage(),
            ],
        ]);
    }

    /**
     * Create new product
     */
    public function store(CreateProductRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $product = Product::create($request->validated());

            // Handle image uploads
            if ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bidhaa imeongezwa kikamilifu',
                'data' => $product->load(['category', 'images']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea wakati wa kuongeza bidhaa',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update product
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        try {
            DB::beginTransaction();

            $product->update($request->validated());

            // Handle new image uploads
            if ($request->hasFile('images')) {
                $this->handleImageUploads($product, $request->file('images'));
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Bidhaa imebadilishwa kikamilifu',
                'data' => $product->load(['category', 'images']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea wakati wa kubadilisha bidhaa',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete product
     */
    public function destroy(Product $product): JsonResponse
    {
        try {
            // Check if product is in any orders
            if ($product->orderItems()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bidhaa haiwezi kufutwa kwa sababu ipo katika oda',
                ], 400);
            }

            // Delete images from storage
            foreach ($product->images as $image) {
                $this->deleteImageFile($image->image_url);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bidhaa imefutwa kikamilifu',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea wakati wa kufuta bidhaa',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Upload additional images
     */
    public function uploadImages(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $product = Product::findOrFail($id);

        try {
            $this->handleImageUploads($product, $request->file('images'));

            return response()->json([
                'success' => true,
                'message' => 'Picha zimeongezwa kikamilifu',
                'data' => $product->load('images'),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea wakati wa kupakia picha',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete product image
     */
    public function deleteImage(int $imageId): JsonResponse
    {
        try {
            $image = ProductImage::findOrFail($imageId);

            $this->deleteImageFile($image->image_url);
            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Picha imefutwa kikamilifu',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea wakati wa kufuta picha',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Handle image uploads
     */
    private function handleImageUploads(Product $product, array $images): void
    {
        $isFirstImage = $product->images()->count() === 0;

        foreach ($images as $index => $image) {
            $path = $image->store('products', 'public');
            $url = Storage::url($path);

            $product->images()->create([
                'image_url' => $url,
                'alt_text' => $product->name,
                'display_order' => $index,
                'is_primary' => $isFirstImage && $index === 0,
            ]);
        }
    }

    /**
     * Delete image file from storage
     */
    private function deleteImageFile(string $url): void
    {
        $path = str_replace('/storage/', '', $url);
        Storage::disk('public')->delete($path);
    }
}
