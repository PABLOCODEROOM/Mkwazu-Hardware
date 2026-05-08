<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Create a new order
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Calculate order totals
            $subtotal = 0;
            $orderItems = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock
                if ($product->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => "Samahani, {$product->name} haipo stock ya kutosha",
                    ], 400);
                }

                $itemSubtotal = $product->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $itemSubtotal,
                ];

                // Decrease stock and check if successful
                if (!$product->decreaseStock($item['quantity'])) {
                    throw new \Exception("Samahani, {$product->name} haina stock ya kutosha");
                }
            }

            // Create order
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'delivery_address' => $request->delivery_address,
                'delivery_region' => $request->delivery_region,
                'delivery_district' => $request->delivery_district,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
                'subtotal' => $subtotal,
                'delivery_fee' => 5000, // Fixed delivery fee
                'tax' => 0,
                'total' => $subtotal + 5000,
            ]);

            // Create order items
            foreach ($orderItems as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();

            // TODO: Send email/SMS notification

            return response()->json([
                'success' => true,
                'message' => 'Oda yako imetumwa kikamilifu',
                'data' => [
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'order_status' => $order->order_status,
                    'payment_status' => $order->payment_status,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Hitilafu imetokea. Tafadhali jaribu tena.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Track order by order number
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $order = Order::with('items')
            ->where('order_number', $orderNumber)
            ->where('customer_phone', $request->phone)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Oda haijapatikana. Hakikisha namba ya oda na simu ni sahihi.',
            ], 404);
        }

        // Build timeline
        $timeline = [
            ['status' => 'pending', 'timestamp' => $order->created_at],
        ];

        if ($order->confirmed_at) {
            $timeline[] = ['status' => 'confirmed', 'timestamp' => $order->confirmed_at];
        }
        if ($order->shipped_at) {
            $timeline[] = ['status' => 'shipped', 'timestamp' => $order->shipped_at];
        }
        if ($order->delivered_at) {
            $timeline[] = ['status' => 'delivered', 'timestamp' => $order->delivered_at];
        }
        if ($order->cancelled_at) {
            $timeline[] = ['status' => 'cancelled', 'timestamp' => $order->cancelled_at];
        }

        return response()->json([
            'success' => true,
            'data' => array_merge($order->toArray(), [
                'timeline' => $timeline,
            ]),
        ]);
    }
}
