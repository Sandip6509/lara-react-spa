import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, UserForm } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react'

export default function CreateEdit() {
    const { user, isEdit } = usePage<{ user: UserForm, isEdit: boolean }>().props;

    // Define breadcrumbs dynamically based on isEdit
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: route('users.index'),
        },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit ? route('users.edit', user?.id) : route('users.create'),
        }
    ];

    // Initialize form data
    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
        password_confirmation: user?.password_confirmation || '',
        ...(isEdit && { _method: 'PUT' }),
    });

    // Handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('users.update', user.id));
        } else {
            post(route('users.store'));
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit' : 'Create'} />
            <div className='w-full h-full flex flex-col p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-foreground'>
                        {isEdit ? 'Edit' : 'Create'}
                    </h2>
                </div>
                <div className='border rounded-lg shadow-sm p-6'>
                    <form onSubmit={onSubmit} className='space-y-6'>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='name' className='text-sm font-medium text-foreground'>
                                    Name
                                </Label>
                                <Input
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className='w-full'
                                    placeholder='Enter your name'
                                />
                                <InputError message={errors.name} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='email' className='text-sm font-medium text-foreground'>
                                    Email
                                </Label>
                                <Input
                                    type='email'
                                    id='email'
                                    value={data.email}
                                    onChange={e => setData('name', e.target.value)}
                                    className='w-full'
                                    placeholder='Enter your email'
                                />
                                <InputError message={errors.email} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='password' className='text-sm font-medium text-foreground'>
                                    Password
                                </Label>
                                <Input
                                    type='password'
                                    id='password'
                                    name='password'
                                    onChange={e => setData('password', e.target.value)}
                                    className='w-full'
                                    placeholder='Enter your password'
                                />
                                <InputError message={errors.password} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='password_confirmation' className='text-sm font-medium text-foreground'>
                                    Confirm Password
                                </Label>
                                <Input
                                    type='password'
                                    id='password_confirmation'
                                    name='password_confirmation'
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className='w-full'
                                    placeholder='Enter your email'
                                />
                                <InputError message={errors.password_confirmation} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex justify-end space-x-4 mt-4'>
                            <Button type='submit' variant='default' disabled={processing}>
                                {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
