/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');

const subber = redis.createClient();
const client_redis = redis.createClient();

const LENGTHS = {

}

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
let messageNum = 0
let queue = []
async function storeQueue() {
    if (queue.length > 0) {
        const copyQueue = [...queue]
        queue = []
        try {
            for (var i = 0; i < queue.length; i++) {
                const msg = JSON.parse(queue[i])
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


                  client_redis.hmset(item[0],payloadObj)
                  client_redis.publish(
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
subber.subscribe('cx')
storeQueue()
setInterval(() => {
  console.log('cxOPT',{messageNum,time:timenow(),queue:queue.length})
},1000*30);
