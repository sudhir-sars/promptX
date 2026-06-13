export interface CacheEntry<T> {
    value: T;
    /** Wall-clock time after which the entry is stale but still servable (SWR window opens). */
    staleAt: number;
    /** Wall-clock time after which the entry is expired and must be evicted (a true cache miss). */
    expiresAt: number;
}

export interface CacheHit<T> {
    value: T;
    isStale: boolean;
}

export class MemoryCache<T> {
    private readonly store = new Map<string, CacheEntry<T>>();
    private readonly expiryQueue = new Set<string>();

    constructor(
        private readonly maxAgeMs: number,
        private readonly staleWhileRevalidateMs: number,
        private readonly maxSize: number = 1000,
    ) {}

    get(key: string): CacheHit<T> | undefined {
        const now = Date.now();
        this.reclaimExpired(now);

        const entry = this.store.get(key);
        if (!entry) return undefined;

        this.store.delete(key);
        this.store.set(key, entry);

        return { value: entry.value, isStale: now >= entry.staleAt };
    }

    set(key: string, value: T): void {
        const now = Date.now();

        this.reclaimExpired(now);

        this.store.delete(key);
        this.store.set(key, {
            value,
            staleAt: now + this.maxAgeMs,
            expiresAt: now + this.maxAgeMs + this.staleWhileRevalidateMs,
        });

        this.expiryQueue.delete(key);
        this.expiryQueue.add(key);

        while (this.store.size > this.maxSize) {
            const lruKey = this.store.keys().next().value;
            if (lruKey === undefined) {
                break;
            }
            this.store.delete(lruKey);
            this.expiryQueue.delete(lruKey);
        }
    }

    delete(key: string): void {
        this.store.delete(key);
        this.expiryQueue.delete(key);
    }

    private reclaimExpired(now: number): void {
        for (const key of this.expiryQueue) {
            const entry = this.store.get(key);

            if (!entry) {
                this.expiryQueue.delete(key);
                continue;
            }

            if (entry.expiresAt > now) break;

            this.store.delete(key);
            this.expiryQueue.delete(key);
        }
    }
}
