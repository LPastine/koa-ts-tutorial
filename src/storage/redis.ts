import * as Interfaces from "../types/interfaces";
import { config } from "../config";
const redis = require("redis");
const { promisify } = require('util');

export function redisStorage(): Interfaces.IStorage {

  const client = redis.createClient(config.redis);

  const rpush = promisify(client.rpush).bind(client);
  const lrem = promisify(client.lrem).bind(client);
  const lrange = promisify(client.lrange).bind(client);

  return {
    get: (list: string) => {
      return lrange(list, 0, -1).then((val: any) => val).catch((e: any) => []);
    },
    add: (list: string, name: string) => {
      return rpush(list, name).then((val: any) => val > 0).catch((e: any) => false);
    },
    remove: (list: string, name: string) => {
      return lrem(list, 0, name).then((val: any) => val > 0).catch((e: any) => false);
    }
  }
};
