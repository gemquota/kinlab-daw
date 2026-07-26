type MemoizeFn<T extends (...args: never[]) => unknown> = T & {
  cache: Map<string, ReturnType<T>>;
  clear: () => void;
};

export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
  maxSize = 256,
): MemoizeFn<T> {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args) as ReturnType<T>;
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) cache.delete(firstKey);
    }
    cache.set(key, result);
    return result;
  }) as MemoizeFn<T>;

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

export function memoizeFactory<T extends (...args: never[]) => unknown>(fn: T): () => MemoizeFn<T> {
  return () => memoize(fn);
}
