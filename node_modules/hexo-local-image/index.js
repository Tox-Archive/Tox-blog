var fs = require('fs');
var path = require('path');
var publicDir = hexo.public_dir;
var sourceDir = hexo.source_dir;
var htmlTag = hexo.util.html_tag;
var route = hexo.route;

var localImage = function(args,content){
  var imageName = args[0]; //images name
  var classes = args[1] || "";
  var imgAttr = args[2] || "{}";
  classes = classes.split(',');
  imgAttr = JSON.parse(imgAttr);

  imgAttr.src   = hexo.config.root + 'images/' + imageName;
  imgAttr.class = classes.join(' ');

  return htmlTag('img', imgAttr);
};

hexo.extend.tag.register('limg',localImage);
hexo.extend.tag.register('limage',localImage);