/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const Tasty = require('../tasty');
const { set } = require('../redis');

(async () => {
  const TastyWorks = await Tasty()
  if (!TastyWorks) return reject('No TastyWorks');
  let streamerD = await TastyWorks.streamer()
  await set(['token',streamerD.token])
  await set(['tokenResetTS',new Date().getTime()])
  console.log(streamerD.token)
  process.exit();
})();
