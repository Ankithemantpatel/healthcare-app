const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const workspaceRoot = path.resolve(__dirname, "../..");
const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  projectRoot: __dirname,
  watchFolders: [workspaceRoot],
  resolver: {
    disableHierarchicalLookup: true,
    extraNodeModules: {
      "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
    },
    nodeModulesPaths: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(workspaceRoot, "node_modules"),
    ],
  },
});
