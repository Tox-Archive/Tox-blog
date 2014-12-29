# hexo-generator-minify

A plugin for [Hexo](http://zespia.tw/hexo) to generate static site with _minified_ CSS and Javascript resources.

The plugin process file with the `.css` or `.js` extension, files containing the `.min` or `.pack` suffix in their name  will be ignored.

## Usage

### Install

```
npm install hexo-generator-minify --save
```

### Update

```
npm update
```

### Uninstall

```
npm uninstall hexo-generator-minify
```

### Usage

```
hexo gm
```

Options:
    `--cssSafe`: Skip [_dangerous transformations_](https://github.com/rstacruz/css-condense#the-dangerous-things-it-does) while minimizing CSS

## More info

The _hexo-generator-minify_ plugin borrows a lot from [hexo-minifer](https://npmjs.org/package/hexo-minifer) by [ChrisYip](https://github.com/ChrisYip). Explore other [Hexo plugins](https://github.com/tommy351/hexo/wiki/plugins).

