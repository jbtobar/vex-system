/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { query } = require('../db');

(async () => {
  let m = await query(`INSERT INTO tasc_fut_hist (SELECT * FROM tasc_fut);`)
  console.log({m})
  m = await query(`TRUNCATE TABLE tasc_fut;`)
  console.log({m})
  process.exit();
})()
