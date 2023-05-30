export function getTimestampString(date: Date = new Date(), useUTC = true): string {
  const [Y, M, D, h, m, s, ms] = useUTC
    ? [
        String(date.getUTCFullYear()),
        String(date.getUTCMonth() + 1).padStart(2, '0'),
        String(date.getUTCDate()).padStart(2, '0'),
        String(date.getUTCHours()).padStart(2, '0'),
        String(date.getUTCMinutes()).padStart(2, '0'),
        String(date.getUTCSeconds()).padStart(2, '0'),
        String(date.getUTCMilliseconds()).padStart(3, '0'),
      ]
    : [
        String(date.getFullYear()),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
        String(date.getHours()).padStart(2, '0'),
        String(date.getMinutes()).padStart(2, '0'),
        String(date.getSeconds()).padStart(2, '0'),
        String(date.getMilliseconds()).padStart(3, '0'),
      ];
  return `${Y}-${M}-${D} ${h}:${m}:${s}.${ms}`;
}
