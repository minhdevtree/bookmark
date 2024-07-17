import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Task } from './task-card';
import { EditBookmarkDialog } from './edit-bookmark-dialog';
import { DeleteTaskDialog } from './delete-task-dialog';
import { EditTaskDialog } from './edit-task-dialog';
import { EditNoteDialog } from './edit-note-dialog';
import { ViewNoteDialog } from './view-note-dialog';

export function TaskContextMenu({
    task,
    children,
    setChange,
}: {
    task: Task;
    children: React.ReactNode;
    setChange: any;
}) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-32">
                {task.type === 'Bookmark' && (
                    <EditBookmarkDialog task={task} setChange={setChange} />
                )}
                {task.type === 'TASK' && (
                    <EditTaskDialog task={task} setChange={setChange} />
                )}
                {task.type === 'NOTE' && (
                    <>
                        <ViewNoteDialog task={task} />
                        <EditNoteDialog task={task} setChange={setChange} />
                    </>
                )}
                <DeleteTaskDialog task={task} setChange={setChange} />
            </ContextMenuContent>
        </ContextMenu>
    );
}
