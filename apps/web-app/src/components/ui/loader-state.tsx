import { LoadingIcon } from "@/components/ui/icons";

export function Loader({ text = "Loading prompts..." }: { text?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <LoadingIcon className="size-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
