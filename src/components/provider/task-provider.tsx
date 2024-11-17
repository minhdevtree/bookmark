'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useRef,
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

  // Debounce references
  const debounceRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    // Load data from localStorage on mount
    const storedCols = localStorage.getItem('cols') || '[]';
    const storedTasks = localStorage.getItem('tasks') || '[]';
    const storedSettings = localStorage.getItem('settings') || '{}';

    if (storedCols) setCols(JSON.parse(storedCols));
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const debounce = (key: string, callback: () => void, delay: number) => {
    if (debounceRef.current[key]) {
      clearTimeout(debounceRef.current[key]);
    }
    debounceRef.current[key] = setTimeout(() => {
      callback();
      delete debounceRef.current[key];
    }, delay);
  };

  const updateCols = (newCols: Column[]) => {
    setCols(newCols);
    debounce(
      'cols',
      () => {
        localStorage.setItem('cols', JSON.stringify(newCols));
      },
      2000
    );
  };

  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    debounce(
      'tasks',
      () => {
        localStorage.setItem('tasks', JSON.stringify(newTasks));
      },
      2000
    );
  };

  const updateSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    debounce(
      'settings',
      () => {
        localStorage.setItem('settings', JSON.stringify(newSettings));
      },
      1000
    );
  };

  return (
    <TaskContext.Provider
      value={{ cols, tasks, settings, updateCols, updateTasks, updateSettings }}
    >
      {children}
    </TaskContext.Provider>
  );
};
