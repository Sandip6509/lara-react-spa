<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class TaskController extends Controller
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

        $query = Task::select('id', 'name', 'image_path', 'status', 'created_at', 'due_date', 'created_by')
            ->with('createdBy:id,name');

        $tasks = $query
            ->when($searchQuery, function (Builder $q) use ($searchQuery) {
                $q->where('name', 'like', '%'.$searchQuery.'%');
            })
            ->when($statusFilter, function (Builder $q) use ($statusFilter) {
                $q->where('status', $statusFilter);
            })
            ->orderBy($sortField, $sortDirection)
            ->paginate(10);

            return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'queryParams' => $request->query(),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::select('id', 'name')->get();
        
        $users = User::select('id', 'name')->get();

        return Inertia::render('tasks/create-edit', compact('projects', 'users'));
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
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'required|exists:users,id',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('tasks', 'public');
        }

        Task::create($validated);
        
        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::select('id', 'name')->get();

        $users = User::select('id', 'name')->get();
        
        return Inertia::render('tasks/create-edit', [
            'task' => $task,
            'projects' => $projects,
            'users' => $users,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'due_date' => 'nullable|date',
            'description' => 'nullable',
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'project_id' => 'required|exists:projects,id',
            'assigned_user_id' => 'required|exists:users,id',
        ]);

        $originalPath = $task->getRawOriginal('image_path');

        if ($request->hasFile('image_path')) {
            // Delete the old image if it exists
            if ($originalPath) {
                Storage::disk('public')->delete($originalPath);
            }
            $validated['image_path'] = $request->file('image_path')->store('tasks', 'public');
        }else {
            $validated['image_path'] = $originalPath;
        }

        $task->fill($validated)->save();

        return to_route('tasks.index')->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $taskName = $task->name;
        $task->delete();
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }

        return to_route('tasks.index')->with('success', 'Task deleted successfully!');
    }
}
