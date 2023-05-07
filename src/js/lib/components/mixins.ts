export function generateQuickGuid(): string {
  return (
    Math.random().toString(36).substring(2, 4) +
    Math.random().toString(36).substring(2, 4)
  );
}
