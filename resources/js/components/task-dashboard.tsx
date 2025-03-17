import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TaskDashboardProps } from '@/types';

export function TaskDashboard({ stats }: TaskDashboardProps) {
    const taskData = [
        { title: 'Pending Tasks', totalCount: stats.totalPendingTasks, myCount: stats.myPendingTasks, totalColor: 'text-red-500', myColor: 'text-green-500' },
        { title: 'In Progress Tasks', totalCount: stats.totalProgressTasks, myCount: stats.myProgressTasks, totalColor: 'text-red-500', myColor: 'text-green-500' },
        { title: 'Completed Tasks', totalCount: stats.totalCompletedTasks, myCount: stats.myCompletedTasks, totalColor: 'text-red-500', myColor: 'text-green-500' },
    ];
    return (
        <div className='grid auto-rows-min gap-4 md:grid-cols-3 p-2'>
            {taskData.map((task, index) => (
                <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='relative aspect-video rounded-xl overflow-hidden'
                >
                    <Card className='h-full flex flex-col justify-center items-center'>
                        <CardHeader className='text-center'>
                            <CardTitle className='text-lg font-semibold text-foreground'>
                                {task.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='text-3xl font-bold text-foreground'>
                            <span className={task.myColor}>{task.myCount ?? 0}</span> / <span className={task.totalColor}>{task.totalCount ?? 0}</span>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}