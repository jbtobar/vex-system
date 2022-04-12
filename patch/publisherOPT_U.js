/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('../db');

const cometRedisChannel = 'cometOPT_U'

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log(`publisherOPT - start - ${timenow()} v4.55.56`)
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')

const subbed = {}
const subbbedUND = {}

const subCommand = async () => {
  console.log(`\n`)
  console.log(`---------------------------------------------------------------`)
  const timeStart = new Date().getTime();
  console.log(`subbing ${timenow()}`)



  let codes = [...new Set([
    ...(await query(`select * from futuresdir`)).rows.map(d => ({name:d.name,symbol:d.dxsymbol})).map(d => d.symbol),
    ...(await query(`select * from futdirx;`)).rows.map(d => ({
      name:d.symbol,
      symbol:d.symbol.slice(0, d.symbol.length-1) + "2" + d.symbol.slice(d.symbol.length-1)+':'+d.dxcode
    })).map(d => d.symbol)
  ])].filter(d => !subbed[d])
  console.log('step2',codes.length,codes[0])

  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,4000)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
    });

    client_redis.publish(cometRedisChannel,JSON.stringify({"add":{
      // "Greeks": symbolLoad,
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
      "Underlying": symbolLoad,
      "Series": symbolLoad
    }}))
    await wait(500);
    // process.exit()
  }






  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------




  codes = (
    await query(`SELECT symbol as optioncode,underlying,strike,expiration,mmy,underlying,(substring(symbol FROM '(?<=\\d)[A-Z]{1}(?=\\d)')) as flag from ipf_opt;`)
  ).rows.filter(d => d.optioncode && d.optioncode.length>0).filter(d => !subbed[d.optioncode])
  console.log('step3',codes.length,codes[0])

  let underlyings = [...new Set(codes.map(d => d.underlying))].filter(d => !subbed[d])

  codes = [...underlyings]
  underlyings = null

  console.log('step4s',codes.length,codes[0])

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------


  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,2000)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
    });

    client_redis.publish(cometRedisChannel,JSON.stringify({"add":{
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
      "Underlying": symbolLoad,
      "Series": symbolLoad
    }}))
    await wait(500);
    // process.exit()
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------




  console.log(`done - Duration: ${new Date().getTime() - timeStart}`)
  console.log(`---------------------------------------------------------------`)
  console.log(`\n`)
}

subCommand()
setInterval(() => {
  subCommand()
},1000*60*10)
