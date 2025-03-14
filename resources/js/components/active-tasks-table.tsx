import { Task } from '@/types';
import { Clock, Loader2 } from 'lucide-react';
import { JSX } from 'react';
import { Link } from '@inertiajs/react';

export function ActiveTasksTable({ activeTasks }: { activeTasks: Task[] }) {
    const statusIcons: { [key in Task['status']]: JSX.Element } = {
        pending: <Clock className='text-yellow-500 size-5' />,
        in_progress: <Loader2 className='text-blue-500 size-5 animate-spin' />,
    };

    const truncateText = (text: string, length: number = 20) =>
        text.length > length ? `${text.slice(0, length)}...` : text;

    return (
        <div className='min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border md:min-h-min'>
            <div className=' p-6 rounded-xl'>
                <h2 className='text-xl font-semibold text-foreground mb-2'>My Active Tasks</h2>
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-card border border-border rounded-lg overflow-hidden'>
                        <thead className='bg-secondary'>
                            <tr>
                                <th className='px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border'>#</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border'>Project Name</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border'>Task</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border'>Status</th>
                                <th className='px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border'>Due Date</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-border'>
                            {activeTasks.length > 0 ? (
                                activeTasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className='hover:bg-accent hover:text-accent-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground'
                                    >
                                        <td className='px-6 py-2 text-sm text-foreground'>{index + 1}</td>
                                        <td className='px-6 py-2 text-sm text-foreground'>
                                            <Link href={route('projects.show', task.project.id)} className='hover:underline'>
                                                {truncateText(task.project.name)}
                                            </Link>
                                        </td>
                                        <td className='px-6 py-2 text-sm text-foreground'>
                                            <Link href={route('tasks.show', task.id)} className='hover:underline'>
                                                {truncateText(task.name)}
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm font-medium'>
                                            {statusIcons[task.status] || null}
                                            <span className='text-gray-900 dark:text-white capitalize'>{task.status.replace('_', ' ')}</span>
                                        </td>
                                        <td className='px-6 py-2 text-sm text-foreground'>{task.due_date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className='text-center py-4 text-foreground'>
                                        No active tasks.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}