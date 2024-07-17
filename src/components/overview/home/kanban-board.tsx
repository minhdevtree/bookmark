'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { BoardColumn, BoardContainer } from './board-column';
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    useSensor,
    useSensors,
    KeyboardSensor,
    Announcements,
    UniqueIdentifier,
    TouchSensor,
    MouseSensor,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { type Task, TaskCard } from './task-card';
import type { Column } from './board-column';
import { hasDraggableData } from './utils';
import { coordinateGetter } from './multiple-containers-keyboard-preset';
import { BoardAddColumn } from './board-add-column';
import { toast } from 'sonner';

export function KanbanBoard({
    setChange,
    change,
}: {
    setChange: any;
    change: boolean;
}) {
    const [defaultCols, setDefaultCols] = useState<Column[]>([]);
    const [initialTasks, setInitialTasks] = useState<Task[]>([]);

    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const pickedUpTaskColumn = useRef<string | null>(null);
    const columnsId = useMemo(() => columns.map(col => col.id), [columns]);
    const [settings, setSettings] = useState({
        openLinkInNewTab: false,
    });

    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    useEffect(() => {
        setDefaultCols(
            JSON.parse(localStorage.getItem('cols') || '[]') as Column[]
        );
        setInitialTasks(
            JSON.parse(localStorage.getItem('tasks') || '[]') as Task[]
        );
        setColumns(
            JSON.parse(localStorage.getItem('cols') || '[]') as Column[]
        );
        setTasks(JSON.parse(localStorage.getItem('tasks') || '[]') as Task[]);
        setSettings(JSON.parse(localStorage.getItem('settings') || '{}'));
    }, [change]);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
        const tasksInColumn = tasks.filter(task => task.columnId === columnId);
        const taskPosition = tasksInColumn.findIndex(
            task => task.id === taskId
        );
        const column = columns.find(col => col.id === columnId);
        return {
            tasksInColumn,
            taskPosition,
            column,
        };
    }

    const announcements: Announcements = {
        onDragStart({ active }) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === 'Column') {
                const startColumnIdx = columnsId.findIndex(
                    id => id === active.id
                );
                const startColumn = columns[startColumnIdx];

                // console.log(
                //     `Picked up Column ${startColumn?.title} at position: ${
                //         startColumnIdx + 1
                //     } of ${columnsId.length}`
                // );
                return `Picked up Column ${startColumn?.title} at position: ${
                    startColumnIdx + 1
                } of ${columnsId.length}`;
            } else if (active.data.current?.type === 'Task') {
                pickedUpTaskColumn.current = active.data.current.task.columnId;
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(active.id, pickedUpTaskColumn.current);

                // console.log(
                //     `Picked up Task ${
                //         active.data.current.task.content
                //     } at position: ${taskPosition + 1} of ${
                //         tasksInColumn.length
                //     } in column ${column?.title}`
                // );
                return `Picked up Task ${
                    active.data.current.task.content
                } at position: ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragOver({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === 'Column' &&
                over.data.current?.type === 'Column'
            ) {
                const overColumnIdx = columnsId.findIndex(id => id === over.id);

                // console.log(
                //     `Column ${
                //         active.data.current.column.title
                //     } was moved over ${
                //         over.data.current.column.title
                //     } at position ${overColumnIdx + 1} of ${columnsId.length}`
                // );
                return `Column ${
                    active.data.current.column.title
                } was moved over ${
                    over.data.current.column.title
                } at position ${overColumnIdx + 1} of ${columnsId.length}`;
            } else if (
                active.data.current?.type === 'Task' &&
                over.data.current?.type === 'Task'
            ) {
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(
                        over.id,
                        over.data.current.task.columnId
                    );
                if (
                    over.data.current.task.columnId !==
                    pickedUpTaskColumn.current
                ) {
                    // console.log(
                    //     `Task ${
                    //         active.data.current.task.content
                    //     } was moved over column ${column?.title} in position ${
                    //         taskPosition + 1
                    //     } of ${tasksInColumn.length}`
                    // );
                    return `Task ${
                        active.data.current.task.content
                    } was moved over column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }

                // console.log(
                //     `Task was moved over position ${taskPosition + 1} of ${
                //         tasksInColumn.length
                //     } in column ${column?.title}`
                // );
                return `Task was moved over position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragEnd({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === 'Column' &&
                over.data.current?.type === 'Column'
            ) {
                const overColumnPosition = columnsId.findIndex(
                    id => id === over.id
                );

                setColumns(prevColumns => {
                    localStorage.setItem('cols', JSON.stringify(prevColumns));
                    return prevColumns;
                });

                toast.success('Column moved successfully');

                // console.log(
                //     `Column ${
                //         active.data.current.column.title
                //     } was dropped into position ${overColumnPosition + 1} of ${
                //         columnsId.length
                //     }`
                // );
                return `Column ${
                    active.data.current.column.title
                } was dropped into position ${overColumnPosition + 1} of ${
                    columnsId.length
                }`;
            } else if (
                active.data.current?.type === 'Task' &&
                over.data.current?.type === 'Task'
            ) {
                const { tasksInColumn, taskPosition, column } =
                    getDraggingTaskData(
                        over.id,
                        over.data.current.task.columnId
                    );
                if (
                    over.data.current.task.columnId !==
                    pickedUpTaskColumn.current
                ) {
                    setTasks(prevTasks => {
                        localStorage.setItem(
                            'tasks',
                            JSON.stringify(prevTasks)
                        );
                        return prevTasks;
                    });

                    toast.success(
                        `${over.data.current.task.type.toLowerCase()} moved successfully`
                    );

                    // console.log(
                    //     `Task was dropped into column ${
                    //         column?.title
                    //     } in position ${taskPosition + 1} of ${
                    //         tasksInColumn.length
                    //     }`
                    // );
                    return `Task was dropped into column ${
                        column?.title
                    } in position ${taskPosition + 1} of ${
                        tasksInColumn.length
                    }`;
                }

                setTasks(prevTasks => {
                    localStorage.setItem('tasks', JSON.stringify(prevTasks));
                    return prevTasks;
                });

                toast.success(
                    `${over.data.current.task.type.toLowerCase()} moved successfully`
                );

                // console.log(
                //     `Task was dropped into position ${taskPosition + 1} of ${
                //         tasksInColumn.length
                //     } in column ${column?.title}`
                // );
                return `Task was dropped into position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({ active }) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;

            // console.log(`Dragging ${active.data.current?.type} cancelled.`);
            return `Dragging ${active.data.current?.type} cancelled.`;
        },
    };

    return (
        <DndContext
            accessibility={{
                announcements,
            }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <BoardContainer>
                <SortableContext items={columnsId}>
                    {columns.map(col => (
                        <BoardColumn
                            key={col.id}
                            column={col}
                            tasks={tasks.filter(
                                task => task.columnId === col.id
                            )}
                            setChange={setChange}
                            settings={settings}
                        />
                    ))}
                    <BoardAddColumn columns={columns} setColumns={setColumns} />
                </SortableContext>
            </BoardContainer>

            {typeof window !== 'undefined' &&
                'document' in window &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                column={activeColumn}
                                tasks={tasks.filter(
                                    task => task.columnId === activeColumn.id
                                )}
                                setChange={setChange}
                                settings={settings}
                            />
                        )}
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                isOverlay
                                setChange={setChange}
                                settings={settings}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === 'Column') {
            setActiveColumn(data.column);
            return;
        }

        if (data?.type === 'Task') {
            setActiveTask(data.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (!hasDraggableData(active)) return;

        const activeData = active.data.current;

        if (activeId === overId) return;

        const isActiveAColumn = activeData?.type === 'Column';
        if (!isActiveAColumn) return;

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(
                col => col.id === activeId
            );

            const overColumnIndex = columns.findIndex(col => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveATask = activeData?.type === 'Task';
        const isOverATask = overData?.type === 'Task';

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId);
                const overIndex = tasks.findIndex(t => t.id === overId);
                const activeTask = tasks[activeIndex];
                const overTask = tasks[overIndex];
                if (
                    activeTask &&
                    overTask &&
                    activeTask.columnId !== overTask.columnId
                ) {
                    activeTask.columnId = overTask.columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = overData?.type === 'Column';

        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId);
                const activeTask = tasks[activeIndex];
                if (activeTask) {
                    activeTask.columnId = overId as string;
                    return arrayMove(tasks, activeIndex, activeIndex);
                }
                return tasks;
            });
        }
    }
}
