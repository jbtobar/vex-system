/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const { get } = require('../redis');
const { CHANNEL_DATA_LENGTHS,DATA_CHANNEL,TIME_SERIES_CHANNEL,SUBSCRIPTION_CHANNEL } = require('../comet/constants')
const publisher = redis.createClient();

const fixNum = (val) => {
  if (val === Infinity) return null;
  if (val === -Infinity) return null;
  if (isNaN(val)) return null;
  return Number(val)
}

let totalM = 0
let time = 0
let dayid = 0
setInterval(async () => {
  dayid = Number(await get('FUTS_DAYID'))
  console.log(`M:${totalM}, MT:${new Date(time).toLocaleString("en-US", {timeZone: "America/New_York"})}, NOW:${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})} `)
},5000)
publisher.on('message', async (channel, message) => {
  const payload = JSON.parse(message)
  let queryText = ``
  totalM+=1
  time =  new Date().getTime()
  while (payload.length > 0) {
    let item = payload.splice(0,CHANNEL_DATA_LENGTHS['Series']);
    // item = item.map(d fixNum=> d === 'NaN' || d === '\x00' ? null : d)
    // queryText+=`INSERT INTO seriesC(
    //   eventsymbol,
    //   time,
    //   expiration,
    //   volatility,
    //   callvolume,
    //   putvolume,
    //   putcallratio,
    //   forwardprice,
    //   dividend,
    //   interest,
    //   optionvolume,
    //   dayid
    // ) VALUES (
    //   '${item[0]}'::varchar,
    //   ${item[4]}::bigint,
    //   ${item[6]}::smallint,
    //   ${item[7]}::real,
    //   ${item[8]}::int,
    //   ${item[9]}::int,
    //   ${item[10]}::real,
    //   ${item[11]}::real,
    //   ${item[12]}::real,
    //   ${item[13]}::real,
    //   ${item[14]}::bigint,
    //   ${dayid}::smallint
    // );
    // `
    queryText+=`INSERT INTO series(
      eventsymbol,
      time,
      expiration,
      volatility,
      callvolume,
      putvolume,
      putcallratio,
      forwardprice,
      dividend,
      interest,
      optionvolume,
      dayid
    ) VALUES (
      '${item[0]}'::varchar,
      ${fixNum(item[4])}::bigint,
      ${fixNum(item[6])}::smallint,
      ${fixNum(item[7])}::real,
      ${fixNum(item[8])}::int,
      ${fixNum(item[9])}::int,
      ${fixNum(item[10])}::real,
      ${fixNum(item[11])}::real,
      ${fixNum(item[12])}::real,
      ${fixNum(item[13])}::real,
      ${fixNum(item[14])}::bigint,
      ${fixNum(dayid)}::smallint
    ) ON CONFLICT(eventsymbol,expiration,dayid) DO UPDATE SET
    time = EXCLUDED.time,
    volatility = EXCLUDED.volatility,
    callvolume = EXCLUDED.callvolume,
    putvolume = EXCLUDED.putvolume,
    putcallratio = EXCLUDED.putcallratio,
    forwardprice = EXCLUDED.forwardprice,
    dividend = EXCLUDED.dividend,
    interest = EXCLUDED.interest,
    optionvolume = EXCLUDED.optionvolume;
    `
  }
  try {
    await query(queryText)
  } catch(err) {
    console.log(queryText)
    console.error(err)
  }
});

(async () => {
  dayid = Number(await get('FUTS_DAYID'))
  console.log({dayid})
  publisher.subscribe('Series_UND');
  // publisher.subscribe('Greeks_OPT')
  console.log('passallUND - Series_UND')
})();

// publisher.subscribe('Quote_OPT');
// publisher.subscribe('Trade_OPT');
