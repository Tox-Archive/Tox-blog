#Hexo Optimize

一个Hexo的输出优化插件

##Hexo是啥
Hexo是一个静态博客系统，基于NodeJS

http://hexo.io/

##本插件功能

帮助hexo完成HTML、CSS、JS、Image的压缩优化

##安装
进到你的hexo博客根目录安装本插件

```
npm install hexo-console-optimize
```

##命令行

优化资源：HTML、CSS、JS、Image
```
hexo optimize
```

别名
```
hexo o
```

优化并发布
```
hexo o -d
```


##待完成

* 按需优化，对已优化文件不进行二次优化
* 把优化参数放入_config.yml
* 合并CSS、JS
* 合并Image或Base64化