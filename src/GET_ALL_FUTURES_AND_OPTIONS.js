/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const Tasty = require('../tasty')
const { query } = require('../db')
// const { hmset, get } = require('../redis')
// const cliProgress = require('cli-progress');
const moment = require('moment-timezone');

const Quantity = {
  ONE_HUNDRED:100,
  TEN:10,
  ONE:1
}
// const multibar = new cliProgress.MultiBar({
//     clearOnComplete: false,
//     hideCursor: true,
//     format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Duration: {duration_formatted} | {symbol}'
// }, cliProgress.Presets.shades_classic);
function TimeUtilsA(a) {
    return function(d) {
        return {
            milliseconds: function() {
                return d * a
            }
        }
    }
};
function format(a, e) {
    if (!a || isNaN(+e))
        return e;
    e = "-" == a.charAt(0) ? -e : +e;
    var d = 0 > e ? e = -e : 0,
        b = a.match(/[^\d\-\+#]/g),
        f = b && b[b.length - 1] || ".",
        b = b && b[1] && b[0] || ",";
    a = a.split(f);
    e = e.toFixed(a[1] && a[1].length);
    e = +e + "";
    var g = a[1] && a[1].lastIndexOf("0"),
        h = e.split(".");
    if (!h[1] || h[1] && h[1].length <= g)
        e = (+e).toFixed(g + 1);
    g = a[0].split(b);
    a[0] = g.join("");
    var k = a[0] && a[0].indexOf("0");
    if (-1 < k)
        for (; h[0].length < a[0].length - k;)
            h[0] = "0" + h[0];
    else
        0 == +h[0] && (h[0] = "");
    e = e.split(".");
    e[0] = h[0];
    if (h = g[1] && g[g.length -
    1].length) {
        for (var g = e[0], k = "", l = g.length % h, m = 0, n = g.length; m < n; m++)
            k += g.charAt(m), !((m - l + 1) % h) && m < n - h && (k += b);
        e[0] = k
    }
    e[1] = a[1] && e[1] ? f + e[1] : "";
    return (d ? "-" : "") + e[0] + e[1]
};
const TimeUtils = {
    year: function() {
        return TimeUtils.years(1)
    },
    years: function(a) {
        return {
            milliseconds: function() {
                return 31536E6
            }
        }
    },
    day: function() {
        return TimeUtils.days(1)
    },
    days: TimeUtilsA(864E5),
    hour: function() {
        return TimeUtils.hours(1)
    },
    hours: TimeUtilsA(36E5),
    minute: function() {
        return TimeUtils.minutes(1)
    },
    minutes: TimeUtilsA(6E4),
    second: function() {
        return TimeUtils.seconds(1)
    },
    seconds: TimeUtilsA(1E3),
    MINUTE: 6E4,
    DAY: 864E5
}
const TradeUtils = {
        NEW_YORK_TZ: "America/New_York",
        DAYS_TO_EXPIRE_SOON: 2,
        DAYS_TO_EXPIRE_SOON_POSITION: 4,
        IDEAL_EXPIRATION_DAYS_DEFAULT: 30,
        MAXIMUM_CONFIRMATION_PAUSE_LENGTH: 2E3,
        CLOSE_TO_EARNINGS_DAYS: 20,
        MINUTES_IN_TRADING_DAY: 390,
        DEFAULT_OPTION_MULTIPLIER: Quantity.ONE_HUNDRED,
        VOL_INDEX_EPS: 0.05,
        DEFAULT_TDA_COMMISSIONS: {
            STOCK: {
                PER_ORDER: 7,
                PER_SHARE_ADDITIONAL: 0,
                MINIMUM: 0
            },
            OPTIONS: {
                PER_CONTRACT: 1.5,
                EXERCISE: 15,
                ASSIGNMENT: 15
            }
        },
        RANGE_OVERLAYS: {
            NONE: "none",
            DAILY_LOW_HIGH: "dailyLowHigh",
            EXPECTED_MOVE_EARNINGS: "expectedMoveEarnings"
        },
        INVALID_ORDER: {
            MISMATCH_DELIVERABLE_QUANTITIES: "deliverableQuantitiesMismatch",
            INVALID_PRICE: "invalidPrice",
            GTC_PAST_EXPIRATION_DATE: "gtcPastExpirationDate",
            DUPLICATE_SECURITIES: "duplicateSecurities"
        },
        OPEN_HOUR: 9.5,
        CLOSE_HOUR: 16,
        EXTENDED_OPEN_HOUR: 4,
        EXTENDED_CLOSE_HOUR: 20,
        OPEN_HOUR_SECONDS: 34200,
        CLOSE_HOUR_SECONDS: 57600,
        EXTENDED_OPEN_HOUR_SECONDS: 14400,
        EXTENDED_CLOSE_HOUR_SECONDS: 72E3,
        MARKET_STATUS: {
            OPEN: "open",
            CLOSED: "closed",
            PRE_MARKET: "preMarket",
            AFTER_HOURS: "afterHours"
        },
        STD_DEV_DELTA_UPPER: 0.16,
        STD_DEV_DELTA_LOWER: 0.025,
        STANDARD_DEVIATION_CALCULATION: {
            delta: {
                1: 0.16,
                2: 0.025
            },
            percentOTM: {
                1: 0.68,
                2: 0.95
            }
        },
        // getDefaultForwardDays: function(a) {
        //     return NumberUtils.isNumber(a) ? a : this.IDEAL_EXPIRATION_DAYS_DEFAULT
        // },
        // getDefaultForwardDate: function(a) {
        //     return moment().add(this.getDefaultForwardDays(a), "days")
        // },
        // isTradingDate: function(a) {
        //     a = a.day();
        //     return a !== DateUtils.SUNDAY && a !== DateUtils.SATURDAY
        // },
        // getMarketStatus: function(a) {
        //     null == a && (a = moment());
        //     if (!this.isTradingDate(a))
        //         return TradeUtils.MARKET_STATUS.CLOSED;
        //     a = a.clone().tz(TradeUtils.NEW_YORK_TZ);
        //     a = 3600 * a.hours() + 60 * a.minutes() + a.seconds();
        //     return a < TradeUtils.EXTENDED_OPEN_HOUR_SECONDS ? TradeUtils.MARKET_STATUS.CLOSED : a < TradeUtils.OPEN_HOUR_SECONDS ? TradeUtils.MARKET_STATUS.PRE_MARKET : a < TradeUtils.CLOSE_HOUR_SECONDS ? TradeUtils.MARKET_STATUS.OPEN : a < TradeUtils.EXTENDED_CLOSE_HOUR_SECONDS ? TradeUtils.MARKET_STATUS.AFTER_HOURS : TradeUtils.MARKET_STATUS.CLOSED
        // },
    //     isTradingDateTime: function(a) {
    //         return this.getMarketStatus(a) === TradeUtils.MARKET_STATUS.OPEN
    //     },
        tradeTimeForDateStrings: function(a,
        e, d, b) {
            return TradeUtils._adjustDateTimeForHour(moment.tz(a + e + d, "YYMMDD", TradeUtils.NEW_YORK_TZ), b)
        },
    //     tradeTimeForDate: function(a, e) {
    //         return TradeUtils._adjustDateTimeForHour(moment(a).tz(TradeUtils.NEW_YORK_TZ), e)
    //     },
        _adjustDateTimeForHour: function(a, e) {
            var d;
            d = Math.floor(e);
            return a.hour(d).minutes(60 * (e % 1)).seconds(0).milliseconds(0)
        },
        openingTimeForDateStrings: function(a, e, d) {
            return this.tradeTimeForDateStrings(a, e, d, TradeUtils.OPEN_HOUR)
        },
    //     openingTimeForDate: function(a) {
    //         return this.tradeTimeForDate(a,
    //         TradeUtils.OPEN_HOUR)
    //     },
    //     closingTimeToday: CacheUtils.temporalCache(function() {
    //         var a;
    //         a = moment.tz(TradeUtils.NEW_YORK_TZ);
    //         return TradeUtils.closingTimeForDate(a)
    //     }, TimeUtils.MINUTE),
        closingTimeForDateStrings: function(a, e, d) {
            return this.tradeTimeForDateStrings(a, e, d, TradeUtils.CLOSE_HOUR)
        },
    //     closingTimeForDate: function(a) {
    //         return this.tradeTimeForDate(a, TradeUtils.CLOSE_HOUR)
    //     },
    //     isTdaReconciliationPeriod: function() {
    //         return TradeUtils.isTdaReconciliationPeriodForDate(moment())
    //     },
    //     isTdaReconciliationPeriodForDate: function(a) {
    //         return TradeUtils.closingTimeForDate(a).isBefore(a)
    //     },
    //     minutesUntilClosing: CacheUtils.temporalCache(function() {
    //         return TradeUtils.minutesUntilClosingForDate(moment())
    //     }, TimeUtils.MINUTE),
    //     minutesUntilClosingForDate: function(a) {
    //         return TradeUtils.closingTimeForDate(a).diff(a, "minutes")
    //     },
    //     isExpired: function(a, e) {
    //         var d;
    //         null == e && (e = moment());
    //         return !a ? !0 : a.isBefore(e) ? a.year() === e.year() && a.month() === e.month() && a.date() === e.date() ? (d = TradeUtils.minutesUntilClosingForDate(e), 0 < d ? !1 : !0) : !0 : !1
    //     },
    //     isOpeningTime: function(a) {
    //         var e;
    //         if (!this.isTradingDate(a))
    //             return !1;
    //         e =
    //         this.tradeTimeForDate(a, TradeUtils.OPEN_HOUR);
    //         return a.isSame(e, "second")
    //     },
    //     isClosingTime: function(a) {
    //         var e;
    //         if (!this.isTradingDate(a))
    //             return !1;
    //         e = this.tradeTimeForDate(a, TradeUtils.CLOSE_HOUR);
    //         return a.isSame(e, "second")
    //     },
    //     isMarketOpen: CacheUtils.temporalCache(function() {
    //         return TradeUtils.isTradingDateTime(moment())
    //     }, TimeUtils.MINUTE),
    //     isOptionInTheMoney: function(a, e, d) {
    //         return e ? a <= d : a >= d
    //     },
    //     isQuoteInTheMoney: function(a, e) {
    //         var d,
    //             b,
    //             f,
    //             g;
    //         if (!a || !e)
    //             return !1;
    //         b = a.loaded && e.loaded;
    //         d = a.error || e.error;
    //         g = e.get("strikePrice");
    //         f = a.get("last");
    //         return !b || d || !g || !g ? !1 : this.isOptionInTheMoney(g, e.get("isCall"), f)
    //     },
    //     directionFunc: function(a) {
    //         return Ember.computed(function() {
    //             return 0 < this.get(a) ? "up" : 0 === this.get(a) ? "same" : "down"
    //         }).property(a)
    //     },
    //     sign: function(a, e) {
    //         null == e && (e = NumberUtils.EPS);
    //         return NumberUtils.isZero(a, e) ? "neutral" : 0 > a ? "negative" : "positive"
    //     },
    //     lookupVolatilityIndex: function(a, e, d) {
    //         var b,
    //             f;
    //         if (!a || !a.findImpliedVolatilityForOptionChainTypeAndExpiration)
    //             return NaN;
    //         e ? b = a.findImpliedVolatilityForOptionChainTypeAndExpiration(e.get("chainType"),
    //         e.get("expirationDate")) : d && (b = a.findImpliedVolatilityForOptionChainTypeAndExpiration(d.get("chain.chainType"), d.date));
    //         return b ? b.impliedVolatility : (f = a.get("volatilityIndex")) ? f : NaN
    //     },
    //     isClosingStockLeg: function(a, e) {
    //         return !e || !a ? !1 : a.get("isBuy") && e.get("isShort") || a.get("isSell") && e.get("isLong") ? a.get("quantity").isLessThanOrEqualTo(e.get("absQuantity")) : !1
    //     },
    //     intrinsicValueAtPrice: function(a, e, d) {
    //         var b,
    //             f,
    //             g;
    //         g = 0;
    //         b = a.getProperties("isStock", "multiplier", "notionalMultiplier");
    //         b.isStock ? g = d * (e ? 1 : -1) :
    //         (a = a.getProperties("strikePrice", "isCall"), f = a.strikePrice, a.isCall ? d >= f && (g = e ? d - f : f - d) : d <= f && (g = e ? f - d : d - f));
    //         return g * b.multiplier.multiply(b.notionalMultiplier).toNumeric()
    //     },
    //     oppositeAction: function(a) {
    //         switch (a) {
    //         case "buy":
    //             return "sellshort";
    //         case "sell":
    //             return "buytocover";
    //         case "sellshort":
    //             return "buy";
    //         case "buytocover":
    //             return "sell";
    //         case "buytoopen":
    //             return "selltoopen";
    //         case "buytoclose":
    //             return "selltoclose";
    //         case "selltoopen":
    //             return "buytoopen";
    //         case "selltoclose":
    //             return "buytoclose"
    //         }
    //     },
    //     oppositeOpenCloseAction: function(a) {
    //         switch (a) {
    //         case "buytoopen":
    //             return "buytoclose";
    //         case "selltoopen":
    //             return "selltoclose";
    //         case "buytoclose":
    //             return "buytoopen";
    //         case "selltoclose":
    //             return "selltoopen";
    //         default:
    //             return a
    //         }
    //     },
    //     checkLegForClosing: function(a, e) {
    //         var d;
    //         null != e ? (d = a.get("isOption") ? e.get("isLong") !== a.get("isBuy") : TradeUtils.isClosingStockLeg(a, e), d = d !== a.get("isClose")) : d = a.get("isClose");
    //         if (d)
    //             return a.swapOpenClose()
    //     }
    // }
}
const f = {
    OCC_SYMBOL_PATTERN: /^([A-Z]{1,5})(\d?)([ ]{0,5})(\d{2})(\d{2})(\d{2})([CP])(\d{8})$/,
    OPTION_SYMBOL_PATTERN_OLD: /^([A-Z]+)(\d?)(\d{2})(\d{2})(\d{2})(\w)(.+)$/,
    OPTION_SYMBOL_PATTERN_NEW: /^([A-Z]+)(\d?)_(\d{2})(\d{2})(\d{2})(\w)(.+)$/,
    DX_OPTION_SYMBOL_PATTERN: /^\.([A-Z]+)(\d?)(\d{2})(\d{2})(\d{2})(\w)(.+)$/,
    DX_FUTURES_OPTION_SYMBOL_PATTERN: /^(\/[A-Z0-9]+)()_(\d{2})(\d{2})(\d{2})(\w)(.+)$/,
    TW_TWO_DIGIT_YEAR_FUTURES_OPTION_SYMBOL_PATTERN: /^\.\/([A-Z0-9]{2,4})([A-Z])([0-9]{2})[ ]([A-Z0-9]{2,4})([A-Z])([0-9]{2})[ ](\d{2})(\d{2})(\d{2})([CP])(\S+)$/,
    TW_ONE_DIGIT_YEAR_FUTURES_OPTION_SYMBOL_PATTERN: /^\.\/([A-Z0-9]{2,3})([A-Z])([0-9])[ ]{0,1}([A-Z0-9]{2,3})([A-Z])([0-9])[ ]{0,2}(\d{2})(\d{2})(\d{2})([CP])(\S+)$/,
    CRYPTO: /^[A-Z]+\/USD(:CXTALP)?$/
};

function getExpirationDateAdjustedForHolidays(a) {
    var b;
    // b = a.format("YYYY-MM-DD");
    // if (e[b] || 6 === a.day())
    //     a = a.clone(), a.subtract(1, "days");
    return a
}

function getDaysToExpirationWithType(a, b) {
    var d,
        e,
        f;
    d = b.startDate;
    f = b.settlementType;
    null == d && (d = new Date);
    e = (getExpirationDateAdjustedForHolidays(a) -
    d) / TimeUtils.DAY;
    if (0 > e)
        return NaN;
    d = Math.floor(e);
    d = 0.6 < e - d ? d + 1 : d;
    return "AM" === f ? 1 > d ? 0 : d - 1 : d
}
function optionSymbolToObject(a) {

  h = function(b) {
        return (b = a[b]) && 0 > b.standard
    };
  b = {
        SPXW: "SPX",
        SPXQ: "SPX",
        RUTW: "RUT",
        NDXP: "NDX",
        VIXW: "VIX",
        BFA: "BF/A",
        BFB: "BF/B",
        BRKB: "BRK/B",
        CBSA: "CBS/A",
        EBRB: "EBR/B",
        FCEA: "FCE/A",
        HEIA: "HEI/A",
        JWA: "JW/A",
        LGFA: "LGF/A",
        NYLDA: "NYLD/A",
        MOGA: "MOG/A",
        PBRA: "PBR/A",
        RDSA: "RDS/A",
        RDSB: "RDS/B",
        VALEP: "VALE/P"
    };
    var e,
        g,
        p,
        q,
        s,
        r,
        t,
        u,
        x,
        w,
        v,
        A,
        y,
        C,
        B,
        D,
        E;
    try {
        if (s = null, u = a.match(f.OCC_SYMBOL_PATTERN))
            E = u[4], t = u[5], g = u[6], e = u[7], B = u[8], C = parseFloat(B) / 1E3, A = a;
        else if (0 === a.indexOf("./") && 20 < a.length)
            if (u = a.match(f.TW_TWO_DIGIT_YEAR_FUTURES_OPTION_SYMBOL_PATTERN))
                w =
                "/" + u[1] + u[2] + u[3], s = u[4] + u[5] + u[6], E = u[7], t = u[8], g = u[9], e = u[10], B = u[11], C = parseFloat(B), A = a, y = w + " " + s + " ";
            else if (u = a.match(f.TW_ONE_DIGIT_YEAR_FUTURES_OPTION_SYMBOL_PATTERN))
                w = "/" + u[1] + u[2] + u[3], s = u[4] + u[5] + u[6], E = u[7], t = u[8], g = u[9], e = u[10], B = u[11], C = parseFloat(B), A = a, y = a.substring(0, 13);
            else
                throw Error("Invalid future option symbol");
        else
            0 === a.indexOf("/") ? (u = a.match(f.DX_FUTURES_OPTION_SYMBOL_PATTERN), t = u[3], g = u[4], E = u[5], e = u[6], B = u[7], C = parseFloat(B), A = a) :
            -1 < a.indexOf("_") ? (u = a.match(f.OPTION_SYMBOL_PATTERN_NEW), t = u[3], g = u[4], E = u[5], e = u[6], B = u[7], C = parseFloat(B), A = a) : "." === a[0] ? (u = a.match(f.DX_OPTION_SYMBOL_PATTERN), E = u[3], t = u[4], g = u[5], e = u[6], B = u[7], C = parseFloat(B), A = a) : (u = a.match(f.OPTION_SYMBOL_PATTERN_OLD), E = u[3], t = u[4], g = u[5], e = u[6], B = u[7], C = parseFloat(B), A = "" + u[1] + u[2] + "_" + (u[4] + u[5] + u[3] + u[6] + u[7]))
    } catch (J) {
        throw Error(J);
    }
    w || (w = u[1]);
    y || (y = w);
    D = b[w] || w;
    h(y) ? (q = TradeUtils.openingTimeForDateStrings(E, t, g, q), p = "AM") : (q = TradeUtils.closingTimeForDateStrings(E, t, g, q), p = "PM");
    w = "standard";
    null === s ? (a = "20" + E + "-" + t + "-" + g + " " + p, v = x = u[2], u = TradeUtils.DEFAULT_OPTION_MULTIPLIER, x && (0 <= k.call(d, x) ? (u = Quantity.TEN, w = "mini" + x) : w = "ns" + x, r = x)) : (a = "20" + E + "-" + t + "-" + g + " " + s, u = Quantity.ONE);
    p = getDaysToExpirationWithType(q, {
        symbol: y,
        settlementType: p
    });
    return {
        underlyingSymbol: D,
        expirationDate: q,
        daysToExpiration: p,
        callOrPut: e,
        strikePrice: C,
        realTradingSymbol: A,
        optionChainType: w,
        miniFlag: r,
        rawOptionChainType: v,
        multiplier: u,
        dateRaw: "" + E + t + g,
        strikePriceRaw: B,
        rootSymbol: y,
        expirationKey: a,
        futureOptionRootSymbol: s
    }
}

function futuresTranslate(b,d,dxcode) { // MQ1
  var a = /^(\/?\w+)([FGHJKMNQUVXZY])(\d{1,2})(:X\w{3})?$/;
  var e,
      h,
      k,
      l,
      m,
      n;
  null == d && (d = !0);
  h = a.exec(b);
  if (!h)
      return k = d ? dxcode :
      "", "" + b + k;
  if (h[4])
      return b;
  n = h[1];
  m = h[2];
  l = h[3];
  k = d ? dxcode: "";
  if (!l || 1 < l.length)
      return "" + b + k;
  e = (new Date).getFullYear();
  h = e % 10;
  e = e % 100 - h;
  l = parseInt(l);
  l < h && (e += 10);
  return "" + n + m + (e + l) + k
}
function optionInDXFormat(a,dxcode) {
    var d,
        e,
        h;
    // a = _.isString(a) ? optionSymbolToObject(a) : a;
    a = optionSymbolToObject(a);
    return !a.dateRaw ? null : a.futureOptionRootSymbol ? (d = a.strikePrice, 0 === a.futureOptionRootSymbol.indexOf("OZTNOTNOT") && (d = Math.round(d, 2, Math.floor)), e = format("0.#######", d), d = dxcode, h = futuresTranslate(a.futureOptionRootSymbol, !1,dxcode), "./" + h + a.callOrPut + e + d) : "." + (a.rootSymbol ||
    a.underlyingSymbol) + a.rawOptionChainType + a.dateRaw + a.callOrPut + a.strikePrice
}
// const fs = require('fs');
async function insertIntoChainDir(futSymbol,chains,dxcode) {
  try {
    const chain = chains[0]
    // console.log({chains})
    if (chains.length !== 1) console.log(futSymbol,chains)
    const expirations = chain.expirations
    const exerciseStyle = chain['exercise-style']
    const rootsymbol = chain['root-symbol']
    const underlyingSymbol = chain['underlying-symbol']
    for (var j = 0; j < expirations.length; j++) {
      const expiration = expirations[j]
      const us = expiration['underlying-symbol'] //'/ESM1'
      const rs = expiration['root-symbol'] //'/ES'
      const ors = expiration['option-root-symbol'] // 'E2A'
      const ocs = expiration['option-contract-symbol'] //'E2AJ1'
      const asset = expiration['asset'] //'E2A'
      const ed = expiration['expiration-date'] //'2021-04-12'
      const dte = expiration['days-to-expiration'] //24
      const nv  = expiration['notional-value'] // '0.5'
      const df  = expiration['display-factor'] // '0.01'
      const sf  = expiration['strike-factor'] // '1.0'
      const sta  = expiration['stops-trading-at'] // '2021-04-12T20:00:00.000+00:00'
      const ea = expiration['expires-at'] // '2021-04-12T20:00:00.000+00:00'
      const ts = expiration['tick-sizes'] // [ { value: '0.05', threshold: '5.0' }, { value: '0.25' } ]
      const strikes = expiration.strikes
      for (var i = 0; i < strikes.length; i++) {
        try {
          const strikeContracts = strikes[i]
          const optionsymbol_CALL = strikeContracts.call
          const optionsymbol_PUT = strikeContracts.put
          const strike = strikeContracts['strike-price']
          // {
          //   'strike-price': '4105.0',
          //   call: './ESM1 E2AJ1 210412C4105',
          //   put: './ESM1 E2AJ1 210412P4105'
          // }

          // './RTYM1R1EJ1 210401C2420',
          // ./RTYM21C2420:XCME

          // ./ESH21P3780:XCME',
          // ./ESM21P3780:XCME
          // ./MQ1J21C12800:XCME


// {
// 'strike-price': '10450.0',
// call: './MNQM1MQEH1 210331C10450',
// put: './MNQM1MQEH1 210331P10450'
// } { us: '/MNQM1', rs: '/MNQ', ors: 'MQE', ocs: 'MQEH1', asset: 'MQE' }

// {
//   'strike-price': '2460.0',
//   call: './RTYM1R1EJ1 210401C2460',
//   put: './RTYM1R1EJ1 210401P2460'
// } { us: '/RTYM1', rs: '/RTY', ors: 'R1E', ocs: 'R1EJ1', asset: 'R1E' }
          const optioncode_CALL = optionInDXFormat(optionsymbol_CALL,`:${dxcode}`)
          const optioncode_PUT = optionInDXFormat(optionsymbol_PUT,`:${dxcode}`)
/*
          const optioncode_CALL = optionsymbol_CALL.split(' ')[2] && false
            ? `.${us.substring(0,us.length-1)}${optionsymbol_CALL.split(' ')[2].substring(0,2)}${optionsymbol_CALL.split(' ')[2].substring(6)}:${dxcode}`
            : `./${ocs.substring(0,ocs.length-1)}${optionsymbol_CALL.split(' ')[1].substring(0,2)}${optionsymbol_CALL.split(' ')[1].substring(6)}:${dxcode}`

          const optioncode_PUT = optionsymbol_CALL.split(' ')[2] && false
            ?  `.${us.substring(0,us.length-1)}${optionsymbol_PUT.split(' ')[2].substring(0,2)}${optionsymbol_PUT.split(' ')[2].substring(6)}:${dxcode}`
            : `./${ocs.substring(0,ocs.length-1)}${optionsymbol_PUT.split(' ')[1].substring(0,2)}${optionsymbol_PUT.split(' ')[1].substring(6)}:${dxcode}`
*/
          await query(`INSERT INTO futchainx(
            underlying_symbol,
            rootsymbol,
            option_root_symbol,
            option_contract_symbol,
            asset,
            expirydate,
            days_to_expiration,
            notional_value,
            display_factor,
            strike_factor,
            stops_trading_at,
            expires_at,
            tick_sizes,
            strike,
            flag,
            optionsymbol,
            optioncode
          ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,[
            us,
            rs,
            ors,
            ocs,
            asset,
            ed,
            dte,
            nv,
            df,
            sf,
            sta,
            ea,
            JSON.stringify(ts),
            Number(strike),
            'C',
            optionsymbol_CALL,
            optioncode_CALL
          ])

          await query(`INSERT INTO futchainx(
            underlying_symbol,
            rootsymbol,
            option_root_symbol,
            option_contract_symbol,
            asset,
            expirydate,
            days_to_expiration,
            notional_value,
            display_factor,
            strike_factor,
            stops_trading_at,
            expires_at,
            tick_sizes,
            strike,
            flag,
            optionsymbol,
            optioncode
          ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,[
            us,
            rs,
            ors,
            ocs,
            asset,
            ed,
            dte,
            nv,
            df,
            sf,
            sta,
            ea,
            JSON.stringify(ts),
            Number(strike),
            'P',
            optionsymbol_PUT,
            optioncode_PUT
          ])
        }  catch(err) {
          console.log(err)
          console.log(strikes[i],{
            us,
            rs,
            ors,
            ocs,
            asset
          })
        }
      }

    }
    //
  } catch(err) {
    console.log(err)
  }
}

async function insertIntoFutDir(dxcode,futures) {
  try {
    for (var i = 0; i < futures.length; i++) {
      const fut = futures[i]
      try {
        await query(`INSERT INTO futdirx(
          symbol,
          rootsymbol,
          dxcode,
          expiration_date,
          dte,
          active_month,
          next_active_month,
          stops_trading_at,
          expires_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
        [
          fut.symbol,
          fut['root-symbol'],
          dxcode,
          fut['expiration-date'],
          fut['days-to-expiration'],
          fut['active-month'],
          fut['next-active-month'],
          fut['stops-trading-at'],
          fut['expires-at']
        ]
        )
      }catch(err) {
        console.log(err)
        console.log([
          fut.symbol,
          fut['root-symbol'],
          dxcode,
          fut['expiration-date'],
          fut['days-to-expiration'],
          fut['active-month'],
          fut['next-active-month'],
          fut['stops-trading-at'],
          fut['expires-at']
        ])
        console.log('----------4')
        // process.exit()
      }

    }
  } catch(err) {
    console.log(err)
    console.log(dxcode,futures)
    console.log('----------3')
  }
}
// let chain
// let mm
// async function run() {
//   const TastyWorks = await Tasty()
//   chain = await TastyWorks.optionChainFutures(['/YM']);
//   mm = await TastyWorks.marketMetrics(['/YM']);
// }





async function run() {
  let startTime = new Date().getTime()
  const TastyWorks = await Tasty()
  if (!TastyWorks) return process.exit();
  const {rows} = await query(`select * from futuresdir;`)
  // const bar1 = multibar.create(rows.length, 0);
  // bar1.start(rows.length,0,{symbol:''})
  for (var i = 0; i < rows.length; i++) {
    const future  = rows[i]
    try {
      const dxcode = future.dxsymbol.split(':')[1]
      // bar1.increment({symbol:future.symbol})
      const chain = await TastyWorks.optionChainFutures([future.symbol]);
      await insertIntoFutDir(dxcode,chain.futures)
      if (chain['option-chains']) {
        await insertIntoChainDir(future.symbol,chain['option-chains'],dxcode)
      }
    } catch (e) {
      if (e.status  !== 404) {
        console.log(e)
        console.log(future)
        console.log('----------5')
      }

    }
  }
  // bar1.stop()
  // console.log(chain['option-chains'][0].expirations[0].strikes)
  // let data = ;
  // fs.writeFileSync('/ES.json', JSON.stringify(chain));
  return new Date().getTime()-startTime
}

async function GET_ALL_FUTURES_AND_OPTIONS() {
  try {
    // console.log('---------------------------------------------------------------')
    // console.log('\n')
    // console.log('START: GET_ALL_FUTURES_AND_OPTIONS')
    // console.log('TIME:',new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))
    // console.log('\n')
    await query('TRUNCATE TABLE futdirx;')
    await query('TRUNCATE TABLE futchainx;')
    console.log(' - truncated table futdirx')
    console.log(' - truncated table futchainx')
    const duration = await run()
    console.log(` - finished getting all futures and options, duration: ${duration}`)
    let data = await query('SELECT COUNT(*) FROM futdirx;')
    console.log(` - ${data.rows[0].count} futures in futdirx`)
    data = await query('SELECT COUNT(*) FROM futchainx;')
    console.log(` - ${data.rows[0].count} futures options in futchainx`)
    // console.log('\n')
    // console.log('END: GET_ALL_FUTURES_AND_OPTIONS')
    // console.log('TIME:',new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))
    // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    // console.log('---------------------------------------------------------------')
    return true;
  } catch (e) {
    console.log(e)
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log('ERROR: GET_ALL_FUTURES_AND_OPTIONS')
    console.log('TIME:',new Date().toLocaleString("en-US", {timeZone: "America/New_York"}))
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    console.log('---------------------------------------------------------------')
  }
}
module.exports = GET_ALL_FUTURES_AND_OPTIONS
// var myArgs = process.argv.slice(2);
// console.log(myArgs)
// if (myArgs[0] === 'force') {
//   console.log('forcing')
//   run()
//
// }
//
//
// const schedule = require('node-schedule');
// const rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [new schedule.Range(1, 5)];
// rule.hour = 5;
// rule.minute = 0;
// // pulseContext(true)
// var j = schedule.scheduleJob(rule, function() {
//   console.log('Running schedule',new Date().toJSON());
//   run()
// });

/*
e = {
        "/ZB": "XCBT",
        "/ZN": "XCBT",
        "/ZF": "XCBT",
        "/ZT": "XCBT",
        "/UB": "XCBT",
        "/GE": "XCME",
        "/6A": "XCME",
        "/6B": "XCME",
        "/6C": "XCME",
        "/6E": "XCME",
        "/6J": "XCME",
        "/6M": "XCME",
        "/ZC": "XCBT",
        "/ZS": "XCBT",
        "/ZW": "XCBT",
        "/HE": "XCBT",
        "/CL": "XNYM",
        "/NG": "XNYM",
        "/GC": "XCEC",
        "/SI": "XCEC",
        "/HG": "XCEC",
        "/ES": "XCME",
        "/NQ": "XCME",
        "/YM": "XCBT",
        "/RTY": "XCME",
        "/VX": "XCBF",
        "/VXM": "XCBF",
        "/BTC": "XCME"
    };
*/
