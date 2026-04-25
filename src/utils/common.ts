export function envNumber(
  value: string | undefined,
  defaultValue: number
): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}
