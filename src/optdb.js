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
  'dayOpenPrice',
  'dayHighPrice',
  'dayLowPrice',
  'dayClosePrice',
  'prevDayClosePrice',
  'prevDayVolume',
  'openInterest'
]

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
  const data = await runBatchMini(optioncodes,names)
  console.log(`DUR [ 2 ] : ${new Date().getTime() - startTime}`)
}
optdb()
