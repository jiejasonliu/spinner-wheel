export function groupBy<T>(array: T[], keyGetter: (item: T) => string) {
  return array.reduce((result: Record<string, T[]>, item) => {
    const key = keyGetter(item);
    result[key] ??= [];
    result[key].push(item);
    return result;
  }, {});
}
