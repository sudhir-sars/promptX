"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FunctionReturnType } from "convex/server";
import Link from "next/link";

interface SearchResultsProps {
    teamId: Id<"teams"> | undefined;
    results: FunctionReturnType<typeof api.search.search> | undefined;
    searchTerm: string;
    onSelect?: () => void;
}

export function SearchResults({ teamId, results, searchTerm, onSelect }: SearchResultsProps) {
    if (!searchTerm) {
        return <div className="p-4 text-sm text-muted-foreground">Start typing to search...</div>;
    }

    if (results === undefined) {
        return <div className="p-4 text-sm text-muted-foreground">Searching...</div>;
    }

    if (results.length === 0) {
        return <div className="p-4 text-sm text-muted-foreground">No results found.</div>;
    }

    return (
        <div className="max-h-80 overflow-y-auto no-scrollbar py-2">
            {results.map((prompt) => (
                <Link
                    key={prompt._id}
                    href={`/home/${teamId}/${prompt._id}`}
                    onClick={onSelect}
                    className="flex items-center px-4 py-3 text-sm hover:bg-muted"
                >
                    {prompt.name}
                </Link>
            ))}
        </div>
    );
}
