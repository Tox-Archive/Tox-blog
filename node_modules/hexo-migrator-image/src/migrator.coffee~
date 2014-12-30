# Hexo
extend = hexo.extend
util = hexo.util
file = hexo.file
sourceDir = hexo.source_dir

# 
imageFolder = "images"

# Modules
request = require 'request'
async = require 'async'
colors = require 'colors'
fs = require 'fs'
Path = require 'path'

# Local
Source = require './MarkdownSource'
Downloader = require './Downloader'

colorfulLog = (verb, count, msg) ->
        format = "#{verb.green}"
        format += if count? then "\t#{count}\t".cyan else ""
        format += msg
        console.log format

initialize = (next) ->
        imageDir = Path.resolve sourceDir, imageFolder
        colorfulLog "Check ", null, imageDir
        exists = fs.existsSync imageDir
        if not exists
                colorfulLog "Make ", null, imageDir
                fs.mkdirSync imageDir

        next? null, null
                        
openSourceFolder = (nothing, next) ->
        colorfulLog "Open", 1, sourceDir
        file.list sourceDir, null, (err, files) ->
                files = files.filter (f) -> f.match ".*?\.md$"
                colorfulLog "Found", files.length, "posts"
                next? null, files

loadSourceFile = (files, next) ->
        # Parallelly load scripts
        tasks = []

        makeTask = (path) ->
                return (callback) ->
                        src = new Source path
                        src.load callback

        files.forEach (f) ->

                fullPath = sourceDir + f

                tasks.push makeTask fullPath

        async.parallel tasks, (err, results) ->
                colorfulLog "Load", results.length, "source files"
                sum = 0
                for src in results
                        sum += src.images.length

                colorfulLog "Found", sum, "images"
                next? null, results

downloadImages = (srcs, next) ->
        # Parallelly load scripts
        tasks = []

        # Initialize downloader
        downloader = new Downloader Path.resolve sourceDir, imageFolder
        
        srcs.forEach (src) ->
                src.images.forEach (img) ->
                        tasks.push (callback) ->
                                img.download downloader, callback

        colorfulLog "Save", tasks.length, "images"
        
        async.parallel tasks, (err, results) ->
                colorfulLog "Failed", (if err? then err.length else 0), "images"
                # Pass sources along, not images
                next? null, srcs

updateSourceFile = (srcs, next) ->
        # Parallelly load scripts
        tasks = []

        srcs.forEach (src) ->
                tasks.push (callback) -> src.update callback

        async.parallel tasks, (err, results) ->
                colorfulLog "Update", results.length, "source files"
                sum = 0
                for src in results
                        sum += if src.images? then src.images.length else 0

                colorfulLog "Update", sum, "images"
                next? null, results

        
        
extend.migrator.register 'image', (args) ->
        console.log "whatever"
 
        async.waterfall [
                initialize,
                openSourceFolder,
                loadSourceFile,
                downloadImages,
                updateSourceFile
                ], (err, result) ->
                        console.log("Summary")
                        colorfulLog "Error", (if err? then err.length else 0), ""
                        colorfulLog "Success", (if result? then result.length else 0), ""
