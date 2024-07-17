'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SettingDialog({ setChange }: { setChange: any }) {
    const [settings, setSettings] = useState({
        openLinkInNewTab: false,
    });

    useEffect(() => {
        const currentSettings = JSON.parse(
            localStorage.getItem('settings') || '{}'
        );
        if (!currentSettings.openLinkInNewTab) {
            localStorage.setItem('settings', JSON.stringify(settings));
        } else {
            setSettings(currentSettings);
        }
    }, []);

    const handleOpenLinkInNewTab = () => {
        setSettings(preSettings => {
            const updatedSettings = {
                ...preSettings,
                openLinkInNewTab: !preSettings.openLinkInNewTab,
            };
            localStorage.setItem('settings', JSON.stringify(updatedSettings));
            return updatedSettings;
        });
        setChange((pre: boolean) => !pre);
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
                    <DialogDescription>
                        Manage board settings.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="airplane-mode"
                        checked={settings.openLinkInNewTab}
                        onCheckedChange={handleOpenLinkInNewTab}
                    />
                    <Label htmlFor="airplane-mode">Open link in new tab</Label>
                </div>
            </DialogContent>
        </Dialog>
    );
}
