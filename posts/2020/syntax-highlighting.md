---
layout: post.njk
title: Add syntax highlighting
date: 2020-10-20 16:00:00 -4
tags: ['post', 'development']
---
<!-- Excerpt Start -->
Adding syntax highlighting to code blocks
<!-- Excerpt End -->

Now that we have gotten our style sheets working we can add syntax highlighting. Our styles for that exist not within the plugin but are found in a CSS file that we will create. To achieve all of this we are using the plugin that is provided by the Eleventy team found [here](https://www.11ty.dev/docs/plugins/syntaxhighlight/). The color scheme that I am using is Dracula and it's found [here](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-dracula.css).

## Install plugin

First we need to use yarn to install the plugin

```bash
yarn add @11ty/eleventy-plugin-syntaxhighlight
```

## Update config

Add two lines to our `.eleventy.js` config file to let it know about the syntax highlighting plugin

```js/0,3
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
};
```

## Add color scheme

If you were not using Sass you would link this to your style sheet directly in whichever folder it is located. In my instance since I am using Sass everything is loaded into one style sheet which you will see looking at my code on Github. If you look at that [style sheet](https://github.com/somed00d/somed00d.github.io/blob/master/static/scss/main.scss) you would see that it loads the color scheme style sheet with the line `@import './_partials/highlight';`.

```html/2
<html lang="en">
  <head>
    <link type="text/css" rel="stylesheet" href="/path/to/my/style.css">
  </head>
```

## Additional styling

I've also unsurprisingly taken the liberty to further tweak the styling of the code blocks by adding some CSS. I changed the font family to Fira Code, added a minimal box shadow and lightened up the background of highlights to make them stick out. When lines are highlighted they get wrapped with the `<mark></mark>` tag. In my Sass file I've simply adjusted that element to show a background that is 15% lighter than default.

```scss
pre {
  margin: 1em 0 !important;
  border-radius: 8px !important;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

code {
  font-family: 'Fira Code' !important;
  font-size: 12px;
}

p code {
  color: #262626;
  background-color: #e9ecef;
  padding: 2px 4px;
  border-radius: 3px;
}

mark {
  padding: 2px 0;
  background-color: lighten(#282a36, 15%);
}
```

## Conclusion

At this point we've set up syntax highlighting with the Dracula color scheme. In addition we tweaked it a bit to improve readability. If I could add nothing else to the website I'd be satisfied. For a blog like this really all you need is style sheets and syntax highlighting.