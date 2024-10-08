# Config
- Support for Typescript / JS, update `webpack.common.js`.
- Relies on NODE_ENV for `prod/dev`;
- Uses `postcss` with autoprefixer and preset_env under the hood.
- CSS is minified in production.
- uses `browserslists` default.

# WebWorkers
- enabled by default, but Webpack requires that the filepath is given as `URL` rather than a simple string.

`new Worker(
    /* webpackChunkName: 'web-worker' */new URL('./worker.js'), import.meta.url));`;

# PWA
Add `webpack-pwa.js` to enable (`workbox` )[https://webpack.js.org/guides/progressive-web-application/] with Webpack.

# Additional notes
Library config is in `config/lib`;
Webapp config in `config/web`;

# TODO 
- WebAssembly
- Babel?
- SWC?
