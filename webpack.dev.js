const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );

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
        new StylelintPlugin( {
            fix: true,
            failOnError: false,
            failOnWarning: false
        } ),
        new ESLintPlugin( {
            configType: 'flat',
            fix: true,
            failOnError: false,
            failOnWarning: false
        } ),
        new StylelintPlugin( {
            configType: 'flat',
            fix: true
        } ),
    ]
} );
