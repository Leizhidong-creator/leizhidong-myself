export function createPreloaderGate(reveal: () => void) {
  let revealed = false;

  const markReady = () => {
    if (revealed) return;
    revealed = true;
    reveal();
  };

  return {
    markReady,
    cancel: () => undefined,
  };
}
