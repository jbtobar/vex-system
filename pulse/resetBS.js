/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const client_redis = redis.createClient();
const { query } = require('../db');

const data = {}

(async () => {
    const startTime = new Date().getTime();
    const trades = (await query(`SELECT * FROM tasc;`)).rows
    console.log(`tasc length: ${trades.length}`)
    for (var i = 0; i < trades.length; i++) {
        const trade = trades[i]
        let { eventsymbol, size, price, aggressorside } = trade;

        size = Number(size)
        price = Number(size)
        let value = size * price * 100

        if (!data[eventsymbol]) {
            data[eventsymbol] = {
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


        data[eventsymbol].value += value
        data[eventsymbol].volm += size
        data[eventsymbol].count += 1


        switch (aggressorside) {
            case 'BUY':
                data[eventsymbol].valuebuy  += value
                data[eventsymbol].volmbuy += size
                data[eventsymbol].countbuy += 1
                data[eventsymbol].valuebs  += value
                data[eventsymbol].volmbs += size
                data[eventsymbol].countbs  += 1
                break;
            case 'SELL':
                data[eventsymbol].valuesell  += value
                data[eventsymbol].volmsell += size
                data[eventsymbol].countsell += 1
                data[eventsymbol].valuebs -= value
                data[eventsymbol].volmbs -= size
                data[eventsymbol].countbs -= 1
                break;
            default:
                data[eventsymbol].valueund  += value
                data[eventsymbol].volmund += size
                data[eventsymbol].countund  += 1
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
