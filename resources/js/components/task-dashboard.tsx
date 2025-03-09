import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TaskDashboardProps } from "@/types";

export function TaskDashboard({ stats }: TaskDashboardProps) {
    const taskData = [
        { title: "Pending Tasks", totalCount: stats.totalPendingTasks, myCount: stats.myPendingTasks, totalColor: "text-red-500", myColor: "text-green-500" },
        { title: "In Progress Tasks", totalCount: stats.totalProgressTasks, myCount: stats.myProgressTasks, totalColor: "text-red-500", myColor: "text-green-500" },
        { title: "Completed Tasks", totalCount: stats.totalCompletedTasks, myCount: stats.myCompletedTasks, totalColor: "text-red-500", myColor: "text-green-500" },
    ];
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {taskData.map((task, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden shadow-md dark:shadow-lg"
                >
                    <Card className="h-full flex flex-col justify-center items-center bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                        <CardHeader className="text-center">
                            <CardTitle className="text-lg font-semibold">
                                {task.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-3xl font-bold text-gray-900 dark:text-white">
                            <span className={task.myColor}>{task.myCount}</span> / <span className={task.totalColor}>{task.totalCount}</span>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}