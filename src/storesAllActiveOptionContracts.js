/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const { parse } = require('@fast-csv/parse');
const Stream = require('stream')
const copyFrom = require('pg-copy-streams').from
const { pool } = require('../db')
const { logger, timenow } = require('../utils');

// storesAllActiveOptionContracts

pool.connect(async function (err, client, done) {
  const startTime = new Date().getTime()
  logger.info(`START: storesAllActiveOptionContracts - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })

  await client.query(`DROP TABLE IF EXISTS ipf_opt_tmp`)
  await client.query(`CREATE TABLE ipf_opt_tmp (LIKE ipf_opt)`)
  const ts = new Date().getTime();
  // await client.query(`INSERT INTO ipf_diff_hist (SELECT *,${ts} AS up_at FROM ipf_diff);`)
  await client.query(`DROP TABLE IF EXISTS ipf_diff`)

  const streamQ = client.query(copyFrom("COPY ipf_opt_tmp FROM STDIN WITH CSV DELIMITER ',' QUOTE '\"'"))

  const readable = new Stream.Readable()
  readable._read = () => {}
  readable.pipe(streamQ)



  const stream = parse({ headers: true })
    .on('error', error => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
    .on('data', row => {
      const rowkeys = Object.values(row)
      rowkeys.shift()
      const json = JSON.stringify(rowkeys)
      readable.push(json.substring(1, json.length-1)+'\n')
    })
    .on('end', rowCount => {
      readable.push(null)
      streamQ.on('error', (error) => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
      streamQ.on('finish', async () => {
        try {
          logger.info(`DONE: storesAllActiveOptionContracts:stream - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
          await client.query(`
            CREATE TABLE ipf_diff as (
              SELECT ipf_opt_tmp.*
              FROM   ipf_opt_tmp
              FULL   OUTER JOIN ipf_opt USING (SYMBOL)
              WHERE  ipf_opt.SYMBOL IS NULL OR
                     ipf_opt_tmp.SYMBOL IS NULL
            )`)
          logger.info(`DONE: storesAllActiveOptionContracts:ipf_diff - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
          await client.query('BEGIN')
          await client.query(`ALTER TABLE ipf_opt RENAME TO ipf_opt_old;`)
          await client.query(`ALTER TABLE ipf_opt_tmp RENAME TO ipf_opt;`)
          await client.query(`DROP TABLE ipf_opt_old;`)
          await client.query('COMMIT')

          await client.query('BEGIN')
          await client.query(`DROP TABLE IF EXISTS ipf_symb`)
          await client.query(`CREATE TABLE ipf_symb AS (
            SELECT DISTINCT underlying FROM ipf_opt
          )`)
          await client.query('COMMIT')

          logger.info(`DONE: storesAllActiveOptionContracts:table replace - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
          done()
          logger.info(`FINISH: storesAllActiveOptionContracts - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
        } catch (error) {
          logger.error(error,{ function: 'storesAllActiveOptionContracts' })
        }
      })
      stream.on('finish', () => {})

    });


  const https = require('https')
  const options = {
    hostname: 'tools.dxfeed.com',
    port: 443,
    path: '/ipf?types=OPTION',
    method: 'GET',
    auth: `${process.env.DXUSER}:${process.env.CODE}`
  }
  const req = https.request(options, res => {
    // console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => stream.write(d))

    res.on('end',() => stream.end())
  })

  req.on('error', error => {
    // console.error(error)
    logger.error(error,{ function: 'storesAllActiveOptionContracts' })
  })

  req.end()



})


setInterval(() => {
  pool.connect(async function (err, client, done) {
    const startTime = new Date().getTime()
    logger.info(`START: storesAllActiveOptionContracts - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })

    await client.query(`DROP TABLE IF EXISTS ipf_opt_tmp`)
    await client.query(`CREATE TABLE ipf_opt_tmp (LIKE ipf_opt)`)
    const ts = new Date().getTime();
    await client.query(`INSERT INTO ipf_diff_hist (SELECT *,${ts} AS up_at FROM ipf_diff);`)
    await client.query(`DROP TABLE IF EXISTS ipf_diff`)

    const streamQ = client.query(copyFrom("COPY ipf_opt_tmp FROM STDIN WITH CSV DELIMITER ',' QUOTE '\"'"))

    const readable = new Stream.Readable()
    readable._read = () => {}
    readable.pipe(streamQ)



    const stream = parse({ headers: true })
      .on('error', error => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
      .on('data', row => {
        const rowkeys = Object.values(row)
        rowkeys.shift()
        const json = JSON.stringify(rowkeys)
        readable.push(json.substring(1, json.length-1)+'\n')
      })
      .on('end', rowCount => {
        readable.push(null)
        streamQ.on('error', (error) => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
        streamQ.on('finish', async () => {
          try {
            logger.info(`DONE: storesAllActiveOptionContracts:stream - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
            await client.query(`
              CREATE TABLE ipf_diff as (
                SELECT ipf_opt_tmp.*
                FROM   ipf_opt_tmp
                FULL   OUTER JOIN ipf_opt USING (SYMBOL)
                WHERE  ipf_opt.SYMBOL IS NULL OR
                       ipf_opt_tmp.SYMBOL IS NULL
              )`)
            logger.info(`DONE: storesAllActiveOptionContracts:ipf_diff - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
            await client.query('BEGIN')
            await client.query(`ALTER TABLE ipf_opt RENAME TO ipf_opt_old;`)
            await client.query(`ALTER TABLE ipf_opt_tmp RENAME TO ipf_opt;`)
            await client.query(`DROP TABLE ipf_opt_old;`)
            await client.query('COMMIT')

            await client.query('BEGIN')
            await client.query(`DROP TABLE IF EXISTS ipf_symb`)
            await client.query(`CREATE TABLE ipf_symb AS (
              SELECT DISTINCT underlying FROM ipf_opt
            )`)
            await client.query('COMMIT')

            logger.info(`DONE: storesAllActiveOptionContracts:table replace - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
            done()
            logger.info(`FINISH: storesAllActiveOptionContracts - t: ${new Date().getTime() - startTime} - ${timenow()}`,{ function: 'storesAllActiveOptionContracts' })
          } catch (error) {
            logger.error(error,{ function: 'storesAllActiveOptionContracts' })
          }
        })
        stream.on('finish', () => {})

      });


    const https = require('https')
    const options = {
      hostname: 'tools.dxfeed.com',
      port: 443,
      path: '/ipf?types=OPTION',
      method: 'GET',
      auth: `${process.env.DXUSER}:${process.env.CODE}`
    }
    const req = https.request(options, res => {
      // console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => stream.write(d))

      res.on('end',() => stream.end())
    })

    req.on('error', error => {
      // console.error(error)
      logger.error(error,{ function: 'storesAllActiveOptionContracts' })
    })

    req.end()



  })
},1000*60*30)
