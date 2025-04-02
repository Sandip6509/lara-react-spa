import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TaskForm } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';
import { STATUS_TEXT_MAP } from '@/constants';
import { PRIORITY_TEXT_MAP } from '@/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import DatePickerInput from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface Project {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface CreateEditProps {
    projects: Project[];
    users: User[];
}

export default function CreateEdit({ projects, users }: CreateEditProps) {
    const { task } = usePage<{ task: TaskForm }>().props;
    const getInitials = useInitials();
    // Define breadcrumbs dynamically based on isEdit
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tasks',
            href: route('tasks.index'),
        },
        {
            title: task ? 'Edit' : 'Create',
            href: task ? route('tasks.edit', task?.id) : route('tasks.create'),
        },
    ];

    // Initialize form data
    const { data, setData, post, processing, errors } = useForm({
        image_path: '' as string | File,
        name: task?.name || '',
        status: task?.status || '',
        description: task?.description || '',
        due_date: task?.due_date || '',
        project_id: task?.project_id || '',
        assigned_user_id: task?.assigned_user_id || '',
        priority: task?.priority || '',
        ...(task && { _method: 'PUT' }),
    });

    // Handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (task) {
            post(route('tasks.update', task.id));
        } else {
            post(route('tasks.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={ task ? 'Edit' : 'Create' } />
            <div className='w-full h-full flex flex-col p-6'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-foreground'>
                        { task ? 'Edit' : 'Create' }
                    </h2>
                </div>
                <div className='border rounded-lg shadow-sm p-6'>
                    <form onSubmit={onSubmit} className='space-y-6'>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='assign_user' className='text-sm font-medium text-foreground'>
                                    Project Name
                                </Label>
                                <Select
                                    value={String(data.project_id)}
                                    onValueChange={(value) => setData('project_id', String(value))}
                                    name='project_id'
                                >
                                    <SelectTrigger className='p-2 rounded'>
                                        <SelectValue placeholder='Select Project'>{projects.find(project => project.id === data.project_id)?.name}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={String(project.id)}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} className='mt-2' />
                            </div>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='priority' className='text-sm font-medium text-foreground'>
                                    Priority
                                </Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) => setData('priority', value)}
                                    name='priority'
                                >
                                    <SelectTrigger className='p-2 rounded'>
                                        <SelectValue placeholder='Select Priority'>{PRIORITY_TEXT_MAP[data.priority as keyof typeof PRIORITY_TEXT_MAP]}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(PRIORITY_TEXT_MAP).map((priority) => (
                                            <SelectItem key={priority} value={priority}>
                                                {PRIORITY_TEXT_MAP[priority as keyof typeof PRIORITY_TEXT_MAP]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='image_path' className='text-sm font-medium text-foreground'>
                                    Task Image
                                </Label>
                                <div className='flex gap-2'>
                                    {task && task?.image_path && (
                                        <Avatar className='w-9 h-9 object-cover rounded-md'>
                                        <AvatarImage src={typeof task.image_path === 'string' ? task.image_path : undefined} alt={task.name} preview={true} previewSrc={typeof task.image_path === 'string' ? task.image_path : undefined}  />
                                        <AvatarFallback className="rounded-md bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                          {getInitials(task?.name || '')}
                                        </AvatarFallback>
                                      </Avatar>
                                    )}
                                    <Input
                                        id='image_path'
                                        type='file'
                                        name='image_path'
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData('image_path', e.target.files[0] as File);
                                            }
                                        }}
                                        className='w-full block'
                                    />
                                    <InputError message={errors.image_path} className='mt-2' />
                                </div>
                            </div>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='name' className='text-sm font-medium text-foreground'>
                                    Task Name
                                </Label>
                                <Input
                                    id='name'
                                    type='text'
                                    name='name'
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className='w-full'
                                    placeholder='Enter task name'
                                />
                                <InputError message={errors.name} className='mt-2' />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4 mb-2'>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='assign_user' className='text-sm font-medium text-foreground'>
                                    Assign User
                                </Label>
                                <Select
                                    value={String(data?.assigned_user_id)}
                                    onValueChange={(value) => setData('assigned_user_id', Number(value))}
                                    name='assigned_user_id'
                                >
                                    <SelectTrigger className='p-2 rounded'>
                                        <SelectValue placeholder='Select User'>{users.find(user => user.id === data.assigned_user_id)?.name}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} className='mt-2' />
                            </div>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='status' className='text-sm font-medium text-foreground'>
                                    Status
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                    name='status'
                                >
                                    <SelectTrigger className='p-2 rounded'>
                                        <SelectValue placeholder='Select Status'>{STATUS_TEXT_MAP[data.status as keyof typeof STATUS_TEXT_MAP]}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(STATUS_TEXT_MAP).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {STATUS_TEXT_MAP[status as keyof typeof STATUS_TEXT_MAP]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} className='mt-2' />
                            </div>
                            <div className='flex-1 space-y-2'>
                                <Label htmlFor='due_date' className='mb-1 text-sm font-medium text-foreground'>
                                    Due Date
                                </Label>
                                <div>
                                    <DatePickerInput
                                        id='due_date'
                                        name='due_date'
                                        value={data.due_date}
                                        onChange={(value) => setData('due_date', value)}
                                        className='w-full'
                                    />
                                </div>
                                <InputError message={errors.due_date} className='mt-2' />
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='description' className='text-sm font-medium text-foreground'>
                                Description
                            </Label>
                            <Textarea
                                id='description'
                                name='description'
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className='w-full'
                                rows={4}
                                placeholder='Enter task description'
                            />
                            <InputError message={errors.description} className='mt-2' />
                        </div>
                        <div className='flex justify-end space-x-4'>
                            <Button type='submit' variant='default' disabled={processing}>
                                {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}