/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const childProcess = require('child_process');


module.exports = (scriptPath) => {
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
