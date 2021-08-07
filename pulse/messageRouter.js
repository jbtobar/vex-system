const redis = require('redis');

const subber = redis.createClient();
const publisher = redis.createClient();

const onlyNum = (val) => {
  if (val === null) return 0
  if (isNaN(val)) return 0
  return val
}


const getValues = (eventSymbol) => {
  subber.hmget([
    eventSymbol,
    'valuebuy',
    'valuesell',
    'valueund',

    'volmbuy',
    'volmsell',
    'volmund',

    'countbuy',
    'countsell',
    'countund',
  ],(err,res) => {
    publisher.publish(`${payload[0]}::TASVAL`,JSON.stringify({
      eventSymbol,
      valuebuy:onlyNum(res[0]),
      valuesell:onlyNum(res[1]),
      valueund:onlyNum(res[2]),
      volmbuy:onlyNum(res[3]),
      volmsell:onlyNum(res[4]),
      volmund:onlyNum(res[5]),
      countbuy:onlyNum(res[6]),
      countsell:onlyNum(res[7]),
      countund:onlyNum(res[8])
    }))
  })
}


subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    switch (channel) {
      case 'TASER':
      case 'TASERFUT':
        publisher.publish(`${payload[0]}::TAS`,message)
        if (payload[0]) getValues(payload[0])
        break;
      default:
        // console.log(`${payload.eventSymbol}::${channel}`)
        // if (payload.eventSymbol === 'SPY') console.log(`${payload.eventSymbol}::${channel}`)
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
