/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('./db');

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const subbed = {}


const yesterday5PM = () => Math.floor(new Date().getTime()/8.64e7)*8.64e7+ 1000*60*60*4
// new Date(
//   Math.floor(new Date().getTime()/8.64e7)*8.64e7+ 1000*60*60*4
// ).toLocaleString("en-US", {timeZone: "America/New_York"})


const subCommand = async () => {
  console.log(`subbing TASFUT ${timenow()}`)
  const optioncodes = (
    await query({
      text: `SELECT optioncode from futchainx;`,
      rowMode: 'array',
    })
  ).rows.map(d => d[0]).filter(d => !subbed[d])
  console.log(optioncodes.length,optioncodes[0])

  // let timeId = yesterday5PM()
  let timeId = 1626379000213
  console.log({timeId})
  // let lastTrade = Number((await query(`SELECT MAX(time) from tasc_fut;`)).rows[0].max)
  // console.log({lastTrade})
  // if (lastTrade > timeId) {
  //   timeId = lastTrade
  // }

  while (optioncodes.length > 0) {
    const symbolLoad = optioncodes.splice(0,2500)
    symbolLoad.forEach((item, i) => {
      subbed[item] = true
    });

    client_redis.publish('cometTASFUT',JSON.stringify({"addTimeSeries":{
      "TimeAndSale": symbolLoad.map(d => ({"eventSymbol":d,"fromTime":timeId})),
    }}))
    await wait(500);
    // process.exit()
  }
  console.log('done')
}

subCommand()
setInterval(() => {
  subCommand()
},1000*60*10)
