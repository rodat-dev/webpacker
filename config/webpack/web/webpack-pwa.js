const WorkboxPlugin = require("workbox-webpack-plugin");

export default () => {
    return new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true, // this may need adjusting
    });
}