<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'min_order_quantity' => 'nullable|integer|min:1',
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'weight' => 'nullable|numeric|min:0',
            'dimensions' => 'nullable|string|max:100',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Aina ya bidhaa inahitajika',
            'category_id.exists' => 'Aina ya bidhaa haijpatikana',
            'name.required' => 'Jina la bidhaa linahitajika',
            'price.required' => 'Bei inahitajika',
            'price.min' => 'Bei lazima iwe zaidi ya 0',
            'sku.unique' => 'SKU tayari ipo',
            'images.*.image' => 'Faili lazima iwe picha',
            'images.*.mimes' => 'Picha lazima iwe aina ya: jpeg, png, jpg, webp',
            'images.*.max' => 'Ukubwa wa picha lazima usiwe zaidi ya 5MB',
        ];
    }
}
