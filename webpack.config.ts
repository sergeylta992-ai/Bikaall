import  path from  'path'
import { buildPlugins } from './config/build/builPlugins'
import { buildLoaders } from './config/build/buildlLoaers'
import { buildResolvers } from './config/build/buildresorf'
import  webpack  from 'webpack'
import { buildWebPackConfig } from './config/build/buildWebPackConfig'
import { BuildEnv, BuildPaths } from './config/build/types/config'
 
export default (env:BuildEnv) => {

const paths:BuildPaths = {
  entry:path.resolve(__dirname,'src','app','index.tsx'),
  build:path.resolve(__dirname,'build'),
  html:path.resolve(__dirname,'public','index.html')
}

const mode = env.mode || 'development';
const isDev = mode === 'development';
const PORT = env.port || 3002

const config:webpack.Configuration = buildWebPackConfig({
  mode:mode,
  paths,
  isDev,
  port:PORT
})
  return config

}
