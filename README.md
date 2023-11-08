# Vuepress Plugin React

A Vuepress Plugin for rendering React component in Vuepress markdown on top of Vite Bundler, typed with JsDoc.

> This is a plugin for Vuepress Next(v2.0.0 up) which is in `beta` during the plugin was creating.(tested in `beta.67`)


## Install
```
$ npm install vuepress-plugin-react @vuepress/bundler-vite @vitejs/plugin-react
```

## setup Vuepress config
- About the Vuepress config documentation, [please see here](https://v2.vuepress.vuejs.org/reference/config.html)
```js
// docs/.vuepress/config.js
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import react from "@vitejs/plugin-react";
import ReactPlugin from "vuepress-plugin-react";
import path from 'path';

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      plugins: [react()],
    },
  }),

  plugins: [
    ReactPlugin({
      componentsDir: path.resolve(__dirname, "./components-react"),
    }),
  ]
});
```

## create React component
```jsx
// docs/.vuepress/components-react/Counter.jsx
import { useState } from "react";

const Counter = ({ className }) => {
  const [count, setCount] = useState(0);
  return (
    <div className={className}>
      Count: {count}
      <button onClick={() => setCount(count + 1)}>ADD</button>
    </div>
  );
};

export default Counter;
```

## use in anywhere of your Markdown file
By default, all registered React Component in the given folder path will be accessible by using `VueReact` component and `as` props to specify which React component you want to use, you can change the default component name in config for different component folder.
```markdown
# React in Vuepress

- A rendered React Component - Counter
<VueReact as="Counter" className="my-react-counter" />
```

## Pre-Render Supported
By default, the React component will be rendered in client with `createRoot` and pre-render by `renderToString` before client ready(build-time), you can disable the pre-render feature by giving `clientOnly` prop, this way the react component will not be pre-rendered anymore
```markdown
<VueReact as="Counter" clientOnly />
```


## Options
Since this plugin is mostly based on [@vuepress/plugin-register-components](https://v2.vuepress.vuejs.org/reference/plugin/register-components.html), you can see the documentation there. Just some adjustment for default config as following
```js
const defaultOptions = {
  // Name of component in Markdown, please restart vuepress server after changing the name
  "name": "VueReact",
  "components": {},
  "componentsDir": null,
  "componentsPatterns": ["**/*.jsx"],
  "getComponentName": (filename) => path.trimExt(filename.replace(/\/|\\/g, ""))
}
```

### nested folder component
If you have a component path like `.vuepress/components-react/Home/Counter.jsx`, you can access the component as following:
```markdown
<VueReact as="HomeCounter" />
```

### change default component name
```js
export default defineUserConfig({
  // ...
  plugins: [
    ReactPlugin({
      name: 'UseReact',
      componentsDir: path.resolve(__dirname, "./components-react"),
    }),
  ]
});
```
```markdown
<UseReact as="Counter" />
```


## Reference
Thanks a lot for the inspiration of plugin [@vuepress/plugin-register-components](https://v2.vuepress.vuejs.org/reference/plugin/register-components.html).


## Modified by [JohnnyWang](https://github.com/johnnywang1994) in 2023.11