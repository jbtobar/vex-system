/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async () => {
  const m = await exec(`node pulse/test.js`)
  console.log(m)
})();
// const futuresMarketOpen = async () => {
//   `pm2 start`
//   await resetToken()
//   await futuresManager()
//   await startCometOPT()
//   await launchPublisherOPT()
//   await launchCometTASFUT()
//   await launchFlowMakerFUT()
//   await launchPublisherTASFUT()
// }
//
// const futuresMarketClose = async () => {
//   await closeFlowMakerFUT()
//   await close
// }
