import client, { get, set, lrange } from "../databases/init.mongodb";
import { promisify } from "util";

const REDIS_GET = promisify(get).bind(client);
const REDIS_SET = promisify(set).bind(client);
const REDIS_LRANGE = promisify(lrange).bind(client);

export default {
  REDIS_GET,
  REDIS_SET,
  REDIS_LRANGE,
};
