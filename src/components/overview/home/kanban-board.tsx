import { useMemo, useRef, useState } from 'react';
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
import { useTask } from '@/components/provider/task-provider';
import { throttle } from 'lodash';
import React from 'react';
import { startTransition } from 'react';

const THROTTLE_DELAY = 100; // Throttle delay in milliseconds

export function KanbanBoard() {
  const { cols: columns, tasks, updateCols, updateTasks } = useTask();

  const pickedUpTaskColumn = useRef<string | null>(null);
  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  const throttledUpdateCols = useMemo(
    () => throttle(updateCols, THROTTLE_DELAY),
    [updateCols]
  );
  const throttledUpdateTasks = useMemo(
    () => throttle(updateTasks, THROTTLE_DELAY),
    [updateTasks]
  );

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: string) {
    const tasksInColumn = tasks.filter(task => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex(task => task.id === taskId);
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
        const startColumnIdx = columnsId.findIndex(id => id === active.id);
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
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );

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
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
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
        const overColumnPosition = columnsId.findIndex(id => id === over.id);
        if (active.id === over.id) return;
        startTransition(() => {
          throttledUpdateCols(
            arrayMove(columns, columnsId.indexOf(active.id), overColumnPosition)
          );
        });
        toast.success('Column moved');

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
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          startTransition(() => {
            throttledUpdateTasks(tasks);
          });
          toast.success(
            `${over.data.current.task.type
              .charAt(0)
              .toUpperCase()}${over.data.current.task.type
              .slice(1)
              .toLowerCase()} moved`
          );

          // console.log(
          //     `Task was dropped into column ${
          //         column?.title
          //     } in position ${taskPosition + 1} of ${
          //         tasksInColumn.length
          //     }`
          // );
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        startTransition(() => {
          throttledUpdateTasks(tasks);
        });
        toast.success(
          `${
            over.data.current.task.type.charAt(0).toUpperCase() +
            over.data.current.task.type.slice(1).toLowerCase()
          } moved`
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
            <BoardColumn key={col.id} column={col} />
          ))}
          <BoardAddColumn />
        </SortableContext>
      </BoardContainer>

      {typeof window !== 'undefined' &&
        'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && <BoardColumn isOverlay column={activeColumn} />}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
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
    const activeColumnIndex = columns.findIndex(col => col.id === activeId);
    const overColumnIndex = columns.findIndex(col => col.id === overId);
    startTransition(() => {
      throttledUpdateCols(
        arrayMove(columns, activeColumnIndex, overColumnIndex)
      );
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
    const updatedTasks = [...tasks];
    const activeIndex = updatedTasks.findIndex(t => t.id === activeId);
    if (isActiveATask && isOverATask) {
      const overIndex = updatedTasks.findIndex(t => t.id === overId);
      const activeTask = updatedTasks[activeIndex];
      const overTask = updatedTasks[overIndex];
      if (activeTask && overTask && activeTask.columnId !== overTask.columnId) {
        activeTask.columnId = overTask.columnId;
        startTransition(() => {
          throttledUpdateTasks(
            arrayMove(updatedTasks, activeIndex, Math.max(0, overIndex - 1))
          );
        });
        return;
      }
      startTransition(() => {
        throttledUpdateTasks(arrayMove(updatedTasks, activeIndex, overIndex));
      });
    }
    const isOverAColumn = overData?.type === 'Column';
    if (isActiveATask && isOverAColumn) {
      const activeTask = updatedTasks[activeIndex];
      if (activeTask) {
        activeTask.columnId = overId as string;
        startTransition(() => {
          throttledUpdateTasks(
            arrayMove(updatedTasks, activeIndex, activeIndex)
          );
        });
      }
    }
  }
}
