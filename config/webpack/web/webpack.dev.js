const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        port: 9000,
        static: './dist',

        // HMR enabled
        // use `import 'styles.css'` to get HMR for CSS
        hot: true,
    },
})