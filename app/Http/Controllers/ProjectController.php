<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $request = request()->only(['name', 'status', 'sortField', 'sortDirection']);
        
        // $allowedSortFields = ['id', 'name', 'status', 'created_at', 'due_date'];

        // $sortField = in_array($request['sortField'] ?? 'created_at', $allowedSortFields)
        //     ? $request['sortField']
        //     : 'created_at';

        // $sortDirection = in_array($request['sortDirection'] ?? 'desc', ['asc', 'desc'])
        //     ? $request['sortDirection']
        //     : 'desc';

        $query = Project::select('id', 'name', 'status', 'created_at', 'due_date', 'created_by')
            ->with('createdBy:id,name');

        // if (!empty($request['name'])) {
        //     $query->where('name', 'like', '%' . $request['name'] . '%');
        // }

        // if (!empty($request['status'])) {
        //     $query->where('status', $request['status']);
        // }

        $projects = $query //->orderBy($sortField, $sortDirection)
            ->paginate(10);
        // dd($projects);
        return Inertia::render('projects/index', [
            'projects' => $projects,
            'queryParams' => '',
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
