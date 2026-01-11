
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";
import { BuildOPtions } from "./types/config";


export function buildLoaders({ isDev }:BuildOPtions) :webpack.RuleSetRule[]{

  const cssLoaders = {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader:"css-loader",
            options:{
              modules:{
                    auto: (resPath:string)=>Boolean(resPath.includes('module')),
                    localIdentName: isDev
                            ? "[path][name]__[local]--[hash:base64:5]"
                            : '[hash:base64:8]'
              }  
            } 
          },
          "sass-loader",
        ],
      }

    const svgLoader = {
    test: /\.svg$/i,
    oneOf: [
      {
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
    ],
  }



  const typescriptLoader = {
    
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }
    const fileLoader = {
    test: /\.(png|jpe?g|gif|webp)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'images/[hash][ext][query]'
    }
  }

  return [
    svgLoader,
    typescriptLoader,
    cssLoaders,
    fileLoader
  ]
}