import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import { BuildOPtions } from "./types/config";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'



export function buildPlugins({paths}:BuildOPtions):webpack.WebpackPluginInstance[] {

  return [
    new HtmlWebpackPlugin({
      template: paths.html
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename:'css/[name].[contenthash].css',
      chunkFilename:'css/[name].[contenthash].css'
    })
  ]
}