const path = require('path');
const sassGlobImporter = require('node-sass-glob-importer');

module.exports = {
  // You will want to change this to wherever your Stories will live.
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async config => {
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve('babel-loader');
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-env'),
    ];
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve('@babel/plugin-proposal-class-properties'),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve('babel-plugin-remove-graphql-queries'),
    ];
    config.resolve.mainFields = ['browser', 'module', 'main'];
    config.module.rules.push(
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
          plugins: [
            require.resolve('@babel/plugin-proposal-class-properties'),
            // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
            require.resolve('babel-plugin-remove-graphql-queries'),
          ],
        },
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: sassGlobImporter(),
              },
            },
          },
        ],
      },
    );
    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
      // Because we don't have tsconflig (resolve path of src tsconflig) => need ../
      components: path.resolve(__dirname, '../src/components/'),
      assets: path.resolve(__dirname, '../src/assets/'),
      lib: path.resolve(__dirname, '../src/lib/'),
      store: path.resolve(__dirname, '../src/store/'),
      dummy: path.resolve(__dirname, '../src/dummy/'),
    };
    return config;
  },
};
