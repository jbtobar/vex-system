/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');

const subber = redis.createClient();
const client_redis = redis.createClient();

const LENGTHS = {
    Greeks: ["eventSymbol","eventTime","eventFlags","index","time","sequence","price","volatility","delta","gamma","theta","rho","vega"],
    Quote: ["eventSymbol","eventTime","sequence","timeNanoPart","bidTime","bidExchangeCode","bidPrice","bidSize","askTime","askExchangeCode","askPrice","askSize"],
    Trade: ["eventSymbol","eventTime","time","timeNanoPart","sequence","exchangeCode","price","change","size","dayId","dayVolume","dayTurnover","tickDirection","extendedTradingHours"],
    Summary: ["eventSymbol","eventTime","dayId","dayOpenPrice","dayHighPrice","dayLowPrice","dayClosePrice","dayClosePriceType","prevDayId","prevDayClosePrice","prevDayClosePriceType","prevDayVolume","openInterest"],
    TheoPrice: ["eventSymbol","eventTime","eventFlags","index","time","sequence","price","underlyingPrice","delta","gamma","dividend","interest"],
    Series:[
          'eventSymbol',  'eventTime',
          'eventFlags',   'index',
          'time',         'sequence',
          'expiration',   'volatility',
          'callVolume',   'putVolume',
          'putCallRatio', 'forwardPrice',
          'dividend',     'interest',
          'optionVolume'
      ],
    Underlying:[
    "eventSymbol",
    "eventTime",
    "eventFlags",
    "index",
    "time",
    "sequence",
    "volatility",
    "frontVolatility",
    "backVolatility",
    "callVolume",
    "putVolume",
    "putCallRatio",
    "optionVolume"
    ]
}

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
let messageNum = 0
let queue = []
async function storeQueue() {
    if (queue.length > 0) {
        const copyQueue = [...queue]
        queue = []
        try {
            for (var i = 0; i < copyQueue.length; i++) {
                const msg = JSON.parse(copyQueue[i])
                messageNum+=1
                // console.log(msg)
                const ltime = new Date().getTime()
                // client_redis.set('cometOPT',ltime)

                const [payloadType,payload] = msg.data
                let name
                if (typeof payloadType !== 'string') {
                  LENGTHS[payloadType[0]] = payloadType[1]
                  name = payloadType[0]
                } else {
                  name = payloadType
                }
                if (!LENGTHS[name]) return console.log('fucked',[payloadType,payload])

                while (payload.length > 0) {
                  let item = payload.splice(0,LENGTHS[name].length);
                  let payloadObj = {

                  }
                  LENGTHS[name].forEach((key, i) => {
                    if (i > 0) {
                      payloadObj[key] = item[i] || 'null'
                    }
                  });

                  if (name === 'Greeks') {
                    // console.log(payloadObj)
                    payloadObj.theo = payloadObj.price
                    // console.log(payloadObj)
                    delete payloadObj.price
                  }
                  if (name === 'Trade') {
                    // console.log(payloadObj)
                    payloadObj.changePct = payloadObj.change/(payloadObj.price-payloadObj.change)
                    // console.log(payloadObj)
                    // delete payloadObj.changePct
                  }
                  payloadObj[`${name}_ts`] = ltime


                  await client_redis.hmset(item[0],payloadObj)
                  await client_redis.publish(
                    name,
                    JSON.stringify({eventSymbol:item[0],...payloadObj})
                  )

                }
            }
        } catch (e) {
            console.error(e);
        }
        storeQueue();
    } else {
        setTimeout(() => {
            storeQueue()
        },1000)
    }
}



subber.on('message', (channel, message) => queue.push(message))
subber.subscribe('xQuote')
storeQueue()
setInterval(() => {
  console.log('xQuote',{messageNum,time:timenow(),queue:queue.length})
},1000*30);
