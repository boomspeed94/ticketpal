const globImporter = require('node-sass-glob-importer');

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        sassOptions: {
          importer: globImporter(),
        },
      },
    },
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-typescript`,
    'gatsby-plugin-tsconfig-paths',
  ],
};
