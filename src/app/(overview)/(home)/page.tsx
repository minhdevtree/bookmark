'use client';

import { KanbanBoard } from '@/components/overview/home/kanban-board';
import { SettingDialog } from '@/components/overview/home/setting-dialog';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <header className="flex justify-between w-full flex-row p-4 h-[10vh] sticky top-0 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button variant="link" asChild className="text-primary h-8 w-8 p-0">
          <Link href="https://github.com/minhdevtree">
            <GitHubLogoIcon className="fill-current h-full w-full" />
          </Link>
        </Button>
        <Button variant="link" asChild className="text-primary h-16 w-16">
          <Link href="https://github.com/minhdevtree">@minhdevtree</Link>
        </Button>
        <div className="flex gap-2">
          <ModeToggle />
          <SettingDialog />
        </div>
      </header>
      <div className="w-board text-center fixed">
        <KanbanBoard />
      </div>
    </div>
  );
}
