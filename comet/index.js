/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
require('cometd-nodejs-client').adapt();
const { get } = require('../redis')
var lib = require('cometd');
const Tasty = require('../tasty')
const {
  META_UNSUBSCRIBE_CHANNEL,
  META_DISCONNECT_CHANNEL,
  META_SUBSCRIBE_CHANNEL,
  META_PUBLISH_CHANNEL,
  META_UNSUCCESSFUL_CHANNEL
} = require('./constants')
var cometd = new lib.CometD();
// const COMET_URL = 'https://tasty.dxfeed.com/live/cometd'
// "https://tasty-live-web.dxfeed.com/live/cometd"
// const COMET_URL = 'wss://tasty-live-web.dxfeed.com/live/cometd'
const COMET_URL = "https://tasty-live-web.dxfeed.com/live/cometd"
cometd.websocketEnabled = true;
cometd.configure({
    url: COMET_URL,
    logLevel: 'info',
    maxSendBayeuxMessageSize:264000
});


module.exports = async () => {
  let promise = new Promise(async (resolve, reject) => {
    try {
      // const TastyWorks = await Tasty()
      // if (!TastyWorks) return reject('No TastyWorks');
      // let streamerD = await TastyWorks.streamer()
      // console.log(streamerD.token)
      const token = await get('token')
      let streamerD = {
        token
      }
      var additional = {
          'ext': {'com.devexperts.auth.AuthToken': streamerD.token},
          'com.devexperts.auth.AuthToken': streamerD.token
      }

      cometd.handshake(additional, function(h) {
          if (h.successful) {
            cometd.subscribe(META_UNSUBSCRIBE_CHANNEL, msg => {
                console.log(META_UNSUBSCRIBE_CHANNEL)
                console.log(msg)
            });
            cometd.subscribe(META_DISCONNECT_CHANNEL, msg => {
                console.log(META_DISCONNECT_CHANNEL)
                console.log(msg)
            });
            cometd.subscribe(META_SUBSCRIBE_CHANNEL, msg => {
                console.log(META_SUBSCRIBE_CHANNEL)
                console.log(msg)
            });
            cometd.subscribe(META_PUBLISH_CHANNEL, msg => {
                console.log(META_PUBLISH_CHANNEL)
                console.log(msg)
            });
            cometd.subscribe(META_UNSUCCESSFUL_CHANNEL, msg => {
                console.log(META_UNSUCCESSFUL_CHANNEL)
                console.log(msg)
                if (msg.id && Number(msg.id) > 5) {
                  console.log('ERROR ERROR ERROR -----------------------------')
                  console.log('ERROR ERROR ERROR -----------------------------')
                  console.log('ERROR ERROR ERROR -----------------------------')
                  console.log('ERROR ERROR ERROR -----------------------------')
                  console.log('ERROR ERROR ERROR -----------------------------')
                  console.log('ERROR ERROR ERROR -----------------------------')
                  process.exit()
                }
            });
            resolve(cometd)
          } else {
            console.log('COMETMAKER: ERROR: Handshake Failed')
            console.log(JSON.stringify(h))
            process.exit()

            return reject(h)
          }
      })
    } catch(err) {
      return reject(err);
    }
  });
  let result = await promise
  return result
}
