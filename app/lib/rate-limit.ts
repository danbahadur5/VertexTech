interface RateLimitOptions {
  interval: number; // in ms
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new Map<string, { count: number; lastReset: number }>();

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const entry = tokenCache.get(token);

        if (!entry || now - entry.lastReset > options.interval) {
          tokenCache.set(token, { count: 1, lastReset: now });
          return resolve();
        }

        entry.count += 1;
        if (entry.count > limit) {
          return reject();
        }

        return resolve();
      }),
  };
}
