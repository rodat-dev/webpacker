import type { Configuration } from "@rspack/core";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import path from "path";
import rspack from "@rspack/core";
import Dotenv from "dotenv-webpack";

const config: Configuration = {
  mode: process.env["NODE_ENV"] || "development" ? "development" : "production",

  // currently the only way to import CSS that isn't a CSS module
  experiments: {
    css: true,
  },
  entry: {
    index: ["./src/index.ts", "./src/styles/index.css"],
  },
  stats: "normal",
  resolve: {
    tsConfig: path.resolve(__dirname, "./tsconfig.json"),
  },
  devServer: {
    // HMR does not work with [contenthash] CSS
    hot: false,
    port: 9000,
    static: "./dist",
  },
  devtool:
    process.env["NODE_ENV"] || "development" === "development"
      ? "inline-source-map"
      : "source-map",
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    runtimeChunk: "single",
    moduleIds: "deterministic",
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin({}),
      new rspack.LightningCssMinimizerRspackPlugin({}),
    ],
  },
  plugins: [
    // enable `.env` for passing env vars safely
    new Dotenv(),

    // one per page
    new rspack.HtmlRspackPlugin({
      template: "./src/pages/index.html",
      scriptLoading: "defer",
      chunks: ["index"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
          },
        ],
        type: "asset/resources",
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
          {
            loader: "builtin:lightningcss-loader",
            options: {
              targets: ">= 0.25%",
              errorRecovery: true,
              minify: true,
              draft: {
                customMedia: true,
              },
              include: {
                nesting: true,
                mediaRangeSyntax: true,
                clampFunction: true,
                customMediaQueries: true,
                logicalProperties: true,
                doublePositionGradients: true,
                vendorPrefixes: true,
                p3Colors: true,
                isSelector: true,
                spaceSeparatedColorNotation: true,
                notSelectorList: true,
                selectors: true,
              },
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },
    ],
  },
};

export default config;
