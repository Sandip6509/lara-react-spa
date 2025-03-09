import { Task } from "@/types";
import { Clock, Loader2 } from "lucide-react";
import { JSX } from "react";
import { PlaceholderPattern } from "./ui/placeholder-pattern";

export function ActiveTasksTable({ activeTasks }: { activeTasks: Task[] }) {
    const statusIcons: { [key in Task['status']]: JSX.Element } = {
        pending: <Clock className="text-yellow-500 size-5" />,
        in_progress: <Loader2 className="text-blue-500 size-5 animate-spin" />,
    };

    const truncateText = (text: string, length: number = 20) => 
        text.length > length ? `${text.slice(0, length)}...` : text;

    return (
        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border md:min-h-min shadow-lg">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">My Active Tasks</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase">#</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Project Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Task</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTasks.length > 0 ? (
                                activeTasks.map((task, index) => (
                                    <tr
                                        key={task.id}
                                        className="border-b border-gray-300 dark:border-gray-700 transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{truncateText(task.project.name)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{truncateText(task.name)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm font-medium">
                                            {statusIcons[task.status] || null}
                                            <span className="text-gray-900 dark:text-white capitalize">{task.status.replace("_", " ")}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{task.due_date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
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