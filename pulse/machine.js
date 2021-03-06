/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const util = require('util');
const schedule = require('node-schedule');
const exec = util.promisify(require('child_process').exec);
// const GET_ALL_FUTURES_AND_OPTIONS = require('../src/GET_ALL_FUTURES_AND_OPTIONS')
const { query } = require('../db');
const run = require('../utils/childrun');
const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// │ 0  │ cometOPT           │ fork     │ 257… │ online    │ 0%       │ 112.3mb  │
// │ 6  │ cometTAS           │ fork     │ 127… │ online    │ 0%       │ 88.2mb   │
// │ 3  │ cometTASFUT        │ fork     │ 8    │ online    │ 0%       │ 80.0mb   │
// │ 5  │ flowMaker          │ fork     │ 368  │ online    │ 0%       │ 880.6mb  │
// │ 2  │ flowMakerFUT       │ fork     │ 3    │ online    │ 0%       │ 131.7mb  │
// │ 1  │ publisherOPT       │ fork     │ 14   │ online    │ 0%       │ 640.7mb  │
// │ 7  │ publisherTAS       │ fork     │ 3    │ online    │ 0%       │ 405.4mb  │
// │ 4  │ publisherTASFUT    │ fork     │ 22   │ online    │ 0%       │ 75.5mb   │
// │ 9  │ server             │ fork     │ 7    │ online    │ 0%       │ 537.2mb  │
// │ 8  │ vex-pay            │ fork     │ 0    │ online    │ 0%       │ 60.7mb

const marketClose = async () => {
  try {
    await exec('pm2 stop cometOPT')
    await exec('pm2 stop cometTAS')
    await exec('pm2 stop cometTASFUT')
    await exec('pm2 stop flowMaker')
    await exec('pm2 stop flowMakerFUT')
    await exec('pm2 stop publisherOPT')
    await exec('pm2 stop publisherTAS')
    await exec('pm2 stop publisherTASFUT')
    await query(`INSERT INTO opt_db_hist (select * from opt_db);`)
    console.log(`pm2 stop all - ${timenow()}`)
  } catch (e) {
    console.error(`marketClose - ${timenow()}`,e)
  }
}

const optionsMarketOpen = async () => {
  try {
    let code = await run(`pulse/optionsdatareset.js`)
    console.log(`optionsdatareset - ${timenow()} - ${code}`)

    await exec('pm2 start cometTAS')
    console.log(`pm2 start cometTAS - ${timenow()}`)

    await wait(5000)

    await exec('pm2 start flowMaker')
    console.log(`pm2 start flowMaker - ${timenow()}`)

    await wait(1000)
    await query(`DELETE FROM opt_db where substring(optioncode,1,2) != './'`)
    await exec('pm2 start publisherTAS')
    console.log(`pm2 start publisherTAS - ${timenow()}`)


    await wait(30000)

    await exec('pm2 restart cometOPT')
    console.log(`pm2 restart cometOPT - ${timenow()}`)

    await exec('pm2 restart publisherOPT')
    console.log(`pm2 restart publisherOPT - ${timenow()}`)




  } catch (e) {
    console.error(`optionsMarketOpen - ${timenow()}`,e)
  }
}

const futuresMarketOpen = async () => {
  try {
      let code = await run(`pulse/tokenReset.js`)
      console.log(`tokenReset - ${timenow()} - ${code}`)

      console.log(`getting  GET_ALL_FUTURES_AND_OPTIONS - ${timenow()}`)
      // await GET_ALL_FUTURES_AND_OPTIONS()
      code = await run(`pulse/futuresmanager.js`)
      console.log(`finished GET_ALL_FUTURES_AND_OPTIONS - ${timenow()}`)
      await query(`DELETE FROM opt_db where substring(optioncode,1,2) = './'`)
      await query(`insert into opt_db(optioncode,expirydate,strike,flag,rootsymbol) ( select optioncode,expirydate,strike,flag,rootsymbol from futchainx)`)
      console.log(`pruned opt_db - ${timenow()}`)


      console.log(`futuresmanager - ${timenow()} - ${code}`)

      await exec('pm2 start cometOPT')
      console.log(`pm2 start cometOPT - ${timenow()}`)

      await exec('pm2 start publisherOPT')
      console.log(`pm2 start publisherOPT - ${timenow()}`)

      await wait(30000)

      code = await run(`pulse/futuresdatareset.js`)
      console.log(`futuresdatareset - ${timenow()} - ${code}`)

      await exec('pm2 start cometTASFUT')
      console.log(`pm2 start cometTASFUT - ${timenow()}`)

      await wait(5000)

      await exec('pm2 start flowMakerFUT')
      console.log(`pm2 start flowMakerFUT - ${timenow()}`)

      await wait(1000)

      await exec('pm2 start publisherTASFUT')
      console.log(`pm2 start publisherTASFUT - ${timenow()}`)
  } catch (e) {
    console.error(`futuresMarketOpen - ${timenow()}`,e)
  }
}


const marketCloseRule = new schedule.RecurrenceRule();
marketCloseRule.dayOfWeek = [new schedule.Range(1, 5)];
marketCloseRule.hour = 17;
marketCloseRule.minute = 15;
marketCloseRule.tz = 'America/New_York';
schedule.scheduleJob(marketCloseRule,marketClose)

const futuresMarketOpenRule = new schedule.RecurrenceRule();
futuresMarketOpenRule.dayOfWeek = [new schedule.Range(1, 4)];
futuresMarketOpenRule.hour = 17;
futuresMarketOpenRule.minute = 30;
futuresMarketOpenRule.tz = 'America/New_York';
schedule.scheduleJob(futuresMarketOpenRule,futuresMarketOpen)


const futuresMarketOpenRuleSunday = new schedule.RecurrenceRule();
futuresMarketOpenRuleSunday.dayOfWeek = 0;
futuresMarketOpenRuleSunday.hour = 16;
futuresMarketOpenRuleSunday.minute = 0;
futuresMarketOpenRuleSunday.tz = 'America/New_York';
schedule.scheduleJob(futuresMarketOpenRuleSunday,futuresMarketOpen)


const optionsMarketOpenRule = new schedule.RecurrenceRule();
optionsMarketOpenRule.dayOfWeek = [new schedule.Range(1, 5)];
optionsMarketOpenRule.hour = 2;
optionsMarketOpenRule.minute = 0;
optionsMarketOpenRule.tz = 'America/New_York';
schedule.scheduleJob(optionsMarketOpenRule,optionsMarketOpen)

if (process.argv[2] === 'fmo') {
  console.log('fmo')
  futuresMarketOpen()
}
