#!/usr/bin/env sh
set -e

php artisan mkwazu:boot

php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
