const finder = require("find-package-json");
const path = require("path");
const fs = require("fs");

const AutomaticVendorFederation = ({
                                     exclude,
                                     ignoreVersion,
                                     packageJson,
                                     ignorePatchVersion = true,
                                     shareFrom = ["dependencies"],
                                   }) => {
  let combinedDependencies;
  if (!packageJson) {
    throw new Error(
      "AutomaticVendorFederation: You must pass the package.json file of your app"
    );
  }
  if (shareFrom) {
    if (!Array.isArray(shareFrom)) {
      throw new Error("AutomaticVendorFederation: shareFrom must be an array");
    }
    combinedDependencies = shareFrom.reduce((acc, jsonKey) => {
      Object.assign(acc, packageJson[jsonKey]);
      return acc;
    }, {});
  }

  const shareableDependencies = Object.keys(combinedDependencies).filter(
    (dependency) => {
      if (exclude.some((dep) => dependency.includes(dep))) return false;
      return dependency;
    }
  );
  return shareableDependencies.reduce((shared, pkg) => {
    let packageVersion;
    const packageExists = fs.existsSync(
      path.join(path.dirname(require.resolve(pkg)), "/package.json")
    );
    if (packageExists) {
      const resolvedPackage = path.join(
        path.dirname(require.resolve(pkg)),
        "/package.json"
      );
      packageVersion = require(resolvedPackage).version.split(".");
    } else {
      console.log("searching for package");
      const f = finder(path.dirname(require.resolve(pkg)));
      const jsonValue = f.next().value;
      packageVersion = require(f.next().filename).version.split(".");
    }
    console.log(packageVersion);
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
