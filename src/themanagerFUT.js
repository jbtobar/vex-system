/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const schedule = require('node-schedule');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { query } = require('../db');
const GET_ALL_FUTURES_AND_OPTIONS = require('./GET_ALL_FUTURES_AND_OPTIONS');

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function theManager() {
  try {

    console.log(`Starting theManager FUT - ${timenow()}`)
    await GET_ALL_FUTURES_AND_OPTIONS()
    console.log(`done: GET_ALL_FUTURES_AND_OPTIONS - ${timenow()}`)
    let count = ( await query('select count(*) from tasc_fut_hist;') ).rows[0]
    console.log(`tasc_fut_hist before -${count}`)
    await query(`INSERT INTO tasc_fut_hist (SELECT * FROM tasc_fut);`)
    await query(`TRUNCATE TABLE tasc_fut;`)
    count = ( await query('select count(*) from tasc_fut_hist;') ).rows[0]
    console.log(`tasc_fut_hist now -${count}`)

    await wait(5000)
    await exec('pm2 restart masterFUT')
    await wait(5000)
    await exec('pm2 restart commanderFUT')



    await wait(5000)
    await exec('pm2 restart masterUNDFUT')
    await wait(5000)
    await exec('pm2 restart commanderUNDFUT')


    await wait(1000*60*10)


    await exec('pm2 restart flowMakerFUT')
    await wait(5000)
    await exec('pm2 restart masterTASFUT')
    await wait(5000)
    await exec('pm2 restart commanderTASFUT')

    console.log(`Done: theManager FUT - ${timenow()}`)
  } catch (e) {
    console.error(e)
    console.error(`Error: theManager FUT - ${timenow()}`)
  }
}
// theManager()
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 4)];
rule.hour = 5;
rule.minute = 0;
rule.tz = 'America/New_York';
schedule.scheduleJob(rule,theManager)
