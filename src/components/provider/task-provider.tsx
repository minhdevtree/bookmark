'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Column } from '../overview/home/board-column';
import { Task } from '../overview/home/task-card';
import { SettingsType } from '@/lib/define';

interface TaskContextProps {
  cols: Column[];
  tasks: Task[];
  settings: SettingsType;
  updateCols: (cols: Column[]) => void;
  updateTasks: (tasks: Task[]) => void;
  updateSettings: (settings: SettingsType) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [cols, setCols] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    openLinkInNewTab: false,
  });

  useEffect(() => {
    // Load data from localStorage on mount
    const storedCols = localStorage.getItem('cols') || '[]';
    const storedTasks = localStorage.getItem('tasks') || '[]';
    const storedSettings = localStorage.getItem('settings') || '{}';

    if (storedCols) setCols(JSON.parse(storedCols));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const updateCols = (newCols: Column[]) => {
    setCols(newCols);
    localStorage.setItem('cols', JSON.stringify(newCols));
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const updateSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  return (
    <TaskContext.Provider
      value={{ cols, tasks, settings, updateCols, updateTasks, updateSettings }}
    >
      {children}
    </TaskContext.Provider>
  );
};
