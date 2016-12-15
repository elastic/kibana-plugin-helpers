var pluginConfig = require('./plugin_config');
var tasks = require('./tasks');

module.exports = function run(name) {
  var action = tasks[name];
  if (!action) throw new Error('Invalid task: "' + name + '"');

  return function () {
    // call the action function with the plugin, then all
    // renaining arguments from commander
    var plugin = pluginConfig();
    var args = [].slice.apply(arguments);

    action.apply(null, [plugin, run].concat(args));
  };
};
