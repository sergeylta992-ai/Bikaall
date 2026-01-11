import { BuildOPtions } from "./types/config";
import type { Configuration as DevServerConfiguration} from "webpack-dev-server";

export function buildDevServer(options:BuildOPtions):DevServerConfiguration{
  return {
    port : options.port,
    open: true,
    historyApiFallback:true,
  }
}