const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const endaomentAdminPath = path.resolve(
  __dirname,
  "contracts",
  "endaomentAdmin.sol"
);
const endaomentAdminSource = fs.readFileSync(endaomentAdminPath, "utf8");
const endaomentAdminOutput = solc.compile(endaomentAdminSource, 1).contracts;

for (let contract in endaomentAdminOutput) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    endaomentAdminOutput[contract]
  );
}
const fundFactoryPath = path.resolve(__dirname, "contracts", "fundFactory.sol");
const fundFactorySource = fs.readFileSync(fundFactoryPath, "utf8");
const fundFactoryOutput = solc.compile(fundFactorySource, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in fundFactoryOutput) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    fundFactoryOutput[contract]
  );
}
const orgFactoryPath = path.resolve(__dirname, "contracts", "orgFactory.sol");
const orgFactorySource = fs.readFileSync(orgFactoryPath, "utf8");
const orgFactoryOutput = solc.compile(orgFactorySource, 1).contracts;

for (let contract in orgFactoryOutput) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    orgFactoryOutput[contract]
  );
}
