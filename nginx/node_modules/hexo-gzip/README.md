# Gzip console plugin for [Hexo]

This plugin gzip files produced by Hexo, in order to serve pre-gzipped files with Nginx or Apache2, instead of gzipping them of the fly!

For example in nginx.conf file just add:

```
gzip_static on;
```

## Usage

In the console just type :


```
hexo gzip
```

It automaticaly call generate, then, hexo-gzip.

Feel free to fork, and report bugs!


Author

Vincent RABAH (Twitter: @itwars - Websites: [ITwars]|[NodeJS-News])

License

LGPL. See [COPYING] for more details.


[Hexo]: http://zespia.tw/hexo
[ITwars]: http://it-wars.com
[NodeJS-News]: http://nodejs-news.com
[COPYING]: https://github.com/itwars/hexo-gzip/blob/master/COPYING
