'use client';

import { Icons } from '@/components/icons/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Task } from './task-card';

export function DeleteTaskDialog({
    task,
    setChange,
}: {
    task: Task;
    setChange: any;
}) {
    const router = useRouter();
    const [checkbox, setCheckbox] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTask = async () => {
        setIsLoading(true);
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const deleteTask = tasks.find((t: any) => t.id === task.id);

        if (!deleteTask) {
            toast.error('Task not found');
            return;
        }

        const updateTasks = tasks.filter(
            (task: any) => task.id !== deleteTask.id
        );

        localStorage.setItem('tasks', JSON.stringify(updateTasks));
        setChange((pre: boolean) => !pre);
        setIsLoading(false);
        router.refresh();
        toast.success(
            `${task.type.charAt(0).toUpperCase()}${task.type
                .slice(1)
                .toLowerCase()} ${task.title} deleted`
        );
        setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div>Delete</div>
                    <Trash className="w-4 h-4 text-red-500" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Delete {task.type.toLowerCase()}: {task.title}
                    </DialogTitle>
                    <DialogDescription>
                        Delete the {task.type.toLowerCase()} from your column.
                    </DialogDescription>
                </DialogHeader>
                <div className="items-top flex space-x-2">
                    <Checkbox
                        checked={checkbox}
                        id="terms1"
                        onCheckedChange={() => setCheckbox(!checkbox)}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Are you sure you want to delete this{' '}
                            {task.type.toLowerCase()}?
                        </label>
                        <p className="text-sm text-muted-foreground">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={!checkbox || isLoading}
                        onClick={handleDeleteTask}
                        variant="destructive"
                    >
                        {isLoading && (
                            <Icons.spinner className=" mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
