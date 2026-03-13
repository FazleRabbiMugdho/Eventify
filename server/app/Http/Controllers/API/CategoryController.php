<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    // List all categories
    public function index()
    {
        return response()->json(Category::all());
    }

    // Show a single category
    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);

        return response()->json($category);
    }

    // Create a new category
    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
        ]);

        $category = Category::create([
            'category_name' => $request->category_name
        ]);

        return response()->json(['message' => 'Category created', 'category' => $category], 201);
    }

    // Update a category
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);

        $category->update($request->only('category_name'));
        return response()->json(['message' => 'Category updated', 'category' => $category]);
    }

    // Delete a category
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);

        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}