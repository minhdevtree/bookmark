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
    setChange,
}: {
    column: Column;
    children: React.ReactNode;
    setChange: any;
}) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-32">
                <EditColumnDialog column={column} setChange={setChange} />
                <DeleteColumnDialog column={column} setChange={setChange} />
            </ContextMenuContent>
        </ContextMenu>
    );
}
