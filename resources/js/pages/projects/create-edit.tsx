import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ProjectForm } from '@/types';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

export default function CreateEdit() {
  const { project } = usePage<{ project: ProjectForm }>().props;
  const getInitials = useInitials();

  // Define breadcrumbs dynamically based on isEdit
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Projects',
      href: route('projects.index'),
    },
    {
      title: project ? 'Project-Edit' : 'Project-Create',
      href: project ? route('projects.edit', project?.id) : route('projects.create'),
    },
  ];

  // Initialize form data
  const { data, setData, post, processing, errors } = useForm({
    image_path: '' as string | File,
    name: project?.name || '',
    status: project?.status || '',
    description: project?.description || '',
    due_date: project?.due_date || '',
    ...(project && { _method: 'PUT' }),
  });

  // Handle form submission
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (project) {
      post(route('projects.update', project.id));
    } else {
      post(route('projects.store'));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={project ? 'Edit Project' : 'Create Project'} />
      <div className='w-full h-full flex flex-col p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-foreground'>
            {project ? 'Edit Project' : 'Create Project'}
          </h2>
        </div>

        <div className='border rounded-lg shadow-sm p-6'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='flex flex-row gap-4 mb-2'>
              <div className='flex-1 space-y-2'>
                <Label htmlFor='image_path' className='text-sm font-medium text-foreground'>
                  Project Image
                </Label>
                <div className='flex gap-2'>
                  {project?.image_path && (
                    <Avatar className='w-9 h-9 object-cover rounded-md'>
                      <AvatarImage src={typeof project.image_path === 'string' ? project.image_path : undefined} alt={project.name} preview={true} previewSrc={typeof project.image_path === 'string' ? project.image_path : undefined}  />
                      <AvatarFallback className="rounded-md bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(project?.name || '')}
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
                placeholder='Enter project description'
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