module.exports = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx"],
  webpack: (config, { defaultLoaders }) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [defaultLoaders.babel],
    });

    return config;
  },
};
