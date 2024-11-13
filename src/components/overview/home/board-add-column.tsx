'use client';

import { type UniqueIdentifier } from '@dnd-kit/core';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Icons } from '@/components/icons/icons';
import { useTask } from '@/components/provider/task-provider';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

const formSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title is required')
    .max(40, 'Title is too long'),
});

export function BoardAddColumn() {
  const { cols, updateCols } = useTask();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const handleAddColumn = () => {
    setIsAddingColumn(true);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const newColumn: Column = {
      id: uuidv4(),
      title: values.title,
    };

    const updatedCols = [...cols, newColumn];

    localStorage.setItem('cols', JSON.stringify(updatedCols));
    updateCols(updatedCols);
    toast.success('Column added');
    form.reset();
    setIsLoading(false);
  }

  return (
    <Card className="h-card w-[310px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center border-2 border-transparent">
      <CardHeader className="px-4 py-2 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <span className="mr-auto flex items-center">Add Column</span>
        <Button
          variant="hidden"
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-default"
        >
          <Plus />
        </Button>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          {isAddingColumn ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Column Title"
                          disabled={isLoading}
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Add Column
                </Button>
              </form>
            </Form>
          ) : (
            <Button
              className="w-full"
              onClick={handleAddColumn}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className=" mr-2 h-4 w-4 animate-spin" />
              )}
              Add Column
            </Button>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
