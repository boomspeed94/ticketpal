const path = require('path');
const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        process: 'process',
        stream: 'stream-browserify',
        zlib: 'browserify-zlib'
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        os: require.resolve('os-browserify/browser'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        util: require.resolve('util/'),
        path: require.resolve("path-browserify"),
        electron: false
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process',
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.DefinePlugin({
        'process.env.NFT_CONTRACT_ADDRESS': JSON.stringify("0xa042E690a4D68bd9D291d26231421392A6CB9F11"),
        'process.env.SIMPLE_EXCHANGE_ADDRESS': JSON.stringify("0xA405A399Ef18595b2349Bf36763080104f1594fA"),
        'process.env.BUSD_CONTRACT_ADDRESS': JSON.stringify("0xd6b4a89e6c2c9a615a809927b66ba23f92335186"),
        'process.env.CONT_CONTRACT_ADDRESS': JSON.stringify("0x2009975970c8c8b8ed05f3cdb65571c7d1f6acfa"),
        'process.env.GAS_LIMIT': 500000,
        'process.env.SERVICE_FEE': 1.0,
      })
    ],
  });

  if (stage.startsWith('develop')) {
    actions.setWebpackConfig({
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom',
          components: path.resolve(__dirname, 'src/components/'),
          assets: path.resolve(__dirname, 'src/assets/'),
          lib: path.resolve(__dirname, 'src/lib/'),
          store: path.resolve(__dirname, 'src/store/'),
        },
      },
    });
  }

  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /multiselect-react-dropdown/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
};
