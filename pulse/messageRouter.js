const redis = require('redis');

const subber = redis.createClient();
const publisher = redis.createClient();


subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    switch (channel) {
      case 'TASER':
      case 'TASERFUT':
        publisher.publish(`${payload[0]}::TAS`,message)
        break;
      default:
        // console.log(`${payload.eventSymbol}::${channel}`)
        publisher.publish(`${payload.eventSymbol}::${channel}`,message)
    }
  } catch (e) {
    console.error(e)
  }
})
subber.subscribe('TASER')
subber.subscribe('TASERFUT')
subber.subscribe('Trade')
subber.subscribe('Greeks')
subber.subscribe('Summary')
subber.subscribe('Quote')
subber.subscribe('Underlying')
subber.subscribe('Series')
