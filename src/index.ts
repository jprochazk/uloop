
export interface Handle {
    stop(): void;
}

interface Timer {
    now(): number;
}
type FrameFn = (callback: () => void) => void;

const isNode = typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;

export function loop(rate: number, update: () => void, render?: (frameWeight: number) => void): Handle {
    // how this works:
    // 1. accumulate how much time has passed since the last frame
    // 2. if the accumulated time is greater than the update interval, call update
    // 3. calculate frame weight = a value between 0 and 1, which determines how
    //    far inbetween updates we are
    // 4. pass frame weight into render call

    const time: Timer = globalThis.performance ?? globalThis.Date;
    const frame: FrameFn = isNode ? globalThis.setImmediate : globalThis.requestAnimationFrame;
    const TARGET_UPDATE_MS = 1000 / rate;

    let running = false;
    const handle = { stop() { running = false } };
    let last = time.now();
    let lag = 0.0;
    // minor optimization:
    // specialize for the case where there is no render function
    let loop: () => void;
    if (render) {
        loop = () => {
            if (!running) return;
            const now = time.now();
            lag += now - last;
            last = now;
            while (lag >= TARGET_UPDATE_MS) {
                update();
                lag -= TARGET_UPDATE_MS;
            }
            render(lag / TARGET_UPDATE_MS);
            frame(loop);
        };
    } else {
        loop = () => {
            if (!running) return;
            const now = time.now();
            lag += now - last;
            last = now;
            while (lag >= TARGET_UPDATE_MS) {
                update();
                lag -= TARGET_UPDATE_MS;
            }
            frame(loop);
        };
    }

    running = true;
    frame(loop);
    return handle;
}