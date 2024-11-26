const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );

module.exports = merge( common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        liveReload: true,
        hot: true,
        open: true,
        static: [ './dist' ],
    },
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new ESLintPlugin( {
            configType: 'flat',
            fix: true
        } ),
    ]
} );
