import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];
export default function Task() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Tasks' />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>

            </div>
        </AppLayout>
    )
}