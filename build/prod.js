const webpack = require("webpack");
const {merge}=require("webpack-merge");
const MiniCssExtractPlugin=require("mini-css-extract-plugin");
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const {CleanWebpackPlugin}=require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { PATHS,hash } = require("./config.js");
function webpackConfig(env,argv){
    const baseConf=require("./base");
    const prodConf = {
        mode:"production",
        output:{
            path:PATHS.output,
            chunkFilename:`${PATHS.out_js}[name].[${hash}].js`,
            filename:`${PATHS.out_js}[name].[${hash}].js`,
            publicPath:"/"
        },
        optimization:{
            minimize: true,
            minimizer:[
                new TerserPlugin({
                    // 启用/禁用提取注释 默认值：true
                    extractComments:false,
                    terserOptions:{
                        compress:{
                            drop_console:true,
                            hoist_vars:true,
                            reduce_vars:true,
                            hoist_funs:true,
                            dead_code:true
                        },
                        output:{
                            ascii_only:true,
                        }
                    }
                })
            ]
        },
        plugins:[
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__:true,
                __VUE_PROD_DEVTOOLS__:false,
                IS_DEV: false
            }),
            //css url() relative 
            new CssUrlRelativePlugin({
                root:"./"
            }),
            new MiniCssExtractPlugin({
                filename:`${PATHS.out_css}[name].[${hash}].css`,
                chunkFilename:`${PATHS.out_css}[name].[${hash}].css`
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns:["**/*",`!${PATHS.out_dll}*`],
            })
        ]

    }

    if(env.analyzer){
        prodConf.plugins.push(new BundleAnalyzerPlugin())
    }
    
    return merge(baseConf(env,argv),prodConf)
}


module.exports=webpackConfig;