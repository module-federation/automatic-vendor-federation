# automatic-vendor-federation

Utility to enable automatic vendor sharing within bundles using Module Federation

## This tool will be part of Webpack 5 core: https://github.com/webpack/webpack/pull/10960

# Check out our book
| <a href="https://module-federation.myshopify.com/products/practical-module-federation" target="_blank"><img src="https://github.com/module-federation/module-federation-examples/raw/master/docs/MFCover.png" alt='Practical Module Federation Book' width="90%"/></a> | <a href="https://module-federation.myshopify.com/products/practical-module-federation" target="_blank">We will be actively updating this book over the next year as we learn more about best practices and what issues people are running into with Module Federation, as well as with every release of Webpack as it moves towards a release candidate and release. So with your one purchase you are buying a whole year of updates.</a> |
|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

# Install

```shell script
yarn install @module-federation/automatic-vendor-sharing -D
```

# Usage
There are a few arguments you can pass to the utility.
* `exclude` : allows you to filter out any packages including part of the string.
* `packageJson` : pass your apps `package.json`: eg: `require("./package.json");`
* `ignoreVersion`: you can ignore versions on some shared packages. This utility supports versioned dependencies, which is a problem when using React as there can only be one version on the page
* `ignorePatchVersion` : ignore patch numbers and share dependencies based on a minor version matching. lodash-4.11 instead of lodash-4.11.7
* `shareFrom`: choose where in package.json the utility should share from. `['dependencies','peerDependencies']`/ (default: `dependencies`)

```js
const AutomaticVendorFederation = require("@module-federation/automatic-vendor-federation");
const { ModuleFederationPlugin } = require("webpack").container;
const packageJson = require("./package.json");
const exclude = ["babel", "plugin", "preset", "webpack", "loader", "serve"];
const ignoreVersion = ["react", "react-dom"];

module.export = {
  //... rest of your config
  plugins: [
    new ModuleFederationPlugin({
      name: "app2",
      library: { type: "var", name: "app2" },
      filename: "remoteEntry.js",
      remotes: {
        app1: "app1",
      },
      exposes: {
        Button: "./src/Button",
      },
      shared: AutomaticVendorFederation({
        exclude,
        ignoreVersion,
        packageJson,
        shareFrom: ["dependencies", "peerDependencies"],
        ignorePatchVersion: true,
      }),
    }),
  ],
};
```

<img src="https://ssl.google-analytics.com/collect?v=1&t=event&ec=email&ea=open&t=event&tid=UA-120967034-1&z=1589682154&cid=ae045149-9d17-0367-bbb0-11c41d92b411&dt=ModuleFederation&dp=/email/AutoVendorFederation">
