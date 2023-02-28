// const redis = require('redis');
// const SERVER_ID = process.env.SERVER_ID;
// let connection = [];

// const subscriber = redis.createClient({
//   socket: {
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_CONNECT,
//     password: process.env.REDIS_PASSWORD
//   }
// });

// const publisher = redis.createClient({
//   socket: {
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_CONNECT,
//     password: process.env.REDIS_PASSWORD
//   }
// });

// const redisClient = redis.createClient({
//   socket: {
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_CONNECT,
//     password: process.env.REDIS_PASSWORD
//   }
// });

// (async () => {
//   subscriber.on('subscribe', (channel, count) => {
//     console.log(`Server ${SERVER_ID} subscribe successfully to ${channel}`);
//     publisher.publish('chat');
//   });

//   subscriber.on('message', (channel, message) => {
//     try {
//       console.log(`Server ${SERVER_ID} subscribe successfully to ${channel}`);
//       connection.forEach((c) => c.send(message));
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   redisClient.on('error', (err) => console.log('Redis Client Error', err));

//   await redisClient.connect();
//   await subscriber.connect();
//   await publisher.connect();
// })();

// module.exports = { subscriber, publisher, redisClient };
