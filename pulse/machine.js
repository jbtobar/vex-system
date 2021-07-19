/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const exec = util.promisify(require('child_process').exec);

(async () => {
  await exec(`node test.js`)
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
