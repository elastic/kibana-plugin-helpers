var inquirer = require('inquirer');

var createBuild = require('./create_build');

var defaultFiles = [
  'package.json',
  'index.js',
  '{lib,public,server,webpackShims}/**/*'
];

module.exports = function (plugin, run, options) {
  options = options || {};
  var buildVersion = plugin.version;
  var kibanaVersion = (plugin.pkg.kibana && plugin.pkg.kibana.version) || plugin.pkg.version;
  var files = (options.files && options.files.length) ? options.files : defaultFiles;

  // allow options to override plugin info
  if (options.buildVersion) buildVersion = options.buildVersion;
  if (options.kibanaVersion) kibanaVersion = options.kibanaVersion;

  // add dependency files
  var deps = Object.keys(plugin.pkg.dependencies || {});
  if (deps.length === 1) {
    files.push(`node_modules/${ deps[0] }/**/*`);
  } else if (deps.length) {
    files.push(`node_modules/{${ deps.join(',') }}/**/*`);
  }

  return new Promise(function (resolve, reject) {
    if (kibanaVersion === 'kibana') {
      askForKibanaVersion(function (customKibanaVersion) {
        createBuild(plugin, buildVersion, customKibanaVersion, files).then(resolve);
      });
    } else {
      createBuild(plugin, buildVersion, kibanaVersion, files).then(resolve);
    }
  });
};

function askForKibanaVersion(cb) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'kibanaVersion',
      message: 'What version of Kibana are you building for?'
    }
  ]).then(function (answers) {
    cb(answers.kibanaVersion);
  });
}