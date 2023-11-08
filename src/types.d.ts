import { App } from "@vuepress/core";
import { RegisterComponentsPluginOptions } from "@vuepress/plugin-register-components";

export interface ReactPluginOptions extends RegisterComponentsPluginOptions {
  name?: string;
}

export function prepareClientConfigFile(
  app: App,
  options: Required<ReactPluginOptions>,
  identifier: string
): string;
