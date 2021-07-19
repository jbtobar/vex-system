/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const childProcess = require('child_process');

const run = (scriptPath) => {
  return new Promise((resolve, reject) => {
    let invoked = false;

    const process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error',  (err) => {
        if (invoked) return;
        invoked = true;
        // callback(err);
        reject(err)
    });

    // execute the callback once the process has finished running
    process.on('exit',  (code) =>  {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        if (err) reject(err)
        else resolve(code)
        // callback(err);
    });
  });
}

// function runScript(scriptPath, callback) {
//
//     // keep track of whether callback has been invoked to prevent multiple invocations
//
//
// }
//
// // Now we can run a script and invoke a callback when complete, e.g.
// runScript('pulse/test.js', function (err) {
//     if (err) throw err;
//     console.log('finished running some-script.js');
// });


(async () => {
  const m = await exec(`node pulse/test.js`)
  console.log(m)
})();
// const futuresMarketOpen = async () => {
//   `pm2 start`
//   await resetToken()
//   await futuresManager()
//   await startCometOPT()
//   await launchPublisherOPT()
//   await launchCometTASFUT()
//   await launchFlowMakerFUT()
//   await launchPublisherTASFUT()
// }
//
// const futuresMarketClose = async () => {
//   await closeFlowMakerFUT()
//   await close
// }
