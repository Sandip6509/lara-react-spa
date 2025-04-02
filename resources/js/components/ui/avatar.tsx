import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger } from './dialog';

function Avatar({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            data-slot='avatar'
            className={cn(
                'relative flex size-8 shrink-0 overflow-hidden rounded-full',
                className
            )}
            {...props}
        />
    )
}

interface AvatarImageProps extends React.ComponentProps<typeof AvatarPrimitive.Image> {
    preview?: boolean;
    previewSrc?: string;
    previewTitle?: string;
}

function AvatarImage({
    className,
    preview = false,
    previewSrc,
    previewTitle = 'Image preview',
    ...props
}: AvatarImageProps) {
    const image = (
        <AvatarPrimitive.Image
            data-slot='avatar-image'
            className={cn('aspect-square size-full', className)}
            {...props}
        />
    )

    if (preview && (previewSrc || props.src)) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="relative after:absolute after:inset-0 after:rounded-full after:bg-black/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity">
                        {image}
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
                    <img
                        src={previewSrc || props.src?.toString()}
                        alt={props.alt || previewTitle}
                        className="w-full h-full object-contain rounded-md"
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return image;
}

function AvatarFallback({
    className,
    ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot='avatar-fallback'
            className={cn(
                'bg-muted flex size-full items-center justify-center rounded-full',
                className
            )}
            {...props}
        />
    )
}

export { Avatar, AvatarImage, AvatarFallback }
