import { PaginationProps } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <a
                    key={i}
                    href='#'
                    onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i);
                    }}
                    aria-current={i === currentPage ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${i === currentPage
                        ? 'z-10 bg-indigo-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                >
                    {i}
                </a>,
            );
        }

        if (startPage > 1) {
            pages.unshift(
                <span key='start-ellipsis' className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0'>
                    ...
                </span>,
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <span key='end-ellipsis' className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0'>
                    ...
                </span>,
            );
        }

        return pages;
    };
    return (
        <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'>
            <div className='flex flex-1 justify-between sm:hidden'>
                <a
                    href='#'
                    onClick={(e) => {
                        e.preventDefault();
                        handlePrevious();
                    }}
                    className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                    Previous
                </a>
                <a
                    href='#'
                    onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                    }}
                    className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                >
                    Next
                </a>
            </div>
            <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                <div>
                    <p className='text-sm text-gray-700'>
                        Showing <span className='font-medium'>{(currentPage - 1) * 10 + 1}</span> to{' '}
                        <span className='font-medium'>{Math.min(currentPage * 10, totalPages * 10)}</span> of{' '}
                        <span className='font-medium'>{totalPages * 10}</span> results
                    </p>
                </div>
                <div>
                    <nav aria-label='Pagination' className='isolate inline-flex -space-x-px rounded-md shadow-xs'>
                        <a
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                handlePrevious();
                            }}
                            className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        >
                            <span className='sr-only'>Previous</span>
                            <ChevronLeft aria-hidden='true' className='size-5' />
                        </a>
                        {renderPageNumbers()}
                        <a
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                handleNext();
                            }}
                            className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        >
                            <span className='sr-only'>Next</span>
                            <ChevronRight aria-hidden='true' className='size-5' />
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}
