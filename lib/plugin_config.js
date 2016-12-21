var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var fileConfig = require('./file_config');

module.exports = function (root) {
  if (!root) root = process.cwd();

  var pkg = require(resolve(root, 'package.json'));
  var config = fileConfig(root);

  return Object.assign({
    root: root,
    kibanaRoot: resolve(root, '../kibana'),
    serverTestPatterns: ['server/**/__tests__/**/*.js'],
    id: pkg.name,
    pkg: pkg,
    version: pkg.version,
  }, config);
};
