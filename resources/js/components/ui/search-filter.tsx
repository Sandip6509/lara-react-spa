import { X } from 'lucide-react';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { STATUS_TEXT_MAP } from '@/constants';

interface SearchFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter?: string;
    onStatusFilterChange?: (value: string) => void;
    isFilter: boolean;
}

export default function SearchFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    isFilter
}: SearchFilterProps) {
    return (
        <>
            <div className="relative w-full">
                <Input
                    id="search"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="p-2 pr-10 rounded w-full"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                        <X size={16} className='transition-colors duration-300' />
                    </button>
                )}
            </div>
            {isFilter && (
                <div className='w-full'>
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                        <SelectTrigger className="p-2 rounded w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value=" ">All Status</SelectItem>
                            {Object.keys(STATUS_TEXT_MAP).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {STATUS_TEXT_MAP[status as keyof typeof STATUS_TEXT_MAP]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </>
    )
}
