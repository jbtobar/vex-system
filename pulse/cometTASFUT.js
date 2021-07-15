/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const connectedComet = require('../comet');
const { SUBSCRIPTION_CHANNEL, TIME_SERIES_CHANNEL,CHANNEL_DATA_LENGTHS } = require('../comet/constants')
const pool = require('../db').pool
const Stream = require('stream')
const copyFrom = require('pg-copy-streams').from

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const client_redis = redis.createClient();
const publisher = redis.createClient();

const LENGTHS = {

}
const fixNum = (val) => isNaN(val) ? 0 : Number(val);

const contextForContract = (ctc) => {
  return new Promise(function(resolve, reject) {
    // console.log({ctc});
    client_redis.hmget([ctc,'underlying','volatility','mmy'],(err,res) => {
      // console.log({res});
      if (err) console.error(err)
      if (res[0]) {
        client_redis.hmget([res[0],'price'],(e,r) => {
          // console.log({r});
          if (e) console.error(e)
          resolve([
            fixNum(r[0]),
            fixNum(res[1]),
            res[0],
            fixNum(res[2])
          ])
        })
      } else {
        resolve([
          fixNum(0),
          fixNum(res[1]),
          res[0],
          fixNum(res[2])
        ])
      }

    })
  });;
}

let messageNum = 0
let okNum = 0

const processReceived = (payload) => {
  payload.addTimeSeries.TimeAndSale.forEach((item, i) => {
    client_redis.hmset(item.eventSymbol,{pubok:new Date().getTime()})
  });
}


pool.connect(async function (err, client, done) {
  try {
    const handeTimeSeriesChannel = async msg => {
      try {
        // console.log(msg)
        client_redis.set('cometTASFUT',new Date().getTime())
        messageNum+=1;
        const [payloadType,payload] = msg.data
         if (payload.length > 0) {
           if (payloadType === 'TimeAndSale' || payloadType[0] === 'TimeAndSale') {
             // console.log('istands')
             const stream = client.query(copyFrom("COPY tasc_fut FROM STDIN WITH CSV DELIMITER ',' QUOTE '\"'"))
             const readable = new Stream.Readable()
             readable._read = () => {}
             while (payload.length > 0) {
               const singleLoad = payload.splice(0,CHANNEL_DATA_LENGTHS['TimeAndSale'])
               // console.log(singleLoad)
               if (singleLoad[13] === '\x00') singleLoad[13] =  0
               if (singleLoad[7] === '\u0000') singleLoad[7] =  0

               const context = await contextForContract(singleLoad[0])
               const json = JSON.stringify([
                 singleLoad[0],
                 // 'eventTime',singleLoad[1],
                 // 'eventFlags',singleLoad[2],
                 singleLoad[3],
                 singleLoad[4],
                 // 'timeNanoPart',singleLoad[5],
                 singleLoad[6],
                 singleLoad[7],
                 fixNum(singleLoad[8]),
                 fixNum(singleLoad[9]),
                 fixNum(singleLoad[10]),
                 fixNum(singleLoad[11]),
                 singleLoad[12],
                 singleLoad[13],
                 singleLoad[14],
                 singleLoad[15],
                 singleLoad[16],
                 singleLoad[17],
                 singleLoad[18],
                 singleLoad[19],
                 singleLoad[20],
                 ...context
               ])
               client_redis.set('LAST_FUT',singleLoad[3])
               client_redis.publish('TASERFUT',json)
               readable.push(json.substring(1, json.length-1)+'\n')
             }
             readable.push(null)
             // console.log('finished pushing')
             stream.on('error', (err) => console.log('streamerr',err,payload))
             // stream.on('finish', console.log)
             readable.pipe(stream)
           }
         }
      } catch (e) {
        console.error(msg,e);
      }
    }

    console.log('suball')
    let startTime = new Date().getTime()
    const comet = await connectedComet()



    comet.subscribe(TIME_SERIES_CHANNEL, handeTimeSeriesChannel)

    publisher.on('message', (channel, message) => {
      const payload = JSON.parse(message)
      // console.log(message)
      // console.log(payload)
      switch (channel) {
        case 'cometTASFUT':
          comet.publish(SUBSCRIPTION_CHANNEL,payload,ack => {
            if (!ack.successful) {
              console.log('sub fail',ack)
              processReceived(payload)
            } else {
              okNum+=1
            }
          })
          break;
        default:
      }
    })
    publisher.subscribe('cometTASFUT')







    setInterval(() => {
      console.log('cometTASFUT',{messageNum,okNum,time:timenow()})
    },1000*30)
  } catch (e) {
    console.error(e)
  }
})
