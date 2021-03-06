/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { query } = require('../db');
const { set,sadd } = require('../redis');

const queryMaker = (interval) => {
  const ts = new Date().getTime();
  // const ts = 1625860833239
  let whereText = ``
  if (interval === 'H1') whereText = `WHERE time > ${ts-1000*60*60}`
  if (interval === 'M30') whereText = `WHERE time > ${ts-1000*60*30}`
  if (interval === 'M15') whereText = `WHERE time > ${ts-1000*60*15}`
  if (interval === 'M10') whereText = `WHERE time > ${ts-1000*60*10}`
  if (interval === 'M5') whereText = `WHERE time > ${ts-1000*60*5}`
  return `SELECT
    rootsymbol as symbol,
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
  FROM tasc ${whereText} group by rootsymbol;`
}

const tables = {

}
// const categories = ['ALL','H1','M30','M15','M10','M5']
const categories = ['M30','M15','M10','M5']
// const getTable = async () => {
//   const startTime = new Date().getTime()
//   for (var i = 0; i < categories.length; i++) {
//     const item = categories[i]
//     const startTimeI = new Date().getTime()
//     // tables[item] = (await query(queryMaker(item))).rows
//     const {rows,fields} = (await query({
//       text:queryMaker(item),
//       rowMode:'array'
//     }))
//     await set([
//       `FLOW:${item}`,
//       JSON.stringify({
//         rows,
//         fields:fields.map(d => d.name)
//       })
//     ])
//     console.log(`Dur (${item}): ${new Date().getTime() - startTimeI}`)
//   }
//   console.log(`Duration: ${new Date().getTime() - startTime}`)
//
// }
const fieldNames = [
  'symbol',
  'value',
  'callvolume',
  'putvolume',
  'optionvolume',
  'bullflow',
  'bearflow',
  'valuebuyc',
  'valuesellc',
  'valuebuyp',
  'valuesellp',
]
sadd(['FLOW::FIELDS',...fieldNames])
const getTable = async () => {
  const startTime = new Date().getTime()
  for (var i = 0; i < categories.length; i++) {
    const item = categories[i]
    const startTimeI = new Date().getTime()
    // tables[item] = (await query(queryMaker(item))).rows
    const {rows,fields} = (await query({
      text:queryMaker(item),
      rowMode:'array'
    }))

    for (var j = 1; j < fieldNames.length; j++) {

      //asc

      await set([
        `FLOW::${item}::${fieldNames[j]}::asc`,
        JSON.stringify(rows.sort((a, b) => (a[j]===null)-(b[j]===null) || +(a[j]>b[j])||-(a[j]<b[j])))
      ])

      await set([
        `FLOW::${item}::${fieldNames[j]}::desc`,
        JSON.stringify(rows.sort((a, b) => (a[j]===null)-(b[j]===null) || -(a[j]>b[j])||+(a[j]<b[j])))
      ])




    }


    // await set([
    //   `FLOW::${item}`,
    //   JSON.stringify(rows)
    // ])
    console.log(`Dur (${item}): ${new Date().getTime() - startTimeI}`)
  }
  const duration = new Date().getTime() - startTime
  console.log(`Duration: ${duration}`)
  if (duration < 1000) {
    setTimeout(() => {
      getTable()
    },1000-duration)
  } else getTable()

}

getTable()
// setInterval(() => {
//   getTable()
// },5000)
