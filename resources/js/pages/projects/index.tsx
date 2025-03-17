import DeleteModel from '@/components/delete-model';
import Table from '@/components/ui/table';
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectProps, type Project } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { SquarePen, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function Project({ projects, queryParams, success }: ProjectProps) {
    const [searchQuery, setSearchQuery] = useState(queryParams?.name || '');
    const [statusFilter, setStatusFilter] = useState(queryParams?.status || '');
    const [sortField, setSortField] = useState(queryParams?.sortField || 'created_at');
    const [sortDirection, setSortDirection] = useState(queryParams?.sortDirection || 'desc');

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const memoizedQueryParams = useMemo(() => queryParams || {}, [queryParams]);

    useEffect(() => {
        if (!debouncedSearchQuery && !statusFilter) return
        router.get(route('projects.index'), {
            ...memoizedQueryParams,
            name: debouncedSearchQuery,
            status: statusFilter,
            sortField,
            sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedSearchQuery, statusFilter, sortField, sortDirection, memoizedQueryParams]);

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
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get(route('projects.index'), {
            ...queryParams,
            name: searchQuery,
            status,
            sortField,
            sortDirection,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const columns = [
        { accessor: 'id', label: 'ID', sortable: true },
        { accessor: 'image_path', label: 'Image', render: (item: Project) => <img src={item.image_path} alt={item.name} className='w-8 h-8 rounded' />, sortable: true },
        { accessor: 'name', label: 'Name', sortable: true },
        { accessor: 'status', label: 'Status', render: (item: Project) => <span className={`px-2 py-1 rounded text-xs font-semibold text-foreground ${STATUS_CLASS_MAP[item.status as keyof typeof STATUS_CLASS_MAP]}`}>{STATUS_TEXT_MAP[item.status as keyof typeof STATUS_TEXT_MAP]}</span>, sortable: true },
        { accessor: 'created_at', label: 'Create At', sortable: true },
        { accessor: 'due_date', label: 'Due Date', sortable: true },
        { accessor: 'created_by', label: 'Created By', render: (item: Project) => item.created_by.name, sortable: true },
        {
            accessor: 'actions', label: 'Actions', render: (item: Project) => (
                <div className="flex space-x-2 gap-2" >
                    <Link href={route('projects.edit', item.id)}><SquarePen className='text-green-700 hover:text-green-500 transition-colors duration-300' /></Link>
                    {/* <Link href={route('projects.edit', item.id)}><Trash className='text-red-700 hover:text-red-500 transition-colors duration-300' /></Link> */}
                    <DeleteModel projectId={item.id}/>
                </div >
            ), sortable: false
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Projects' />
            <div className='w-flex h-full flex-1 flex-col gap-4 rounded-xl p-2'>
                <div className='min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min'>
                    <div className='flex justify-between items-center p-2 rounded-xl'>
                        <h2 className='text-xl font-semibold text-foreground'></h2>
                        <Link href={route('projects.create')} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3`}>Create Project</Link>
                    </div>
                    <div className='overflow-x-auto w-full'>
                        {success && (
                            <div className='bg-green-500 px-4 py-2 text-foreground rounded flex items-center space-x-2'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                <span>{success}</span>
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