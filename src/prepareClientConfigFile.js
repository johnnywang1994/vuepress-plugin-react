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

  const content = await renderFile(clientTemplatePath, {
    name: options.name,
    componentsMap: JSON.stringify(componentsMap),
  });

  // write temp file and return the file path
  return app.writeTemp(
    `react-components/clientConfig.${identifier}.jsx`,
    content
  );
};
