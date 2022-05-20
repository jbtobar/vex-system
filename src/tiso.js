/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const Tasty = require('../tasty');
(async () => {

    const TastyWorks = await Tasty()
    const chain = await TastyWorks.optionChainFutures(['/ES']);
    console.log(chain)
})();
