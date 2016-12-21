var vfs = require('vinyl-fs');
var zip = require('gulp-zip');
var map = require('through2-map').obj;
var rename = require('gulp-rename');
var join = require('path').join;
var inquirer = require('inquirer');
var execFileSync = require('child_process').execFileSync;

module.exports = function (plugin) {
  var kibanaVersion = (plugin.pkg.kibana && plugin.pkg.kibana.version) || plugin.pkg.version;
  var deps = Object.keys(plugin.pkg.dependencies || {});

  return new Promise(function (resolve, reject) {
    if (kibanaVersion === 'kibana') {
      askForKibanaVersion(function (customKibanaVersion) {
        build(plugin, customKibanaVersion, deps, onComplete);
      });
    } else {
      build(plugin, kibanaVersion, deps, onComplete);
    }

    function onComplete(err) {
      if (err) return reject(err);
      resolve();
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

function toBuffer(string) {
  if (typeof Buffer.from === 'function') {
    return Buffer.from(string, 'utf8');
  } else {
    // this was deprecated in node v5 in favor
    // of Buffer.from(string, encoding)
    return new Buffer(string, 'utf8');
  }
}

function gitInfo(rootPath) {
  try {
    var LOG_SEPARATOR = '||';
    var commitCount = execFileSync('git', ['rev-list', '--count', 'HEAD'], {
      cwd: rootPath,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    });
    var logLine = execFileSync('git', ['log', '--pretty=%h' + LOG_SEPARATOR + '%cD', '-n', '1'], {
      cwd: rootPath,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).split(LOG_SEPARATOR);

    return {
      count: commitCount.trim(),
      sha: logLine[0].trim(),
      date: logLine[1].trim(),
    };
  } catch (e) {
    return {};
  }
}

function build(plugin, kibanaVersion, deps, cb) {
  var buildId = `${plugin.id}-${buildVersion}`;

  var files = [
    'package.json',
    'index.js',
    '{lib,public,server,webpackShims}/**/*'
  ];

  if (deps.length === 1) {
    files.push(`node_modules/${ deps[0] }/**/*`);
  } else if (deps.length) {
    files.push(`node_modules/{${ deps.join(',') }}/**/*`);
  }

  vfs
    .src(files, { cwd: plugin.root, base: plugin.root })

    // modify the package.json file
    .pipe(map(function (file) {
      if (file.basename === 'package.json' && file.dirname === plugin.root) {
        var pkg = JSON.parse(file.contents.toString('utf8'));

        // rewrite the target kibana version while the
        // file is on it's way to the archive
        if (!pkg.kibana) pkg.kibana = {};
        pkg.kibana.version = kibanaVersion;
        pkg.version = buildVersion;

        // append build info
        pkg.build = {
          git: gitInfo(plugin.root),
          date: new Date().toString()
        };

        file.contents = toBuffer(JSON.stringify(pkg, null, 2));
      }

      return file;
    }))

    // put all files inside the correct directoried
    .pipe(rename(function nestFileInDir(path) {
      path.dirname = join('kibana', plugin.id, path.dirname);
    }))

    .pipe(zip(`${buildId}.zip`))
    .pipe(vfs.dest(join(plugin.root, 'build')))
    .on('end', function () {
      cb(null);
    });
}