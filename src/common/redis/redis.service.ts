import { RedisClientType } from 'redis';

export class RedisService {
  constructor(private readonly client: RedisClientType) {}

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async get<T = string>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    try {
      return val ? (JSON.parse(val) as T) : null;
    } catch {
      return val as unknown as T;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds?: number,
  ): Promise<string | null> {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds && ttlSeconds > 0) {
      return this.client.set(key, payload, { EX: ttlSeconds });
    }
    return this.client.set(key, payload);
  }

  async del(key: string | string[]): Promise<number> {
    return this.client.del(key as any);
  }
}
