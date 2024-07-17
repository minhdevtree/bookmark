import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function BasicTooltip({
    title,
    tooltipTitle,
}: {
    title: string;
    tooltipTitle?: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <p className="line-clamp-1 text-left">{title}</p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltipTitle || title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
