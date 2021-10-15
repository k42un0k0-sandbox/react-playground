const path = require("path");
const SSRPlugin =
  require("next/dist/build/webpack/plugins/nextjs-ssr-import").default;
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    config.module.rules.push({
      test: /\.(glsl|vert|flag)$/,
      use: "raw-loader",
    });

    // wasm

    // wasm in react
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.output.webassemblyModuleFilename =
      (isServer ? "../" : "") + "static/wasm/[modulehash].wasm";

    // wasm in web worker
    const ssrPlugin = config.plugins.find(
      (plugin) => plugin instanceof SSRPlugin
    );
    if (ssrPlugin) {
      patchSsrPlugin(ssrPlugin);
    }

    // #wasm

    return config;
  },
};

// Patch the NextJsSSRImport plugin to not throw with WASM generated chunks.
function patchSsrPlugin(plugin) {
  plugin.apply = function apply(compiler) {
    compiler.hooks.compilation.tap("NextJsSSRImport", (compilation) => {
      compilation.mainTemplate.hooks.requireEnsure.tap(
        "NextJsSSRImport",
        (code, chunk) => {
          // The patch that we need to ensure this plugin doesn't throw
          // with WASM chunks.
          if (!chunk.name) {
            return;
          }

          // Update to load chunks from our custom chunks directory
          const outputPath = path.resolve("/");
          const pagePath = path.join("/", path.dirname(chunk.name));
          const relativePathToBaseDir = path.relative(pagePath, outputPath);
          // Make sure even in windows, the path looks like in unix
          // Node.js require system will convert it accordingly
          const relativePathToBaseDirNormalized = relativePathToBaseDir.replace(
            /\\/g,
            "/"
          );
          return code
            .replace(
              'require("./"',
              `require("${relativePathToBaseDirNormalized}/"`
            )
            .replace(
              "readFile(join(__dirname",
              `readFile(join(__dirname, "${relativePathToBaseDirNormalized}"`
            );
        }
      );
    });
  };
}
