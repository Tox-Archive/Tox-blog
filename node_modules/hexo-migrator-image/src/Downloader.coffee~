fs = require 'fs'
Url = require 'url'
Path = require 'path'
crypto = require 'crypto'
colors = require 'colors'
file = hexo.file

# Add future protocol extensions here
protocols =
        http: require 'http'
        https: require 'https'

isRemoteUrl = (url) ->
        return url.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/)?


isLocalUrl = (url) ->
        return fs.existsSync(url)

defaultFileName = (path) ->
        u = Url.parse(path)
        shasum = crypto.createHash('sha1').update(u.href)
        ext = Path.extname(u.path)
        digest = shasum.digest('hex')

        return digest + ext


module.exports = class Downloader
        constructor: (@imageFolder) ->

        download: (img, callback) ->
                # TODO: download
                url = img.url
                fileName = defaultFileName url
                to = @imageFolder + fileName
                console.log "FILE ".blue + "GET".yellow + " %s", url
                # Skip downloaded
                if fs.existsSync(to)
                        console.log("SKIP".green + " %s", fileName)
                        callback?(null, fileName)
                        return

                isRemote = isRemoteUrl(url)
                isLocal = isLocalUrl(url)

                if isRemote
                        @downloadRemoteImage url, fileName, (err, succ) ->
                                img.localPath = succ
                                callback?(err, succ)
                else
                        @copyLocalImage url, fileName, (err, succ) ->
                                img.localPath = succ
                                callback?(err, succ)

        downloadRemoteImage: (from, fileName, callback) ->
                to = Path.resolve @imageFolder, fileName
                protocol_name = Url.parse(from).protocol
                protocol = protocols[protocol_name]
                if not protocol?
                        return callback?(new Error("Unsupported protocol '#{protocol_name}'"), fileName)

                request = protocol.get(from, ((response) ->
                        if (response.statusCode == 200)
                                console.log("#{protocol_name} ".blue + "%d ".green + "%s", response.statusCode, from);

                                ws = fs.createWriteStream(to)
                                        .on("error", (err) -> callback?(err, fileName))
                                        .on("close", ((err) ->
                                                console.log("SAVE".green + " %s", to)
                                                callback?(null, fileName)))

                                response.pipe(ws)
                        else
                                console.log "HTTP ".blue + "%d ".red.blue + "%s", response.statusCode, from
                                callback?(new Error("HTTP " + response.statusCode), fileName)

                    ))
                    .on("error", (err) ->
                        console.log(err.message)
                        callback(err, fileName)
                    )


        copyLocalImage: (from, fileName, callback) ->
                to = Path.resolve @imageFolder, fileName
                console.log("COPY ".blue + "FROM ".yellow + "%s", from)
                ws = fs.createWriteStream(to)
                    .on("error", ((err) ->
                        console.log("COPY ".blue + "ErrW ".green + "%s", to)
                        callback?(err, fileName)))
                    .on("close", ((err) ->
                        console.log("COPY ".blue + "DONE ".green + "%s", to)
                        callback?(null, fileName)))
                rs = fs.createReadStream(from)
                    .on("error", ((err) ->
                        console.log("COPY ".blue + "ErrR ".green + "%s", from)
                        callback?(err, fileName)))
                    .pipe(ws)
