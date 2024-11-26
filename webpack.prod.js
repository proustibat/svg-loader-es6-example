const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const ESLintPlugin = require( 'eslint-webpack-plugin' );
const StylelintPlugin = require( 'stylelint-webpack-plugin' );

module.exports = merge( common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(s(a|c)ss)$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new StylelintPlugin( {
            fix: false,
            failOnError: true,
            failOnWarning: true
        } ),
        new ESLintPlugin( {
            configType: 'flat',
            fix: false,
            failOnError: true,
            failOnWarning: true
        } ),
        new MiniCssExtractPlugin()
    ],
} );
