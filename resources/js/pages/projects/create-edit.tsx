import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';
import { STATUS_TEXT_MAP } from '@/constants';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import DatePickerInput from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle } from 'lucide-react';

export default function CreateEdit() {
  const { project, isEdit } = usePage<{ project: { id: number; name: string; status: string; description: string; due_date: string; image_url?: string }, isEdit: boolean }>().props;

  // Define breadcrumbs dynamically based on isEdit
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: isEdit ? 'Project-Edit' : 'Project-Create',
      href: isEdit ? route('projects.edit', project?.id) : route('projects.create'),
    },
  ];

  // Initialize form data
  const { data, setData, post, processing, errors } = useForm({
    image_path: null as File | null,
    name: project?.name || '',
    status: project?.status || '',
    description: project?.description || '',
    due_date: project?.due_date || '',
  });

  // Handle form submission
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      // Use put for updating
      post(route('projects.update', project.id), {
        method: 'put',
        ...data
      });
    } else {
      // Use post for creating
      post(route('projects.store'));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit Project' : 'Create Project'} />
      <div className='w-full h-full flex flex-col p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-foreground'>
            {isEdit ? 'Edit Project' : 'Create Project'}
          </h2>
        </div>

        <div className='border rounded-lg shadow-sm p-6'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='flex flex-row gap-4 mb-2'>
              <div className='flex-1 space-y-2'>
                <Label htmlFor='image_path' className='text-sm font-medium text-foreground'>
                  Project Image
                </Label>
                {isEdit && project?.image_url && (
                  <div className='mb-4'>
                    <img
                      src={project.image_url}
                      alt='Project Image'
                      className='w-32 h-32 object-cover rounded-md'
                    />
                  </div>
                )}
                <Input
                  id='image_path'
                  type='file'
                  name='image_path'
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setData('image_path', e.target.files[0]);
                    }
                  }}
                  className='w-full block'
                />
                <InputError message={errors.image_path} className='mt-2' />
              </div>
              <div className='flex-1 space-y-2'>
                <Label htmlFor='name' className='text-sm font-medium text-foreground'>
                  Project Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  name='name'
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className='w-full'
                  placeholder='Enter project name'
                />
                <InputError message={errors.name} className='mt-2' />
              </div>
            </div>
            <div className='flex flex-row gap-4 mb-2'>
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
                    <SelectValue placeholder='Select Status'>{data.status}</SelectValue>
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
              <div className='flex flex-col space-y-2'>
                <Label htmlFor='due_date' className='mb-1 text-sm font-medium text-foreground'>
                  Due Date
                </Label>
                <DatePickerInput
                  id='due_date'
                  name='due_date'
                  value={data.due_date}
                  onChange={(value) => setData('due_date', value)}
                  className='w-full'
                />
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
                placeholder='Enter project description'
              />
              <InputError message={errors.description} className='mt-2' />
            </div>
            <div className='flex justify-end space-x-4'>
              <Button type='submit' variant='default' disabled={processing}>
                {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
                {isEdit ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}