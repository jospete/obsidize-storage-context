#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const { execSync } = require('child_process');
const { version } = require('../package.json');
const { out, target } = argv;

const getAbsolutePath = function () {
	return path.resolve(path.join(...arguments)).replace(/[\r\n|\n|\r]/gm, '');
};

const removeVersion = function (input) {
	return (input + '').replace('-' + version, '');
};

const generatePackedModuleFile = (targetDirectory) => {
	return execSync('npm pack', { stio: 'pipe', cwd: targetDirectory }).toString();
};

const generateAndCopyPackedModule = () => {

	const tarballFileName = generatePackedModuleFile(target);
	const tarballInputPath = getAbsolutePath(target, tarballFileName);
	const tarballOutputPath = getAbsolutePath(out, removeVersion(tarballFileName));
	const outputDirectory = path.dirname(tarballOutputPath);

	if (!fs.existsSync(outputDirectory)) {
		console.log('creating output directory: ' + outputDirectory);
		fs.mkdirSync(outputDirectory);
	}

	console.log('copying tarball from ' + tarballInputPath + ' to ' + tarballOutputPath);
	fs.copyFileSync(tarballInputPath, tarballOutputPath);

	console.log('removing generated tarball at ' + tarballInputPath);
	fs.rmSync(tarballInputPath);

	console.log('done!');
};

generateAndCopyPackedModule();
