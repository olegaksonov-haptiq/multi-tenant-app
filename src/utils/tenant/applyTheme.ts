export function applyTheme(theme: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(theme).forEach(([k, v]) => {
    // theme keys like primary, accent -> --color-primary
    root.style.setProperty(`--${k}`, v);
  });
}
