/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { set } = require('../redis')
const publisher = redis.createClient();

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const generateEmptyObject = () => {
  return {

    value:0,
    volm:0,
    count:0,

    valuecall:0,
    volmcall:0,
    countcall:0,

    valueput:0,
    volmput:0,
    countput:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

    valuebuycall:0,
    volmbuycall:0,
    countbuycall:0,

    valuesellcall:0,
    volmsellcall:0,
    countsellcall:0,

    valueundcall:0,
    volmundcall:0,
    countundcall:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

    valuebuyput:0,
    volmbuyput:0,
    countbuyput:0,

    valuesellput:0,
    volmsellput:0,
    countsellput:0,

    valueundput:0,
    volmundput:0,
    countundput:0,

    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // // // // // // // // // // // // // // // // // // // // //

  }
}

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
  return [
    payload[20], //rootsymbol,
    Math.floor(Number(payload[2])/60000), //minute,
    callorput(payload[0].match(/(?<=\d)[A-Z]{1}(?=\d)/)[0]),// flag,
    buyorsell(payload[11]), // side,
    Number(payload[5])*Number(payload[6])*100, // value
    Number(payload[6]) // volm
  ]
}

const handleTAS = payload => {
  const [rootsymbol,minute,flag,side,value,volm] = getBreakdown(payload)

  if (!totals[rootsymbol]) totals[rootsymbol] = generateEmptyObject()
  if (!minutes[minute]) minutes[minute] = {}
  if (!minutes[minute][rootsymbol]) {
    minutes[minute][rootsymbol] = generateEmptyObject()
  }

  minutes[minute][rootsymbol].value+=value
  minutes[minute][rootsymbol].volm+=volm
  minutes[minute][rootsymbol].count+=1

  minutes[minute][rootsymbol][`value${flag}`]+=value
  minutes[minute][rootsymbol][`volm${flag}`]+=volm
  minutes[minute][rootsymbol][`count${flag}`]+=1

  minutes[minute][rootsymbol][`value${side}${flag}`]+=value
  minutes[minute][rootsymbol][`volm${side}${flag}`]+=volm
  minutes[minute][rootsymbol][`count${side}${flag}`]+=1



  totals[rootsymbol].value+=value
  totals[rootsymbol].volm+=volm
  totals[rootsymbol].count+=1

  totals[rootsymbol][`value${flag}`]+=value
  totals[rootsymbol][`volm${flag}`]+=volm
  totals[rootsymbol][`count${flag}`]+=1

  totals[rootsymbol][`value${side}${flag}`]+=value
  totals[rootsymbol][`volm${side}${flag}`]+=volm
  totals[rootsymbol][`count${side}${flag}`]+=1


}

setInterval(async () => {
  try {
    const startTime = new Date().getTime();
    const minute = Math.floor(startTime/60000)
    const FullTable = Object.keys(totals).map(symbol => {
      return {
        symbol,
        ...totals[symbol]
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

          temp[symbol].value += minutes[minute-i][symbol].value
          temp[symbol].volm += minutes[minute-i][symbol].volm
          temp[symbol].count += minutes[minute-i][symbol].count

          temp[symbol].valuecall += minutes[minute-i][symbol].valuecall
          temp[symbol].volmcall += minutes[minute-i][symbol].volmcall
          temp[symbol].countcall += minutes[minute-i][symbol].countcall

          temp[symbol].valueput += minutes[minute-i][symbol].valueput
          temp[symbol].volmput += minutes[minute-i][symbol].volmput
          temp[symbol].countput += minutes[minute-i][symbol].countput

          //

          temp[symbol].valuebuycall += minutes[minute-i][symbol].valuebuycall
          temp[symbol].volmbuycall += minutes[minute-i][symbol].volmbuycall
          temp[symbol].countbuycall += minutes[minute-i][symbol].countbuycall

          temp[symbol].valuesellcall += minutes[minute-i][symbol].value
          temp[symbol].volmsellcall += minutes[minute-i][symbol].value
          temp[symbol].countsellcall += minutes[minute-i][symbol].value

          temp[symbol].valueundcall += minutes[minute-i][symbol].value
          temp[symbol].volmundcall += minutes[minute-i][symbol].value
          temp[symbol].countundcall += minutes[minute-i][symbol].value

          //

          temp[symbol].valuebuyput += minutes[minute-i][symbol].value
          temp[symbol].volmbuyput += minutes[minute-i][symbol].value
          temp[symbol].countbuyput += minutes[minute-i][symbol].value

          temp[symbol].valuesellput += minutes[minute-i][symbol].value
          temp[symbol].volmsellput += minutes[minute-i][symbol].value
          temp[symbol].countsellput += minutes[minute-i][symbol].value

          temp[symbol].valueundput += minutes[minute-i][symbol].value
          temp[symbol].volmundput += minutes[minute-i][symbol].value
          temp[symbol].countundput += minutes[minute-i][symbol].value
        });

        if (i === 5) {
          await set([
            `FLO::M5::F`,
            JSON.stringify(Object.keys(temp).map(symbol => {
              return {
                symbol,
                ...temp[symbol]
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
                ...temp[symbol]
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
                ...temp[symbol]
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
                ...temp[symbol]
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
                ...temp[symbol]
              }
            }))
          ])
        }

      }

    }
    // Object.keys(total).forEach((item, i) => {
    //
    // });
    console.log(`Done: ${timenow()} - Duration ${new Date().getTime() - startTime}`)

  } catch (e) {
    console.error(e)
  }
},1000)


publisher.on('message', (channel, message) => {
  const payload = JSON.parse(message)
  switch (channel) {
    case 'TASERFUT':
      handleTAS(payload)
      break;
    default:
  }
})
publisher.subscribe('TASERFUT')
