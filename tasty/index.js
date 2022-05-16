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
    // const token = await TastyWorks.authorization()
    token = "dGFzdHksbGl2ZSwsMTY1Mjc4Mjg0OCwxNjUyNjk2NDQ4LFUwMDAwOTIxODYw.Gg5pwy3knK_oELeefRMlhBgtol3Z3GwOnQ5z2odA3Kc"
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
