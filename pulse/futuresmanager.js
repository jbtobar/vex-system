/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const GET_ALL_FUTURES_AND_OPTIONS = require('../src/GET_ALL_FUTURES_AND_OPTIONS');

(async () => {
  await GET_ALL_FUTURES_AND_OPTIONS()
  process.exit()
})()
