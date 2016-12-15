module.exports = function testAllAction(plugin, run, options) {
  options = options || {};

  run('testServer', options);
  run('testBrowser', options);
};
