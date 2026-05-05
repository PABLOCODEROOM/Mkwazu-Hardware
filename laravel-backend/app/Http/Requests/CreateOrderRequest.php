<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'delivery_address' => 'required|string',
            'delivery_region' => 'nullable|string|max:100',
            'delivery_district' => 'nullable|string|max:100',
            'payment_method' => 'required|in:cash_on_delivery,mobile_money,bank_transfer',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Jina la mteja linahitajika',
            'customer_phone.required' => 'Namba ya simu inahitajika',
            'customer_email.email' => 'Barua pepe si sahihi',
            'delivery_address.required' => 'Anwani ya usafirishaji inahitajika',
            'payment_method.required' => 'Njia ya malipo inahitajika',
            'items.required' => 'Lazima uchague bidhaa angalau moja',
            'items.min' => 'Lazima uchague bidhaa angalau moja',
            'items.*.product_id.required' => 'Bidhaa inahitajika',
            'items.*.product_id.exists' => 'Bidhaa haijpatikana',
            'items.*.quantity.required' => 'Idadi inahitajika',
            'items.*.quantity.min' => 'Idadi lazima iwe angalau 1',
        ];
    }
}
