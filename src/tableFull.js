/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { query } = require('../db');
const { set,sadd } = require('../redis');

const queryMaker = (interval) => {
  const ts = new Date().getTime();
  const minus = {
    H1:ts-1000*60*60,
    M30:ts-1000*60*30,
    M15:ts-1000*60*15,
    M10:ts-1000*60*10,
    M5:ts-1000*60*5,
  }
  // const ts = 1625860833239
  let whereText = ``
  // if (interval === 'H1') whereText = `WHERE time > ${ts-1000*60*60}`
  // if (interval === 'M30') whereText = `WHERE time > ${ts-1000*60*30}`
  // if (interval === 'M15') whereText = `WHERE time > ${ts-1000*60*15}`
  // if (interval === 'M10') whereText = `WHERE time > ${ts-1000*60*10}`
  // if (interval === 'M5') whereText = `WHERE time > ${ts-1000*60*5}`
  return `SELECT
    rootsymbol as symbol,
    (CASE
      when time > ${minus.H1} then 'H1'
      when time > ${minus.M30} then 'M30'
      when time > ${minus.M15} then 'M15'
      when time > ${minus.M10} then 'M10'
      when time > ${minus.M5} then 'M5'
      else 'all'
      end
    ) as interval,
    SUM(size*price*100) as value,
    SUM(CASE flag WHEN 'C' THEN size ELSE 0 END) AS callvolume,
    SUM(CASE flag WHEN 'P' THEN size ELSE 0 END) AS putvolume,
    SUM(size) as optionvolume,
    SUM(
      CASE WHEN (flag = 'C' AND aggressorside = 'BUY') OR (flag = 'P' AND aggressorside = 'SELL') THEN size*price*100 ELSE 0 END
    ) AS bullflow,
    SUM(
      CASE WHEN (flag = 'P' AND aggressorside = 'BUY') OR (flag = 'C' AND aggressorside = 'SELL') THEN size*price*100 ELSE 0 END
    ) AS bearflow,
    SUM(
      CASE WHEN (flag = 'C' AND aggressorside = 'BUY') THEN size*price*100 ELSE 0 END
    ) AS valuebuyc,
    SUM(
      CASE WHEN (flag = 'C' AND aggressorside = 'SELL') THEN size*price*100 ELSE 0 END
    ) AS valuesellc,
    SUM(
      CASE WHEN (flag = 'P' AND aggressorside = 'BUY') THEN size*price*100 ELSE 0 END
    ) AS valuebuyp,
    SUM(
      CASE WHEN (flag = 'P' AND aggressorside = 'SELL') THEN size*price*100 ELSE 0 END
    ) AS valuesellp
  FROM tasc group by rootsymbol,interval;`
}


const getTable = async () => {
  const startTime = new Date().getTime()

  const {rows,fields} = (await query({
    text:queryMaker(''),
    rowMode:'array'
  }))
  // const data = await (await query({
  //   text:'SELECT * FROM tasc;',
  //   rowMode:'array'
  // }))

  const duration = new Date().getTime() - startTime

  console.log(`Duration: ${duration}`)
  if (duration < 1000) {
    setTimeout(() => {
      getTable()
    },1000-duration)
  } else getTable()


}

getTable()
