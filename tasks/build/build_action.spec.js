/*eslint-env jest*/
const resolve = require('path').resolve;
const fs = require('fs');
const del = require('del');

const PLUGIN_FIXTURE = resolve(__dirname, '__fixtures__/test_plugin');
const PLUGIN_BUILD_DIR = resolve(PLUGIN_FIXTURE, 'build');
const PLUGIN = require('../../lib/plugin_config')(PLUGIN_FIXTURE);
const noop = function () {};

describe('build_action', () => {
  describe('creating build zip', function () {
    const buildAction = require('./build_action');

    beforeEach(() => del(PLUGIN_BUILD_DIR));
    afterEach(() => del(PLUGIN_BUILD_DIR));

    it('creates a zip in the build directory', () => {
      return buildAction(PLUGIN).then(() => {
        if (!fs.existsSync(resolve(PLUGIN_BUILD_DIR, PLUGIN.id + '-' + PLUGIN.version + '.zip'))) {
          throw new Error('expected the plugin to build a zip file');
        }
      });
    });
  });

  describe('calling create_build', () => {
    let mockBuild;
    let buildAction;

    beforeEach(() => {
      jest.resetModules();
      mockBuild = jest.fn(() => Promise.resolve());
      jest.mock('./create_build', () => mockBuild);
      buildAction = require('./build_action');
    });

    it('takes optional build version', function () {
      const options = {
        buildVersion: '1.2.3',
        kibanaVersion: '4.5.6',
      };

      return buildAction(PLUGIN, noop, options).then(() => {
        expect(mockBuild.mock.calls).toHaveLength(1);
        const [ plugin, buildVersion, kibanaVersion, files ] = mockBuild.mock.calls[0];
        expect(buildVersion).toBe('1.2.3');
        expect(kibanaVersion).toBe('4.5.6');
      });
    });

    it('uses default file list without files option', function () {
      var defaultFiles = [
        'package.json',
        'index.js',
        '{lib,public,server,webpackShims}/**/*'
      ];

      return buildAction(PLUGIN).then(() => {
        expect(mockBuild.mock.calls).toHaveLength(1);
        const [ plugin, buildVersion, kibanaVersion, files ] = mockBuild.mock.calls[0];
        defaultFiles.forEach(file => expect(files).toContain(file));
      });
    });

    it('uses only files passed in', function () {
      const options = {
        files: [
          'index.js',
          'LICENSE.txt',
          'plugins/**/*',
          '{server,public}/**/*'
        ]
      };

      return buildAction(PLUGIN, noop, options).then(() => {
        expect(mockBuild.mock.calls).toHaveLength(1);
        const [ plugin, buildVersion, kibanaVersion, files ] = mockBuild.mock.calls[0];
        options.files.forEach(file => expect(files).toContain(file));
      });
    });
  });
});
