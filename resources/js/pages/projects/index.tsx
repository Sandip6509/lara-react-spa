import { Button } from '@/components/ui/button';
import Table from '@/components/ui/table';
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectProps, type Project } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

export default function Project({ projects, queryParams, success }: ProjectProps) {
    const [searchQuery, setSearchQuery] = useState(queryParams?.name || '');
    const [statusFilter, setStatusFilter] = useState(queryParams?.status || '');
    const [sortField, setSortField] = useState(queryParams?.sortField || 'created_at');
    const [sortDirection, setSortDirection] = useState(queryParams?.sortDirection || 'desc');

    const handleSort = (field: string) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
        router.get(route('projects.index'), {
            ...queryParams,
            sortField: field,
            sortDirection: direction,
            name: searchQuery,
            status: statusFilter,
        });
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        router.get(route('projects.index'), {
            ...queryParams,
            name: query,
            status: statusFilter,
            sortField,
            sortDirection,
        });
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get(route('projects.index'), {
            ...queryParams,
            name: searchQuery,
            status,
            sortField,
            sortDirection,
        });
    };

    const columns = [
        { accessor: 'id', label: 'ID' },
        { accessor: 'image_path', label: 'Image', render: (item: Project) => <img src={item.image_path} alt={item.name} className='w-8 h-8 rounded' /> },
        { accessor: 'name', label: 'Name' },
        { accessor: 'status', label: 'Status', render: (item: Project) => <span className={`px-2 py-1 rounded text-xs font-semibold text-foreground ${STATUS_CLASS_MAP[item.status as keyof typeof STATUS_CLASS_MAP]}`}>{STATUS_TEXT_MAP[item.status as keyof typeof STATUS_TEXT_MAP]}</span> },
        { accessor: 'created_at', label: 'Create At' },
        { accessor: 'due_date', label: 'Due Date' },
        { accessor: 'created_by', label: 'Created By', render: (item: Project) => item.created_by.name },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Projects' />
            <div className='w-flex h-full flex-1 flex-col gap-4 rounded-xl p-2'>
                <div className='min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min'>
                    <div className='flex justify-between items-center p-2 rounded-xl'>
                        <h2 className='text-xl font-semibold text-foreground'>Projects</h2>
                        <Button>
                            <a href={route('projects.create')}>Create Project</a>
                        </Button>
                    </div>
                    <div className='overflow-x-auto w-full'>
                        {success && (
                            <div className='bg-[var(--color-success)] py-2 px-4 text-foreground rounded mb-4'>
                                {success}
                            </div>
                        )}
                        <Table
                            columns={columns}
                            data={projects?.data}
                            sortField={sortField}
                            sortDirection={sortDirection as 'asc' | 'desc' | undefined}
                            onSort={handleSort}
                            searchQuery={searchQuery}
                            onSearchChange={handleSearchChange}
                            statusFilter={statusFilter}
                            onStatusFilterChange={handleStatusFilterChange}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}