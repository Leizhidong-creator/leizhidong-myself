type ProgressEntry = { id: string; weight: number };
type ProgressListener = (value: number) => void;

export function createWeightedProgress(entries: readonly ProgressEntry[]) {
  const values = new Map(entries.map((entry) => [entry.id, 0]));
  const listeners = new Set<ProgressListener>();
  const totalWeight = entries.reduce((total, entry) => total + entry.weight, 0);
  let current = 0;

  const calculate = () =>
    entries.reduce((total, entry) => total + entry.weight * (values.get(entry.id) ?? 0), 0) / totalWeight;

  return {
    get value() {
      return current;
    },
    set(id: string, progress: number) {
      const previous = values.get(id);
      if (previous === undefined) throw new Error(`Unknown progress entry: ${id}`);

      values.set(id, Math.max(previous, Math.min(1, Math.max(0, progress))));
      current = Math.max(current, calculate());
      listeners.forEach((listener) => listener(current));
    },
    subscribe(listener: ProgressListener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  };
}
