import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Column } from './board-column';
import { EditColumnDialog } from './edit-column-dialog';
import { DeleteColumnDialog } from './delete-column-dialog';

export function BoardColumnContextMenu({
  column,
  children,
}: {
  column: Column;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-32">
        <EditColumnDialog column={column} />
        <DeleteColumnDialog column={column} />
      </ContextMenuContent>
    </ContextMenu>
  );
}
