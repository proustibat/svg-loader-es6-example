const merge = require( 'webpack-merge' );
const UglifyJSPlugin = require( 'uglifyjs-webpack-plugin' );
const common = require( './webpack.common.js' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = merge( common, {
    module: {
        rules: [

            {
                test: /\.(s*)css$/,
                use: ExtractTextPlugin.extract( {
                    fallback: 'style-loader?sourceMap',
                    use: [
                        'css-loader?sourceMap',
                        'sass-loader?sourceMap'
                    ],
                } )
            },
        ]
    },
    plugins: [
        new UglifyJSPlugin( {
            sourceMap: true,
        } ),
        new webpack.DefinePlugin( {
            'process.env.NODE_ENV': JSON.stringify( 'production' )
        } ),
        new ExtractTextPlugin( { filename: 'main.min.css' } ),
    ],
} );
