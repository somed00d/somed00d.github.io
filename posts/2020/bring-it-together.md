---
layout: post.njk
title: Bringing It All Together
date: 2020-10-22 24:36:00
tags: ['post', 'development']
---
<!-- Excerpt Start -->
Summary of what we've done so far with the website
<!-- Excerpt End -->

So far we have gotten the basic essentials set up.

## Configuration file

Below I've included my `.eleventy.js` file, it's not as complicated as it looks. The beginning is creating a bunch of variables for our dependencies. We are using [Day.js](https://day.js.org/) to keep track of time for us. It requires three plugins that give us additional abilities when using the library. Then is the `@11ty/eleventy-plugin-syntaxhighlight` plugin to give us syntax highlighting and the `@eleventy-plugin-sass` plugin for our style sheets. I've also included a plugin that is a wrapper of the [Typeset](https://github.com/davidmerfield/Typeset) that provides more consistent text formatting and styling. Then we set some settings for the Day.js library.

```js
const day = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const timeZone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSass = require("eleventy-plugin-sass");
const typesetPlugin = require('eleventy-plugin-typeset');

day.locale('en');
day.extend(relativeTime);
day.extend(timeZone);
day.extend(utc);
day.tz.setDefault("America/New_York");
```

This is the next part of the file. It's the main area where the configurations are initialized and made. It begins with `eleventyConfig.addPlugin` statements to initialize the plugins based on the variables we put them in, syntaxHighlight, pluginSass, typesetPlugin. Technically we can be called anything as long as it matches but I've just went what was used in the documentation. Next we add in some [shortcodes](https://www.11ty.dev/docs/shortcodes/) which allows for creating reusable content. In this instance we are using shortcodes to format our date in different ways. Then we use `eleventyConfig.addPassthroughCopy` to [copy](https://www.11ty.dev/docs/copy/) over our static assets. Lastly adjusting the dir value that is returned in order to change the directory things are outputted too.

```js
module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginSass);
  eleventyConfig.addPlugin(typesetPlugin);

  // Shortcodes
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
  eleventyConfig.addFilter('dateISO', date => {
    return day(date).format('YYYY-MM-DDTHH:mm:ss');
  });
  eleventyConfig.addFilter('dateShort', date => {
    return day(date).format('dddd, MMM DD, YYYY');
  });
  eleventyConfig.addFilter('dateLong', date => {
    return day(date).format('h:mm A · dddd · MMMM D, YYYY');
  });
  // Passthrough
  eleventyConfig.addPassthroughCopy({ "static": "/" });

  return {
    dir: {
      output: 'docs'
    }
  };
};
```

This last bit of code is what takes care of post excerpts. It is from this [tutorial](https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/) that is included in the Eleventy documentation. The function is pulling in all the content from each post, looking for the HTML comment tags, extracting what is in between them, and then storing them in variables to make them accessible.

```js
function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];

  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });

  return excerpt;
}
```

## Style sheets

I'm still deciding on a naming convention. My plan is in the future to devote an entire post to it when I have a better idea of what I'm doing. I don't want to ever have to adopt a CSS framework for this website so I'll be building it all. But that is not the main focus, instead I want to go over how I got style sheets working to begin with.

Really it was quite easy. The [plugin](https://www.npmjs.com/package/eleventy-plugin-sass) that I used seems like the ideal way. In the past it appears like there were additional steps that were required to watch for files but from what I can see Eleventy takes care of all that now. It's all pretty straight forward and doesn't require any additional configuration.

## Syntax highlighting

After we got the style sheets going, we're next able to get syntax highlighting configured. It was a very straight forward process like the style sheets. Eleventy suggests a [plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) in the documentation that uses the PrisimJS syntax highlighting library. There is a [repository](https://github.com/PrismJS/prism-themes) of color schemes that you can use to find the one you like. I am using the [Dracula](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-dracula.css) color scheme. 

## Conclusion

Well, all of that wasn't too bad. It's my first time using Eleventy and I think it's pretty nifty. Everything is straight forward and follows the [KISS principle](https://en.wikipedia.org/wiki/KISS_principle). I've gotten set up a nice foundation that will be very easy to build on top of. Everything so far has been just a basic implementation without much jazz. I like how the framework starts you off with nothing and allows you to only apply what you need. I think it's important these days to be really aware of speed and optimizations.