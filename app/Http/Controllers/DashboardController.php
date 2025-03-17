<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $taskStats = Task::query()
            ->selectRaw("
                    COUNT(*) as totalTasks,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as totalPendingTasks,
                    SUM(CASE WHEN status = 'pending' AND assigned_user_id = ? THEN 1 ELSE 0 END) as myPendingTasks,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as totalProgressTasks,
                    SUM(CASE WHEN status = 'in_progress' AND assigned_user_id = ? THEN 1 ELSE 0 END) as myProgressTasks,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as totalCompletedTasks,
                    SUM(CASE WHEN status = 'completed' AND assigned_user_id = ? THEN 1 ELSE 0 END) as myCompletedTasks
                ", [$user->id, $user->id, $user->id]
            )
            ->first();

        $activeTasks = Task::select(['id', 'name', 'status', 'due_date', 'project_id'])->with('project:id,name')
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('dashboard', compact('taskStats', 'activeTasks'));
    }
}
