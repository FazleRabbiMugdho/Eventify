<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    try {
        // 1. Get all table names in the 'event_management' database
        $tables = DB::select('SHOW TABLES');
        
        // 2. Format the table list (MySQL returns them as objects)
        $tableList = array_map(function($table) {
            return current((array)$table);
        }, $tables);

        // 4. Return everything as a JSON response
        return response()->json([
            'status' => 'Success',
            'message' => 'Event Management API Running',
            'database_connected' => DB::connection()->getDatabaseName(),
            'all_tables_found' => $tableList,
            
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error',
            'message' => 'Could not connect to database',
            'error' => $e->getMessage()
        ], 500);
    }
});

// This route handles your frontend/SPA routing
Route::get('{any}', function () {
    if (file_exists(public_path('index.html'))) {
        return file_get_contents(public_path('index.html'));
    }
    return "API is running, but index.html is missing in the public folder.";
})->where('any', '.*');