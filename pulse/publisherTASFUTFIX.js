/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('../db');

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log(`publisherTASFUT - start - ${timenow()}`)
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')

const subbed = {}

const get = (args) => {
  return new Promise((resolve, reject) => {
    client_redis.get(args,(err,res) => {
      if (err) reject(err)
      else resolve(res)
    })
  });
}
const yesterday545PM = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7- (1000*60*60*3) + 1000*60*45
const today545pm = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7+(1000*60*60*21+1000*60*45)
// const today510pm = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7+(1000*60*60*21+1000*60*10)
// const today500pm = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7+(1000*60*60*21+1)
// const today300pm = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7+(1000*60*60*20)
// new Date(
//   Math.floor(new Date().getTime()/8.64e7)*8.64e7+ 1000*60*60*4
// ).toLocaleString("en-US", {timeZone: "America/New_York"})

let timeId = 0;
(async () => {
  const lastFut = await get('LAST_FUT')
  console.log(lastFut)
  // timeId = today500pm()
  // timeId = today545pm()
  timeId = today545pm();
  // timeId = today300pm()
  console.log('firsttime',{timeId})
  // process.exit()
})();


const subCommand = async () => {


  console.log(`\n`)
  console.log(`---------------------------------------------------------------`)
  console.log(`subbing TASFUT ${timenow()}`)
  const timeStart = new Date().getTime();
  console.log({timeId})
  const optioncodes = (
    await query({
      text: `SELECT optioncode from futchainx;`,
      rowMode: 'array',
    })
  ).rows.map(d => d[0]).filter(d => !subbed[d])
  console.log(optioncodes.length,optioncodes[0])

  // let timeId = yesterday5PM()

  // let lastTrade = Number((await query(`SELECT MAX(time) from tasc_fut;`)).rows[0].max)
  // console.log({lastTrade})
  // if (lastTrade > timeId) {
  //   timeId = lastTrade
  // }

  while (optioncodes.length > 0) {
    const symbolLoad = optioncodes.splice(0,2500)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
      client_redis.hmset(item,{pub:new Date().getTime()})
    });

    client_redis.publish('cometTASFUTFIX',JSON.stringify({"addTimeSeries":{
      "TimeAndSale": symbolLoad.map(d => ({"eventSymbol":d,"fromTime":timeId})),
    }}))
    await wait(500);
    // process.exit()
  }
  console.log(`done - Duration: ${new Date().getTime() - timeStart}`)
  console.log(`---------------------------------------------------------------`)
  console.log(`\n`)
}

subCommand()
setInterval(() => {
  subCommand()
},1000*60*10)
