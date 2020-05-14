const AutomaticVendorFederation = ({
  exclude,
  ignoreVersion,
  packageJson,
  ignorePatchVersion = true,
}) => {
  if (!packageJson) {
    throw new Error(
      "AutomaticVendorFederation: You must pass the package.json file of your app"
    );
  }
  const { dependencies, devDependencies } = packageJson;
  const combinedDependencies = { ...dependencies, ...devDependencies };
  const shareableDependencies = Object.keys(combinedDependencies).filter(
    (dependency) => {
      if (exclude.some((dep) => dependency.includes(dep))) return false;
      return dependency;
    }
  );
  return shareableDependencies.reduce((shared, pkg) => {
    let packageVersion = require(pkg + "/package.json").version.split(".");
    if (ignorePatchVersion) {
      packageVersion.pop();
    }
    if (ignoreVersion && ignoreVersion.includes(pkg)) {
      Object.assign(shared, { [pkg]: pkg });
    } else {
      Object.assign(shared, { [`${pkg}-${packageVersion.join(".")}`]: pkg });
    }

    return shared;
  }, {});
};
module.exports = AutomaticVendorFederation;
