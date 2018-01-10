const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const HtmlHeaderPlugin = require( './html-header-plugin' );

const pagesList = [
    {
        title: 'Home',
        filename: 'index'
    },
    {
        title: 'Dashboard',
        filename: 'dashboard'
    },
    {
        title: 'Generator',
        filename: 'generator'
    }
];

module.exports = {
    entry: [
        'babel-polyfill',
        './src/js/main.js',
        ...Object.values( pagesList ).map( page => `./src/${ page.filename }.ejs` )
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' )
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(ejs)$/,
                use: [
                    'underscore-template-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?name=fonts/[name].[ext]'
                ]
            },
            {
                enforce: 'pre',
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: [ 'babel-preset-latest' ],
                    cacheDirectory: true
                }
            }
        ]
    },
    plugins: [
        new StyleLintPlugin( {
            configFile: '.stylelintrc'
        } ),
        ...Object.values( pagesList ).map( page => {
            return new HtmlWebpackPlugin( {
                filename: `${ page.filename }.html`,
                template: `./src/${ page.filename }.ejs`,
                title: `SVG Loader ES6 - ${ page.title }`,
                hash: true,
                favicon: './src/favicon.ico'
            } );
        } ),
        new HtmlHeaderPlugin( pagesList ),
        new CleanWebpackPlugin( [ 'dist' ] )
    ],
    devtool: 'source-map'
};
