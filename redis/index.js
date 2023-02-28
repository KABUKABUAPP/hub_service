// const dotenv = require("dotenv");
// dotenv.config();
// const redis = require("redis");
// const config_env = require("../config_env");

// const url = `redis://${config_env.REDIS_HOST}:${config_env.REDIS_PORT}`;

// // const redisClient=redis.createClient({
// //   url,
// //   // password:
// // process.env.REDIS_PORT || 6379,
// // process.env.REDIS_CONNECT
// // });

// const redisClient = redis.createClient({ url });
// // const redisClient = redis.createClient();

// (async () => {
//   await redisClient.connect();
// })();

// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// redisClient.on("connect", () => {
//   console.log("Redis Connected!");
// });
// redisClient.on("reconnecting", () =>
//   console.log("redis client is reconnecting")
// );
// redisClient.on("ready", () => console.log("redis client is ready"));

// module.exports = redisClient;
