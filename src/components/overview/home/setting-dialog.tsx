'use client';

import { useTask } from '@/components/provider/task-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FolderOutput, Import, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SettingDialog() {
  const { settings, cols, tasks, updateCols, updateTasks, updateSettings } =
    useTask();
  const router = useRouter();
  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify({ cols, tasks });
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
      )}`;
      const exportFileDefaultName = 'data.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      toast.error('Invalid data');
      return;
    }
  };

  const handleImportData = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const text = e.target.result;

          if (!text) {
            toast.error('Invalid data');
            return;
          }
          const importedData = JSON.parse(text);

          if (
            !importedData ||
            typeof importedData !== 'object' ||
            !importedData?.cols ||
            !importedData?.tasks ||
            !Array?.isArray(importedData.cols) ||
            !Array?.isArray(importedData.tasks)
          ) {
            toast.error('Invalid data');
            return;
          }
          updateCols(importedData.cols);
          updateTasks(importedData.tasks);
          router.refresh();
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      toast.error('Invalid data');
      return;
    }
  };

  const handleOpenLinkInNewTab = () => {
    updateSettings({
      ...settings,
      openLinkInNewTab: !settings.openLinkInNewTab,
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="hidden" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem] " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage board settings.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={settings.openLinkInNewTab}
            onCheckedChange={handleOpenLinkInNewTab}
          />
          <Label htmlFor="airplane-mode">Open link in new tab</Label>
        </div>
        <div className="flex justify-center gap-5 mt-5">
          <Button className="gap-2" onClick={handleExportData}>
            <FolderOutput className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="gap-2" onClick={handleImportData}>
            <Import className="w-4 h-4" />
            Import Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
