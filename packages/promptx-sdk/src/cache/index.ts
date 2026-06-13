export interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

export class MemoryCache<T> {
    private readonly store = new Map<string, CacheEntry<T>>();
    private readonly expiryQueue = new Set<string>();

    constructor(
        private readonly ttlMs: number,
        private readonly maxSize: number = 1000,
    ) {}

    get(key: string): T | undefined {
        this.reclaimExpired(Date.now());

        const entry = this.store.get(key);
        if (!entry) return undefined;

        this.store.delete(key);
        this.store.set(key, entry);

        return entry.value;
    }

    set(key: string, value: T): void {
        const now = Date.now();

        this.reclaimExpired(now);

        this.store.delete(key);
        this.store.set(key, { value, expiresAt: now + this.ttlMs });

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
