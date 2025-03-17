import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface TaskStats {
    totalPendingTasks: number;
    myPendingTasks: number;
    totalProgressTasks: number;
    myProgressTasks: number;
    totalCompletedTasks: number;
    myCompletedTasks: number;
}

export interface TaskDashboardProps {
    stats: TaskStats;
}

export interface Task {
    id: number;
    name: string;
    status: string;
    due_date: string;
    project: {
        id: number;
        name: string;
    };
    [key: string]: unknown;
}

export interface DashboardProps {
    auth: Auth;
    taskStats: TaskStats;
    activeTasks: Task[];
}

export interface Column {
    label: string;
    accessor?: keyof T;
    render?: (row: T, rowIndex: number) => React.ReactNode;
    sortable?: boolean;
}

export interface TableProps {
    columns: Column[];
    data: Record<string, unknown>[];
    sortField?: string;
    sortDirection?: string;
    onSort?: (field: string, direction: 'asc' | 'desc') => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    statusFilter?: string;
    onStatusFilterChange?: (status: string) => void;
}

export interface Project {
    id: number;
    image_path: string;
    name: string;
    status: keyof typeof STATUS_CLASS_MAP;
    created_at: string;
    due_date: string;
    created_by: {
        name: string;
    };
    [key: string]: unknown; 
}

export interface QueryParams {
    name?: string;
    status?: string;
    sortField?: string;
    sortDirection?: string;
}

export interface ProjectProps {
    projects: {
        data: Project[];
        links: unknown[];
        meta: unknown;
    };
    queryParams: QueryParams;
    success?: string;
    [key: string]: unknown;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}