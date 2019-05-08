const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const givingTreeAdminPath = path.resolve(__dirname, 'contracts', 'givingTreeAdmin.sol');
const givingTreeAdminSource = fs.readFileSync(givingTreeAdminPath, 'utf8');
const givingTreeAdminOutput = solc.compile(givingTreeAdminSource, 1).contracts;

for (let contract in givingTreeAdminOutput) {
	fs.outputJsonSync(path.resolve(buildPath, contract.replace(':', '') + '.json'), givingTreeAdminOutput[contract]);
}
const givingTreePath = path.resolve(__dirname, 'contracts', 'givingTree.sol');
const givingTreeSource = fs.readFileSync(givingTreePath, 'utf8');
const givingTreeOutput = solc.compile(givingTreeSource, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in givingTreeOutput) {
	fs.outputJsonSync(path.resolve(buildPath, contract.replace(':', '') + '.json'), givingTreeOutput[contract]);
}
const orgFactoryPath = path.resolve(__dirname, 'contracts', 'orgFactory.sol');
const orgFactorySource = fs.readFileSync(orgFactoryPath, 'utf8');
const orgFactoryOutput = solc.compile(orgFactorySource, 1).contracts;

for (let contract in orgFactoryOutput) {
	fs.outputJsonSync(path.resolve(buildPath, contract.replace(':', '') + '.json'), orgFactoryOutput[contract]);
}
