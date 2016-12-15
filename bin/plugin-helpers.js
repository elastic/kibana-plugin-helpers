#!/usr/bin/env node

var program = require('commander');

var pkg = require('../package.json');
var run = require('../lib/run');
var docs = require('../lib/docs');
var enableCollectingUnknownOptions = require('../lib/enable_collecting_unknown_options');

program
  .version(pkg.version);

enableCollectingUnknownOptions(
  program
    .command('start')
    .description('Start kibana and have it include this plugin')
    .on('--help', docs('start'))
    .action(run('start'))
);

program
  .command('build')
  .description('Build a distributable archive')
  .on('--help', docs('build'))
  .action(run('build'));

program
  .command('test')
  .description('Run the server and browser tests')
  .on('--help', docs('test/all'))
  .action(run('testAll'));

program
  .command('test:browser')
  .description('Run the browser tests in a real web browser')
  .option('--dev', 'Enable dev mode, keeps the test server running')
  .option('-p, --plugins <plugin-ids>', 'Manually specify which plugins\' test bundles to run')
  .on('--help', docs('test/browser'))
  .action(run('testBrowser'));

program
  .command('test:server [files...]')
  .description('Run the server tests using mocha')
  .on('--help', docs('test/server'))
  .action(run('testServer'));

program
  .parse(process.argv);
