/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const schedule = require('node-schedule');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function theManager() {
  try {

    console.log(`Starting theManager FUT - ${timenow()}`)

    await wait(5000)
    await exec('pm2 restart masterFUT')
    await wait(5000)
    await exec('pm2 restart commanderFUT')



    await wait(5000)
    await exec('pm2 restart masterUNDFUT')
    await wait(5000)
    await exec('pm2 restart commanderUNDFUT')


    await wait(1000*60*10)


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
theManager()
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = 2;
rule.minute = 0;
rule.tz = 'America/New_York';
schedule.scheduleJob(rule,theManager)
