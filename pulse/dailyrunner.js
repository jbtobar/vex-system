/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const subber = redis.createClient();

(async () =>  {
  const contracts = await query(`SELECT optioncode,openinterest - prevoi as oich,
valuebuy,
volmbuy,
countbuy,
valuesell,
volmsell,
countsell,
valueund,
volmund,
countund,
value,
volm,
count,
valuebs,
volmbs,
countbs from opt_db where optioncode != '';`)
  console.log(contracts.rows.length)
  console.log(contracts.rows[0])
  var batch = subber.batch();
  for (var i = 0; i < contracts.rows.length; i++) {
    batch.hmset(contracts.rows[i].optioncode,{
      oich:contracts.rows[i].oich  || 'null',
      valuebuy:contracts.rows[i].valuebuy  || 0,
      volmbuy:contracts.rows[i].volmbuy  || 0,
      countbuy:contracts.rows[i].countbuy  || 0,
      valuesell:contracts.rows[i].valuesell  || 0,
      volmsell:contracts.rows[i].volmsell  || 0,
      countsell:contracts.rows[i].countsell  || 0,
      valueund:contracts.rows[i].valueund  || 0,
      volmund:contracts.rows[i].volmund  || 0,
      countund:contracts.rows[i].countund  || 0,
      value:contracts.rows[i].value  || 0,
      volm:contracts.rows[i].volm  || 0,
      count:contracts.rows[i].count  || 0,
      valuebs:contracts.rows[i].valuebs  || 0,
      volmbs:contracts.rows[i].volmbs  || 0,
      countbs:contracts.rows[i].countbs  || 0,
    })
  }
  batch.exec((err, resp)=> {
    if (err) {
      console.log(err)
      // reject(err)
    }
    console.log('batched')
    // resolve()
  });
  console.log('done')
})();
