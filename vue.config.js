const fs = require('fs')
const path = require('path')
const spritesmithPlugin = require('webpack-spritesmith')
const terserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const webpack = require('webpack');

const spritesmithTasks = []

// gzip 相关
const isGZIP = process.env.VUE_APP_GZIP === 'ON'

module.exports = {
    publicPath: '',
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        open: true,
        port: 5818,
    },
    transpileDependencies: ['element-ui'],
    configureWebpack: config => {
        config.resolve.modules = ['node_modules', 'assets/sprites']
        config.plugins.push(...spritesmithTasks)
        config.optimization = {
            minimizer: [
                new terserPlugin({
                    terserOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        }
                    }
                })
            ]
        }
        if (isGZIP) {
            return {
                plugins: [
                    new CompressionPlugin({
                        algorithm: 'gzip',
                        test: /\.(js|css)$/, // 匹配文件名
                        threshold: 10240, // 对超过10k的数据压缩
                        deleteOriginalAssets: false, // 不删除源文件
                        minRatio: 0.8 // 压缩比
                    })
                ]
            }
        }
    },
    pluginOptions: {
        lintStyleOnBuild: false,
        stylelint: {
            fix: false
        },
        mock: {
            entry: './src/mock/server.js',
            debug: true,
            disable: true
        }
    },
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item.use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: [
                        './src/assets/styles/resources/*.scss',
                        './src/assets/sprites/*.scss'
                    ]
                })
                .end()
        });
        config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, 'src/assets/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, 'src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();
        config.plugin('html')
            .tap(args => {
                args[0].title = '';
                args[0].debugTool = '';
                args[0].appType = '';
                return args
            });

        //Quill图片
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill',
            'Quill': 'quill/dist/quill.js'
        }])
    }
};
