/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const schedule = require('node-schedule');
const logger = require('./logger')

const onceEveryTradingDay = (params) => {

  const { hour = 2, minute = 0, cb = () => {} } = params;

  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(1, 5)];
  rule.hour = hour;
  rule.minute = minute;
  rule.tz = 'America/New_York';

  schedule.scheduleJob(rule,cb)
}
const onceEveryTradingHour = (params) => {

  const { cb = () => {} } = params;

  const rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [new schedule.Range(1, 5)];
  rule.hour = [new schedule.Range(8, 16)];
  rule.minute = 0;
  rule.tz = 'America/New_York';

  schedule.scheduleJob(rule,cb)
}

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

module.exports = {
  logger,
  onceEveryTradingDay,
  onceEveryTradingHour,
  timenow
}
