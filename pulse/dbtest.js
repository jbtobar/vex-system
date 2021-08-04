/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('../db');

function runBatchMini(rows,params,includeKeys) {
  return new Promise(function(resolve, reject) {
    var batch = client_redis.batch();
    for (var i = 0; i < rows.length; i++) {
      batch.hmget(rows[i],...params)
    }
    batch.exec((err, resp)=> {
      if (err) {
        console.log(err)
        reject(err)
      }
      if (includeKeys) resolve(resp.map((d,i) => [rows[i],...d]))
      else resolve(resp)
    });
  });
}

const printTime = (t) => {
  return new Date().getTime() - t
}

(async () => {
  let timeStart = new Date().getTime()
  const codes = (
      await query({
        text:`SELECT symbol as optioncode,underlying,strike,expiration,mmy from ipf_opt;`,
        rowMode:'array'
      })
    ).rows
  console.log(`codes queried   - ${printTime(timeStart)}`)
  timeStart = new Date().getTime()
  const values = await runBatchMini(codes,['dayVolume','delta','gamma','vega','theta'])
  console.log(`values obtained - ${printTime(timeStart)}`)
})();
