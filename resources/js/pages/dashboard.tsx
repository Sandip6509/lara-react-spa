import { ActiveTasks } from '@/components/active-tasks';
import { TaskDashboard } from '@/components/task-dashboard';
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
            <Head title='Dashboard' />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-2'>
                <TaskDashboard stats={taskStats} />
                <ActiveTasks activeTasks={activeTasks} />
            </div>
        </AppLayout>
    );
}