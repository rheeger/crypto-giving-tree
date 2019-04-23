const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(withSass());

const withImages = require('next-images');
module.exports = withImages();
