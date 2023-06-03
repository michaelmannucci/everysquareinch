const yaml = require("js-yaml")

module.exports = function(eleventyConfig) {
  // Current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`)

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents))

  // Copy node_modules files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.min.js": "./js/alpine.js",
    "./node_modules/@alpinejs/focus/dist/cdn.min.js": "./js/alpine-focus.js",
    "./node_modules/lottie-web/build/player/lottie.min.js": "./js/lottie.js",
  });

  // Copy hamburger.json to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/hamburger.json": "./hamburger.json",
  });

  // Transform HTML as njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  }
}