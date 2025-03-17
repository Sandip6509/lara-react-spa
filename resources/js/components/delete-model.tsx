import { useForm } from '@inertiajs/react'
import { Dialog, DialogClose, DialogContent, DialogFooter } from './ui/dialog'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import { Trash } from 'lucide-react'

export default function DeleteModel({ projectId }: { projectId: number }) {
    const { delete: destroy, processing, reset, clearErrors } = useForm()

    const deleteData: React.FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('projects.destroy', projectId), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };
    return (
        <div className='space-y-6'>
            <Dialog>
                <DialogTrigger asChild>
                    <Trash className='text-red-700 hover:text-red-500 transition-colors duration-300' />
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Are you sure you want to delete?</DialogTitle>
                    <form className='space-y-6' onSubmit={deleteData}>
                        <DialogFooter className='gap-2'>
                            <DialogClose asChild>
                                <Button variant='secondary' onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant='destructive' disabled={processing} asChild>
                                <button type='submit'>Delete</button>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
