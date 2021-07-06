require('dotenv').config()
const { parse } = require('@fast-csv/parse');
const { Pool } = require('pg')
const Stream = require('stream')
const copyFrom = require('pg-copy-streams').from

const pool = new Pool({
  user: process.env.DB_USER,
  // host: process.env.HOST_EXT,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})




// https://tools.dxfeed.com/ipf?
//
//
/*
pool.connect(function (err, client, done) {
  var stream = client.query(copyFrom('COPY my_table FROM STDIN'))
  var fileStream = fs.createReadStream('some_file.tsv')
  fileStream.on('error', done)
  stream.on('error', done)
  stream.on('finish', done)
  fileStream.pipe(stream)
})
*/


let rowLength = 0

pool.connect(async function (err, client, done) {
  const streamQ = client.query(copyFrom("COPY ipf_opt FROM STDIN WITH CSV DELIMITER ',' QUOTE '\"'"))
  const readable = new Stream.Readable()
  readable._read = () => {}










  readable.pipe(streamQ)

  const stream = parse({ headers: true })
    .on('error', error => console.error(error))
    .on('data', row => {
      rowLength+=1
      const json = JSON.stringify(row)
      readable.push(json.substring(1, json.length-1)+'\n')
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`)
      readable.push(null)
      // console.log('finished pushing')
      streamQ.on('error', (err) => console.log('streamerr',err))
      stream.on('finish', () => {
        console.log('finished')
      })

    });


  const https = require('https')
  const options = {
    hostname: 'tools.dxfeed.com',
    port: 443,
    path: '/ipf?types=OPTION',
    method: 'GET',
    auth: `${process.env.DXUSER}:${process.env.CODE}`
  }
  // console.log({options})
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      // process.stdout.write(d)
      // process.exit()
      stream.write(d);

    })
    res.on('end',() => {
      console.log('ended',rowLength)
      stream.end();
      setTimeout(() => {
        console.log('png',rowLength)
      },3000)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.end()



})




// #ETF::=TYPE,SYMBOL,DESCRIPTION,COUNTRY,OPOL,EXCHANGES,CURRENCY,PRICE_INCREMENTS,TRADING_HOURS,SUBTYPES
// #OPTION::=TYPE,SYMBOL,COUNTRY,OPOL,EXCHANGES,CURRENCY,CFI,MULTIPLIER,UNDERLYING,SPC,ADDITIONAL_UNDERLYINGS,MMY,EXPIRATION,LAST_TRADE,STRIKE,OPTION_TYPE,EXPIRATION_STYLE,SETTLEMENT_STYLE,PRICE_INCREMENTS,TRADING_HOURS
// #STOCK::

///
//
// var http = require('http');
//
// var request = http.request({'hostname': 'www.example.com',
//                             'auth': 'user:password'
//                            },
//                            function (response) {
//                              console.log('STATUS: ' + response.statusCode);
//                              console.log('HEADERS: ' + JSON.stringify(response.headers));
//                              response.setEncoding('utf8');
//                              response.on('data', function (chunk) {
//                                console.log('BODY: ' + chunk);
//                              });
//                            });
// request.end();
