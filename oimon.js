const redis = require('redis');
const client = redis.createClient()
const { timenow } = require('./utils');

const checkStatus = () => {
  client.hmget(['.TSLA210723C700','openInterest'],(err,res) => {
    console.log(`${Number(res[0])} - ${timenow()}`)
  })
}
checkStatus()
setInterval(() => {
  checkStatus()
},1000*60*10)
