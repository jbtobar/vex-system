/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { query } = require('../db');
const { runBatchMini } = require('../redis');

const names = [
  'time',
  'volatility',
  'delta',
  'gamma',
  'theta',
  'rho',
  'vega',
  'theo',
  'bidPrice',
  'bidSize',
  'askPrice',
  'askSize',
  'price',
  'change',
  'size',
  'dayVolume',
  'dayTurnover',
  'changePct',
  // 'dayOpenPrice',
  // 'dayHighPrice',
  // 'dayLowPrice',
  // 'dayClosePrice',
  // 'prevDayClosePrice',
  // 'prevDayVolume',
  // 'openInterest'
]
const dayVolume = names.findIndex(d => d === 'dayVolume')

const optdb = async () => {
  let startTime = new Date().getTime()
  const optioncodes = (
    await query({
      text: `SELECT symbol from ipf_opt;`,
      rowMode: 'array',
    })
  ).rows
  console.log(`DUR [ 1 ] - length: ${optioncodes.length} : ${new Date().getTime() - startTime}`)
  startTime = new Date().getTime()
  const data = await runBatchMini(optioncodes,names,true)
  console.log(`DUR [ 2 ] : ${new Date().getTime() - startTime}`)
  startTime = new Date().getTime()
  const top10 = data.sort((a,b) => Number(a[dayVolume]) - Number(b[dayVolume])).filter((d,i) => i < 10)
  console.log(top10)
  console.log(`DUR [ 3 ] : ${new Date().getTime() - startTime}`)
  optdb()
}
optdb()
