'use client';

import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BasicTooltip } from '@/components/shared/tool-tip';
import { TaskContextMenu } from './task-context-menu';
import { SettingsType } from '@/lib/define';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

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
    setChange?: any;
    settings: SettingsType;
}

export type TaskType = 'Task';

export interface TaskDragData {
    type: TaskType;
    task: Task;
}

export function TaskCard({
    task,
    isOverlay,
    setChange,
    settings,
}: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: 'Task',
        },
    });

    const [showAlternatives, setShowAlternatives] = useState(false);

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva('', {
        variants: {
            dragging: {
                over: 'ring-2 opacity-30',
                overlay: 'ring-2 ring-primary',
            },
        },
    });

    const handleCheckTask = (e: any) => {
        task.isCompleted = e || false;

        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.map((t: Task) => {
            if (t.id === task.id) {
                t.isCompleted = task.isCompleted;
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        setChange((pre: boolean) => !pre);
        toast.success('Task updated successfully');
    };

    if (task.type === 'BOOKMARK') {
        return (
            <TaskContextMenu task={task} setChange={setChange}>
                <Link
                    href={task.url}
                    target={settings.openLinkInNewTab ? '_blank' : '_self'}
                >
                    <Card
                        ref={setNodeRef}
                        style={style}
                        className={variants({
                            dragging: isOverlay
                                ? 'overlay'
                                : isDragging
                                ? 'over'
                                : undefined,
                        })}
                    >
                        <CardHeader
                            className={cn(
                                'p-2 space-between flex flex-row relative space-y-0'
                            )}
                        >
                            <div className="mr-auto flex gap-2">
                                <div className="flex items-center justify-center">
                                    {showAlternatives ? (
                                        <Image
                                            src="/default-favicon/default-favicon.jpg"
                                            alt={task.title}
                                            onError={event => {
                                                setShowAlternatives(true);
                                            }}
                                            width={24}
                                            height={24}
                                            className="overflow-hidden w-5 h-5 rounded-md"
                                        />
                                    ) : (
                                        <Image
                                            src={
                                                task.img ||
                                                '/default-favicon/default-favicon.jpg'
                                            }
                                            alt={task.title}
                                            onError={() => {
                                                setShowAlternatives(true);
                                            }}
                                            width={24}
                                            height={24}
                                            className="overflow-hidden w-5 h-5 rounded-md"
                                        />
                                    )}
                                </div>

                                <span className="flex items-center line-clamp-1">
                                    <BasicTooltip
                                        title={task.title}
                                        tooltipTitle={
                                            task.content
                                                ? task.content
                                                : task.title
                                        }
                                    />
                                </span>
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
                </Link>
            </TaskContextMenu>
        );
    } else if (task.type === 'TASK') {
        return (
            <TaskContextMenu task={task} setChange={setChange}>
                <Card
                    ref={setNodeRef}
                    style={style}
                    className={variants({
                        dragging: isOverlay
                            ? 'overlay'
                            : isDragging
                            ? 'over'
                            : undefined,
                    })}
                >
                    <CardHeader
                        className={cn(
                            'p-2 space-between flex flex-row relative space-y-0',
                            task?.content && 'border-b-2 border-secondary'
                        )}
                    >
                        <div className="mr-auto flex gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={task.isCompleted}
                                    id={'task-' + task.id}
                                    onCheckedChange={event =>
                                        handleCheckTask(event)
                                    }
                                />
                                <label
                                    htmlFor={'task-' + task.id}
                                    className={cn(
                                        'flex items-center line-clamp-1',
                                        task.isCompleted && 'line-through'
                                    )}
                                >
                                    {task.title}
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
                    {task.content && (
                        <CardContent className="p-2 text-left whitespace-pre-wrap">
                            {task.content}
                        </CardContent>
                    )}
                </Card>
            </TaskContextMenu>
        );
    } else if (task.type === 'NOTE') {
        return (
            <TaskContextMenu task={task} setChange={setChange}>
                <Card
                    ref={setNodeRef}
                    style={style}
                    className={variants({
                        dragging: isOverlay
                            ? 'overlay'
                            : isDragging
                            ? 'over'
                            : undefined,
                    })}
                >
                    <CardHeader
                        className={cn(
                            'p-2 space-between flex flex-row relative space-y-0'
                            // task?.content && 'border-b-2 border-secondary'
                        )}
                    >
                        <div className="mr-auto flex gap-2">
                            <div className="flex items-center">
                                <span className="flex items-center line-clamp-1">
                                    {task.title}
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
                    {/* {task.content && (
                        <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
                            {task.content}
                        </CardContent>
                    )} */}
                </Card>
            </TaskContextMenu>
        );
    } else {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                className={variants({
                    dragging: isOverlay
                        ? 'overlay'
                        : isDragging
                        ? 'over'
                        : undefined,
                })}
            >
                <CardHeader
                    className={cn(
                        'p-2 space-between flex flex-row relative space-y-0'
                    )}
                >
                    <div className="mr-auto flex gap-2">
                        <span className="flex items-center line-clamp-1">
                            Not support yet
                        </span>
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
        );
    }
}
