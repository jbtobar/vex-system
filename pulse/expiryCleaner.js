/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client = redis.createClient();
const { query } = require('../db');







const storeChains = (codes) => {
  const startTime = new Date().getTime()
  return new Promise((resolve, reject) => {
    const underlyings = [...new Set(codes.map(d => d.underlying))]

    var batch = client.batch();

    for (var i = 0; i < underlyings.length; i++) {
      const contracts = codes.filter(d => d.underlying === underlyings[i])
      const expirations = [...new Set(contracts.map(d => d.expiration))].sort((a,b) => new Date(a) - new Date(b))
      batch.del(`${underlyings[i]}_EXP`)
      for (var j = 0; j < expirations.length; j++) {
        batch.sadd(`${underlyings[i]}_EXP`,expirations[j])
        const expirycontracts = contracts.filter(d => d.expiration === expirations[j])
        const strikes = [...new Set(expirycontracts.map(d => d.strike))].sort((a,b) => Number(a) - Number(b))
        strikes.forEach((item) => {
          batch.sadd(`${underlyings[i]}_${expirations[j]}`,item)
          const strikecontracts = expirycontracts.filter(d => d.strike === item).map(d => d.optioncode).sort()
          strikecontracts.forEach((stk) => {
            batch.sadd(`${underlyings[i]}_${expirations[j]}_${item}`,stk)
          });

        });
      }
    }
    batch.exec((err, resp)=> {
      console.log(`Duration: ${new Date().getTime()-startTime}`)
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve()
    });
  });

  return ;
}










function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log(`expiryCleaner - start - ${timenow()}`)
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


  await storeChains(codes)



  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------




  codes = (
    await query(`SELECT symbol as optioncode,underlying,strike,expiration,mmy from ipf_opt;`)
  ).rows.filter(d => !subbed[d.optioncode])

  await storeChains(codes)



  console.log(`done - Duration: ${new Date().getTime() - timeStart}`)
  console.log(`---------------------------------------------------------------`)
  console.log(`\n`)
}

subCommand()
setInterval(() => {
  subCommand()
},1000*60*10)
