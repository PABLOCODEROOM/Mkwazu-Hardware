<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Get all orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('items');

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // Filter by date range
        if ($request->has('date_from') || $request->has('date_to')) {
            $query->dateRange($request->date_from, $request->date_to);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';

            $query->where(function ($q) use ($search, $like) {
                $q->where('order_number', $like, "%{$search}%")
                  ->orWhere('customer_name', $like, "%{$search}%")
                  ->orWhere('customer_phone', $like, "%{$search}%");
            });
        }

        // Pagination
        $orders = $query->latest()->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'total_pages' => $orders->lastPage(),
                'total_items' => $orders->total(),
                'per_page' => $orders->perPage(),
            ],
        ]);
    }

    /**
     * Get single order
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with(['items.product'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'admin_notes' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        $order->updateStatus($validated['order_status']);

        if (isset($validated['admin_notes'])) {
            $order->admin_notes = $validated['admin_notes'];
            $order->save();
        }

        // TODO: Send notification to customer

        return response()->json([
            'success' => true,
            'message' => 'Hali ya oda imebadilishwa kikamilifu',
            'data' => $order,
        ]);
    }

    /**
     * Update payment status
     */
    public function updatePayment(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,paid,failed',
        ]);

        $order = Order::findOrFail($id);
        $order->payment_status = $validated['payment_status'];
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Hali ya malipo imebadilishwa kikamilifu',
            'data' => $order,
        ]);
    }
}
