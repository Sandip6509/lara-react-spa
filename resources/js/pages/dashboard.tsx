import { ActiveTasksTable } from '@/components/active-tasks-table';
import { TaskDashboard } from '@/components/task-dashboard';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { DashboardProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ taskStats, activeTasks }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <TaskDashboard stats={taskStats} />
                <ActiveTasksTable activeTasks={activeTasks} />
            </div>
        </AppLayout>
    );
}