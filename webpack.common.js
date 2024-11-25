const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

const pagesList = [
    {
        title: 'Home',
        filename: 'index'
    },
    {
        title: 'Generator',
        filename: 'generator'
    },
    {
        title: 'Dashboard',
        filename: 'dashboard'
    }
];

const getHtmlWebpackPluginInstances = () => {
    return Object.values( pagesList ).map( page => {
        const pageTitle = `SVG Loader ES6 - ${ page.title }`;
        const header = `
            <header class="header">
                <h1 class="title">SVG Loader ES6</h1>
                <ul class="menu">
                    ${ pagesList.map( pageLink => `<li class="${ pageLink.filename === page.filename ? 'isActive' : '' }"><a href="${ pageLink.filename }.html">${ pageLink.title }</a></li>` ).join( '' ) }
                    <li><a href="https://github.com/proustibat/svg-loader-es6" target="_blank">Install</a></li>
                </ul>
            </header>`;
        return new HtmlWebpackPlugin( {
            filename: `${ page.filename }.html`,
            template: `./src/${ page.filename }.ejs`,
            title: pageTitle,
            hash: true,
            favicon: './src/favicon.ico',
            header: header
        } );
    } );
};

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
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [ {
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'assets/images/[hash]-[name].[ext]'
                    }
                } ]
            }
        ]
    },
    plugins: [
        new StyleLintPlugin( {
            configFile: '.stylelintrc'
        } ),
        ...getHtmlWebpackPluginInstances(),
        /**
         * All files inside webpack's output.path directory will be removed once, but the
         * directory itself will not be. If using webpack 4+'s default configuration,
         * everything under <PROJECT_DIR>/dist/ will be removed.
         * Use cleanOnceBeforeBuildPatterns to override this behavior.
         *
         * During rebuilds, all webpack assets that are not used anymore
         * will be removed automatically.
         *
         * See `Options and Defaults` for information
         */
        new CleanWebpackPlugin(),
    ],
    devtool: 'source-map'
};
