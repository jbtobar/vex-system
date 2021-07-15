/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const client_redis = redis.createClient();
const { query } = require('../db');


(async () => {
  const codes = (
      await query(`SELECT symbol as optioncode,underlying,strike,expiration,mmy from ipf_opt;`)
    ).rows
  const startTime = new Date().getTime()
  const batch = runBatchMini(codes.map(d => d.optioncode),['dayVolume'])
  console.log(`Duration: ${new Date().getTime() - startTime}`)
})();
