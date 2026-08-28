const path = require('path');
const prodConfig = {
  mode: 'production',
  entry: './src/extension.ts',
  target: 'node',
  output: {
    filename: 'extension.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2' // VS Code extensions must export via CommonJS
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  infrastructureLogging: {
    level: "log", // required for VS Code problem matchers to parse build output
  },
  devtool: 'hidden-source-map', // generates external .map files without linking them in the bundle; .map files are excluded from the .vsix package
  externals: {
    // vscode is injected by the Extension Host at runtime — not a real file on disk, must not be bundled
    vscode: 'commonjs vscode'
  }
};
module.exports = [prodConfig];
