const run = require('./run');

module.exports = function createCommanderAction(taskName, getOptions = () => {}) {
  return (...args) => {
    // command is the last arg passed by commander, but we move it to the front of the list
    const command = args.pop();

    return Promise
      .resolve()
      .then(() => run(taskName, getOptions(command, ...args)))
      .catch((error) => {
        process.stderr.write(`Task "${taskName}" failed:\n\n${error.stack || error.message}\n`);
        process.exit(1);
      });
  };
};
