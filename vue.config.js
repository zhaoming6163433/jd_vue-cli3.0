// see http://vuejs-templates.github.io/webpack for documentation.
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
    // 输出文件目录
    outputDir: 'dist',
    // 静态资源存放
    assetsDir: "static",
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // 是否为 Babel 或 TypeScript 使用 thread-loader 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
    parallel: require('os').cpus().length > 1,
    // 启动端口
    devServer: {
        port: 8886,
    },
    // 生成gzip
    configureWebpack: config => {
        //入口文件
        config.entry.app = ['babel-polyfill', './src/main.js'];
        
        if (process.env.NODE_ENV === 'production') {
            // 生产环境
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );

        } else {
            // 开发环境

        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
          .set('@', resolve('src'))
          .set('@assets',resolve('src/assets'))
          .set('api',resolve('src/model'))
          .set('components',resolve('src/components'))
    },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        loaderOptions: {
            sass: {
            data: `
                @import "@/assets/css/common_color.scss";
                @import "@/assets/css/mixin.scss";
            `
            }
        }
    }
}