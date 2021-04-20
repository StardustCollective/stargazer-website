const withPlugins = require("next-compose-plugins");

const { nextI18NextRewrites } = require("next-i18next/rewrites");

const path = require("path");

const withSass = require("@zeit/next-sass");

const localeSubpaths = {
  tr: "tr",
  en: "en",
};

module.exports = withSass({
  /* bydefault config  option Read For More Optios
  here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
  cssModules: true,
});

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
};

const config = {
  // rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
};

module.exports = withPlugins([], config);
