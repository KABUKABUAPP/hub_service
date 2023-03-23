const amqp = require('amqplib/callback_api');
const dotenv = require('dotenv');
const config_env = require('../config_env');
dotenv.config();

let amqpConn = null;
let channel = null;

const init = async () => {
  try {
    const con = await amqp.connect(config_env.CLOUDAMQP_URL);
    Promise.resolve(con);
  } catch (error) {
    Promise.reject(error);
  }

  //   await amqp.connect(config_env.CLOUDAMQP_URL, (err, connection) => {
  //     if (err) {
  //       console.log("falid###", err);

  //       Promise.reject(err);
  //     }
  //     console.log("queueconee#$$")
  // if(connection){
  // amqpConn = connection;
  // Promise.resolve(connection);
  // }

  //     //console.log("connected to queue", amqpConn);
  //   });
};
module.exports = {
  sendQueue: async (queue, msg) => {
    // if (!amqpConn) {
    //   init()
    //     .then((res) => {
    //       console.log("then motheiod###");
    //      // console.log(res)
    //       amqpConn=res;
    //       //main();
    //     })
    //     .catch((e) => {
    //       console.log("errorRRR#@@@m", e);
    //     });
    // }else{
    //     console.log("auoo$##", );
    //     main();
    // }
     amqp.connect(config_env.CLOUDAMQP_URL, (errx, connection) => {
      if (errx) {
        console.log('error', errx);
        return;
      }
      connection.createChannel((err, ch) => {
        if (closeOnErr(err)) return;

        ch.on('error', function (err) {
          console.error('[AMQP] channel error', err.message);
        });

        ch.on('close', function () {
          console.log('[AMQP] channel closed');
        });

        ch.assertQueue(queue, { durable: true }, (err, _ok) => {
          if (closeOnErr(err)) return;

          //send message to queue
          console.log('channel connected#$$');
          ch.sendToQueue(queue, msg);
        });
      });
    });
    
    // function main() {
    //   amqpConn.createChannel((err, ch) => {
    //     if (closeOnErr(err)) return;

    //     ch.on("error", function (err) {
    //       console.error("[AMQP] channel error", err.message);
    //     });

    //     ch.on("close", function () {
    //       console.log("[AMQP] channel closed");
    //     });

    //     ch.assertQueue(queue, { durable: true }, (err, _ok) => {
    //       if (closeOnErr(err)) return;

    //       //send message to queue
    //       console.log("channel connected#$$")
    //       ch.sendToQueue(queue, msg);
    //     });
    //   });
    // }
  },
  startConsumer: async (queue, fnConsumer) => {
    amqp.connect(config_env.CLOUDAMQP_URL, (errrm, connection) => {
      if (errrm) {
        console.log(errrm);
        return;
      }

      connection.createChannel((errr, ch) => {
        if (closeOnErr(errr)) return;

        ch.on('error', function (errrr) {
          console.error('[AMQP] channel error', errrr.message);
        });

        ch.on('close', function () {
          console.log('[AMQP] channel closed');
        });

        ch.prefetch(
          config_env.CLOUDAMQP_CONSUMER_PREFETCH
            ? config_env.CLOUDAMQP_CONSUMER_PREFETCH
            : 10
        );

        //connect to queue
        ch.assertQueue(queue, { durable: true }, (errx, _ok) => {
          if (closeOnErr(errx)) return;

          //consume incomming messages
          ch.consume(queue, proccessMsg, { noAck: false });
        });

        function proccessMsg(msg) {
          // Process incoming messages and send them to fnConsumer
          // Here we need to send a callback(true) for acknowledge the message or callback(false) for reject them
          fnConsumer(msg, function (ok) {
            try {
              ok ? ch.ack(msg) : ch.reject(msg, true);
            } catch (e) {
              closeOnErr(e);
            }
          });
        }
      });
    });
  }
};

function closeOnErr(err) {
  if (!err) return false;
  console.error('[AMQP] error', err);
  amqpConn.close();
  return true;
}
