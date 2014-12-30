extend = hexo.extend
util = hexo.util
file = hexo.file
sourceDir = hexo.source_dir

Image = require './MarkdownImage'
async = require 'async'

MatchImageUrl = (url) ->
  re1='(.*?)'#  // Non-greedy match on filler
  re2='( )'  #  // Any Single Character 1
  re3='(")'  #  // Any Single Character 2
  re4='(.*?)'#  // Non-greedy match on filler
  re5='(")'  #  // Any Single Character 3

  p = new RegExp re1+re2+re3+re4+re5, ["i"]
  m = p.exec url
  if m?
    url = m[1]
    optional = m[4]
    return [url, optional]
  return [url, null]


MatchImageMarkDown = (src) ->
  re1='(!)'  #  // Any Single Character 1
  re2='(\\[)'#  // Any Single Character 2
  re3='(.*?)'#  // Non-greedy match on filler
  re4='(\\])'#  // Any Single Character 3
  re5='(\\()'#  // Any Single Character 4
  re6='(.*?)'#  // Non-greedy match on filler
  re7='(\\))'#  // Any Single Character 5

  ex = re1+re2+re3+re4+re5+re6+re7
  p = new RegExp ex, ["gim"]

  items = new Array()
  while (m = p.exec(src))?
    alt_ = m[3]
    rest = m[6]

    r = MatchImageUrl rest
    # Skip saved image
    if r[0]?.indexOf("{{BASE_PATH}}") != 0
      item = new Image alt_, r[0], r[1]
      items.push(item)

  return items


makeWorker = (img, folder) ->
  return (callback) ->
    img.download folder, callback


makeLoaderCallback = (source, callback) ->
  return (err, src) ->
    if err? then return callback(err)
    if not src? then return callback(new Error("Null source."))
    source.src = src
    source.images = MatchImageMarkDown(src)

    return callback(null, source)

escapeRegExp = (str) ->
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

module.exports = class Source
  constructor: (@path) ->
    @src = ""
    @images = []

  load: (callback) ->
    file.readFile(@path, null, makeLoaderCallback(@, callback))

  update: (callback) ->
    newSrc = @src
    for img in @images
      r = new RegExp escapeRegExp img.url, "g"
      newSrc = newSrc.replace r, "{{BASE_PATH}}/images/#{img.localPath}"
      #console.log "#{img.url} -> #{img.localPath}"
    d = new Date()
    timestamp = d.toISOString()
      .replace(/:/g, "-")

    # write backup file
    file.writeFile "#{@path}.#{timestamp}.bak", @src, (err) =>
      if err?
        console.log "Fail to backup #{@path}"
      file.writeFile @path, newSrc, (err) ->
        if err?
          callback? err, @
        else
          callback? null, @
