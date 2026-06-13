// components/ui/loading-state.tsx

"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type LoadingStateVariant = "project" | "prompt" | "version" | "activity";

type LoadingStateMode = "default" | "compact";

interface LoadingStateProps {
  variant: LoadingStateVariant;
  mode?: LoadingStateMode;
}

const LOADING_STATE_CONFIG: Record<LoadingStateVariant, string[]> = {
  project: [
    "Looking for projects",
    "Preparing your workspace",
    "Bringing everything together",
    "Getting things ready",
    "Loading your work",
    "Finding what matters",
    "Gathering context",
    "Organizing your workspace",
    "Connecting recent activity",
    "Checking your projects",
    "Loading your environment",
    "Restoring your workspace",
    "Putting things in place",
    "Almost there",
    "Just a moment",
  ],

  prompt: [
    "Looking for prompts",
    "Preparing your editor",
    "Loading your work",
    "Gathering context",
    "Finding recent prompts",
    "Restoring your workflow",
    "Loading prompt history",
    "Preparing your workspace",
    "Connecting everything",
    "Getting things ready",
    "Reviewing recent changes",
    "Loading prompt data",
    "Putting things in place",
    "Almost there",
    "Just a moment",
  ],

  version: [
    "Loading versions",
    "Reviewing changes",
    "Preparing version history",
    "Finding recent updates",
    "Loading revision history",
    "Gathering context",
    "Comparing changes",
    "Checking saved versions",
    "Loading previous work",
    "Preparing timeline",
    "Connecting version history",
    "Restoring recent changes",
    "Almost there",
    "Just a moment",
  ],

  activity: [
    "Loading activity",
    "Checking recent updates",
    "Gathering activity",
    "Preparing timeline",
    "Loading recent events",
    "Connecting activity feed",
    "Reviewing updates",
    "Loading history",
    "Almost there",
    "Just a moment",
  ],
};

export function LoadingState({ variant, mode = "default" }: LoadingStateProps) {
  const messages = LOADING_STATE_CONFIG[variant];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 2374);

    return () => clearInterval(interval);
  }, [messages]);

  if (mode === "compact") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />

        <p
          key={messageIndex}
          className="animate-in fade-in text-sm text-muted-foreground duration-300"
        >
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
}
