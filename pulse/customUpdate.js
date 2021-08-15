/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const subber = redis.createClient();
const client_redis = redis.createClient();

console.log('Custom update')

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

let m = 0
let p = 0
setInterval(() => {
    console.log(`m: ${m} - p: ${p} :: ${timenow()}`)
},30000)

subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    m+=1
    const {eventSymbol} = payload;
    if (eventSymbol) {
      client_redis.hmget(...[
        eventSymbol,
        'value'
        'volm'
        'count'
        'valuebuy'
        'volmbuy'
        'countbuy'
        'valuebs'
        'volmbs'
        'countbs'
        'valuesell'
        'volmsell'
        'countsell'
        'valuebs'
        'volmbs'
        'countbs'
        'valueund'
        'volmund'
        'countund'
      ],(err,res) => {
        if (!err) {
          p+=1
          client_redis.publish('Custom',JSON.stringify({
            eventSymbol,
            value:res[0],
            volm:res[1],
            count:res[2],
            valuebuy:res[3],
            volmbuy:res[4],
            countbuy:res[5],
            valuebs:res[6],
            volmbs:res[7],
            countbs:res[8],
            valuesell:res[9],
            volmsell:res[10],
            countsell:res[11],
            valuebs:res[12],
            volmbs:res[13],
            countbs:res[14],
            valueund:res[15],
            volmund:res[16],
            countund:res[17]
          }))
        } else console.log(err)
      })
    }
  } catch (e) {
    console.error(e,channel, message)
  }
})
subber.subscribe('CustomUpdate')
