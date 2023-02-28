const { REDIS_CACHE_TTL } = require("../config_env");
const redisClient = require("../redis/index");

exports.getRedisData = async (key) => {
  let data = await redisClient.get(key);
  data = JSON.parse(data);
  return data;
};

exports.saveRedisData = async (key, value, ttl) => {
  ttl = ttl || Number(REDIS_CACHE_TTL);
  const data = JSON.stringify(value);
  await redisClient.set(key, data, { ttl });
};

exports.deleteRedisData = async (key) => {
  console.info("deleting key for: %s ", key);
  await redisClient.del(key);
};

exports.deleteRedisMany = async (keys) => {
  console.info("deleting key for: %s ", keys);

  keys.forEach((key) => {
    redisClient.del(key);
  });
};
