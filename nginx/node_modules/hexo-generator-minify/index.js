var uglify = require('uglify-js'),
    cssc = require('css-condense'),
    async = require('async');

var fs = require('fs'),
    path = require('path'),
    util = require('util');

var supportedResources = {
    'js': function(content, opts) { return uglify.minify(content, { fromString: true }).code },
    'css': function(content, opts) {
            var csscOpts = opts.cssSafe ? {consolidateViaDeclarations: false,
                                            consolidateMediaQueries: false,
                                            consolidateViaSelectors: false,
                                            sortSelectors: false,
                                            lineBreaks: true} : {};
            return cssc.compress(content, csscOpts);
    }
};

/**
 * Navigate a folder recursively and minify resources
 * @param item where to start the navigation from
 */
var minify = function(item, opts) {
  fs.readdir(item, function(err, files) {
      if (!files) return;

      files.forEach(function(file) {
          var target = path.join(item, file);
          var stats = fs.statSync(target);

          if ( stats.isDirectory() ) {
              minify(target, opts);
          } else if (stats.isFile()) {
              compress(target, opts);
          }
      });
  });
};

/**
 * Util to ignore files that are already minified
 * @param filename file to be tested
 * @returns {boolean} true if already minified, false elsewhere
 */
var alreadyPacked = function(filename) {
    return (filename.indexOf(".min") > 0 ||
                filename.indexOf(".pack") > 0);
};

/**
 * Util to check if we have a minification strategy for given file extension
 * @param fileExt file extension to be tested
 * @returns {boolean} true if we are able to minify given extension, false elsewhere
 */
var processable = function(fileExt) {
    return (Object.keys(supportedResources)
                    .indexOf(fileExt) > -1);
};

/**
 * Perform file content minification overwriting the original content
 * @param filename pathname of the file to be minified
 */
var compress = function(filename, opts) {
    var fileExt = path.extname(filename||'').replace(".","");

    if (alreadyPacked(filename) || !processable(fileExt)) return;

    var originalContent = fs.readFileSync(filename).toString();
    var minifiedContent = supportedResources[fileExt](originalContent, opts);

    if (minifiedContent) {
        if (!opts.silent) {
            console.log("[info] Minify: " + filename.replace(hexo.public_dir, ""));
        }
        fs.unlink( filename, function ( err ) {
            if ( err ) throw err;
            fs.writeFile(filename, minifiedContent, 'utf8', function(err) {
                if (err) throw err;
            })
        });
    }
};

/**
 * Plugin hook function.
 *
 * Handled args:
 *      args.silent: do not output anything
 *      args.cssSafe: perform safe CSS minification
 */
hexo.extend.console.register('gm', 'Generate static site with minified CSS and JS resources', function(args) {
    async.series([
        function(next) {
            hexo.call("generate", next)
        },
        function() {
            if (fs.existsSync(hexo.public_dir)) {
                minify(hexo.public_dir, args);
            } else {
                throw new Error(hexo.public_dir + " NOT found.")
            }
        }
    ], function(err){
        if (err) {
            util.error("[error] Minify: -> " + err.message);
        }
    });
});