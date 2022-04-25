/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const connectedComet = require('../comet');
const { SUBSCRIPTION_CHANNEL, DATA_CHANNEL } = require('../comet/constants')

const client_redis = redis.createClient();
const publisher = redis.createClient();

const LENGTHS = {

}

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log(`cometOPT - start - ${timenow()}`)
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')

let messageNum = 0
let okNum = 0

const handleDataChannel = msg => {
  messageNum+=1
  // console.log(msg)
  const ltime = new Date().getTime()
  client_redis.set('cometOPT',ltime)

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


    client_redis.hmset(item[0],payloadObj)
    client_redis.publish(
      name,
      JSON.stringify({eventSymbol:item[0],...payloadObj})
    )

  }

};

const channelName = payloadType => {

    return payloadType !== 'string' ?
        `x${payloadType[0]}`
        :
        `x${payloadType}`
};

(async () => {
  console.log('suball')
  let startTime = new Date().getTime()

  const comet = await connectedComet()

  // comet.subscribe(DATA_CHANNEL,handleDataChannel)
  // comet.subscribe(DATA_CHANNEL,e => client_redis.publish("cx", JSON.stringify(e)))
  comet.subscribe(DATA_CHANNEL,msg => client_redis.publish(channelName(msg.data[0]), JSON.stringify(msg)))

  publisher.on('message', (channel, message) => {
    const payload = JSON.parse(message)

    switch (channel) {
      case 'cometOPT':
        comet.publish(SUBSCRIPTION_CHANNEL,payload,ack => {
          if (!ack.successful) {
            console.log('sub fail','cometOPT',ack)
          } else {
            okNum+=1
          }
        })
        break;
      default:
    }
  })
  publisher.subscribe('cometOPT')


  setInterval(() => {
    console.log('cometOPTv2',{messageNum,okNum,time:timenow()})
  },1000*30)
})();
