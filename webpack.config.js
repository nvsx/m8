import TerserPlugin from 'terser-webpack-plugin'
import { fileURLToPath } from 'url'
import path from 'path'

const current_path    = fileURLToPath(import.meta.url)
const base_dir        = path.dirname(current_path)
const entry_file      = base_dir + '/javascript/index.js'
const target_dir      = base_dir + '/public/_m8/ce/cfg'
const target_filename = 'index.js'

console.log("DEBUG: base_dir =", base_dir)
console.log("DEBUG: entry_file =", entry_file)
console.log("DEBUG: target_dir =", target_dir)
console.log("DEBUG: target_filename =", target_filename)

export default {
  entry: entry_file,
  output: {
    path: target_dir, 
    filename: target_filename
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              [
                "@babel/preset-env",
                {
                  "useBuiltIns": "entry",
                  "modules": false,
                  "corejs": 2
                }
              ]
            ],
            "plugins": [
              "@babel/plugin-transform-runtime"
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      'node_modules': path.join('node_modules')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  watchOptions: {
    ignored: /node_modules/
  }
}
