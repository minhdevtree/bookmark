'use client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Task } from './task-card';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '@/components/icons/icons';

const formSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .min(1, 'Title is required')
        .max(40, 'Title is too long'),
    content: z
        .string()
        .max(100, 'Content is too long')
        .optional()
        .or(z.literal('')),
    url: z
        .string({
            required_error: 'URL is required',
        })
        .url({ message: 'Invalid URL' }),
});

export function AddBookmarkDialog({
    columnId,
    setChange,
}: {
    columnId: UniqueIdentifier;
    setChange: any;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            url: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const bookmark = {
            id: uuidv4(),
            title: values.title,
            content: values.content,
            url: values.url,
            type: 'BOOKMARK',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            columnId,
            img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${values.url}`,
        } as Task;
        const bookmarks = JSON.parse(localStorage.getItem('tasks') || '[]');
        bookmarks.push(bookmark);
        localStorage.setItem('tasks', JSON.stringify(bookmarks));
        setChange((pre: boolean) => !pre);
        setIsLoading(false);
        form.reset();
        router.refresh();
        toast.success('Bookmark added');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" size="xs">
                    Add Bookmark
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Bookmark</DialogTitle>
                    <DialogDescription>
                        Add a new bookmark to your collection.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-2"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Title{' '}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Title"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Content"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Url{' '}
                                        <span className="text-red-500">*</span>{' '}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Url"
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className=" mr-2 h-4 w-4 animate-spin" />
                                )}
                                Add bookmark
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
