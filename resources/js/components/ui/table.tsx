import { TableProps } from '@/types';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Input } from './input';
import { STATUS_TEXT_MAP } from '@/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
// import Pagination from './pagination';
// import { useState } from 'react';

export default function Table({
    columns,
    data,
    sortField,
    sortDirection,
    onSort,
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: TableProps) {
    // const [currentPage, setCurrentPage] = useState(1);
    // const totalPages = 10;

    return (
        <div className='overflow-x-auto rounded-lg p-2'>
            <div className='flex space-x-4 mb-4'>
                <Input
                    id='search'
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className='p-2 rounded'
                />
                <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange?.(value)}>
                    <SelectTrigger className='p-2 rounded'>
                        <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value=' '>Status</SelectItem>
                        {Object.keys(STATUS_TEXT_MAP).map((status) => (
                            <SelectItem key={status} value={status}>
                                {STATUS_TEXT_MAP[status as keyof typeof STATUS_TEXT_MAP]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full bg-card border border-border rounded-lg overflow-hidden'>
                    <thead className='bg-secondary'>
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-3 text-left text-sm font-medium text-secondary-foreground uppercase border-b border-border ${column.accessor ? 'cursor-pointer' : ''
                                        }`}
                                    onClick={() => {
                                        if (typeof column.accessor === 'string') {
                                            const direction: 'asc' | 'desc' = sortDirection === 'asc' ? 'asc' : 'desc';
                                            onSort?.(column.accessor, direction);
                                        }
                                    }}
                                >
                                    <div className='flex items-center space-x-1'>
                                        <span>{column.label}</span>
                                        {column.accessor && (column.sortable === true) && (
                                            sortField === column.accessor ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp />
                                                ) : (
                                                    <ArrowDown />
                                                )
                                            ) : (
                                                <ArrowUpDown className='opacity-50' />
                                            )
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                        {data?.length > 0 ? (
                            data?.map((row, rowIndex) => (
                                <tr
                                    key={row.id ? Number(row.id) : rowIndex}
                                    className='hover:bg-accent hover:text-accent-foreground dark:hover:bg-secondary dark:hover:text-secondary-foreground'
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className='px-6 py-2 text-sm text-foreground'
                                        >
                                            {
                                                column.render
                                                    ? column.render(row, rowIndex)
                                                    : column.accessor
                                                        ? (typeof column.accessor === 'string'
                                                            ? (typeof row[column.accessor] === 'string' && (row[column.accessor] as string)?.length > 20
                                                                ? (row[column.accessor] as string).substring(0, 20) + '...'
                                                                : row[column.accessor]?.toString() || '')
                                                            : '')
                                                        : ''
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className='text-center py-4 text-foreground'
                                >
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> */}
            </div>
        </div>
    );
}