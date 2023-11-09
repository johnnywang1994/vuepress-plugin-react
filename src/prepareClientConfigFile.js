import { getComponentsFromDir } from "@vuepress/plugin-register-components";
import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
import util from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {(input: string, data: any) => Promise<string>}
 */
const renderFile = util.promisify(ejs.renderFile);

const clientTemplatePath = path.resolve(__dirname, "./client-template.js");

/**
 * @type {import('./types').prepareClientConfigFile}
 */
export const prepareClientConfigFile = async (app, options, identifier) => {
  // get components from directory
  const componentsFromDir = await getComponentsFromDir(options);

  // components from options will override components from dir
  // if they have the same component name
  const componentsMap = {
    ...componentsFromDir,
    ...options.components,
  };

  // create importMap with static filepath, so that vite can compile correctly in build-time
  const importMap = Object.entries(componentsMap).map(
    ([name, filepath]) =>
      `${JSON.stringify(name)}: () => import(${JSON.stringify(filepath)})`
  );

  const content = await renderFile(clientTemplatePath, {
    name: options.name,
    importMap,
  });

  // write temp file and return the file path
  return app.writeTemp(
    `react-components/clientConfig.${identifier}.jsx`,
    content
  );
};
