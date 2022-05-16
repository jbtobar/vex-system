'use strict';

const _authorization = require('./authorization');
const _accounts = require('./accounts');
const _balances = require('./balances');
const _positions = require('./positions');
const _liveOrders = require('./liveOrders');
const _executeOrder = require('./executeOrder');
const _cancelOrder = require('./cancelOrder');
const _marketMetrics = require('./marketMetrics');
const _history = require('./history');
const _streamer = require('./streamer');
const _optionChain = require('./optionChain');

const _optionChainFutures = require('./optionChainFutures');

let _headers = require('../util/defaultHeaders');

// _headers['Authorization'] = '6wFAM7AnEVhc0xj0WWy95eupWwsJ60eMvB_NlahDWf2l2XH8-ctxPw+C'
// _headers['X-Castle-Request-Token'] = 'RUEFIhcXvQBDDfbxtXTNqLsSeLBW3IrYnZk2woqbWK25HJ3AGppQ7oanKYRinXLA5MMHgcmYVs81NmLPnrpZtNP2R6ry9Vzsq7cN47bUXKD390ms7fEG49f3SabyuXCi_blykL7BHfKuxgz2wa8U49_pTa_7zlih1fBJ7KipCO2vtwz2vrF2i8rUce--9VSo-7l6pv3yUuq-z1ix7fBSrbGoDu2vtw_jzfhbouzwEvWurBPysKgIr5avDqGqrgvw_-4-xBWZqcv8_wqmq6oMogK6dK3q_FHrzLAdiuzwTuvK1BTjzvVIsL7eT6Lu8VSg7bkL9qs9KfKxqBLyp64N776oB_Ouow3zvthwbJaZiOZbFKcIn0o8HjK62sN1m8rpo2HReGGIaQue5z3Dnus9w57rPcOemT3Dnpk9w54ojHmeJYGDW5k9w57ZfYPe2X200O5zsPUlgQBdy3Ub_vmqw5-ZPcOemz08'

let _user = {
    username: null,
    password: null,
    authorization_token: null,
    accounts: []
};

module.exports = {
    setUser: user => {
        _user = {
            ..._user,
            ...user
        };
    },
    getUser: () => _user,
    setAuthorizationToken: (authorization_token) => _headers['Authorization'] = authorization_token,
    getHeaders: () => _headers,

    authorization: () => _authorization(_user.username, _user.password, _headers),
    accounts: () => _accounts(_headers),
    balances: (account_id) => _balances(_headers, account_id),
    positions: (account_id) => _positions(_headers, account_id),
    marketMetrics: (account_id, tickers) => _marketMetrics(_headers, account_id, tickers),
    optionChain: (account_id, ticker) =>  _optionChain(_headers, account_id, ticker),
    optionChainFutures: (account_id, ticker) =>  _optionChainFutures(_headers, account_id, ticker),
    liveOrders: (account_id) => _liveOrders(_headers, account_id),
    executeOrder: (account_id, symbol, price, quantity) => _executeOrder(_headers, account_id, symbol, price, quantity),
    cancelOrder: (account_id, order_id) => _cancelOrder(_headers, account_id, order_id),
    streamer: () => _streamer(_headers),
    history: (account_id, start_date, end_date) => _history(_headers, account_id, start_date, end_date)
}
