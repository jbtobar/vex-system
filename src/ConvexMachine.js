/**
 *
 * The Convex Machine
 *
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { onceEveryTradingDay, onceEveryTradingHour, logger, timenow } = require('../utils');
const storesAllActiveOptionContracts = require('../storesAllActiveOptionContracts');


function maintainsActiveOptionContractDatabase() {

  logger.info(`CM: maintainsActiveOptionContractDatabase - ${new Date().toLocaleString("en-US", {timeZone: "America/New_York"})}`)

  onceEveryTradingDay({
    cb:storesAllActiveOptionContracts
  })




  // onceEveryTradingHour([
  //   monitorsForChangesInActiveContracts()
  // ])
}



function TheConvexMachine() {
  logger.info(`The Convex Machine is Running - ${timenow()}`)
  maintainsActiveOptionContractDatabase()
}
TheConvexMachine()
