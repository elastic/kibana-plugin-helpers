var os = require('os');
var platform = os.platform();

module.exports = function winCmd(cmd) {
  return /^win/.test(platform) ? cmd + '.cmd' : cmd;
}