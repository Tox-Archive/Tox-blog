## Introduction

This is a [hexo](https://github.com/tommy351/hexo)
tag plugin which allows you to embed an image stored on github pages.

## Installation

To install, run the following command in the root directory of hexo:
```
npm install hexo-local-image --save
```

And add this plugin in your ``_config.yml``.

```
plugins:
  - hexo-local-image
```

Make dir named ``images`` under source folder, And puts image in ``images`` folder.

## Usage

```
{% limg imageName [class1,class2] [JSONImageAttibutes] %}
{% limage imageName [class1,class2] [JSONImageAttibutes] %}
```
