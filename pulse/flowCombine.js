/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { set,get, runBatchMini, client } = require('../redis')


const timenow = () => new Date().toLocaleString("en-US", {timeZone: "America/New_York"})


const flowCombiner = async () => {
  try {
    const startTime = new Date().getTime();
    const duration = new Date().getTime() - startTime

    const cats = [
      `FLO::ALL::`,
      `FLO::M5::`,
      `FLO::M10::`,
      `FLO::M15::`,
      `FLO::M30::`,
      `FLO::H1::`
    ]
    for (var i = 0; i < cats.length; i++) {
      const stockList = await get(cats[i])
      const futList = await get(`${cats[i]}F`)
      await set([
        `${cats[i]}C`,
        JSON.stringify([
          ...stockList,
          ...futList
        ])
      ])
    }


    console.log(`Done: ${timenow()} - Duration flowCombiner ${duration}`)
    if (duration < 1000) {
      setTimeout(() => {
        flowCombiner()
      },1000 - duration)
    } else flowCombiner()

  } catch (e) {
    console.error(e)
  }
}
flowCombiner()
