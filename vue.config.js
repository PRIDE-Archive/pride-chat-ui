const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  outputDir:'dist/pride/chatbot',
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/pride/chatbot/" : "/",
  productionSourceMap: false,
});