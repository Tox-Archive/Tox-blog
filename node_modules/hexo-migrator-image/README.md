hexo-migrator-image
===================

A Hexo migrator that imports remote or local images referenced in markdown source

## Install

> npm install hexo-migrator-image

## How Does It Work

This migrator scans all ```.md``` files in a hexo blog folder for Markdown's image tags.
Then downloads (remote) or copies (local) files to ```source/images``` folder and updates all urls in the posts.
The images' file names are SHA1 digest of its original url.
A backup file named ```.md.#timestamp#.bak``` file will be created for each ```.md``` files every time.
However it is better to **use version control** or **make a copy** just in case.

## Usage

1. Writes your posts and insert images with any remote url or local file path.

2. Before you deploy, run in your hexo blog folder:

> hexo migrate image

