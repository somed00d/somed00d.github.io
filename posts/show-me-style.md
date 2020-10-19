---
layout: post.njk
title: Setting up Sass in Eleventy
date: 2020-10-19 10:33:00 -4
tags: ['post', 'development']
---
<!-- Excerpt Start -->
I've gotten all of my assets situated and started building out style sheets. Let's go over everything I've added.
<!-- Excerpt End -->

In the last [post](https://somed00d.github.io/posts/2020/building-the-website) we went through how to get set up and initialized. We started by creating the folder our website would live in. Next adding `@11ty/eleventy` to it, a home page, about page, and blog. We then made it so that all of our blog entries would be listed on the home page. At that point we didn't have any CSS on the website nor any code block syntax highlighting. Our next step was to get both of those things in order to be able to add a little bit of style. Key word being little bit. I'm trying to keep it as minimal as I can around here.

## Sass

The very first order of business was getting style sheets working. I've decided to use [Sass](https://sass-lang.com/) which is just like CSS on steroids, though the CSS spec is catching up. I'm still using Sass though because I'm use to it and because it's less verbose thus less typing. Eleventy in their documentation lists a community made plugin called `eleventy-plugin-sass` found [here](https://github.com/Sonaryr/eleventy-plugin-sass). So to start, we're going to add that package to our website.

```bash
yarn add eleventy-plugin-sass
```

Next we need to add some things to our `.eleventy.js` file, first importing

```js
const pluginSass = require('eleventy-plugin-sass')
```

Next adding it to our config function. I'm not using any options so I removed `sassPluginOptions`. In addition we need to add a *passthrough* which essentially copies our style sheets into a folder in our output directory.

```js/1,4
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSass);


  eleventyConfig.addPassthroughCopy({ "static": "/" });
}
```

Now that we have set it all up, we need to create a place to store all of our style sheets. I've chosen to throw everything into a folder called **static**. Inside the static folder I've created another folder called **scss**.

```bash
mkdir static
mkdir static/scss
# This can also be done in one command
mkdir static/scss
```

For now I'm not going to discuss my naming convention because I'm still working it out. The more software you write the more you come to find that naming things effectively is difficult. But I'm going to certainly write about it once I've found something that works for me.

Lastly we need to import our style sheets into the `<head>` of our website. For us at the moment that is found in the `_includes/base.njk` file.

```html
<link type="text/css" rel="stylesheet" href="/static/scss/main.css">
```

Sweet! We should be good to go now. Since I am using Sass all of my style sheets are basically loaded into one style sheet that Sass then takes and translates into the `main.css` file. Which we then import into the `<head>` of our base template. If you weren't using Sass though you could simply just add multiple CSS files here.

At this point we've got Sass configured and our style sheets working. In an effort to keep these short and sweet, I'll write about adding syntax highlighting in the next post.

*PS: Purple is my favorite color if you didn't notice 😉*
