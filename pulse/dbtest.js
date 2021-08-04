/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const subber = redis.createClient();



subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    if (payload.eventSymbol?.charAt(0) === '.') {
      switch (channel) {
        case 'Greeks':
          query(
            `UPDATE opt_db set
              eventTimeG = ${payload.eventTime},
              gprice = ${payload.price},
              volatility = ${payload.volatility},
              delta = ${payload.delta},
              gamma = ${payload.gamma},
              theta = ${payload.theta},
              rho = ${payload.rho},
              vega = ${payload.vega}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          )
          break;
        case 'Quote':
          query(
            `UPDATE opt_db set
              eventTimeQ = ${payload.eventTime},
              bidTime = ${payload.bidTime},
              bidExchangeCode = '${payload.bidExchangeCode}',
              bidPrice = ${payload.bidPrice},
              bidSize = ${payload.bidSize},
              askTime = ${payload.askTime},
              askExchangeCode = '${payload.askExchangeCode}',
              askPrice = ${payload.askPrice},
              askSize = ${payload.askSize}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          )
          break;
        case 'Trade':
          query(
            `UPDATE opt_db set
              eventTimeT = ${payload.eventTime},
              price = ${payload.price},
              change = ${payload.change},
              size = ${payload.size},
              dayVolume = ${payload.dayVolume},
              dayTurnover = ${payload.dayTurnover},
              tickDirection = ${payload.tickDirection},
              extendedTradingHours = ${payload.extendedTradingHours}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          )
          break;
        case 'Summary':
          query(
            `UPDATE opt_db set
              eventTimeS = ${payload.eventTime},
              dayId = ${payload.dayId},
              dayOpenPrice = ${payload.dayOpenPrice},
              dayHighPrice = ${payload.dayHighPrice},
              dayLowPrice = ${payload.dayLowPrice},
              dayClosePrice = ${payload.dayClosePrice},
              dayClosePriceType = '${payload.dayClosePriceType}',
              prevDayId = ${payload.prevDayId},
              prevDayClosePrice = ${payload.prevDayClosePrice},
              prevDayClosePriceType = '${payload.prevDayClosePriceType}',
              prevDayVolume = ${payload.prevDayVolume},
              openInterest = ${payload.openInterest}
              WHERE optioncode = '${payload.eventSymbol}'
            `
          )
          break;
        default:

      }
    }
  } catch (e) {
    console.error(e)
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
