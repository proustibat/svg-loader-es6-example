const { merge } = require( 'webpack-merge' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const common = require( './webpack.common.js' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = merge( common, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(s(a|c)ss)$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [ new MiniCssExtractPlugin() ],
} );
