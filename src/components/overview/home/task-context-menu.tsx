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

export function TaskContextMenu({
  task,
  children,
}: {
  task: Task;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        {task.type === 'BOOKMARK' && <EditBookmarkDialog task={task} />}
        {task.type === 'TASK' && <EditTaskDialog task={task} />}
        {task.type === 'NOTE' && <EditNoteDialog task={task} />}
        <DeleteTaskDialog task={task} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
