const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Emit favicon assets without HtmlWebpackPlugin injecting a second <link>.
 * Use a dedicated filename (not /favicon.svg): Chromium often keeps tab icons keyed by URL
 * and ignores ?v=; a new path forces a fresh fetch.
 */
class EmitFaviconPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap('EmitFavicon', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'EmitFavicon',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const faviconPath = path.join(__dirname, 'assets', 'favicon.svg');
          const body = fs.readFileSync(faviconPath, 'utf8');
          compilation.emitAsset('quantus-favicon.svg', new sources.RawSource(body));
          compilation.emitAsset('favicon.svg', new sources.RawSource(body));
        }
      );
    });
  }
}

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        // Allow 'import * from "./foo.tsx"'
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // allow 'import "foo.css"' and '@import "foo.css" in css files
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        generator: { filename: 'styles/[name].[contenthash][ext]' },
      },
      {
        // allow 'import Icon from "./icon.png"'
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name].[contenthash][ext]' },
      },
      {
        // allow CSS @url('./my-font.woff2')" style font loading
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name].[contenthash][ext]' },
      },
    ],
  },
  plugins: [
    new EmitFaviconPlugin(),
    new HtmlWebpackPlugin({
      template: './assets/index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'main.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
};
