/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { set, runBatchMini } = require('../redis')
const publisher = redis.createClient();
const client_redis = redis.createClient();

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log(`flowMakerFUT - start - ${timenow()}`)
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')
console.log('-----------------------------------------------------------------')

const generateEmptyObject = () => {
  return {

    value:0,
    volm:0,
    count:0,
    sumdelta:0,
    sumgamma:0,
    sumvega:0,
    sumtheta:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

    valuecall:0,
    volmcall:0,
    countcall:0,
    sumdeltacall:0,
    sumgammacall:0,
    sumvegacall:0,
    sumthetacall:0,

    valueput:0,
    volmput:0,
    countput:0,
    sumdeltaput:0,
    sumgammaput:0,
    sumvegaput:0,
    sumthetaput:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

    valuebuycall:0,
    volmbuycall:0,
    countbuycall:0,
    sumdeltabuycall:0,
    sumgammabuycall:0,
    sumvegabuycall:0,
    sumthetabuycall:0,

    valuesellcall:0,
    volmsellcall:0,
    countsellcall:0,
    sumdeltasellcall:0,

    valueundcall:0,
    volmundcall:0,
    countundcall:0,
    sumdeltaundcall:0,
    sumgammaundcall:0,
    sumvegaundcall:0,
    sumthetaundcall:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

    valuebuyput:0,
    volmbuyput:0,
    countbuyput:0,
    sumdeltabuyput:0,
    sumgammabuyput:0,
    sumvegabuyput:0,
    sumthetabuyput:0,

    valuesellput:0,
    volmsellput:0,
    countsellput:0,
    sumdeltasellput:0,
    sumgammasellput:0,
    sumvegasellput:0,
    sumthetasellput:0,

    valueundput:0,
    volmundput:0,
    countundput:0,
    sumdeltaundput:0,
    sumgammaundput:0,
    sumvegaundput:0,
    sumthetaundput:0

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

  }
}
const emptyObject = generateEmptyObject()

const totals = {

}

const minutes = {

}
const callorput = (f) => {
  if (f === 'C') return 'call'
  if (f === 'P') return 'put'
  return ''
}
const buyorsell = (side) => {
  if (side === 'BUY') return 'buy'
  if (side === 'SELL') return 'sell'
  return 'und'
}
const fixNum = (val) => isNaN(val) ? 0 : Number(val);

const getBreakdown = (payload) => {
// eventsymbol            | character varying     |           |          |
// index                  | bigint                |           |          |
// time                   | bigint                |           |          |
// sequence               | integer               |           |          |
// exchangecode           | character(1)          |           |          |
// price                  | real                  |           |          |
// size                   | integer               |           |          |
// bidprice               | real                  |           |          |
// askprice               | real                  |           |          |
// exchangesaleconditions | character varying     |           |          |
// tradethroughexempt     | character(1)          |           |          |
// aggressorside          | character varying     |           |          |
// spreadleg              | boolean               |           |          |
// extendedtradinghours   | boolean               |           |          |
// validtick              | boolean               |           |          |
// type                   | character varying     |           |          |
// buyer                  | character varying     |           |          |
// seller                 | character varying     |           |          |
// spot                   | real                  |           |          |
// volatility             | real                  |           |          |
// rootsymbol             | character varying(10) |           |          |
// expirydate             | character varying(10) |           |          |
// delta                  | real                  |           |          |
  return [
    payload[20], //rootsymbol,
    Math.floor(Number(payload[2])/60000), //minute,
    callorput(payload[0].match(/(?<=\d)[A-Z]{1}(?=\d)/)[0]),// flag,
    buyorsell(payload[11]), // side,
    Number(payload[5])*Number(payload[6])*100, // value
    Number(payload[6]), // volm
    Number(payload[22]), // delta
    Number(payload[23]), // gamma
    Number(payload[24]), // vega
    Number(payload[25]), // theta,
    payload[0] // eventSymbol
  ]
}

const processedContracts = {}
const handleTASOption = (eventSymbol,side,value,volm) => {
  try {
    client_redis.hincrbyfloat(eventSymbol,'value',value)
    client_redis.hincrby(eventSymbol,'volm',volm)
    client_redis.hincrby(eventSymbol,'count',1)

    switch (side) {
      case 'buy':
        client_redis.hincrbyfloat(eventSymbol,'valuebuy',value)
        client_redis.hincrby(eventSymbol,'volmbuy',volm)
        client_redis.hincrby(eventSymbol,'countbuy',1)

        client_redis.hincrbyfloat(eventSymbol,'valuebs',value)
        client_redis.hincrby(eventSymbol,'volmbs',volm)
        client_redis.hincrby(eventSymbol,'countbs',1)
        break;
      case 'sell':
        client_redis.hincrbyfloat(eventSymbol,'valuesell',value)
        client_redis.hincrby(eventSymbol,'volmsell',volm)
        client_redis.hincrby(eventSymbol,'countsell',1)

        client_redis.hincrbyfloat(eventSymbol,'valuebs',-value)
        client_redis.hincrby(eventSymbol,'volmbs',-volm)
        client_redis.hincrby(eventSymbol,'countbs',-1)
        break;
      default:
        client_redis.hincrbyfloat(eventSymbol,'valueund',value)
        client_redis.hincrby(eventSymbol,'volmund',volm)
        client_redis.hincrby(eventSymbol,'countund',1)
        break;
    }
    client_redis.publish('CustomUpdate',JSON.stringify({eventSymbol}))
  } catch(err) {
    console.error(err)
  }
}

const handleTAS = payload => {
  const [rootsymbol,minute,flag,side,value,volm,delta,gamma,vega,theta,eventSymbol] = getBreakdown(payload)
  const sumDelta = fixNum(volm*delta)
  const sumGamma = fixNum(volm*gamma)
  const sumVega = fixNum(volm*vega)
  const sumTheta = fixNum(volm*theta)

  if (volm>0) {
    handleTASOption(eventSymbol,side,value,volm)

    if (!totals[rootsymbol]) totals[rootsymbol] = generateEmptyObject()
    if (!minutes[minute]) minutes[minute] = {}
    if (!minutes[minute][rootsymbol]) {
      minutes[minute][rootsymbol] = generateEmptyObject()
    }

    minutes[minute][rootsymbol].value+=value
    minutes[minute][rootsymbol].volm+=volm
    minutes[minute][rootsymbol].count+=1
    minutes[minute][rootsymbol].sumdelta+=sumDelta
    minutes[minute][rootsymbol].sumgamma+=sumGamma
    minutes[minute][rootsymbol].sumvega+=sumVega
    minutes[minute][rootsymbol].sumtheta+=sumTheta



    minutes[minute][rootsymbol][`value${flag}`]+=value
    minutes[minute][rootsymbol][`volm${flag}`]+=volm
    minutes[minute][rootsymbol][`count${flag}`]+=1
    minutes[minute][rootsymbol][`sumdelta${flag}`]+=sumDelta
    minutes[minute][rootsymbol][`sumgamma${flag}`]+=sumGamma
    minutes[minute][rootsymbol][`sumvega${flag}`]+=sumVega
    minutes[minute][rootsymbol][`sumtheta${flag}`]+=sumTheta


    minutes[minute][rootsymbol][`value${side}${flag}`]+=value
    minutes[minute][rootsymbol][`volm${side}${flag}`]+=volm
    minutes[minute][rootsymbol][`count${side}${flag}`]+=1
    minutes[minute][rootsymbol][`sumdelta${side}${flag}`]+=sumDelta
    minutes[minute][rootsymbol][`sumgamma${side}${flag}`]+=sumGamma
    minutes[minute][rootsymbol][`sumvega${side}${flag}`]+=sumVega
    minutes[minute][rootsymbol][`sumtheta${side}${flag}`]+=sumTheta



    totals[rootsymbol].value+=value
    totals[rootsymbol].volm+=volm
    totals[rootsymbol].count+=1
    totals[rootsymbol].sumdelta+=sumDelta
    totals[rootsymbol].sumgamma+=sumGamma
    totals[rootsymbol].sumvega+=sumVega
    totals[rootsymbol].sumtheta+=sumTheta

    totals[rootsymbol][`value${flag}`]+=value
    totals[rootsymbol][`volm${flag}`]+=volm
    totals[rootsymbol][`count${flag}`]+=1
    totals[rootsymbol][`sumdelta${flag}`]+=sumDelta
    totals[rootsymbol][`sumgamma${flag}`]+=sumGamma
    totals[rootsymbol][`sumvega${flag}`]+=sumVega
    totals[rootsymbol][`sumtheta${flag}`]+=sumTheta

    totals[rootsymbol][`value${side}${flag}`]+=value
    totals[rootsymbol][`volm${side}${flag}`]+=volm
    totals[rootsymbol][`count${side}${flag}`]+=1
    totals[rootsymbol][`sumdelta${side}${flag}`]+=sumDelta

    totals[rootsymbol][`sumgamma${side}${flag}`]+=sumGamma
    totals[rootsymbol][`sumvega${side}${flag}`]+=sumVega
    totals[rootsymbol][`sumtheta${side}${flag}`]+=sumTheta
  }

}

const getUnderlyingValues = async (totalKeys) => {
  try {
    const vals = await runBatchMini(totalKeys,['dayVolume','price','change','callVolume','putVolume','volatility','frontVolatility','backVolatility'],true)
    let obj = {}
    vals.forEach((item, i) => {
      obj[item[0]] = {
        dayVolume:Number(item[1]),
        price:Number(item[2]),
        change:Number(item[3]),
        callVolume:Number(item[4]),
        putVolume:Number(item[5]),
        volatility:Number(item[6]),
        frontVolatility:Number(item[7]),
        backVolatility:Number(item[8]),
      }
    });
    return obj
  } catch (e) {
    console.error('getUnderlyingValues',e)
    return {}
  }
}

// setInterval(,1000)
const flowMaker = async () => {
  try {
    const startTime = new Date().getTime();
    const minute = Math.floor(startTime/60000)
    const totalKeys = Object.keys(totals)
    const underlyingValues = await getUnderlyingValues(totalKeys)
    console.log(`underlyingValues Duration ${new Date().getTime() - startTime}`)

    const FullTable = totalKeys.map(symbol => {
      return {
        symbol,
        ...totals[symbol],
        ...underlyingValues[symbol]
      }
    })
    await set([
      `FLO::ALL::F`,
      JSON.stringify(FullTable)
    ])

    const temp = {}
    for (var i = 0; i < 61; i++) {
      if (minutes[minute-i]) {
        Object.keys(minutes[minute-i]).forEach((symbol) => {
          if (!temp[symbol]) temp[symbol] = generateEmptyObject()

          Object.keys(emptyObject).forEach((k) => {
            temp[symbol][k] += minutes[minute-i][symbol][k]
          });


          //
          // temp[symbol].value += minutes[minute-i][symbol].value
          // temp[symbol].volm += minutes[minute-i][symbol].volm
          // temp[symbol].count += minutes[minute-i][symbol].count

          // temp[symbol].valuecall += minutes[minute-i][symbol].valuecall
          // temp[symbol].volmcall += minutes[minute-i][symbol].volmcall
          // temp[symbol].countcall += minutes[minute-i][symbol].countcall
          //
          // temp[symbol].valueput += minutes[minute-i][symbol].valueput
          // temp[symbol].volmput += minutes[minute-i][symbol].volmput
          // temp[symbol].countput += minutes[minute-i][symbol].countput
          //
          // //
          //
          // temp[symbol].valuebuycall += minutes[minute-i][symbol].valuebuycall
          // temp[symbol].volmbuycall += minutes[minute-i][symbol].volmbuycall
          // temp[symbol].countbuycall += minutes[minute-i][symbol].countbuycall
          //
          // temp[symbol].valuesellcall += minutes[minute-i][symbol].value
          // temp[symbol].volmsellcall += minutes[minute-i][symbol].value
          // temp[symbol].countsellcall += minutes[minute-i][symbol].value
          //
          // temp[symbol].valueundcall += minutes[minute-i][symbol].value
          // temp[symbol].volmundcall += minutes[minute-i][symbol].value
          // temp[symbol].countundcall += minutes[minute-i][symbol].value
          //
          // //
          //
          // temp[symbol].valuebuyput += minutes[minute-i][symbol].value
          // temp[symbol].volmbuyput += minutes[minute-i][symbol].value
          // temp[symbol].countbuyput += minutes[minute-i][symbol].value
          //
          // temp[symbol].valuesellput += minutes[minute-i][symbol].value
          // temp[symbol].volmsellput += minutes[minute-i][symbol].value
          // temp[symbol].countsellput += minutes[minute-i][symbol].value
          //
          // temp[symbol].valueundput += minutes[minute-i][symbol].value
          // temp[symbol].volmundput += minutes[minute-i][symbol].value
          // temp[symbol].countundput += minutes[minute-i][symbol].value
        });

        if (i === 5) {
          await set([
            `FLO::M5::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol],
                ...underlyingValues[symbol]
              }
            }))
          ])
        }
        if (i === 10) {
          await set([
            `FLO::M10::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol],
                ...underlyingValues[symbol]
              }
            }))
          ])
        }
        if (i === 15) {
          await set([
            `FLO::M15::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol],
                ...underlyingValues[symbol]
              }
            }))
          ])
        }
        if (i === 30) {
          await set([
            `FLO::M30::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol],
                ...underlyingValues[symbol]
              }
            }))
          ])
        }

        if (i === 60) {
          await set([
            `FLO::H1::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol],
                ...underlyingValues[symbol]
              }
            }))
          ])
        }

      }

    }
    // Object.keys(total).forEach((item, i) => {
    //
    // });
    const duration = new Date().getTime() - startTime
    console.log(`Done: ${timenow()} - Duration flowMakerFUT ${duration}`)
    if (duration < 1000) {
      setTimeout(() => {
        flowMaker()
      },1000 - duration)
    } else flowMaker()
  } catch (e) {
    console.error(e)
  }
}
flowMaker()

const handleRootTAS = (payload) => {
  try {
    const [symbol,code] = payload[20].split(':')
    payload[20] = `${symbol.slice(0,-3)}:${code}`
    handleTAS(payload)
  } catch (e) {
    console.error(e);
  }
}

publisher.on('message', (channel, message) => {
  const payload = JSON.parse(message)
  switch (channel) {
    case 'TASERFUT':
      handleTAS(payload)
      handleRootTAS([...payload])
      break;
    default:
  }
})
publisher.subscribe('TASERFUT')
