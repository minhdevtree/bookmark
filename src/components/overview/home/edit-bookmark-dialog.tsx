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
import { toast } from 'sonner';
import { useState } from 'react';
import { Icons } from '@/components/icons/icons';
import { FilePenLine } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTask } from '@/components/provider/task-provider';

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

export function EditBookmarkDialog({ task }: { task: Task }) {
  const { tasks, updateTasks } = useTask();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      content: task.content,
      url: task.url,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const updatedBookmarks = tasks.map((bookmark: Task) => {
      if (bookmark.id === task.id) {
        return {
          ...bookmark,
          title: values.title,
          content: values.content || '',
          url: values.url,
          updatedAt: new Date().toISOString(),
          img: `https://s2.googleusercontent.com/s2/favicons?domain_url=${values.url}`,
        };
      }
      return bookmark;
    });
    updateTasks(updatedBookmarks);
    setIsLoading(false);
    toast.success('Bookmark update');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <div>Edit</div>
          <FilePenLine className="w-4 h-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>Edit the bookmark details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
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
                    <Textarea
                      placeholder="Content"
                      disabled={isLoading}
                      className="resize-none"
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
                    Url <span className="text-red-500">*</span>{' '}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Url" disabled={isLoading} {...field} />
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
