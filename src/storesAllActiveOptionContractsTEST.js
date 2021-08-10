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
// const stream = parse({ headers: true })
//   .on('error', error => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
//   .on('data', row => {
//     const rowkeys = Object.values(row)
//     rowkeys.shift()
//     const json = JSON.stringify(rowkeys)
//     readable.push(json.substring(1, json.length-1)+'\n')
//   })
//   .on('end', rowCount => {
//     readable.push(null)
//     streamQ.on('error', (error) => logger.error(error,{ function: 'storesAllActiveOptionContracts' }))
//     streamQ.on('finish', async () => {
//     })
//     stream.on('finish', () => {})
//
//   });


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

  // res.on('data', d => stream.write(d))
  res.on('data', d => {
    console.log(d.toString())
    process.exit()
  })

  // res.on('end',() => stream.end())
})

req.on('error', error => {
  // console.error(error)
  logger.error(error,{ function: 'storesAllActiveOptionContracts' })
})

req.end()
