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
  const reactComponents = Object.keys(componentsMap).join(",");

  // client app enhance file content
  const imports = Object.entries(componentsMap).map(
    ([name, filepath]) => `import ${name} from ${JSON.stringify(filepath)};`
  );

  const content = await renderFile(clientTemplatePath, {
    name: options.name,
    components: reactComponents,
    imports,
  });

  // write temp file and return the file path
  return app.writeTemp(
    `react-components/clientConfig.${identifier}.jsx`,
    content
  );
};
