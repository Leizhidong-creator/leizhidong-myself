export type EventCallback<T = any> = (data: T) => void;

export default class EventEmitter<TEvents extends Record<string, any>> {
  private events: { [K in keyof TEvents]?: EventCallback<TEvents[K]>[] } = {};

  on<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(callback);
  }

  once<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
    const onceCallback: EventCallback<TEvents[K]> = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  emit<K extends keyof TEvents>(event: K, data?: TEvents[K]): void {
    this.events[event]?.forEach((cb) => cb(data || ({} as TEvents[K])));
  }

  off<K extends keyof TEvents>(event: K, callback: EventCallback<TEvents[K]>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event]!.filter((cb) => cb !== callback);
  }

  destroyEmitter(): void {
    this.events = {};
  }
}
