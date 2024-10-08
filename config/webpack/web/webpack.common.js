const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const lightningcss = require("lightningcss");
const browserslist = require("browserslist");
const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");

const isProd = process.env.NODE_ENV === "production";

/** @type {import("webpack").Configuration} */
module.exports = {
  mode: "development",
  // config for typescript, see above for JS
  entry: {
    index: ["./src/index.ts"],
  },
  module: {
    rules: [
      /* NOTE:
       * `asset/resource` is a raw loader, creates a new file in dist
       * `asset/inline` gets injected as a 'data URI'. Great for SVGs
       * `asset/source` gets bundled to code as-is. Great for text or HTML templates
       */
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
      {
        // add CSS here to inline in web components
        test: /\.(txt|html)$/i,
        type: "asset/source",
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      // this ensures CSS is imported as a side-effect
      // and imune to Treeshaking if included in .js
      {
        assert: { type: "css" },
        sideEffects: true,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [new TsConfigPathsPlugin({})],
  },
  output: {
    // using [contenthash] aids webpack in
    //  caching the resources if unchanged
    filename: "[name].[contenthash].js",

    path: path.resolve(__dirname, "dist"),

    // clean output directory
    clean: true,

    // allows to use `import.meta.url`
    // needs polyfill for `document.currentScript`
    // https://webpack.js.org/guides/public-path/
    publicPath: "auto",
  },
  optimization: {
    // stabilizes IDs so that updates in local code
    // do not lead to a change in the has of 'vendor' modules
    moduleIds: "deterministic",

    // bundles all assets to a single chunk
    runtimeChunk: "single",

    // separate external dependencies to a different
    // cache group.
    // Chunks are kept separate to enable code splitting
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },

    // Treeshaking
    usedExports: true,

    /* CSS minification */
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minify: CssMinimizerPlugin.lightningCssMinify,
        minimizerOptions: {
          targets: lightningcss.browserslistToTargets(browserslist(">= 0.25%")),
        },
      }),
    ],
  },
  plugins: [
    new DotenvWebpackPlugin({}),
    // Easily download GoogleFonts
    // https://www.npmjs.com/package/@beyonk/google-fonts-webpack-plugin
    new HtmlWebpackPlugin({
      template: "./src/pages/index.html",
      chunks: ["index"],
    }),
  ],
};
