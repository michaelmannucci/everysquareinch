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
  })

  // Copy various files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/hamburger.json": "./hamburger.json",
    "./src/img/svg/*": "./img/svg/"
  })

  // Images plugin
  function imageShortcode(src, alt, classes = "", sizes = "(max-width: 1536px) 100vw, 1536px") {
    fullSrc = path.join(__dirname, "/src/img/", src)
    console.log(`Generating image(s) from:  ${fullSrc}`)
    const options = {
      widths: [480, 768, 1200],
      formats: ["webp", "jpeg", "svg"],
      urlPath: "/img/",
      outputDir: "./_site/img/",
      filenameFormat: function (id, fullSrc, width, format, options) {
        const extension = path.extname(fullSrc)
        const name = path.basename(fullSrc, extension)
        return `${name}-${width}w.${format}`
      },
      svgShortCircuit: true,
      svgAllowUpscale: false
    }

    // Generate images
    Image(fullSrc, options)

    const imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      class: classes
    }

    // Get metadata
    metadata = Image.statsSync(fullSrc, options)
    return Image.generateHTML(metadata, imageAttributes)
  }

  eleventyConfig.addShortcode("image", imageShortcode)
  // Images plugin end

  // Transform HTML as njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  }
}