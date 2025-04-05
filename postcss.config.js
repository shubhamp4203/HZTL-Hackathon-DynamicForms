// postcss.config.js
module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-preset-env")({ stage: 0 }), // Add this line if not already present
  ],
};
