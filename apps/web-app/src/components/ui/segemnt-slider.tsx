"use client";

import { useCallback, useMemo, useRef } from "react";

type SegmentSliderItem = {
    value: number;
    label: string;
};

type SegmentSliderProps = {
    value: SegmentSliderItem[];
    onChange: (value: SegmentSliderItem[]) => void;
    step?: number;
};

const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
];

export function SegmentSlider({ value, onChange, step = 1 }: SegmentSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);

    const boundaries = useMemo(() => {
        const result = [0];

        let running = 0;

        for (const segment of value) {
            running += segment.value;
            result.push(running);
        }

        return result;
    }, [value]);

    const updateBoundary = useCallback(
        (boundaryIndex: number, nextBoundary: number) => {
            const previousBoundary = boundaries[boundaryIndex - 1];
            const nextBoundaryLimit = boundaries[boundaryIndex + 1];

            nextBoundary = Math.max(previousBoundary, nextBoundary);
            nextBoundary = Math.min(nextBoundaryLimit, nextBoundary);

            nextBoundary = Math.round(nextBoundary / step) * step;

            const nextSegments = [...value];

            nextSegments[boundaryIndex - 1] = {
                ...nextSegments[boundaryIndex - 1],
                value: nextBoundary - previousBoundary,
            };

            nextSegments[boundaryIndex] = {
                ...nextSegments[boundaryIndex],
                value: nextBoundaryLimit - nextBoundary,
            };

            onChange(nextSegments);
        },
        [boundaries, value, onChange, step],
    );

    const startDrag = (e: React.PointerEvent, boundaryIndex: number) => {
        e.preventDefault();

        const move = (event: PointerEvent) => {
            if (!trackRef.current) {
                return;
            }

            const rect = trackRef.current.getBoundingClientRect();

            const x = event.clientX - rect.left;

            const percentage = (x / rect.width) * 100;

            updateBoundary(boundaryIndex, percentage);
        };

        const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
    };

    return (
        <div className="w-full py-12">
            <div ref={trackRef} className="relative h-5 overflow-visible rounded-full bg-muted">
                {value.map((segment, index) => (
                    <div
                        key={segment.label}
                        className="absolute top-0 h-full"
                        style={{
                            left: `${boundaries[index]}%`,
                            width: `${segment.value}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                        }}
                    />
                ))}

                {boundaries.map((boundary, index) => {
                    const isFirst = index === 0;
                    const isLast = index === boundaries.length - 1;

                    return (
                        <div
                            key={index}
                            className="absolute top-1/2"
                            style={{
                                left: `${boundary}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            {!isLast && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-md border bg-background px-2 py-1 text-xs font-medium shadow">
                                    {value[index].label} · {value[index].value}%
                                </div>
                            )}

                            <div
                                onPointerDown={
                                    !isFirst && !isLast ? (e) => startDrag(e, index) : undefined
                                }
                                className={[
                                    "h-6 w-6 rounded-full border-2 border-background shadow-lg",
                                    isFirst || isLast
                                        ? "bg-zinc-400"
                                        : "cursor-grab bg-white active:cursor-grabbing",
                                ].join(" ")}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
            </div>
        </div>
    );
}
