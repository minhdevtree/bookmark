import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { Task, TaskCard } from './task-card';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AddBookmarkDialog } from './add-bookmark-dialog';
import { BasicTooltip } from '@/components/shared/tool-tip';
import { BoardColumnContextMenu } from './board-column-context-menu';
import { SettingsType } from '@/lib/define';
import { AddTaskDialog } from './add-task-dialog';
import { AddNoteDialog } from './add-note-dialog';
import { useTask } from '@/components/provider/task-provider';
import { cn } from '@/lib/utils';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  isOverlay?: boolean;
}

export function BoardColumn({ column, isOverlay }: BoardColumnProps) {
  const { tasks } = useTask();
  const tasksIds = useMemo(() => {
    return tasks
      .filter(task => task.columnId === column.id)
      .map(task => task.id);
  }, [tasks, column.id]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'h-card w-[310px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'border-2 border-primary opacity-30',
          overlay: 'ring-2 ring-primary',
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        variants({
          dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
        }),
        'pb-2'
      )}
    >
      <BoardColumnContextMenu column={column}>
        <CardHeader className="px-4 py-2 font-semibold border-b-2 text-left flex flex-row space-between items-center">
          <span className="mr-auto flex items-center">
            <BasicTooltip title={column.title} />
          </span>
          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">{`Move column: ${column.title}`}</span>
            <GripVertical />
          </Button>
        </CardHeader>
      </BoardColumnContextMenu>

      <div className="flex justify-center gap-2 py-2">
        <AddBookmarkDialog columnId={column.id} />
        <AddNoteDialog columnId={column.id} />
        <AddTaskDialog columnId={column.id} />
      </div>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2 pt-0">
          <SortableContext items={tasksIds}>
            {tasks
              .filter(task => task.columnId === column.id)
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2 md:px-0 flex lg:justify-center pb-4', {
    variants: {
      dragging: {
        default: 'snap-x snap-mandatory',
        active: 'snap-none',
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
