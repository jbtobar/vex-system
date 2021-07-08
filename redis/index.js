/**
 * Code written by and belongs to Juan Bernardo Tobar <jbtobar>
 * jbtobar.io@gmail.com
 * @author Juan Bernardo Tobar <jbtobar.io@gmail.com>
 */
const redis = require("redis");
const client = redis.createClient();
function runBatch(rows,includeKeys) {
  return new Promise(function(resolve, reject) {
    var batch = client.batch();
    for (var i = 0; i < rows.length; i++) {
      batch.hgetall(rows[i])
    }
    batch.exec((err, resp)=> {
      if (err) {
        console.log(err)
        reject(err)
      }
      if (includeKeys) resolve(resp.map((d,i) => [rows[i],d]))
      else resolve(resp)
    });
  });;
}
function hmsetBatch(rows,param) {
  return new Promise(function(resolve, reject) {
    var batch = client.batch();
    for (var i = 0; i < rows.length; i++) {
      batch.hmset(rows[i][param],rows[i])
    }
    batch.exec((err, resp)=> {
      if (err) {
        console.log(err)
        reject(err)
      }
      resolve()
    });
  });;
}
function runBatchMini(rows,params,includeKeys) {
  return new Promise(function(resolve, reject) {
    var batch = client.batch();
    for (var i = 0; i < rows.length; i++) {
      batch.hmget(rows[i],...params)
    }
    batch.exec((err, resp)=> {
      if (err) {
        console.log(err)
        reject(err)
      }
      if (includeKeys) resolve(resp.map((d,i) => [rows[i],...d]))
      else resolve(resp)
    });
  });
}
module.exports = {
  client,
  runBatch,
  runBatchMini,
  hmsetBatch,
  smembers:(args) => {
    return new Promise((resolve, reject) => {
      client.smembers(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  publish:(channel,args) => {
    return new Promise((resolve, reject) => {
      client.publish(channel,args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  hgetall:(args) => {
    return new Promise((resolve, reject) => {
      client.hgetall(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  hmget:(args) => {
    return new Promise((resolve, reject) => {
      client.hmget(...args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  hmset:(args) => {
    return new Promise((resolve, reject) => {
      client.hmset(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  sadd:(args) => {
    return new Promise((resolve, reject) => {
      client.sadd(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  get:(args) => {
    return new Promise((resolve, reject) => {
      client.get(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  del:(args) => {
    return new Promise((resolve, reject) => {
      client.del(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  },
  set:(args) => {
    return new Promise((resolve, reject) => {
      client.set(args,(err,res) => {
        if (err) reject(err)
        else resolve(res)
      })
    });
  }
}
