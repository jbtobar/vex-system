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

const subbed = {}
const subbbedUND = {}

const subCommand = async () => {
  const timeStart = new Date().getTime();
  console.log(`subbing ${timenow()}`)
  const codes = (
    await query({
      text: `SELECT symbol from ipf_opt;`,
      rowMode: 'array',
    })
  ).rows.map(d => d[0]).filter(d => !subbed[d])
  console.log(codes.length,codes[0])

  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,2000)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
    });

    client_redis.publish('CometPub',JSON.stringify({"add":{
      "Greeks": symbolLoad,
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
    }}))
    await wait(500);
    // process.exit()
  }

  codes = (
    await query({
      text: `SELECT distinct symbol from ipf_opt;`,
      rowMode: 'array',
    })
  ).rows.map(d => d[0]).filter(d => !subbed[d])
  console.log(codes.length,codes[0])


  while (codes.length > 0) {
    const symbolLoad = codes.splice(0,2000)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
    });

    client_redis.publish('cometOPT',JSON.stringify({"add":{
      "Quote": symbolLoad,
      "Trade": symbolLoad,
      "Summary": symbolLoad,
    }}))
    await wait(500);
    // process.exit()
  }


  console.log(`done - Duration: ${new Date().getTime() - timeStart}`)
}

subCommand()
setInterval(() => {
  subCommand()
},1000*60*10)
