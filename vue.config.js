const path = require("path");
const registerRouter = require("./backend/router");

module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 引入全局样式变量
        path.resolve(__dirname, "src/assets/style/variable.less"),
        path.resolve(__dirname, "src/assets/style/mixin.less"),
      ],
    },
  },
  devServer: {
    before(app) {
      registerRouter(app);
    },
  },
};
