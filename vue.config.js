"use strict";
const dayjs = require("dayjs");
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { baseConfig } = require("./src/config/common");

// 版本号
const Version = dayjs().format("YYYYMMDD-HHmmss") + "-v2.0.1";

function resolve(dir) {
    return path.join(__dirname, dir);
}

const port = process.env.port || process.env.npm_config_port || 7001; // dev port

module.exports = {
    publicPath: baseConfig.PUBLIC_PATH || "/",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: process.env.NODE_ENV === "development",
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        stats: {
            builtAt: true,
            timings: true
        },
        proxy: {
            // 本地代理解决跨域，设置serverDomain = ""
            '/cms-app': {
                target: 'https://apparmy.81.mil.cn',
                secure: false,
                ws: true,
                changeOrigin: true
            },
        
        },
    },
    configureWebpack: {
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                "@": resolve("src")
            }
        },
        output: {
            filename: `js/[name].${Version}.js`,
            chunkFilename: `js/[name].${Version}.js`
        },
        externals: {
            // "dayjs": "dayjs"
        }
    },
    chainWebpack(config) {
        config.optimization.splitChunks({
            minChunks: 3,
            cacheGroups: {
                vendor: {
                    name: 'chunk-vendor',
                    chunks: 'initial',
                    test({ resource }) {
                        return /[\\/]node_modules[\\/](vue|vue-router|axios)/.test(resource);
                    },
                    enforce: true,
                    reuseExistingChunk: true,
                    priority: 3,
                },
                vantUI: {
                    name: 'chunk-vant-ui',
                    chunks: 'initial',
                    enforce: true,
                    reuseExistingChunk: true,
                    priority: 2,
                    test: /[\\/]node_modules[\\/]vant[\\/]/,
                }
            }
        })
        config.plugin("preload").tap(() => [
            {
                rel: "preload",
                fileBlacklist: [
                    /\.map$/,
                    /hot-update\.js$/,
                    /runtime\..*\.js$/
                ],
                include: "initial",
            }
        ]);

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete("prefetch");
    }
};
