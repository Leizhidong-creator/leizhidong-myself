export const RETRY_DELAYS_MS = [1_000, 2_000, 4_000, 8_000, 10_000] as const;

export type RetryEnvironment = {
  isOnline: () => boolean;
  schedule: (callback: () => void, delayMs: number) => unknown;
  cancel: (handle: unknown) => void;
  onOnline: (callback: () => void) => () => void;
};

const browserEnvironment: RetryEnvironment = {
  isOnline: () => navigator.onLine,
  schedule: (callback, delayMs) => window.setTimeout(callback, delayMs),
  cancel: (handle) => window.clearTimeout(handle as number),
  onOnline: (callback) => {
    window.addEventListener("online", callback);
    return () => window.removeEventListener("online", callback);
  },
};

export function runWithRetry<T>(
  attempt: () => Promise<T>,
  options: { environment?: RetryEnvironment } = {},
): Promise<T> {
  const environment = options.environment ?? browserEnvironment;

  return new Promise<T>((resolve) => {
    let failures = 0;
    let running = false;
    let scheduled: unknown = null;

    const clearSchedule = () => {
      if (scheduled === null) return;
      environment.cancel(scheduled);
      scheduled = null;
    };

    const unsubscribeOnline = environment.onOnline(() => {
      clearSchedule();
      void run();
    });

    const run = async () => {
      if (running || !environment.isOnline()) return;
      running = true;
      clearSchedule();

      try {
        const value = await attempt();
        unsubscribeOnline();
        resolve(value);
      } catch {
        const delay = RETRY_DELAYS_MS[Math.min(failures, RETRY_DELAYS_MS.length - 1)]!;
        failures += 1;
        scheduled = environment.schedule(run, delay);
      } finally {
        running = false;
      }
    };

    void run();
  });
}
