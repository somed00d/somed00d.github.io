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