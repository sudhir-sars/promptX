import Fuse, { IFuseOptions } from "fuse.js";
import { docsPages } from "../../sidebar/config";

type DocsSearchResult = {
    type: "page" | "heading";
    title: string;
    href: string;
    page?: string;
};

const docsSearchIndex: DocsSearchResult[] = docsPages.flatMap((page) => {
    const results: DocsSearchResult[] = [
        {
            type: "page",
            title: page.label,
            href: page.href,
        },
    ];

    if (page.toc) {
        results.push(
            ...page.toc.map((item) => ({
                type: "heading" as const,
                title: item.label,
                page: page.label,
                href: `${page.href}#${item.id}`,
            })),
        );
    }

    return results;
});

const docsSearchOptions: IFuseOptions<DocsSearchResult> = {
    keys: [
        {
            name: "title",
            weight: 0.9,
        },
        {
            name: "page",
            weight: 0.1,
        },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    findAllMatches: true,
    minMatchCharLength: 2,
};

let docsSearchInstance: Fuse<DocsSearchResult> | undefined;

export function getDocsSearch(): Fuse<DocsSearchResult> {
    if (docsSearchInstance) return docsSearchInstance;

    docsSearchInstance = new Fuse(docsSearchIndex, docsSearchOptions);
    return docsSearchInstance;
}
