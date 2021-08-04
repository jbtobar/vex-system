/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const subber = redis.createClient();


const fixNum = (val) => {
  if (val === Infinity) return null;
  if (val === -Infinity) return null;
  if (isNaN(val)) return null;
  return Number(val)
}

subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    if (payload.eventSymbol?.charAt(0) === '.') {
      switch (channel) {
        case 'Greeks':
          query(
            `UPDATE opt_db set
              eventTimeG = ${fixNum(payload.eventTime)},
              gprice = ${fixNum(payload.price)},
              volatility = ${fixNum(payload.volatility)},
              delta = ${fixNum(payload.delta)},
              gamma = ${fixNum(payload.gamma)},
              theta = ${fixNum(payload.theta)},
              rho = ${fixNum(payload.rho)},
              vega = ${fixNum(payload.vega)}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          ).catch(err => console.error(e,channel, message))
          break;
        case 'Quote':
          query(
            `UPDATE opt_db set
              eventTimeQ = ${fixNum(payload.eventTime)},
              bidTime = ${fixNum(payload.bidTime)},
              bidExchangeCode = '${payload.bidExchangeCode}',
              bidPrice = ${fixNum(payload.bidPrice)},
              bidSize = ${fixNum(payload.bidSize)},
              askTime = ${fixNum(payload.askTime)},
              askExchangeCode = '${payload.askExchangeCode}',
              askPrice = ${fixNum(payload.askPrice)},
              askSize = ${fixNum(payload.askSize)}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          ).catch(err => console.error(e,channel, message))
          break;
        case 'Trade':
          query(
            `UPDATE opt_db set
              eventTimeT = ${fixNum(payload.eventTime)},
              price = ${fixNum(payload.price)},
              change = ${fixNum(payload.change)},
              size = ${fixNum(payload.size)},
              dayVolume = ${fixNum(payload.dayVolume)},
              dayTurnover = ${fixNum(payload.dayTurnover)},
              tickDirection = ${fixNum(payload.tickDirection)},
              extendedTradingHours = ${payload.extendedTradingHours}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          ).catch(err => console.error(e,channel, message))
          break;
        case 'Summary':
          query(
            `UPDATE opt_db set
              eventTimeS = ${fixNum(payload.eventTime)},
              dayId = ${fixNum(payload.dayId)},
              dayOpenPrice = ${fixNum(payload.dayOpenPrice)},
              dayHighPrice = ${fixNum(payload.dayHighPrice)},
              dayLowPrice = ${fixNum(payload.dayLowPrice)},
              dayClosePrice = ${fixNum(payload.dayClosePrice)},
              dayClosePriceType = '${payload.dayClosePriceType}',
              prevDayId = ${fixNum(payload.prevDayId)},
              prevDayClosePrice = ${fixNum(payload.prevDayClosePrice)},
              prevDayClosePriceType = '${payload.prevDayClosePriceType}',
              prevDayVolume = ${fixNum(payload.prevDayVolume)},
              openInterest = ${fixNum(payload.openInterest)}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          ).catch(err => console.error(e,channel, message))
          break;
        default:

      }
    }
  } catch (e) {
    console.error(e,channel, message)
  }
})
subber.subscribe('TASER')
subber.subscribe('TASERFUT')
subber.subscribe('Trade')
subber.subscribe('Greeks')
subber.subscribe('Summary')
subber.subscribe('Quote')

// ALTER TABLE opt_db add column eventTimeG bigint;
// ALTER TABLE opt_db add column gprice real;
// ALTER TABLE opt_db add column volatility real;
// ALTER TABLE opt_db add column delta real;
// ALTER TABLE opt_db add column gamma real;
// ALTER TABLE opt_db add column theta real;
// ALTER TABLE opt_db add column rho real;
// ALTER TABLE opt_db add column vega real;
// ALTER TABLE opt_db add column eventTimeQ bigint;
// ALTER TABLE opt_db add column bidTime bigint;
// ALTER TABLE opt_db add column bidExchangeCode varchar;
// ALTER TABLE opt_db add column bidPrice real;
// ALTER TABLE opt_db add column bidSize bigint;
// ALTER TABLE opt_db add column askTime bigint;
// ALTER TABLE opt_db add column askExchangeCode varchar;
// ALTER TABLE opt_db add column askPrice real;
// ALTER TABLE opt_db add column askSize bigint;
// ALTER TABLE opt_db add column eventTimeT bigint;
// ALTER TABLE opt_db add column price real;
// ALTER TABLE opt_db add column change real;
// ALTER TABLE opt_db add column size bigint;
// ALTER TABLE opt_db add column dayVolume  bigint;
// ALTER TABLE opt_db add column dayTurnover real;
// ALTER TABLE opt_db add column tickDirection varchar;
// ALTER TABLE opt_db add column extendedTradingHours boolean;
// ALTER TABLE opt_db add column eventTimeS bigint;
// ALTER TABLE opt_db add column dayId smallint;
// ALTER TABLE opt_db add column dayOpenPrice real;
// ALTER TABLE opt_db add column dayHighPrice real;
// ALTER TABLE opt_db add column dayLowPrice real;
// ALTER TABLE opt_db add column dayClosePrice real;
// ALTER TABLE opt_db add column dayClosePriceType varchar;
// ALTER TABLE opt_db add column prevDayId smallint;
// ALTER TABLE opt_db add column prevDayClosePrice real;
// ALTER TABLE opt_db add column prevDayClosePriceType varchar;
// ALTER TABLE opt_db add column prevDayVolume bigint;
// ALTER TABLE opt_db add column openInterest bigint;

// subber.subscribe('Underlying')
// subber.subscribe('Series')
