export function pageFromSegments(segments?: string | string[]) {
  if (!segments) return 1;

  return Array.isArray(segments)
    ? parseInt(segments[0]) || 1
    : parseInt(segments) || 1;
}
