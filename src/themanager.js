/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const schedule = require('node-schedule');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { query } = require('../db')

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function theManager() {
  try {

    console.log(`Starting theManager - ${timenow()}`)


    await query(`INSERT INTO tasc_hist (SELECT * FROM tasc);`)
    await query(`TRUNCATE TABLE tasc;`)


    await exec('pm2 restart tokenRefresh')
    await wait(5000)


    await exec('pm2 restart master')
    await wait(5000)
    await exec('pm2 restart commander')
    await wait(5000)


    await exec('pm2 restart masterUND')
    await wait(5000)
    await exec('pm2 restart commanderUND')
    await wait(5000)


    await wait(1000*60*30)


    await exec('pm2 restart flowMaker')
    await wait(5000)
    await exec('pm2 restart masterTAS')
    await wait(5000)
    await exec('pm2 restart commanderTAS')

    console.log(`Done: theManager - ${timenow()}`)
  } catch (e) {
    console.error(e)
    console.error(`Error: theManager - ${timenow()}`)
  }
}

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = 2;
rule.minute = 0;
rule.tz = 'America/New_York';
schedule.scheduleJob(rule,theManager)
