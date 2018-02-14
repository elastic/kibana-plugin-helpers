const resolve = require('path').resolve;
const delimiter = require('path').delimiter;
const execFileSync = require('child_process').execFileSync;
const winCmd = require('../../../lib/win_cmd');

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
  const kibanaBins = resolve(plugin.kibanaRoot, 'node_modules/.bin');
  const mochaSetupScript = resolve(plugin.kibanaRoot, 'test/mocha_setup.js');
  const babelRegisterScript = resolve(plugin.kibanaRoot, 'src/optimize/babel/register');
  let testPaths = plugin.serverTestPatterns;

  // allow server test files to be overridden
  if (options.files && options.files.length) {
    testPaths = options.files;
  }

  const fullCmd = resolve(plugin.kibanaRoot, 'node_modules', '.bin', 'mocha');
  const cmd = winCmd(fullCmd);
  const args = ['--require', canRequire(mochaSetupScript) ? mochaSetupScript : babelRegisterScript].concat(testPaths);
  const path = `${kibanaBins}${delimiter}${process.env.PATH}`;

  execFileSync(cmd, args, {
    cwd: plugin.root,
    stdio: ['ignore', 1, 2],
    env: Object.assign({}, process.env, {
      PATH: path
    })
  });
};
