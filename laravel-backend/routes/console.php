<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mkwazu:boot', function () {
    $this->call('migrate', ['--force' => true]);

    $hasProducts = false;

    try {
        $hasProducts = DB::table('products')->exists();
    } catch (Throwable) {
        $hasProducts = false;
    }

    if (! $hasProducts) {
        $this->call('db:seed', ['--force' => true]);
        $this->info('Database seeded.');
        return;
    }

    $this->info('Database already has products; seed skipped.');
})->purpose('Run Render startup database setup safely');
