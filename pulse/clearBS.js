/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('../db');

const data = {};

(async () => {
    const startTime = new Date().getTime();
    const trades = (await query(`SELECT symbol from ipf_opt;`)).rows
    console.log(`tasc length: ${trades.length}`)
    for (var i = 0; i < trades.length; i++) {
        const trade = trades[i]
        let { symbol } = trade;
        data[symbol] = {
            valuebuy:0,
            volmbuy:0,
            countbuy:0,
            valuesell:0,
            volmsell:0,
            countsell:0,
            valueund:0,
            volmund:0,
            countund:0,
            value:0,
            volm:0,
            count:0,
            valuebs:0,
            volmbs:0,
            countbs:0,
        }


    }
    console.log(`FINISHED ${new Date().getTime() - startTime}`)

    const symbols = Object.keys(data)
    for (var i = 0; i < symbols.length; i++) {
        await client_redis.hmset(
            symbols[i],{
                ...data[symbols[i]],
                gucc:1
            })
    }
    console.log(`FINISHED DOUBLE ${new Date().getTime() - startTime}`)
})();
