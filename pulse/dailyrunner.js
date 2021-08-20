/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
// const redis = require('redis');
const { client, get } = require('../redis');
const { query } = require('../db')
// const client_redis = redis.createClient();

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
const getFlowRep = async () => {
  try {
    const timeStart = new Date().getTime()
    console.log(`Starting - ${timenow()}`)
    const data = {}
    const results = await get("FLO::ALL::C")
    const tab = JSON.parse(results)
    data.toppremium = tab.sort((a,b) => b.value - a.value).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))
    data.topvolume = tab.sort((a,b) => b.volm - a.volm).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))
    data.topbullflow1m = tab.sort((a,b) => b.flowratio - a.flowratio).filter((d,i) => d.value > 1000000).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))
    data.topbullflow10m = tab.sort((a,b) => b.flowratio - a.flowratio).filter((d,i) => d.value > 10000000).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))

    data.topbearflow1m = tab.sort((a,b) => a.flowratio - b.flowratio).filter((d,i) => d.value > 1000000).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))
    data.topbearflow10m = tab.sort((a,b) => a.flowratio - b.flowratio).filter((d,i) => d.value > 10000000).filter((d,i) => i < 100).map(item => ({
      symbol: item.symbol,
      flowratio: item.flowratio,
      volm: item.volm,
      value: item.value,
      bearflow: item.bearflow,
      bullflow: item.bullflow,
      valuecall: item.valuecall,
      valueput: item.valueput,
      valuebuycall: item.valuebuycall,
      valuesellcall: item.valuesellcall,
      valuebuyput: item.valuebuyput,
      valuesellput: item.valuesellput
    }))
    data.toppremiumcontracts = (
      await query(`SELECT eventSymbol,rootSymbol,flag,expirydate, SUM(size),COUNT (*), SUM(price*size*100) as value,
      SUM(case WHEN aggressorside = 'BUY' THEN price*size*100 ELSE 0 END) as buyvalue,
      SUM(case WHEN aggressorside = 'SELL' THEN price*size*100 ELSE 0 END) as sellvalue
      from tasc WHERE size > 0
      GROUP BY eventSymbol,rootSymbol,flag,expirydate
      ORDER BY SUM(price*size*100) DESC LIMIT 100`)
    ).rows

    data.toppremiumcontractsnospx = (
      await query(`SELECT eventSymbol,rootSymbol,flag,expirydate, SUM(size),COUNT (*), SUM(price*size*100) as value,
      SUM(case WHEN aggressorside = 'BUY' THEN price*size*100 ELSE 0 END) as buyvalue,
      SUM(case WHEN aggressorside = 'SELL' THEN price*size*100 ELSE 0 END) as sellvalue
      from tasc WHERE size > 0 AND rootSymbol != 'SPY' AND rootSymbol != 'SPX' AND rootSymbol != 'SPXW'
      GROUP BY eventSymbol,rootSymbol,flag,expirydate
      ORDER BY SUM(price*size*100) DESC LIMIT 100`)
    ).rows

    data.topvolmcontracts = (
      await query(`SELECT eventSymbol,rootSymbol,flag,expirydate, SUM(size),COUNT (*), SUM(price*size*100) as value,
      SUM(case WHEN aggressorside = 'BUY' THEN size ELSE 0 END) as buyvolm,
      SUM(case WHEN aggressorside = 'SELL' THEN size ELSE 0 END) as sellvolm
      from tasc WHERE size>0
      GROUP BY eventSymbol,rootSymbol,flag,expirydate
      ORDER BY SUM(size) DESC LIMIT 100`)
    ).rows

    data.topvolmcontractsnospx = (
      await query(`SELECT eventSymbol,rootSymbol,flag,expirydate, SUM(size),COUNT (*), SUM(price*size*100) as value,
      SUM(case WHEN aggressorside = 'BUY' THEN size ELSE 0 END) as buyvolm,
      SUM(case WHEN aggressorside = 'SELL' THEN size ELSE 0 END) as sellvolm
      from tasc WHERE size>0 AND rootSymbol != 'SPY' AND rootSymbol != 'SPX' AND rootSymbol != 'SPXW'
      GROUP BY eventSymbol,rootSymbol,flag,expirydate
      ORDER BY SUM(size) DESC LIMIT 100`)
    ).rows

    data.toptradespremium = (
      await query(`SELECT *,(price*size*100) as value FROM tasc where size > 0
      ORDER BY (price*size*100) DESC limit 100`)
    ).rows

    data.toptradespremiumnospx = (
      await query(`SELECT *,(price*size*100) as value FROM tasc where size > 0 AND rootSymbol != 'SPY' AND rootSymbol != 'SPX' AND rootSymbol != 'SPXW'
      ORDER BY (price*size*100) DESC limit 100`)
    ).rows


    data.stats = (
      await query(`SELECT
       sum(size*price*100) as value,
       sum(size) as volm,
       count(*) as count,
       max(dayid)
       from tasc where size>0`)
    ).rows

    console.log('got it all',new Date().getTime() - timeStart)

    await query(`UPDATE jkeys set t_up=NOW(),body = '${JSON.stringify(data)}' where name='flowrep'`)


    console.log('loaded it all and done',new Date().getTime() - timeStart)

  } catch (e) {
    console.error(e)
  }
}
getFlowRep()



// (async () =>  {
//   const contracts = await query(`SELECT optioncode,openinterest - prevoi as oich,
// valuebuy,
// volmbuy,
// countbuy,
// valuesell,
// volmsell,
// countsell,
// valueund,
// volmund,
// countund,
// value,
// volm,
// count,
// valuebs,
// volmbs,
// countbs from opt_db where optioncode != '';`)
//   console.log(contracts.rows.length)
//   console.log(contracts.rows[0])
//   var batch = client.batch();
//   for (var i = 0; i < contracts.rows.length; i++) {
//     batch.hmset(contracts.rows[i].optioncode,{
//       oich:contracts.rows[i].oich  || 'null',
//       valuebuy:contracts.rows[i].valuebuy  || 0,
//       volmbuy:contracts.rows[i].volmbuy  || 0,
//       countbuy:contracts.rows[i].countbuy  || 0,
//       valuesell:contracts.rows[i].valuesell  || 0,
//       volmsell:contracts.rows[i].volmsell  || 0,
//       countsell:contracts.rows[i].countsell  || 0,
//       valueund:contracts.rows[i].valueund  || 0,
//       volmund:contracts.rows[i].volmund  || 0,
//       countund:contracts.rows[i].countund  || 0,
//       value:contracts.rows[i].value  || 0,
//       volm:contracts.rows[i].volm  || 0,
//       count:contracts.rows[i].count  || 0,
//       valuebs:contracts.rows[i].valuebs  || 0,
//       volmbs:contracts.rows[i].volmbs  || 0,
//       countbs:contracts.rows[i].countbs  || 0,
//     })
//   }
//   batch.exec((err, resp)=> {
//     if (err) {
//       console.log(err)
//       // reject(err)
//     }
//     console.log('batched')
//     // resolve()
//   });
//   console.log('done')
// })();
