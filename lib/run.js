var pluginConfig = require('./plugin_config');
var tasks = require('./tasks');

module.exports = function run(name) {
  var action = tasks[name];
  if (!action) throw new Error('Invalid task: "' + name + '"');

  var plugin = pluginConfig();
  var args = [].slice.apply(arguments).slice(1);
  action.apply(null, [plugin, run].concat(args));
};
