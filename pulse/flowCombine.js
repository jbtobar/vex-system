/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { set,get, runBatchMini, client } = require('../redis')


const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const enhanceMetrics = (data) => {
  return data.map((d) => {
    try {
      d.callbuyshare = Number((d.valuebuycall/d.valuecall).toFixed(2))
      d.flowratio = Number(((d.valuebuycall+d.valuesellput)/(d.valuebuyput+d.valuesellcall)).toFixed(2))
      d.changepct = Number(((d.change/(d.price-d.change))*100).toFixed(2))

      d.sumdelta = Number((d.sumdelta*100).toFixed(2))
      d.sumgamma = Number((d.sumgamma*100).toFixed(2))
      d.sumvega = Number((d.sumvega*100).toFixed(2))
      d.sumtheta = Number((d.sumtheta*100).toFixed(2))

      return d;
    } catch (e) {
      return d;
    }
  })
}


const flowCombiner = async () => {
  try {
    const startTime = new Date().getTime();


    const cats = [
      `FLO::ALL::`,
      `FLO::M5::`,
      `FLO::M10::`,
      `FLO::M15::`,
      `FLO::M30::`,
      `FLO::H1::`
    ]
    let batch = client.batch();
    for (var i = 0; i < cats.length; i++) {

      batch.get(cats[i])
      batch.get(`${cats[i]}F`)

    }
    batch.exec((err, resp)=> {

      batch = client.batch();
      for (var i = 0; i < cats.length; i++) {
        batch.set([
          `${cats[i]}C`,
          JSON.stringify([
            ...enhanceMetrics(JSON.parse(resp[(i*2)])),
            ...enhanceMetrics(JSON.parse(resp[(i*2)+1])),
          ])
        ])
      }
      batch.exec((err, resp)=> {
        if (err) console.error(err)
        const duration = new Date().getTime() - startTime
        console.log(`Done: ${timenow()} - Duration flowCombiner ${duration}`)
        if (duration < 1000) {
          setTimeout(() => {
            flowCombiner()
          },1000 - duration)
        } else flowCombiner()
      });

    });






  } catch (e) {
    console.error(e)
  }
}
flowCombiner()
