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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SquareGanttChart } from 'lucide-react';
import { Task } from './task-card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ViewNoteDialog({ task }: { task: Task }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className=" w-full flex justify-between relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <div>View</div>
                    <SquareGanttChart className="w-4 h-4" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Note: {task.title}</DialogTitle>
                    <DialogDescription>
                        View the note details.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 p-2 whitespace-pre-wrap">
                    {task.content}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
