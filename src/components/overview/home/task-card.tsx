'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BasicTooltip } from '@/components/shared/tool-tip';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTask } from '@/components/provider/task-provider';
import { TaskContextMenu } from './task-context-menu';
import { cn, showLessText } from '@/lib/utils';
import { useState } from 'react';
import { SettingsType } from '@/lib/define';

export interface Task {
  id: UniqueIdentifier;
  columnId: string;
  title: string;
  content: string;
  url: string;
  type: string;
  img: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
  attributes?: { [key: string]: any };
  listeners?: { [key: string]: any };
  isDragging?: boolean;
  settings?: SettingsType;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

const variants = cva('', {
  variants: {
    dragging: {
      over: 'ring-2 opacity-30',
      overlay: 'ring-2 ring-primary',
    },
  },
});

function BookmarkTask({
  task,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
  isOverlay,
  settings,
}: TaskCardProps & { settings: SettingsType }) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  return (
    <TaskContextMenu task={task}>
      <Link
        href={task.url}
        target={settings.openLinkInNewTab ? '_blank' : '_self'}
      >
        <Card
          ref={setNodeRef}
          style={style}
          className={cn(
            variants({
              dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
            }),
            'border-none shadow-md'
          )}
        >
          <CardHeader className="p-2 space-between flex flex-row relative space-y-0">
            <div className="mr-auto flex gap-2">
              <div className="flex items-center justify-center">
                <Image
                  src={
                    showAlternatives
                      ? '/default-favicon/default-favicon.jpg'
                      : task.img || '/default-favicon/default-favicon.jpg'
                  }
                  alt={task.title}
                  onError={() => setShowAlternatives(true)}
                  width={24}
                  height={24}
                  className="overflow-hidden w-5 h-5 rounded-md"
                />
              </div>
              <span className="flex items-center line-clamp-1">
                <BasicTooltip
                  title={showLessText(task.title, 20)}
                  tooltipTitle={task.content ? task.content : task.title}
                />
              </span>
            </div>
            <Button
              variant="ghost"
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
            >
              <GripVertical />
            </Button>
          </CardHeader>
        </Card>
      </Link>
    </TaskContextMenu>
  );
}

function TodoTask({
  task,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
  isOverlay,
}: TaskCardProps) {
  const { tasks, updateTasks } = useTask();

  const handleCheckTask = (isChecked: boolean) => {
    const updatedTasks = tasks.map((t: Task) =>
      t.id === task.id ? { ...t, isCompleted: isChecked } : t
    );
    updateTasks(updatedTasks);
    toast.success('Task updated');
  };

  return (
    <TaskContextMenu task={task}>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          variants({
            dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
          }),
          'border-none shadow-md'
        )}
      >
        <CardHeader
          className={cn('p-2 space-between flex flex-row relative space-y-0')}
        >
          <div className="mr-auto flex gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.isCompleted}
                id={'task-' + task.id}
                onCheckedChange={isChecked => handleCheckTask(!!isChecked)}
              />

              <label
                htmlFor={'task-' + task.id}
                className={cn(
                  'flex items-center line-clamp-1',
                  task.isCompleted && 'line-through'
                )}
              >
                {showLessText(task.title, 20)}
              </label>
            </div>
          </div>

          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>
        </CardHeader>
      </Card>
    </TaskContextMenu>
  );
}

function NoteTask({
  task,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
  isOverlay,
}: TaskCardProps) {
  return (
    <TaskContextMenu task={task}>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          variants({
            dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
          }),
          'border-none shadow-md'
        )}
      >
        <CardHeader
          className={cn('p-2 space-between flex flex-row relative space-y-0')}
        >
          <div className="mr-auto flex gap-2">
            <div className="flex items-center">
              <span className="flex items-center line-clamp-1">
                {showLessText(task.title, 20)}
              </span>
            </div>
          </div>

          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>
        </CardHeader>
      </Card>
    </TaskContextMenu>
  );
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task } satisfies TaskDragData,
  });

  const { settings } = useTask();

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  switch (task.type) {
    case 'BOOKMARK':
      return (
        <BookmarkTask
          task={task}
          setNodeRef={setNodeRef}
          style={style}
          attributes={attributes}
          listeners={listeners || {}}
          isDragging={isDragging}
          isOverlay={isOverlay}
          settings={settings}
        />
      );
    case 'TASK':
      return (
        <TodoTask
          task={task}
          setNodeRef={setNodeRef}
          style={style}
          attributes={attributes}
          listeners={listeners || {}}
          isDragging={isDragging}
          isOverlay={isOverlay}
        />
      );
    case 'NOTE':
      return (
        <NoteTask
          task={task}
          setNodeRef={setNodeRef}
          style={style}
          attributes={attributes}
          listeners={listeners || {}}
          isDragging={isDragging}
          isOverlay={isOverlay}
        />
      );
    default:
      return (
        <Card
          ref={setNodeRef}
          style={style}
          className={cn(
            variants({
              dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
            }),
            'border-none shadow-md'
          )}
        >
          <CardHeader className="p-2 flex justify-between items-center">
            <span className="line-clamp-1">Not supported yet</span>
            <Button
              variant="ghost"
              {...attributes}
              {...listeners}
              className="p-1 text-secondary-foreground/50 -ml-2 cursor-grab"
            >
              <GripVertical />
            </Button>
          </CardHeader>
        </Card>
      );
  }
}
