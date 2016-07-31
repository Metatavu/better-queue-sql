var fs      = require('fs');
var extend  = require('extend');
var util    = require('util');
var knex    = require('knex');

function SqliteAdapter(opts) {
  extend(this, opts);
}

SqliteAdapter.prototype.connect = function (cb) {
  if (this.knex) return cb();
  this.knex = knex({
    client: 'sqlite3',
    connection: {
      filename: this.path || ':memory:',
    },
    debug: false,
    useNullAsDefault: true,
  });
  cb();
};

SqliteAdapter.prototype.upsert = function (properties, cb) {
  var keys = Object.keys(properties);
  var values = keys.map(function (k) {
    return properties[k];
  });
  var sql = 'INSERT OR REPLACE INTO ' + this.tableName + ' (' + keys.join(',') + ') VALUES (' + values.map(function (x) { return '?'; }).join(',') + ')';
  this.knex.raw(sql, values).then(function () { cb(); }).error(cb);
};

SqliteAdapter.prototype.close = function (cb) {
  setImmediate(cb);
};

module.exports = SqliteAdapter;
