const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 1. Extract transformer and resolver from the default config
const { transformer, resolver } = config;

// 2. Add SVG transformer configuration
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// 3. Wrap the modified config with NativeWind and export it
module.exports = withNativeWind(config, { input: "./styles/global.css" });