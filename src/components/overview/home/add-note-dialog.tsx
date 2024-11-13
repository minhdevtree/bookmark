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
import { useState } from 'react';
import { Icons } from '@/components/icons/icons';
import { Textarea } from '@/components/ui/textarea';
import { useTask } from '@/components/provider/task-provider';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title is required')
    .max(40, 'Title is too long'),
  content: z
    .string()
    .max(2000, 'Content is too long')
    .optional()
    .or(z.literal('')),
});

export function AddNoteDialog({ columnId }: { columnId: UniqueIdentifier }) {
  const { tasks, updateTasks } = useTask();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const note = {
      id: uuidv4(),
      title: values.title,
      content: values.content,
      type: 'NOTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      columnId,
      isCompleted: false,
    } as Task;

    const updatedTasks = [...tasks, note];
    updateTasks(updatedTasks);

    setIsLoading(false);
    form.reset();
    toast.success('Note added');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="xs">
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Add a new note to your collection.
          </DialogDescription>
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
                    {/* Use this if tiptap editor have UI bugs */}
                    {/* <Textarea
                      placeholder="Content"
                      disabled={isLoading}
                      className="resize-none min-h-96"
                      {...field}
                    /> */}

                    {/* TODO: Experimental feature */}
                    <MinimalTiptapEditor
                      {...field}
                      throttleDelay={2000}
                      className={cn('resize-none min-h-96 w-full rounded-xl', {
                        'border-destructive focus-within:border-destructive':
                          form.formState.errors.content,
                      })}
                      editorContentClassName="overflow-auto h-full flex grow"
                      output="html"
                      immediatelyRender={false}
                      placeholder="Content goes here"
                      editable={true}
                      injectCSS={true}
                      editorClassName="focus:outline-none px-5 py-4 h-full grow"
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
                Add note
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
