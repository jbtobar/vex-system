/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { query } = require('../db')
const subber = redis.createClient();

(async () =>  {
  const contracts = await query(`SELECT optioncode,openinterest - prevoi as oich from opt_db where optioncode != '';`)
  console.log(contracts.rows.length)
  console.log(contracts.rows[0])
  for (var i = 0; i < contracts.rows.length; i++) {
    subber.hmset(contracts.rows[i].optioncode,{
      oich:contracts.rows[i].oich
    })
  }
  console.log('done')
})();
