const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/_svc/*',
        createProxyMiddleware({
            target: 'https://api-external.gobolt.dev',
            changeOrigin: true,
            secure: false,
            // pathRewrite: {
            //     "^/_svc/articles": ""
            // },
        })
    );
};