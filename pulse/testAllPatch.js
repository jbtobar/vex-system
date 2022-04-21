/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const client = redis.createClient();
function runBatch(rows,includeKeys) {
  return new Promise(function(resolve, reject) {
    var batch = client.batch();
    for (var i = 0; i < rows.length; i++) {
      batch.hgetall(rows[i])
    }
    batch.exec((err, resp)=> {
      if (err) {
        console.log(err)
        reject(err)
      }
      if (includeKeys) resolve(resp.map((d,i) => [rows[i],d]))
      else resolve(resp)
    });
  });;
};

(async () => {
    try {
        const startTime =  new Date().getTime();
        let codes = await query({
          text: `SELECT symbol from ipf_opt;`,
          rowMode: 'array',
        });
        // codes = codes.map(d => d.symbol)
        console.log(codes[0])
        console.log(`time codes:${new Date().getTime() - startTime}`)
        const data = await runBatch(codes,true);
        console.log(`time all:${new Date().getTime() - startTime}`)
    } catch (e) {
        console.error(e)
    }
})();
