export function createPreloaderGate(reveal: () => void, delayMs = 350) {
  let revealed = false;

  const revealOnce = () => {
    if (revealed) return;
    revealed = true;
    clearTimeout(timer);
    reveal();
  };

  const timer = setTimeout(revealOnce, delayMs);

  return {
    revealOnce,
    cancel: () => clearTimeout(timer),
  };
}
