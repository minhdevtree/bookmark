import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { Task, TaskCard } from './task-card';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Settings } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AddBookmarkDialog } from './add-bookmark-dialog';
import { BasicTooltip } from '@/components/shared/tool-tip';
import { EditColumnDialog } from './edit-column-dialog';
import { BoardColumnContextMenu } from './board-column-context-menu';
import { SettingsType } from '@/lib/define';
import { AddTaskDialog } from './add-task-dialog';
import { AddNoteDialog } from './add-note-dialog';

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
    tasks: Task[];
    isOverlay?: boolean;
    setChange: (change: boolean) => void;
    settings: SettingsType;
}

export function BoardColumn({
    column,
    tasks,
    isOverlay,
    setChange,
    settings,
}: BoardColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map(task => task.id);
    }, [tasks]);

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
        'h-card w-[300px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
        {
            variants: {
                dragging: {
                    default: 'border-2 border-transparent',
                    over: 'ring-2 opacity-30',
                    overlay: 'ring-2 ring-primary',
                },
            },
        }
    );

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
            <BoardColumnContextMenu column={column} setChange={setChange}>
                <CardHeader className="px-4 py-2 font-semibold border-b-2 text-left flex flex-row space-between items-center">
                    <span className="mr-auto flex items-center">
                        <BasicTooltip title={column.title} />
                    </span>
                    <Button
                        variant={'ghost'}
                        {...attributes}
                        {...listeners}
                        className="p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
                    >
                        <span className="sr-only">{`Move column: ${column.title}`}</span>
                        <GripVertical />
                    </Button>
                </CardHeader>
            </BoardColumnContextMenu>

            <div className="flex justify-center gap-2 pt-2">
                <AddBookmarkDialog columnId={column.id} setChange={setChange} />
                <AddNoteDialog columnId={column.id} setChange={setChange} />
                <AddTaskDialog columnId={column.id} setChange={setChange} />
            </div>
            <ScrollArea>
                <CardContent className="flex flex-grow flex-col gap-2 p-2">
                    <SortableContext items={tasksIds}>
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                setChange={setChange}
                                settings={settings}
                            />
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
