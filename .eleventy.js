const day = require('dayjs');

day.locale('en');

module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter('dateISO', date => {
    return day(date);
  });

  eleventyConfig.addFilter('dateReadable', date => {
    return day(date).format('hh:mm:ss A, MM-DD-YYYY');
  });
};