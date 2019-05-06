const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

const plugins = [
    new VueLoaderPlugin(),
    new CopyPlugin([{
        from: './src/resources/public/*.*',
        to: path.resolve(__dirname, 'dist', '[name].[ext]')
    },
    {
        from: './src/resources/images/loader.svg',
        to: 'resources/[name].[ext]'
    }])
];

const commonConfig = {
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this necessary.
                    'scss': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader'
                    ],
                    'sass': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader?indentedSyntax'
                    ]
                }
            }
        },
        {
            resourceQuery: /blockType=i18n/,
            type: 'javascript/auto',
            loader: '@kazupon/vue-i18n-loader'
        },
        {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/]
            }
        },
        {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                'css-loader'
            ],
        },
        {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader'
            ],
        },
        {
            test: /\.sass$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader?indentedSyntax'
            ],
        },
        {
            test: /\.(png|jpg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'resources',
                publicPath: 'assets/resources'
            }
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins,
    mode: process.env.NODE_ENV !== 'test' ? process.env.NODE_ENV : 'development'
};

module.exports = [
    Object.assign({}, commonConfig, {
        target: 'web',
        entry: {
            app: path.resolve(__dirname, 'src', 'app.ts')
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist', 'assets')
        }
    })
];
