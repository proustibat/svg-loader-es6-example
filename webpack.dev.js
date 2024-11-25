const { merge } = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

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
                    'style-loader?sourceMap',
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap'
                ]
            }
        ]
    },
    // plugins: [
    //     new webpack.NamedModulesPlugin(),
    //     new webpack.HotModuleReplacementPlugin(),
    // ],
} );
