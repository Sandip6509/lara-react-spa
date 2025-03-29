<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\{Auth, Storage};

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $sortField = $request->input('sortField', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $searchQuery = $request->input('name', '');
        $statusFilter = $request->input('status', '');

        $query = Project::select('id', 'name', 'image_path', 'status', 'created_at', 'due_date', 'created_by')
            ->with('createdBy:id,name');

        $projects = $query
            ->when($searchQuery, function (Builder $q) use ($searchQuery) {
                $q->where('name', 'like', '%'.$searchQuery.'%');
            })
            ->when($statusFilter, function (Builder $q) use ($statusFilter) {
                $q->where('status', $statusFilter);
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(10);

            return Inertia::render('projects/index', [
            'projects' => $projects,
            'queryParams' => $request->query(),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('projects/create-edit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'due_date' => 'nullable|date',
            'description' => 'nullable',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
        ]);

        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('projects', 'public');
        }

        Project::create($validated);

        return to_route('projects.index')->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('projects/create-edit',[
            'project' => $project,
            'isEdit' => true, 
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'due_date' => 'nullable|date',
            'description' => 'nullable',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
        ]);

        if ($request->hasFile('image_path')) {
            // Delete the old image if it exists
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $validated['image_path'] = $request->file('image_path')->store('projects', 'public');
        }

        $project->fill($validated)->save();

        return to_route('projects.index')->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $projectName = $project->name;
        $project->delete();
        if ($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }

        return to_route('projects.index')->with('success', 'Project deleted successfully!');
    }
}
