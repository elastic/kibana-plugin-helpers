var resolve = require('path').resolve;
var delimiter = require('path').delimiter;
var execFileSync = require('child_process').execFileSync;
var winCmd = require('../../../lib/win_cmd');

function canRequire(path) {
  try {
    require.resolve(path);
    return true;
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
    return false;
  }
}

module.exports = function (plugin, run, options) {
  options = options || {};
  var kibanaBins = resolve(plugin.kibanaRoot, 'node_modules/.bin');
  var mochaSetupScript = resolve(plugin.kibanaRoot, 'test/mocha_setup.js');
  var babelRegisterScript = resolve(plugin.kibanaRoot, 'src/optimize/babel/register');
  var testPaths = plugin.serverTestPatterns;

  // allow server test files to be overridden
  if (options.files && options.files.length) {
    testPaths = options.files;
  }

  var fullCmd = resolve(plugin.kibanaRoot, 'node_modules', '.bin', 'mocha');
  var cmd = winCmd(fullCmd);
  var args = ['--require', canRequire(mochaSetupScript) ? mochaSetupScript : babelRegisterScript].concat(testPaths);
  var path = `${kibanaBins}${delimiter}${process.env.PATH}`;

  execFileSync(cmd, args, {
    cwd: plugin.root,
    stdio: ['ignore', 1, 2],
    env: Object.assign({}, process.env, {
      PATH: path
    })
  });
};
