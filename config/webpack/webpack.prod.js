const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",

    // adding source map for debugging in prod
    // NOT inline.
    devtool: "source-map"
});