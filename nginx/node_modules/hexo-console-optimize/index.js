var fs = require('fs'),
	path = require('path');

var async = require('async'),
	imagemin = require('imagemin'),
	cleancss = require('clean-css'),
	uglify = require('uglify-js'),
	htmlminifier = require('html-minifier');

var log = hexo.log;

var imageList = [],
	cssList = [],
	jsList = [],
	htmlList = [];

function optimizeHTML(p) {
	return function(next) {
		var start = Date.now();
		var content = fs.readFileSync(p).toString();
		var result = htmlminifier.minify(content, {
			removeComments: true,
			removeCommentsFromCDATA: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeEmptyAttributes: true,
			minifyJS: true
		});
		fs.writeFileSync(p, result, 'utf8');
		var saved = parseInt((content.length - result.length) / content.length * 100, 10);
		log.log('update', 'Optimize HTML: %s ' + '[%s saved]'.yellow + ' (%dms)'.grey, p, saved + '%', Date.now() - start);
		next();
	};
}

function optimizeCSS(p) {
	return function(next) {
		var start = Date.now();
		var content = fs.readFileSync(p).toString();
		var result = cleancss().minify(content);
		fs.writeFileSync(p, result, 'utf8');
		var saved = parseInt((content.length - result.length) / content.length * 100, 10);
		log.log('update', 'Optimize CSS: %s ' + '[%s saved]'.yellow + ' (%dms)'.grey, p, saved + '%', Date.now() - start);
		next();
	};
}

function optimizeJS(p) {
	return function(next) {
		var start = Date.now();
		var content = fs.readFileSync(p).toString();
		var result = uglify.minify(content, {
			fromString: true
		}).code;
		fs.writeFileSync(p, result, 'utf8');
		var saved = parseInt((content.length - result.length) / content.length * 100, 10);
		log.log('update', 'Optimize JS: %s ' + '[%s saved]'.yellow + ' (%dms)'.grey, p, saved + '%', Date.now() - start);
		next();
	};
}

// FIXME: 貌似看起来图片无损压缩没效果
function optimizeImage(p) {
	return function(next) {
		var start = Date.now();
		var stat = fs.statSync(p);
		new imagemin()
			.src(p)
			.dest(p)
			.use(imagemin.jpegtran({
				progressive: true
			}))
			.use(imagemin.optipng({
				optimizationLevel: 3
			}))
			.use(imagemin.pngquant())
		// FIXME: 开启后会问题
		// .use(imagemin.gifsicle({
		// 	interlaced: true
		// }))
		.optimize(
			function(err, file) {
				// var saved = parseInt((stat.size - file.contents.toString().length) / stat.size * 100, 10);
				var saved = parseInt((stat.size - fs.statSync(p).size) / stat.size * 100, 10);
				log.log('update', 'Optimize Image: %s ' + '[%s saved]'.yellow + ' (%dms)'.grey, p, saved + '%', Date.now() - start);
				next();
			});
	};

}

function parse(dir) {
	// 读取目录
	var files = fs.readdirSync(dir);
	// 遍历目录
	for (var i = 0; i < files.length; i++) {
		var p = path.join(dir, files[i]);
		var stat = fs.statSync(p);
		// 如果是目录
		if (stat.isDirectory()) {
			parse(p);
		}
		// 如果是文件
		else if (stat.isFile()) {
			var extname = path.extname(p).substr(1);
			switch (extname) {
				case 'html':
				case 'htm':
					htmlList.push(optimizeHTML(p));
					break;
				case 'css':
					cssList.push(optimizeCSS(p));
					break;
				case 'js':
					jsList.push(optimizeJS(p));
					break;
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'gif':
					imageList.push(optimizeImage(p));
					break;
			}
		}
	}
};

function optimize(args) {
	async.series([
		// 处理开始, 得出待处理文件列表
		function(next) {
			log.log('info', 'Optimize start');
			parse('./public');
			next();
		},
		// 处理HTML
		function(next) {
			log.log('debug', 'Optimize HTML start');
			async.parallel(htmlList, function(err, result) {
				log.log('debug', 'Optimize HTML end');
				next();
			});
		},
		// 处理CSS
		function(next) {
			log.log('debug', 'Optimize CSS start');
			async.parallel(cssList, function(err, result) {
				log.log('debug', 'Optimize CSS end');
				next();
			});
		},
		// 处理JS
		function(next) {
			log.log('debug', 'Optimize JS start');
			async.parallel(jsList, function(err, result) {
				log.log('debug', 'Optimize JS end');
				next();
			});
		},
		// 处理Image
		function(next) {
			log.log('debug', 'Optimize Image start');
			async.parallel(imageList, function(err, result) {
				log.log('debug', 'Optimize Image end');
				next();
			});
		},
		// 处理结束
		function(next) {
			log.log('info', 'Optimize end');
			next();
		},
		// 如果有-d参数则调用deploy进行发布
		function(next) {
			if (args.d) {
				hexo.call("deploy", function() {});
			}
			next();
		}
	]);
}
hexo.extend.console.register('optimize', 'Hexo Optimize', {
	alias: 'o'
}, function(args) {
	hexo.call("generate", function() {
		optimize(args);
	});
});