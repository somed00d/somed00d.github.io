const day = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSass = require("eleventy-plugin-sass");
const typesetPlugin = require('eleventy-plugin-typeset');

day.locale('en');
day.extend(relativeTime);

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight, {
    trim: true,
    showLineNumbers: true
  });
  eleventyConfig.addPlugin(pluginSass);
  eleventyConfig.addPlugin(typesetPlugin);

  // Shortcodes
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));
  eleventyConfig.addFilter('dateShort', date => {
    return day(date).format('dddd, MMM DD, YYYY');
  });

  eleventyConfig.addFilter('dateLong', date => {
    return day(date).format('dddd, MMMM D, YYYY h:mm A');
  });
  // Passthrough
  eleventyConfig.addPassthroughCopy({ "static": "/" });


    // Watch for changes to my source files
    if (eleventyConfig.addWatchTarget) {
      eleventyConfig.addWatchTarget("static/scss");
      eleventyConfig.addWatchTarget("static/js");
    } else {
      console.log(
        "A future version of 11ty will allow live-reloading of JS and Sass. You can update 11ty with the next release to get these features."
      );
    }

  return {
    dir: {
      output: 'docs'
    }
  };
};

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