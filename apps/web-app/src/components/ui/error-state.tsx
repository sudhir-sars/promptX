import { AlertIcon } from "@/components/ui/icons";
export function ErrorState({ message = "Something went wrong" }: { message?: string | null }) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <AlertIcon className="size-5" />
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
}
