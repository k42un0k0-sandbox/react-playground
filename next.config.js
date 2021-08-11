const path = require("path");
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    config.module.rules.push({
      test: /\.(glsl|vert|flag)$/,
      use: "raw-loader",
    });

    return config;
  },
};
