import { Port } from "webpack-dev-server"

export type  BuildMode = 'production' | 'development'

export interface BuildPaths {
  entry: string,
  build: string,
  html: string,

}

export interface BuildEnv{
  mode:BuildMode,
  port:Port
}

export interface BuildOPtions {
  mode: BuildMode,
  paths: BuildPaths,
  isDev:boolean,
  port: Port

}