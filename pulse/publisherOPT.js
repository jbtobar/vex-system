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
console.log(`publisherOPT - start - ${timenow()}`)
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








  let codes = (
    await query(`select optioncode,underlying_symbol,rootsymbol as underlying,replace(expirydate,'-','') as mmy,strike,expirydate as expiration from futchainx;`)
  ).rows.filter(d => !subbed[d.optioncode])
  console.log('step1',codes.length,codes[0])
  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,2000)
    symbolLoad.forEach((item, i) => {
      subbed[item.optioncode] = true
      client_redis.hmset(item.optioncode,{
        ...item,
        valuebuy:0,
        volmbuy:0,
        countbuy:0,
        valuesell:0,
        volmsell:0,
        countsell:0,
        valueund:0,
        volmund:0,
        countund:0,
        underlying:item.underlying_symbol.slice(0, item.underlying_symbol.length-1) + '2' + item.underlying_symbol.slice(item.underlying_symbol.length-1) +":"+item.optioncode.split(':')[1]
      })
    });

    client_redis.publish('cometOPT',JSON.stringify({"add":{
      "Greeks": symbolLoad.map(d => d.optioncode),
      "Quote": symbolLoad.map(d => d.optioncode),
      "Trade": symbolLoad.map(d => d.optioncode),
      "Summary": symbolLoad.map(d => d.optioncode),
    }}))
    await wait(500);
    // process.exit()
  }


  // for (var i = 0; i < optioncodes.length; i++) {
  //   client_redis.hmset(optioncodes[i].symbol,{
  //     underlying:optioncodes[i].underlying,
  //     strike:optioncodes[i].strike,
  //     expiration:optioncodes[i].expiration,
  //     option_type:optioncodes[i].option_type,
  //     mmy:optioncodes[i].mmy,
  //   })
  //   processed[optioncodes[i].symbol] = true;
  // }
  // console.log(futures,futs)
  codes = [...new Set([
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

    client_redis.publish('cometOPT',JSON.stringify({"add":{
      // "Greeks": symbolLoad,
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
      "Underlying": symbolLoad,
    }}))
    await wait(500);
    // process.exit()
  }






  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------




  codes = (
    await query(`SELECT symbol as optioncode,underlying,strike,expiration,mmy,underlying,(substring(symbol FROM '(?<=\\d)[A-Z]{1}(?=\\d)')) as flag from ipf_opt;`)
  ).rows.filter(d => !subbed[d.optioncode])
  console.log('step3',codes.length,codes[0])

  let underlyings = [...new Set(codes.map(d => d.underlying))].filter(d => !subbed[d])
  const commitTimeStart = new Date().getTime()
  if (codes.length > 0) {
    await query('BEGIN')
    for (var i = 0; i < codes.length; i++) {
      await query(`INSERT INTO opt_db(optioncode,expirydate,strike,flag,rootsymbol) values($1,$2,$3,$4,$5)`,[
        codes[i].optioncode,
        codes[i].expiration,
        codes[i].strike,
        codes[i].flag,
        codes[i].underlying
      ])
    }
    await query('COMMIT')
    // SELECT symbol as optioncode,expiration as expirydate,strike,(substring(symbol FROM '(?<=\d)[A-Z]{1}(?=\d)')) as flag from ipf_opt
  }
  console.log(`commit finised - ${new Date().getTime()-commitTimeStart}`)

  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,2000)

    symbolLoad.forEach((item, i) => {
      subbed[item.optioncode] = true
      client_redis.hmset(item.optioncode,item)
    });

    client_redis.publish('cometOPT',JSON.stringify({"add":{
      "Greeks": symbolLoad.map(d => d.optioncode),
      "Quote": symbolLoad.map(d => d.optioncode),
      "Trade": symbolLoad.map(d => d.optioncode),
      "Summary": symbolLoad.map(d => d.optioncode),
    }}))
    await wait(500);
    // process.exit()
  }
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

    client_redis.publish('cometOPT',JSON.stringify({"add":{
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
      "Underlying": symbolLoad,
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
