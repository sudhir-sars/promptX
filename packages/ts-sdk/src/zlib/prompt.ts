import { isDeploymentEnv } from "@promptx/shared";
import type { Prompt } from "../ztypes";

/**
 * Runtime validator for the canonical Edge response (`GetPromptResponse`).
 * Single-consumer (SDK only), so it stays here rather than in @promptx/shared —
 * but it validates the shared contract shape, so the two move together.
 */
export function isPrompt(value: unknown): value is Prompt {
    if (typeof value !== "object" || value === null) return false;

    const p = value as Record<string, unknown>;

    if (
        typeof p.identifier !== "string" ||
        typeof p.content !== "string" ||
        typeof p.sequence !== "number" ||
        !Number.isFinite(p.sequence) ||
        typeof p.traffic !== "number" ||
        !Number.isFinite(p.traffic) ||
        !isDeploymentEnv(p.env)
    ) {
        return false;
    }

    if (p.routing === undefined) return true;

    if (typeof p.routing !== "object" || p.routing === null) return false;

    const routing = p.routing as Record<string, unknown>;

    if (routing.strategy === "default") return true;

    if (routing.strategy === "user_sticky" && typeof routing.identifier === "string") return true;

    return false;
}
