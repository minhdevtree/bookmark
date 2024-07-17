import { Icons } from '../icons/icons';

// opacity-75: Delete this class

export default function SpinLoading() {
    return (
        <div className="w-full bg-background z-50">
            <div className="flex gap-2 justify-center items-center text-primary">
                <Icons.spinner className="h-1000 w-1000 animate-spin" />
                <div className="text-center flex flex-col justify-center text-xl">
                    Loading...
                </div>
            </div>
        </div>
    );
}
