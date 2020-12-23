const day = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const timeZone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const updateLocale = require('dayjs/plugin/updateLocale');
const duration = require('dayjs/plugin/duration')
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginSass = require("eleventy-plugin-sass");
const typesetPlugin = require('eleventy-plugin-typeset');

day.locale('en');
day.extend(timeZone);
day.extend(utc);
day.extend(relativeTime);
day.extend(updateLocale);
day.tz.setDefault("America/New_York");
day.extend(duration)

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
    return day(date).format('MMM DD, YYYY');
  });
  eleventyConfig.addFilter('dateLong', date => {
    return day(date).format('h:mm A · dddd · MMMM D, YYYY');
  });
  eleventyConfig.addFilter('dateFrom', date => {
    return day().diff(date, 'days');
  });
  // Passthrough
  eleventyConfig.addPassthroughCopy({ "static": "/" });

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