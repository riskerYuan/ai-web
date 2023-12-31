const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/v1": {
        target: "https://tapiv1.aijzfy.com/",
        pathRewrite: { "": "" },
        ws: false,
        changeOrigin: true,
      },
    },
  },
});
