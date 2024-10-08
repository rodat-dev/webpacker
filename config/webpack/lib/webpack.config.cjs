const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const lightningcss = require("lightningcss");
const browserslist = require("browserslist");
const path = require("node:path");
const GoogleFontsPlugin = require("@beyonk/google-fonts-webpack-plugin");

/*
In `package.json` set either:
- 'main': 'dist/library-name.js', 
- 'module': 'src/index.js' 
*/

/** @type {import("webpack").Configuration} */
module.exports = {
    entry: {
        index: {
            filename: "index.js",
        }   
    },
    module: {
        rules: [
            // this ensures CSS is imported as a side-effect
            // and imune to Treeshaking if included in .js
            {
                assert: { type: 'css' },
                sideEffects: true,
            }
        ]
    },
    output: {
        // stable name for a library
        filename: "library-name.js",
        path: path.resolve(__dirname, "dist"),
        globalObject: "this",
        
        // sets up the library to work across 
        // CommonJS, AMD, script
        library: {
            name: "libraryName",
            type: "umd",
        },
    },
    devtool: "inline-source-map",
    devServer: {
        port: 9000,
        hot: true,
        static: './dist'
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
                    name: 'vendors',
                    chunks: 'all'
                },
            }
        },

        /* CSS minification */
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minify: CssMinimizerPlugin.lightningCssMinify,
                minimizerOptions: {
                    targets: lightningcss.browserslistToTargets(browserslist(">= 0.25%"))
                },
            })
        ]
    },
    plugins: [
        
        // Easily download GoogleFonts
        // https://www.npmjs.com/package/@beyonk/google-fonts-webpack-plugin
        new GoogleFontsPlugin({
            fonts: [
                { family: 'Poppins' }
            ],
            filename: "fonts.css",
            path: "src/assets/font",
            
            // default but explicitly set here.
            // this ensures fonts are downloaded
            // rather than used via a cdn
            local: true,
        })
    ]
};
