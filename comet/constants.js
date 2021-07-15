/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @format
 * @flow
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const DATA_CHANNEL = '/service/data'
const SUBSCRIPTION_CHANNEL = '/service/sub'
const TIME_SERIES_CHANNEL = '/service/timeSeriesData'
const META_HANDSHAKE_CHANNEL = '/meta/handshake'
const META_CONNECT_CHANNEL = '/meta/connect'
const COMET_URL = 'https://tasty.dxfeed.com/live/cometd'

const META_UNSUBSCRIBE_CHANNEL = '/meta/unsubscribe'
const META_DISCONNECT_CHANNEL = '/meta/disconnect'
const META_SUBSCRIBE_CHANNEL = '/meta/subscribe'
const META_PUBLISH_CHANNEL = '/meta/publish'
const META_UNSUCCESSFUL_CHANNEL = '/meta/unsuccessful'

const GREEKS_NAMES = [
  "eventSymbol",
  "eventTime",
  "eventFlags",
  "index",
  "time",
  "sequence",
  "price",
  "volatility",
  "delta",
  "gamma",
  "theta",
  "rho",
  "vega"
]
const QUOTE_NAMES = [
  "eventSymbol",
  "eventTime",
  "sequence",
  "timeNanoPart",
  "bidTime",
  "bidExchangeCode",
  "bidPrice",
  "bidSize",
  "askTime",
  "askExchangeCode",
  "askPrice",
  "askSize"
]
const TRADE_NAMES = [
  "eventSymbol",
  "eventTime",
  "time",
  "timeNanoPart",
  "sequence",
  "exchangeCode",
  "price",
  "change",
  "size",
  "dayVolume",
  "dayid",
  "dayTurnover",
  "tickDirection",
  "extendedTradingHours"
]
const SUMMARY_NAMES = [
  "eventSymbol",
  "eventTime",
  "dayId",
  "dayOpenPrice",
  "dayHighPrice",
  "dayLowPrice",
  "dayClosePrice",
  "dayClosePriceType",
  "prevDayId",
  "prevDayClosePrice",
  "prevDayClosePriceType",
  "prevDayVolume",
  "openInterest"
]
const THEOPRICE_NAMES = ["eventSymbol","eventTime","eventFlags","index","time","sequence","price","underlyingPrice","delta","gamma","dividend","interest"]
const TIMEANDSALE_NAMES = [
  'eventSymbol',
  'eventTime',
  'eventFlags',
  'index',
  'time',
  'timeNanoPart',
  'sequence',
  'exchangeCode',
  'price',
  'size',
  'bidPrice',
  'askPrice',
  'exchangeSaleConditions',
  'tradeThroughExempt',
  'aggressorSide',
  'spreadLeg',
  'extendedTradingHours',
  'validTick',
  'type',
  'buyer',
  'seller'
]
const SERIES_NAMES = [
  'eventSymbol',  'eventTime',
  'eventFlags',   'index',
  'time',         'sequence',
  'expiration',   'volatility',
  'callVolume',   'putVolume',
  'putCallRatio', 'forwardPrice',
  'dividend',     'interest',
  'optionVolume'
]
const UNDERLYING_NAMES = [
"eventSymbol",
"eventTime",
"eventFlags",
"index",
"time",
"sequence",
"volatility",
"frontVolatility",
"backVolatility",
"callVolume",
"putVolume",
"putCallRatio",
"optionVolume"
]
const CHANNEL_DATA_LENGTHS = {
  Summary: SUMMARY_NAMES.length,
  Trade: TRADE_NAMES.length,
  Quote: QUOTE_NAMES.length,
  Greeks: GREEKS_NAMES.length,
  TheoPrice: THEOPRICE_NAMES.length,
  TimeAndSale: TIMEANDSALE_NAMES.length,
  Series: SERIES_NAMES.length,
  Underlying:UNDERLYING_NAMES.length
}

module.exports = {
  CHANNEL_DATA_LENGTHS,
  DATA_CHANNEL,
  SUBSCRIPTION_CHANNEL,
  TIME_SERIES_CHANNEL,
  META_HANDSHAKE_CHANNEL,
  META_CONNECT_CHANNEL,
  TIMEANDSALE_NAMES,
  COMET_URL,
  META_UNSUBSCRIBE_CHANNEL,
  META_DISCONNECT_CHANNEL,
  META_SUBSCRIBE_CHANNEL,
  META_PUBLISH_CHANNEL,
  META_UNSUCCESSFUL_CHANNEL
}
