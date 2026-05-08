<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(): JsonResponse
    {
        // Total orders
        $totalOrders = Order::count();

        // Pending orders
        $pendingOrders = Order::pending()->count();

        // Total revenue
        $totalRevenue = Order::whereIn('order_status', ['confirmed', 'shipped', 'delivered'])
            ->sum('total');

        // Total products
        $totalProducts = Product::count();

        // Low stock products
        $lowStockProducts = Product::where('stock_quantity', '<', 10)
            ->where('is_active', true)
            ->count();

        // Recent orders
        $recentOrders = Order::with('items')
            ->latest()
            ->limit(10)
            ->get();

        // Revenue chart (last 5 months)
        // Using TO_CHAR for PostgreSQL compatibility (Render uses Postgres)
        $revenueChart = DB::table('orders')
            ->select(
                DB::raw("TO_CHAR(created_at, 'Mon') as month"),
                DB::raw('SUM(total) as revenue')
            )
            ->where('created_at', '>=', now()->subMonths(5))
            ->groupBy(DB::raw("TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)"))
            ->orderBy(DB::raw("DATE_TRUNC('month', created_at)"))
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_revenue' => $totalRevenue,
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'recent_orders' => $recentOrders,
                'revenue_chart' => [
                    'labels' => $revenueChart->pluck('month'),
                    'data' => $revenueChart->pluck('revenue'),
                ],
            ],
        ]);
    }
}
