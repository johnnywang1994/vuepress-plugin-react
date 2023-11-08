import { hash, path } from "@vuepress/utils";
import chokidar from "chokidar";
import { prepareClientConfigFile } from "./prepareClientConfigFile.js";

/**
 * @typedef {import('@vuepress/core').Plugin} VuepressPlugin
 * @typedef {import('./types').ReactPluginOptions} ReactPluginOptions
 */

/**
 * @type {(options: ReactPluginOptions) => VuepressPlugin}
 */
export default function ReactPlugin({
  name = "VueReact",
  components = {},
  componentsDir = null,
  componentsPatterns = ["**/*.jsx"],
  getComponentName = (filename) => path.trimExt(filename.replace(/\/|\\/g, "")),
} = {}) {
  const options = {
    name,
    components,
    componentsDir,
    componentsPatterns,
    getComponentName,
  };

  // use options hash as the identifier of client app enhance file
  // to avoid conflicts when using this plugin multiple times
  const optionsHash = hash(options);

  return {
    name: "vuepress-plugin-react",
    multiple: true,
    clientConfigFile: (app) =>
      prepareClientConfigFile(app, options, optionsHash),
    onWatched: (app, watchers) => {
      if (componentsDir) {
        const componentsWatcher = chokidar.watch(componentsPatterns, {
          cwd: componentsDir,
          ignoreInitial: true,
        });
        componentsWatcher.on("add", () => {
          prepareClientConfigFile(app, options, optionsHash);
        });
        componentsWatcher.on("unlink", () => {
          prepareClientConfigFile(app, options, optionsHash);
        });
        watchers.push(componentsWatcher);
      }
    },
  };
}
