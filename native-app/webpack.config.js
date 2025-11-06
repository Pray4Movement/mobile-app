const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const path = require("path");

module.exports = async function (env = {}, argv) {
  // Extract mode from argv or environment
  const mode = argv.mode || process.env.NODE_ENV || 'development';

  // Ensure mode is valid
  if (!['development', 'production', 'none'].includes(mode)) {
    throw new Error(`Invalid mode: ${mode}. Must be one of: development, production, none`);
  }

  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode: mode,
      projectRoot: __dirname,
    },
    argv
  );

  // Ensure entry point is set correctly
  if (!config.entry) {
    config.entry = path.resolve(__dirname, 'index.web.tsx');
  }

  // Ensure react-native resolves to react-native-web for web builds
  config.resolve = {
    ...(config.resolve || {}),
    alias: {
      ...(config.resolve ? config.resolve.alias : {}),
      'react-native$': 'react-native-web',
    },
  };

  // Ensure the bundle is not emitted as native ESM to avoid "exports is not defined"
  config.output = {
    ...(config.output || {}),
    module: false,
  };
  config.experiments = {
    ...(config.experiments || {}),
    outputModule: false,
  };

  // Normalize devServer options for webpack-dev-server v5
  config.devServer = {
    ...(config.devServer || {}),
    // Serve static HTML template
    static: [
      { directory: path.resolve(__dirname, 'public') },
    ],
    historyApiFallback: true,
    server: 'http',
  };

  // Remove deprecated/unknown options if present
  if (config.devServer && 'https' in config.devServer) {
    delete config.devServer.https;
  }

  return config;
};
