/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const subber = redis.createClient();
const client_redis = redis.createClient();

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

let didUpdateOI = false;
const timeIs5AM = () => {
  if (didUpdateOI) return false;
  return new Date().getHours() === 9
}


const fixNum = (val) => {
  if (val === Infinity) return null;
  if (val === -Infinity) return null;
  if (val === null) return null;
  if (val === false) return null;
  if (val === undefined) return null;
  if (isNaN(val)) return null;
  const num = Number(val)
  if (Math.abs(Number(Math.abs(num).countDecimals())) > 6)  {
    // console.log('jjj',val)
    return Number(num.toFixed(6))
  }
  // const dec = num.toString().split('.')[1]
  // if (dec && (dec.includes('e') || dec.length > 6)) {
  //   return num.toFixed(6)
  // }
  // if (num.toString().length > 15) console.log(num)
  if (num.toString().includes('e')) console.log(num)
  // if (num > 0 && num < 0.00000001) return num.toFixed(6)
  // return num.toFixed(6)
  return num
}

const calculateGXOI = (symbol,data) => {
  client_redis.hmget(symbol,'openInterest',(err,res) => {
    if (!err) {
      const openInterest = fixNum(res[0])
      client_redis.hmset(symbol,{
        gxoi:openInterest*data.gamma,
        vxoi:openInterest*data.vega,
        dxoi:openInterest*data.delta,
        txoi:openInterest*data.theta
      })
    } else console.error(err)
  })
}

Number.prototype.countDecimals = function () {

    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;

    var str = this.toString();
    if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
        return str.split("-")[1] || 0;
    } else if (str.indexOf(".") !== -1) {
        return str.split(".")[1].length || 0;
    }
    return str.split("-")[1] || 0;
}

// let queryText = ''
//
// const queryAppend = (q) => {
//   queryText+=`;${q}`
// }
let contracts = {}

const queryInsert = async () => {

  let queryText = ''
  const contractsCopy = {...contracts}
  try {

    contracts = {}
    // UPDATE opt_db set
    // //     eventTimeG = ${fixNum(payload.eventTime)},
    // //     theo = ${fixNum(payload.theo)},
    // //     volatility = ${fixNum(payload.volatility)},
    // //     delta = ${fixNum(payload.delta)},
    // //     gamma = ${fixNum(payload.gamma)},
    // //     theta = ${fixNum(payload.theta)},
    // //     rho = ${fixNum(payload.rho)},
    // //     vega = ${fixNum(payload.vega)}
    // //     WHERE optioncode = '${payload.eventSymbol}'
    Object.keys(contractsCopy).forEach((k) => {
      queryText+=`UPDATE opt_db set `
      Object.keys(contractsCopy[k]).forEach((c,i) => {
        const value = contractsCopy[k][c]
        if (i === 0) {
          switch (c) {
            case 'bidExchangeCode':
            case 'askExchangeCode':
            case 'dayClosePriceType':
            case 'prevDayClosePriceType':
              queryText+=`${c} = '${value}' `
              break;
            case 'theo':
            case 'volatility':
            case 'delta':
            case 'gamma':
            case 'theta':
            case 'rho':
            case 'vega':
            case 'bidprice':
            case 'askprice':
            case 'price':
            case 'change':
            case 'dayturnover':
            case 'dayopenprice':
            case 'dayhighprice':
            case 'daylowprice':
            case 'daycloseprice':
            case 'prevdaycloseprice':
            case 'changepct':
              queryText+=`${c} = ${value}::real `
              break;
          default:
              queryText+=`${c} = ${value} `

          }
        } else {
          switch (c) {
            case 'bidExchangeCode':
            case 'askExchangeCode':
            case 'dayClosePriceType':
            case 'prevDayClosePriceType':
              queryText+=`, ${c} = '${value}' `
              break;
            case 'theo':
            case 'volatility':
            case 'delta':
            case 'gamma':
            case 'theta':
            case 'rho':
            case 'vega':
            case 'bidprice':
            case 'askprice':
            case 'price':
            case 'change':
            case 'dayturnover':
            case 'dayopenprice':
            case 'dayhighprice':
            case 'daylowprice':
            case 'daycloseprice':
            case 'prevdaycloseprice':
            case 'changepct':
              queryText+=`, ${c} = ${value}::real `
              break;
            default:
              queryText+=`, ${c} = ${value} `

          }
        }
      });
      queryText+=` WHERE optioncode = '${k}'; `
    });


    if (queryText) {
      const timeStart = new Date().getTime();
      // if (timeIs5AM()) {
      //   await query(`UPDATE opt_db
      //   SET prevvol = opt_db_hist.volatility,
      //     prevoi = opt_db_hist.openInterest
      //   FROM opt_db_hist
      //   WHERE opt_db_hist.optioncode = opt_db.optioncode
      //   AND opt_db_hist.dayid = (select max(dayid) from opt_db);`)
      //   didUpdateOI = true;
      //   console.log(`Updated OI :: ${timenow()}`)
      // }
      // await query('BEGIN')
      await query(queryText)
      // await query('COMMIT')
      console.log( new Date().getTime()- timeStart)
      queryInsert()
    } else {
      setTimeout(() => {
        queryInsert()
      },100)
    }
  } catch (e) {

    console.error('queryText',e)
    // console.log(contractsCopy)
  }
}
queryInsert()



const cleanString = (val) => {
  if (val.toString() === '\x00') return null;
  return val
}


subber.on('message', (channel, message) => {
  try {
    const payload = JSON.parse(message)
    if (payload.eventSymbol?.charAt(0) === '.') {
      // console.log(payload)
      // if (payload.eventSymbol === './EW1Q21P4385:XCME') {
      //   console.log(payload)
      // }
      const { eventSymbol } = payload;
      if (!contracts[eventSymbol]) {
        contracts[eventSymbol] = {}
      }
      switch (channel) {
        case 'Custom':

          contracts[eventSymbol].value = fixNum(payload.value)
          contracts[eventSymbol].volm = fixNum(payload.volm)
          contracts[eventSymbol].count = fixNum(payload.count)
          contracts[eventSymbol].valuebuy = fixNum(payload.valuebuy)
          contracts[eventSymbol].volmbuy = fixNum(payload.volmbuy)
          contracts[eventSymbol].countbuy = fixNum(payload.countbuy)
          contracts[eventSymbol].valuebs = fixNum(payload.valuebs)
          contracts[eventSymbol].volmbs = fixNum(payload.volmbs)
          contracts[eventSymbol].countbs = fixNum(payload.countbs)
          contracts[eventSymbol].valuesell = fixNum(payload.valuesell)
          contracts[eventSymbol].volmsell = fixNum(payload.volmsell)
          contracts[eventSymbol].countsell = fixNum(payload.countsell)
          contracts[eventSymbol].valuebs = fixNum(payload.valuebs)
          contracts[eventSymbol].volmbs = fixNum(payload.volmbs)
          contracts[eventSymbol].countbs = fixNum(payload.countbs)
          contracts[eventSymbol].valueund = fixNum(payload.valueund)
          contracts[eventSymbol].volmund = fixNum(payload.volmund)
          contracts[eventSymbol].countund = fixNum(payload.countund)

          break;
        case 'Greeks':

          contracts[eventSymbol].eventTimeG = fixNum(payload.eventTime)
          contracts[eventSymbol].theo = fixNum(payload.theo)
          contracts[eventSymbol].volatility = fixNum(payload.volatility)
          contracts[eventSymbol].delta = fixNum(payload.delta)
          contracts[eventSymbol].gamma = fixNum(payload.gamma)
          contracts[eventSymbol].theta = fixNum(payload.theta)
          contracts[eventSymbol].rho = fixNum(payload.rho)
          contracts[eventSymbol].vega = fixNum(payload.vega)
          calculateGXOI(eventSymbol,{
            ...contracts[eventSymbol]
          })
          // queryAppend(
          //   `UPDATE opt_db set
          //     eventTimeG = ${fixNum(payload.eventTime)},
          //     theo = ${fixNum(payload.theo)},
          //     volatility = ${fixNum(payload.volatility)},
          //     delta = ${fixNum(payload.delta)},
          //     gamma = ${fixNum(payload.gamma)},
          //     theta = ${fixNum(payload.theta)},
          //     rho = ${fixNum(payload.rho)},
          //     vega = ${fixNum(payload.vega)}
          //     WHERE optioncode = '${payload.eventSymbol}'
          //   `
          // )
          // .catch(e => console.error(e,channel, message,`UPDATE opt_db set
          //   eventTimeG = ${fixNum(payload.eventTime)},
          //   gprice = ${fixNum(payload.price)},
          //   volatility = ${fixNum(payload.volatility)},
          //   delta = ${fixNum(payload.delta)},
          //   gamma = ${fixNum(payload.gamma)},
          //   theta = ${fixNum(payload.theta)},
          //   rho = ${fixNum(payload.rho)},
          //   vega = ${fixNum(payload.vega)}
          //   WHERE optioncode = '${payload.eventSymbol}'
          // `))
          break;
        case 'Quote':
          contracts[eventSymbol].eventTimeQ = fixNum(payload.eventTime)
          contracts[eventSymbol].bidTime = fixNum(payload.bidTime)
          contracts[eventSymbol].bidExchangeCode = cleanString(payload.bidExchangeCode)
          contracts[eventSymbol].bidPrice = fixNum(payload.bidPrice)
          contracts[eventSymbol].bidSize = fixNum(payload.bidSize)
          contracts[eventSymbol].askTime = fixNum(payload.askTime)
          contracts[eventSymbol].askExchangeCode = cleanString(payload.askExchangeCode)
          contracts[eventSymbol].askPrice = fixNum(payload.askPrice)
          contracts[eventSymbol].askSize = fixNum(payload.askSize)
          // queryAppend(
          //   `UPDATE opt_db set
          //     eventTimeQ = ${fixNum(payload.eventTime)},
          //     bidTime = ${fixNum(payload.bidTime)},
          //     bidExchangeCode = '${cleanString(payload.bidExchangeCode)}',
          //     bidPrice = ${fixNum(payload.bidPrice)},
          //     bidSize = ${fixNum(payload.bidSize)},
          //     askTime = ${fixNum(payload.askTime)},
          //     askExchangeCode = '${cleanString(payload.askExchangeCode)}',
          //     askPrice = ${fixNum(payload.askPrice)},
          //     askSize = ${fixNum(payload.askSize)}
          //     WHERE optioncode = '${payload.eventSymbol}'
          //   `
          // )
          // .catch(e => console.error(e,channel, message,`UPDATE opt_db set
          //   eventTimeQ = ${fixNum(payload.eventTime)},
          //   bidTime = ${fixNum(payload.bidTime)},
          //   bidExchangeCode = '${payload.bidExchangeCode}',
          //   bidPrice = ${fixNum(payload.bidPrice)},
          //   bidSize = ${fixNum(payload.bidSize)},
          //   askTime = ${fixNum(payload.askTime)},
          //   askExchangeCode = '${payload.askExchangeCode}',
          //   askPrice = ${fixNum(payload.askPrice)},
          //   askSize = ${fixNum(payload.askSize)}
          //   WHERE optioncode = '${payload.eventSymbol}'
          // `))
          break;
        case 'Trade':
          contracts[eventSymbol].eventTimeT = fixNum(payload.eventTime)
          contracts[eventSymbol].price = fixNum(payload.price)
          contracts[eventSymbol].change = fixNum(payload.change)
          contracts[eventSymbol].size = fixNum(payload.size)
          contracts[eventSymbol].dayVolume = fixNum(payload.dayVolume)
          contracts[eventSymbol].dayTurnover = fixNum(payload.dayTurnover)
          contracts[eventSymbol].tickDirection = fixNum(payload.tickDirection)
          contracts[eventSymbol].extendedTradingHours = payload.extendedTradingHours
          contracts[eventSymbol].changePct = fixNum(payload.changePct)
          // queryAppend(
          //   `UPDATE opt_db set
          //     eventTimeT = ${fixNum(payload.eventTime)},
          //     price = ${fixNum(payload.price)},
          //     change = ${fixNum(payload.change)},
          //     size = ${fixNum(payload.size)},
          //     dayVolume = ${fixNum(payload.dayVolume)},
          //     dayTurnover = ${fixNum(payload.dayTurnover)},
          //     tickDirection = ${fixNum(payload.tickDirection)},
          //     extendedTradingHours = ${payload.extendedTradingHours},
          //     changePct = ${fixNum(payload.changePct)}
          //     WHERE optioncode = '${payload.eventSymbol}'
          //   `
          // )
          // .catch(e => console.error(e,channel, message,`UPDATE opt_db set
          //   eventTimeT = ${fixNum(payload.eventTime)},
          //   price = ${fixNum(payload.price)},
          //   change = ${fixNum(payload.change)},
          //   size = ${fixNum(payload.size)},
          //   dayVolume = ${fixNum(payload.dayVolume)},
          //   dayTurnover = ${fixNum(payload.dayTurnover)},
          //   tickDirection = ${fixNum(payload.tickDirection)},
          //   extendedTradingHours = ${payload.extendedTradingHours}
          //   WHERE optioncode = '${payload.eventSymbol}'
          // `))
          break;
        case 'Summary':
          contracts[eventSymbol].eventTimeS = fixNum(payload.eventTime)
          contracts[eventSymbol].dayId = fixNum(payload.dayId)
          contracts[eventSymbol].dayOpenPrice = fixNum(payload.dayOpenPrice)
          contracts[eventSymbol].dayHighPrice = fixNum(payload.dayHighPrice)
          contracts[eventSymbol].dayLowPrice = fixNum(payload.dayLowPrice)
          contracts[eventSymbol].dayClosePrice = fixNum(payload.dayClosePrice)
          contracts[eventSymbol].dayClosePriceType = cleanString(payload.dayClosePriceType)
          contracts[eventSymbol].prevDayId = fixNum(payload.prevDayId)
          contracts[eventSymbol].prevDayClosePrice = fixNum(payload.prevDayClosePrice)
          contracts[eventSymbol].prevDayClosePriceType = cleanString(payload.prevDayClosePriceType)
          contracts[eventSymbol].prevDayVolume = fixNum(payload.prevDayVolume)
          contracts[eventSymbol].openInterest = fixNum(payload.openInterest)
          // queryAppend(
          //   `UPDATE opt_db set
          //     eventTimeS = ${fixNum(payload.eventTime)},
          //     dayId = ${fixNum(payload.dayId)},
          //     dayOpenPrice = ${fixNum(payload.dayOpenPrice)},
          //     dayHighPrice = ${fixNum(payload.dayHighPrice)},
          //     dayLowPrice = ${fixNum(payload.dayLowPrice)},
          //     dayClosePrice = ${fixNum(payload.dayClosePrice)},
          //     dayClosePriceType = '${cleanString(payload.dayClosePriceType)}',
          //     prevDayId = ${fixNum(payload.prevDayId)},
          //     prevDayClosePrice = ${fixNum(payload.prevDayClosePrice)},
          //     prevDayClosePriceType = '${cleanString(payload.prevDayClosePriceType)}',
          //     prevDayVolume = ${fixNum(payload.prevDayVolume)},
          //     openInterest = ${fixNum(payload.openInterest)}
          //     WHERE optioncode = '${payload.eventSymbol}'
          //   `
          // )
          // .catch(e => console.error(e,channel, message,`UPDATE opt_db set
          //   eventTimeS = ${fixNum(payload.eventTime)},
          //   dayId = ${fixNum(payload.dayId)},
          //   dayOpenPrice = ${fixNum(payload.dayOpenPrice)},
          //   dayHighPrice = ${fixNum(payload.dayHighPrice)},
          //   dayLowPrice = ${fixNum(payload.dayLowPrice)},
          //   dayClosePrice = ${fixNum(payload.dayClosePrice)},
          //   dayClosePriceType = '${payload.dayClosePriceType}',
          //   prevDayId = ${fixNum(payload.prevDayId)},
          //   prevDayClosePrice = ${fixNum(payload.prevDayClosePrice)},
          //   prevDayClosePriceType = '${payload.prevDayClosePriceType}',
          //   prevDayVolume = ${fixNum(payload.prevDayVolume)},
          //   openInterest = ${fixNum(payload.openInterest)}
          //   WHERE optioncode = '${payload.eventSymbol}'
          // `))
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
subber.subscribe('Custom')
//
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
// ALTER TABLE opt_db add column rootsymbol varchar;
// ALTER TABLE opt_db add column changePct real;


// ALTER TABLE opt_db_hist add column value real;
// ALTER TABLE opt_db_hist add column volm bigint;
// ALTER TABLE opt_db_hist add column count int;
// ALTER TABLE opt_db_hist add column valuebuy real;
// ALTER TABLE opt_db_hist add column volmbuy bigint;
// ALTER TABLE opt_db_hist add column countbuy int;
// ALTER TABLE opt_db_hist add column valuebs real;
// ALTER TABLE opt_db_hist add column volmbs bigint;
// ALTER TABLE opt_db_hist add column countbs int;
// ALTER TABLE opt_db_hist add column valuesell real;
// ALTER TABLE opt_db_hist add column volmsell bigint;
// ALTER TABLE opt_db_hist add column countsell int;
// ALTER TABLE opt_db_hist add column valuebs real;
// ALTER TABLE opt_db_hist add column volmbs bigint;
// ALTER TABLE opt_db_hist add column countbs int;
// ALTER TABLE opt_db_hist add column valueund real;
// ALTER TABLE opt_db_hist add column volmund bigint;
// ALTER TABLE opt_db_hist add column countund int;

// ALTER TABLE opt_db add column dxoi real GENERATED ALWAYS AS (delta*openInterest*100) STORED;
// ALTER TABLE opt_db add column gxoi real GENERATED ALWAYS AS (gamma*openInterest*100) STORED;
// ALTER TABLE opt_db add column vxoi real GENERATED ALWAYS AS (vega*openInterest*100) STORED;
// ALTER TABLE opt_db add column txoi real GENERATED ALWAYS AS (theta*openInterest*100) STORED;
//
// ALTER TABLE opt_db_hist add column dxoi real;
// ALTER TABLE opt_db_hist add column gxoi real;
// ALTER TABLE opt_db_hist add column vxoi real;
// ALTER TABLE opt_db_hist add column txoi real;

// ALTER TABLE opt_db ADD CONSTRAINT optionix UNIQUE (optioncode);
// ALTER TABLE opt_db
// DROP CONSTRAINT optionix;

// subber.subscribe('Underlying')
// subber.subscribe('Series')
