const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser.js'), // Explicitly specify the file extension
      };

      // Add plugin to provide global variables like `process`
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser.js', // Explicitly specify the file extension
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return config;
    },
  },
};