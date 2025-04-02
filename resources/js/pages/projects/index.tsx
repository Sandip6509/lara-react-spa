import DeleteModel from '@/components/delete-model';
import SearchFilter from '@/components/ui/search-filter';
import Table from '@/components/ui/table';
import { STATUS_CLASS_MAP, STATUS_TEXT_MAP } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectProps, type Project } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: '/projects',
    },
];

function useProjectFilters(initialParams: Record<string, string | undefined>) {
    const [filters, setFilters] = useState(initialParams);
    const debouncedFilters = useDebounce(filters, 350);
    const prevFiltersRef = useRef(initialParams);

    useEffect(() => {
        if (JSON.stringify(debouncedFilters) === JSON.stringify(prevFiltersRef.current)) {
            return;
        }

        const abortController = new AbortController();
        const currentFilters = { ...debouncedFilters };

        const queryParams = Object.fromEntries(
            Object.entries(debouncedFilters)
                .filter(([, value]) => value !== undefined && value !== null && value !== '')
        );

        router.get(route('projects.index'), queryParams, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                prevFiltersRef.current = currentFilters;
            },
            onError: () => {
                if (!abortController.signal.aborted) {
                    console.error('Failed to fetch projects');
                }
            }
        });

        return () => {
            abortController.abort();
        };
    }, [debouncedFilters]);

    return { filters, setFilters };
}
export default function Project({ projects, queryParams, success }: ProjectProps) {
    const getInitials = useInitials();
    const { filters, setFilters } = useProjectFilters({
        name: queryParams?.name || '',
        status: queryParams?.status || '',
        sortField: queryParams?.sortField || 'created_at',
        sortDirection: queryParams?.sortDirection || 'desc'
    });

    // Handler functions remain the same as previous example
    const handleSearchChange = (name: string) => {
        setFilters(prev => ({ ...prev, name }));
    };

    const handleStatusChange = (status: string) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleSort = (field: string) => {
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortDirection: prev.sortField === field && prev.sortDirection === 'asc'
                ? 'desc'
                : 'asc'
        }));
    };

    const columns = useMemo(() => [
        { accessor: 'id', label: 'ID', sortable: true },
        { accessor: 'image_path', label: 'Image', render: (item: Project) => <Avatar className='w-9 h-9 object-cover rounded-md'>
                <AvatarImage src={typeof item.image_path === 'string' ? item.image_path : undefined} alt={item.name} preview={true} previewSrc={typeof item.image_path === 'string' ? item.image_path : undefined} />
                <AvatarFallback className="rounded-md bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(item?.name || '')}
                </AvatarFallback>
            </Avatar>, sortable: true
        },
        { accessor: 'name', label: 'Name', sortable: true },
        { accessor: 'status', label: 'Status', render: (item: Project) => <span className={`px-2 py-1 rounded text-xs font-semibold text-foreground ${STATUS_CLASS_MAP[item.status as keyof typeof STATUS_CLASS_MAP]}`}>{STATUS_TEXT_MAP[item.status as keyof typeof STATUS_TEXT_MAP]}</span>, sortable: true },
        { accessor: 'created_at', label: 'Create At', sortable: true },
        { accessor: 'due_date', label: 'Due Date', sortable: true },
        { accessor: 'created_by', label: 'Created By', render: (item: Project) => item.created_by.name, sortable: true },
        {
            accessor: 'actions', label: 'Actions', render: (item: Project) => (
                <div className="flex space-x-2 gap-2" >
                    <Link href={route('projects.edit', item.id)}><SquarePen className='text-green-700 hover:text-green-500 transition-colors duration-300' /></Link>
                    <DeleteModel routeName={route('projects.destroy', item.id)} />
                </div >
            ), sortable: false
        },
    ], [getInitials]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Projects' />
            <div className='w-flex h-full flex-1 flex-col gap-4 rounded-xl p-2'>
                <div className='min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min'>
                    <div className="flex items-center justify-end p-2 rounded-xl gap-4">
                        <div className="flex w-full space-x-4">
                            <SearchFilter
                                searchQuery={filters.name as string}
                                onSearchChange={handleSearchChange}
                                statusFilter={filters.status as string}
                                onStatusFilterChange={handleStatusChange}
                                isFilter={true}
                            />
                        </div>

                        <Link
                            href={route('projects.create')}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
                        >
                            Create Project
                        </Link>
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
                        <div className='overflow-x-auto rounded-lg p-2'>
                            <Table
                                columns={columns}
                                data={projects?.data}
                                sortField={filters.sortField as string}
                                sortDirection={filters.sortDirection as 'asc' | 'desc' | undefined}
                                onSort={handleSort}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}