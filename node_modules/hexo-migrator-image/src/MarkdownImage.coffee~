file = hexo.file

# downloader = require('./downloader')

module.exports = class Image
        constructor: (@alt, @url, @opt) ->
                @localPath = ""
        download: (downloader, callback) ->
                downloader.download @, (err, succ) =>
                        @localPath = succ
                        callback?(err, succ)

