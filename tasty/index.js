/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @format
 * @flow
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
require('dotenv').config()
// const TastyWorks = require('tasty-works-api');
const TastyWorks = require('../tw-api');
TastyWorks.setUser({
  username: process.env.U,
  password: process.env.P
});
const Tasty = async () => {
  try {
    const token = await TastyWorks.authorization()
    console.log('mmmmmmmmmmmm.........')
    console.log({token})
    console.log('uuuuuuuuuuppp')
    TastyWorks.setAuthorizationToken(token);
    return TastyWorks;
  } catch(err) {
    console.log(err)
    return null;
  }
}
module.exports = Tasty
