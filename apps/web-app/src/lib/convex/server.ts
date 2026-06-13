import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { FunctionArgs, FunctionReference } from "convex/server";

async function getConvexToken() {
    const { getToken } = await auth();
    return (
        (await getToken({
            template: "convex",
        })) ?? undefined
    );
}

export async function convexQuery<Query extends FunctionReference<"query">>(
    query: Query,
    args: FunctionArgs<Query>,
) {
    return fetchQuery(query, args, {
        token: await getConvexToken(),
    });
}

export async function convexMutation<Mutation extends FunctionReference<"mutation">>(
    mutation: Mutation,
    args: FunctionArgs<Mutation>,
) {
    return fetchMutation(mutation, args, {
        token: await getConvexToken(),
    });
}
