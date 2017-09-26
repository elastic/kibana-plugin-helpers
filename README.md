# kibana-plugin-helpers

[![CircleCI](https://circleci.com/gh/elastic/kibana-plugin-helpers/tree/master.svg?style=svg)](https://circleci.com/gh/elastic/kibana-plugin-helpers/tree/master)

Just some helpers for kibana plugin devs.

This simple CLI has several tasks that plugin devs can run from to easily debug, test, or package kibana plugins.

```sh
$ plugin-helpers help

  Usage: plugin-helpers [options] [command]

  Commands:

    start                       Start kibana and have it include this plugin
    build [options] [files...]  Build a distributable archive
    test                        Run the server and browser tests
    test:browser [options]      Run the browser tests in a real web browser
    test:server [files...]      Run the server tests using mocha

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

## Versions

Plugin Helpers | Kibana
-------------- | ------
7.x | 4.6+ (node 6+ only)
6.x | 4.6+
5.x | 4.x

# License

Apache-2.0
