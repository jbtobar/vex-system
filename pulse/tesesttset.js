/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require('redis');
const { set, runBatchMini } = require('../redis')
const publisher = redis.createClient();

publisher.on('message', (channel, message) => {
  const payload = JSON.parse(message)
  console.log(payload)
})
publisher.subscribe('TASERFUT')
