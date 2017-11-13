const execFileSync = require('child_process').execFileSync;
const { existsSync } = require('fs');
const { resolve, join } = require('path');

module.exports = function (plugin, run, options) {
  options = options || {};
  let args = [];
  let cmd;
  const relativeScript = join('scripts', 'kibana.js');
  const absoluteScript = resolve(plugin.kibanaRoot, relativeScript);
  if (existsSync(absoluteScript)) {
    cmd = 'node';
    args.push(relativeScript);
  } else {
    cmd = (process.platform === 'win32') ? 'bin\\kibana.bat' : 'bin/kibana';
  }

  args = args.concat(['--dev', '--plugin-path', plugin.root]);

  if (Array.isArray(plugin.includePlugins)) {
    plugin.includePlugins.forEach((path) => {
      args = args.concat(['--plugin-path', path]);
    });
  }

  if (options.flags) {
    args = args.concat(options.flags);
  }

  execFileSync(cmd, args, {
    cwd: plugin.kibanaRoot,
    stdio: ['ignore', 1, 2]
  });
};
