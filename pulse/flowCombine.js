/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { set,get, runBatchMini, client } = require('../redis')

const onlyNum = (val) => {
  if (val === null) return 0
  if (val === Infinity) return 0
  if (val === -Infinity) return 0
  if (isNaN(val)) return 0
  return val
}

const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})

const enhanceMetrics = (data) => {
  return data.filter(d => !['null',':undefined','/:undefined'].includes(d.symbol)).map((d) => {
    try {
      d.callbuysharecall = onlyNum(Number(((d.valuebuycall/d.valuecall)*100).toFixed(2)))
      d.callbuysharetotal = onlyNum(Number(((d.valuebuycall/d.value)*100).toFixed(2)))
      if (isNaN(d.callbuysharetotal)) d.callbuysharetotal = 0
      const bullflow = onlyNum(Number(d.valuebuycall+d.valuesellput))
      const bearflow = onlyNum((Number(d.valuebuyput+d.valuesellcall)))
      d.bullflow = onlyNum(Number(bullflow.toFixed(0)))
      d.bearflow = onlyNum(Number(bearflow.toFixed(0)))
      d.flowratio = onlyNum(
        Number(
          (
            onlyNum(Number(bullflow/bearflow))
          ).toFixed(2)
        )
      )
      d.changepct = onlyNum(Number(((d.change/(d.price-d.change))*100).toFixed(2)))
      d.open = onlyNum(Number((d.price-d.change).toFixed(2)))

      d.sumdelta = onlyNum(Number((d.sumdelta*100).toFixed(2)))
      d.sumgamma = onlyNum(Number((d.sumgamma*100).toFixed(2)))
      d.sumvega = onlyNum(Number((d.sumvega*100).toFixed(2)))
      d.sumtheta = onlyNum(Number((d.sumtheta*100).toFixed(2)))

      d.putcallratio = onlyNum(onlyNum(Number(d.putVolume))/onlyNum(Number(d.callVolume)))

      return d;
    } catch (e) {
      console.error(e)
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
