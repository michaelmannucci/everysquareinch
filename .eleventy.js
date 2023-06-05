const Image = require("@11ty/eleventy-img")
const path = require('path')
const yaml = require("js-yaml")

module.exports = function (eleventyConfig) {

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




  function imageShortcode(src, alt, sizes = "(min-width: 1024px) 100vw, 50vw", className = "") {
    let fullSrc = path.join(__dirname, "/src/img/", src)
    console.log(`Generating image(s) from:  ${fullSrc}`)
    let options = {
      widths: [600, 900, 1500],
      formats: ["webp", "jpeg"],
      urlPath: "/img/",
      outputDir: "./_site/img/",
      filenameFormat: function (id, fullSrc, width, format, options) {
        const extension = path.extname(fullSrc)
        const name = path.basename(fullSrc, extension)
        return `${name}-${width}w.${format}`
      }
    }
  
    // generate images
    Image(fullSrc, options)
  
    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      class: className // add the class parameter to the imageAttributes object
    }
    // get metadata
    metadata = Image.statsSync(fullSrc, options)
    return Image.generateHTML(metadata, imageAttributes)
  }
  eleventyConfig.addShortcode("image", imageShortcode)
  // --- END, eleventy-img






  // Transform HTML as njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  }


}