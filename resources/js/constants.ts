export const STATUS_CLASS_MAP = {
    pending: 'bg-amber-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
} as const;

export const STATUS_TEXT_MAP = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
} as const;

export const PRIORITY_CLASS_MAP = {
    low: 'bg-gray-600',
    medium: 'bg-amber-600',
    high: 'bg-red-600',
} as const;

export const PRIORITY_TEXT_MAP = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
} as const;
