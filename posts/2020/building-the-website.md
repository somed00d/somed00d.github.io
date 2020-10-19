---
layout: post.njk
title: Building the website
date: 2020-10-15 15:46:00 -4
tags: ['post']
---
<!-- Excerpt Start -->
I'm all for the learning experience which means building from scratch is the only way to go!
<!-- Excerpt End -->

## Kicking things off

I've been building websites for awhile now, in all sorts of different ways. But like anything, even when you're proficient it is still hard to know *everything*. That is how it is for me with regards to HTML and CSS. I know more than enough to get by but often see code written by others that reminds me I have plenty of room for improvement. With how heavy and bloated building a website has become these days, my first preference when choosing how I was going to go about making this thing was that it had to be lean. I've built plenty of websites that started thick with lots of design. For this, I wanted to start with the bare minimum. [11ty](https://11ty.dev) seemed like a good fit for that. It also has an active community which will make learning the framework smoother.

## Bare-bones

We've started off with just the necessities, a home page, about page, and a blog. That is pretty much it, the website contains zero images and zero CSS as of the writing of the post. To get myself started I used a [tutorial](https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/) that I found in the 11ty documentation. Below I've made a list of everything it includes.

  1. Initiate node app
  2. Add `@11ty/eleventy`
  3. Create about page
  4. Create base template
  5. Create navigation
  6. Write first post
  7. Create home page
  8. Add post list to home page
  9. Format date in post list
  10. Add excerpt to post list
  11. Create post template

I didn't do much to change this except swap `dayjs` for `moment` since the latter is no longer maintained. Also changed the output directory to work with Github Pages. Next we will go through these steps more in depth.

## Setting it all up

This assumes you have access to a terminal with bash or similar. First things first we need to create a folder to store everything in and initiate the node package manager (npm). I personally do not use npm but install use yarn, the original tutorial though uses npm if you need reference.

Make directory, change into directory, initiate app

```bash
mkdir somed00d.github.io
cd somed00d.github.io
yarn init
```

Install eleventy

```bash
yarn add @11ty/eleventy
```

Create `about.md` file

```bash
touch about.md
```

Add some words to it

```md
# About page

This page tells you things that are about me!
```

Add build, serve, debug scripts to `package.json`

```json
"scripts": {
  "build": "npx eleventy",
  "serve": "npx eleventy --serve",
  "debug": "DEBUG=* npx eleventy"
},
```

Create `_includes` folder and add template file `base.njk`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eleventy Blog</title>
</head>
<body>
  <header>
    Site Header
    <a href="/About">About</a>
  </header>
  <main>
    {{ content | safe }}
  </main>
  <footer>Site Footer</footer>
</body>
</html>
```

Update `about.md` to include template front matter

```md
---
layout: base.njk
---
```

Create new `posts` folder and add `first-blog-post.md`

```md
---
layout: base.njk
title: My first blog post
date: 2020-10-15 12:00:00
tags: ['post']
---

Hello world! This is my first post. Can you hear me?!
```

Create home page by creating `index.njk` file

```html
---
layout: base.njk
pagination:
  data: collections.post
  size: 10
  reverse: true
  alias: posts
---
{% raw %}
{% for post in posts %}
  <article>
    <h1>
      <a href="{{ post.url | url }}">{{ post.data.title }}</a>
    </h1>
      <time title="{{ post.date | dateReadable }}">{{ post.date | dateFrom }}</time>
  </article>
{% endfor %}
{% endraw %}
```

Install `dayjs`

```bash
yarn add dayjs
```

Create `.eleventy.js`

```js
const day = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

day.locale('en');
day.extend(relativeTime);

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
  eleventyConfig.addFilter('dateFrom', date => {
    return day(date).fromNow();
  });

  eleventyConfig.addFilter('dateReadable', date => {
    return day(date).format('h:mm:ss A - MM/DD/YYYY');
  });
};
```

Add function for post excerpt to `.eleventy.js`

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

Register excerpt *shortcode* in eleventy config

```js
eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
```

Update post with HTML comments to add excerpt

```html
<!-- Excerpt Start -->
Enter your excerpt here
<!-- Excerpt End -->
```

Add excerpt below date to `index.njk`

```html
  { % excerpt post % }
    <a href="{{ post.url | url }}" aria-label="Read more on {{ post.data.title }}">
      Read more
    </a>
```

Create a `post.njk` template file in the `_includes` folder

```html
---
layout: base.njk
---
{% raw %}
<article>
  <h1>{{ title }}</h1>
  <time datetime="{{ date | dateIso }}">{{ date | dateReadable }}</time>
  {{ content | safe }}
</article>
{% endraw %}
```

Update front matter in posts with new template

```html
---
layout: post.njk
---
```

Change output directory for Github Pages adding return value to config function in `.eleventy.js`

```js
 return {
    dir: {
      output: 'docs'
    }
  };
```

## Bada-bing

That is the condensed version of what is described in this [tutorial](https://keepinguptodate.com/pages/2019/06/creating-blog-with-eleventy/). Again the only thing that I changed was some file names, used `dayjs` instead of `moment` for date, and configured output directory for Github Pages.

Not too bad. I've now got a solid foundation to start styling and build upon. My next step will probably be getting style sheets set up and static assets. It looks really bad without code block syntax highlighting.
