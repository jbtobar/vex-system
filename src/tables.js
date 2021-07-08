/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { query } = require('../db');

(async () => {
  const startTime = new Date().getTime()
  let queryText = `SELECT
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
  FROM tasc group by rootsymbol;`
  const data = await query(queryText)
  console.log(`Duration: ${new Date().getTime() - startTime}`)
})();
