require('dotenv').config();

const Tasty = require('../tasty');
(async () => {
  const TastyWorks = await Tasty()
  if (!TastyWorks) return reject('No TastyWorks');
  let streamerD = await TastyWorks.streamer()
  console.log(streamerD.token)
})();
