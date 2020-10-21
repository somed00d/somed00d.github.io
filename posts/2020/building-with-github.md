---
layout: post.njk
title: Build and deployment
date: 2020-10-21 02:35:00 -4
tags: ['post']
---
<!-- Excerpt Start -->
The final step before we start getting crazy is to configure things to build and deploy
<!-- Excerpt End -->

Before we start getting crazy with things around here we need to set it up so that everything builds and deploys automatically. There are a handful of ways to do this, the easiest these days seems to be to use [GitHub Actions](https://github.com/features/actions). I haven't explored Actions that much but it's a great things to have on GitHub now. Before you had to pull your code to another website to do all that magic for you, now GitHub will do it for you. I found a [blog post](https://www.rockyourcode.com/how-to-deploy-eleventy-to-github-pages-with-github-actions/) explaining how to get all this properly configured with Eleventy. It uses an Action called [GitHub Actions for GitHub Pages](https://github.com/peaceiris/actions-gh-pages).

## Create folders and file

First we need to create the proper folder for our YAML build file to live in. 

```bash
mkdir .github
mkdir .github/workflows
touch .github/workflows/build.yml
```

## Build file

The build file is a typical YAML file named `build.yml`. This is the file that Github looks at when you commit to your repository and decides which Action to run. The file is pretty self explanatory. It watches the master branch for commits, uses Ubuntu 20.04 and node 13 for the build. First it runs `yarn` to install all the dependencies and then runs `yarn build` to build the website. Lastly it takes the docs directory and pushes it to the gh-pages branch of the repository.

```yaml
name: Build Eleventy
{% raw %}
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-20.04
    strategy:
      matrix:
        node-version: [13.x]
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies & build
        run: |
          yarn
          yarn build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./docs
          github_token: ${{ secrets.GITHUB_TOKEN }}
{% endraw %}
```

## Change GitHub Pages setting

Since the GitHub Action deploys the built site to the gh-pages branch we need to change our settings for the repository to look in that branch for the build files.

![Screenshot of GitHub Pages settings](/img/gh-pages-source-settings.png)

## Conclusion

You should be good to go now! Once you now make a commit to your repository it will start the build. It makes our life a lot easier since before we were building the website locally and then committing the code. That is definitely not the ideal way to do things since it will increase the size of your repo. Also it will make keeping track of changes more difficult since your commits are all littered with built files. I've added the build folder to my `.gitignore` file so that it doesn't get committed to my repo anymore. I still need to tweak my build because currently it appears it is adding some files more than once. In the next post I will go over everything we have done so far to make sure we are 100%. 