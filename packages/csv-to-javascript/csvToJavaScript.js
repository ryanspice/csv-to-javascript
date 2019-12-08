
'use strict';

const chalk = require('chalk');
const commander = require('commander');
const path = require('path');
/*
const dns = require('dns');
const envinfo = require('envinfo');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const hyperquest = require('hyperquest');
const inquirer = require('inquirer');
const os = require('os');
const semver = require('semver');
const spawn = require('cross-spawn');
const tmp = require('tmp');
const unpack = require('tar-pack').unpack;
const url = require('url');
const validateProjectName = require('validate-npm-package-name');
*/
const packageJson = require('./package.json');

// These files should be allowed to remain on a failed install,
// but then silently removed during the next create.
const errorLogFilePatterns = [
    'npm-debug.log',
    'yarn-error.log',
    'yarn-debug.log',
];

let pathToFile;

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(path => {
        pathToFile = path;
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option(
        '--scripts-version <alternative-package>',
        'use a non-standard version of react-scripts'
    )
    .option(
        '--template <path-to-template>',
        'specify a template for the created project'
    )
    .allowUnknownOption()
    .on('--help', () => {
        console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
        console.log();
        console.log(
            `    A custom ${chalk.cyan('--scripts-version')} can be one of:`
        );
        console.log(`      - a specific npm version: ${chalk.green('0.8.2')}`);
        console.log(`      - a specific npm tag: ${chalk.green('@next')}`);
        console.log(
            `      - a custom fork published on npm: ${chalk.green(
                'my-react-scripts'
            )}`
        );
        console.log(
            `      - a local path relative to the current working directory: ${chalk.green(
                'file:../my-react-scripts'
            )}`
        );

        console.log();
        console.log(`    A custom ${chalk.cyan('--template')} can be one of:`);
        console.log(
            `      - a custom fork published on npm: ${chalk.green(
                'cra-template-typescript'
            )}`
        );
        console.log(
            `      - a local path relative to the current working directory: ${chalk.green(
                'file:../my-custom-template'
            )}`
        );
        console.log(
            `      - a .tgz archive: ${chalk.green(
                'https://mysite.com/my-custom-template-0.8.2.tgz'
            )}`
        );
        console.log(
            `      - a .tar.gz archive: ${chalk.green(
                'https://mysite.com/my-custom-template-0.8.2.tar.gz'
            )}`
        );
        console.log();
        console.log(
            `    If you have any problems, do not hesitate to file an issue:`
        );
        console.log(
            `      ${chalk.cyan(
                'https://github.com/facebook/create-react-app/issues/new'
            )}`
        );
        console.log();
    })
    .parse(process.argv);




if (typeof pathToFile === 'undefined') {
    console.error('Please specify the project directory:');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log('For example:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-react-app')}`);
    console.log();
    console.log(
        `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
}

function printValidationResults(results) {
    if (typeof results !== 'undefined') {
        results.forEach(error => {
            console.error(chalk.red(`  *  ${error}`));
        });
    }
}


// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    // Return the parsed data.
    return( arrData );
}


csvToJavaScript(
    pathToFile,
    program.verbose,
    program.scriptsVersion,
    program.template,
    program.useNpm,
    program.usePnp,
    program.typescript
);

function csvToJavaScript(
    name,
    verbose,
    version,
    template,
    useNpm,
    usePnp,
    useTypeScript
) {

    const root = path.resolve(name);
    const appName = path.basename(root);

    //checkAppName(appName);
    //fs.ensureDirSync(name);
    // if (!isSafeToCreateProjectIn(root, name)) {
    //     process.exit(1);
    // }

    console.log(`Opening ${chalk.green(name)}.`);
    //console.log();

    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
    };


}
/*


function install(root, useYarn, usePnp, dependencies, verbose, isOnline) {
    return new Promise((resolve, reject) => {
        let command;
        let args;
        if (useYarn) {
            command = 'yarnpkg';
            args = ['add', '--exact'];
            if (!isOnline) {
                args.push('--offline');
            }
            if (usePnp) {
                args.push('--enable-pnp');
            }
            [].push.apply(args, dependencies);

            // Explicitly set cwd() to work around issues like
            // https://github.com/facebook/create-react-app/issues/3326.
            // Unfortunately we can only do this for Yarn because npm support for
            // equivalent --prefix flag doesn't help with this issue.
            // This is why for npm, we run checkThatNpmCanReadCwd() early instead.
            args.push('--cwd');
            args.push(root);

            if (!isOnline) {
                console.log(chalk.yellow('You appear to be offline.'));
                console.log(chalk.yellow('Falling back to the local Yarn cache.'));
                console.log();
            }
        } else {
            command = 'npm';
            args = [
                'install',
                '--save',
                '--save-exact',
                '--loglevel',
                'error',
            ].concat(dependencies);

            if (usePnp) {
                console.log(chalk.yellow("NPM doesn't support PnP."));
                console.log(chalk.yellow('Falling back to the regular installs.'));
                console.log();
            }
        }

        if (verbose) {
            args.push('--verbose');
        }

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}

function run(
    root,
    appName,
    version,
    verbose,
    originalDirectory,
    template,
    useYarn,
    usePnp
) {
    Promise.all([
        getInstallPackage(version, originalDirectory),
        getTemplateInstallPackage(template, originalDirectory),
    ]).then(([packageToInstall, templateToInstall]) => {
        const allDependencies = ['react', 'react-dom', packageToInstall];

        console.log('Installing packages. This might take a couple of minutes.');

        Promise.all([
            getPackageInfo(packageToInstall),
            getPackageInfo(templateToInstall),
        ])
            .then(([packageInfo, templateInfo]) =>
                checkIfOnline(useYarn).then(isOnline => ({
                    isOnline,
                    packageInfo,
                    templateInfo,
                }))
            )
            .then(({ isOnline, packageInfo, templateInfo }) => {
                let packageVersion = semver.coerce(packageInfo.version);

                // This environment variable can be removed post-release.
                const templatesVersionMinimum = process.env.CRA_INTERNAL_TEST
                    ? '3.2.0'
                    : '3.3.0';

                // Assume compatibility if we can't test the version.
                if (!semver.valid(packageVersion)) {
                    packageVersion = templatesVersionMinimum;
                }

                // Only support templates when used alongside new react-scripts versions.
                const supportsTemplates = semver.gte(
                    packageVersion,
                    templatesVersionMinimum
                );
                if (supportsTemplates) {
                    allDependencies.push(templateToInstall);
                } else if (template) {
                    console.log('');
                    console.log(
                        `The ${chalk.cyan(packageInfo.name)} version you're using ${
                            packageInfo.name === 'react-scripts' ? 'is not' : 'may not be'
                            } compatible with the ${chalk.cyan('--template')} option.`
                    );
                    console.log('');
                }

                // TODO: Remove with next major release.
                if (!supportsTemplates && (template || '').includes('typescript')) {
                    allDependencies.push(
                        '@types/node',
                        '@types/react',
                        '@types/react-dom',
                        '@types/jest',
                        'typescript'
                    );
                }

                console.log(
                    `Installing ${chalk.cyan('react')}, ${chalk.cyan(
                        'react-dom'
                    )}, and ${chalk.cyan(packageInfo.name)}${
                        supportsTemplates ? ` with ${chalk.cyan(templateInfo.name)}` : ''
                        }...`
                );
                console.log();

                return install(
                    root,
                    useYarn,
                    usePnp,
                    allDependencies,
                    verbose,
                    isOnline
                ).then(() => ({
                    packageInfo,
                    supportsTemplates,
                    templateInfo,
                }));
            })
            .then(async ({ packageInfo, supportsTemplates, templateInfo }) => {
                const packageName = packageInfo.name;
                const templateName = supportsTemplates ? templateInfo.name : undefined;
                checkNodeVersion(packageName);
                setCaretRangeForRuntimeDeps(packageName);

                const pnpPath = path.resolve(process.cwd(), '.pnp.js');

                const nodeArgs = fs.existsSync(pnpPath) ? ['--require', pnpPath] : [];

                await executeNodeScript(
                    {
                        cwd: process.cwd(),
                        args: nodeArgs,
                    },
                    [root, appName, verbose, originalDirectory, templateName],
                    `
        var init = require('${packageName}/scripts/init.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `
                );

                if (version === 'react-scripts@0.9.x') {
                    console.log(
                        chalk.yellow(
                            `\nNote: the project was bootstrapped with an old unsupported version of tools.\n` +
                            `Please update to Node >=8.10 and npm >=5 to get supported tools in new projects.\n`
                        )
                    );
                }
            })
            .catch(reason => {
                console.log();
                console.log('Aborting installation.');
                if (reason.command) {
                    console.log(`  ${chalk.cyan(reason.command)} has failed.`);
                } else {
                    console.log(
                        chalk.red('Unexpected error. Please report it as a bug:')
                    );
                    console.log(reason);
                }
                console.log();

                // On 'exit' we will delete these files from target directory.
                const knownGeneratedFiles = [
                    'package.json',
                    'yarn.lock',
                    'node_modules',
                ];
                const currentFiles = fs.readdirSync(path.join(root));
                currentFiles.forEach(file => {
                    knownGeneratedFiles.forEach(fileToMatch => {
                        // This removes all knownGeneratedFiles.
                        if (file === fileToMatch) {
                            console.log(`Deleting generated file... ${chalk.cyan(file)}`);
                            fs.removeSync(path.join(root, file));
                        }
                    });
                });
                const remainingFiles = fs.readdirSync(path.join(root));
                if (!remainingFiles.length) {
                    // Delete target folder if empty
                    console.log(
                        `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
                            path.resolve(root, '..')
                        )}`
                    );
                    process.chdir(path.resolve(root, '..'));
                    fs.removeSync(path.join(root));
                }
                console.log('Done.');
                process.exit(1);
            });
    });
}

function getInstallPackage(version, originalDirectory) {
    let packageToInstall = 'react-scripts';
    const validSemver = semver.valid(version);
    if (validSemver) {
        packageToInstall += `@${validSemver}`;
    } else if (version) {
        if (version[0] === '@' && version.indexOf('/') === -1) {
            packageToInstall += version;
        } else if (version.match(/^file:/)) {
            packageToInstall = `file:${path.resolve(
                originalDirectory,
                version.match(/^file:(.*)?$/)[1]
            )}`;
        } else {
            // for tar.gz or alternative paths
            packageToInstall = version;
        }
    }

    const scriptsToWarn = [
        {
            name: 'react-scripts-ts',
            message: chalk.yellow(
                `The react-scripts-ts package is deprecated. TypeScript is now supported natively in Create React App. You can use the ${chalk.green(
                    '--template typescript'
                )} option instead when generating your app to include TypeScript support. Would you like to continue using react-scripts-ts?`
            ),
        },
    ];

    for (const script of scriptsToWarn) {
        if (packageToInstall.startsWith(script.name)) {
            return inquirer
                .prompt({
                    type: 'confirm',
                    name: 'useScript',
                    message: script.message,
                    default: false,
                })
                .then(answer => {
                    if (!answer.useScript) {
                        process.exit(0);
                    }

                    return packageToInstall;
                });
        }
    }

    return Promise.resolve(packageToInstall);
}

function getTemplateInstallPackage(template, originalDirectory) {
    let templateToInstall = 'cra-template';
    if (template) {
        if (template.match(/^file:/)) {
            templateToInstall = `file:${path.resolve(
                originalDirectory,
                template.match(/^file:(.*)?$/)[1]
            )}`;
        } else if (
            template.includes('://') ||
            template.match(/^.+\.(tgz|tar\.gz)$/)
        ) {
            // for tar.gz or alternative paths
            templateToInstall = template;
        } else {
            // Add prefix 'cra-template-' to non-prefixed templates, leaving any
            // @scope/ intact.
            const packageMatch = template.match(/^(@[^/]+\/)?(.+)$/);
            const scope = packageMatch[1] || '';
            const templateName = packageMatch[2];

            const name = templateName.startsWith(templateToInstall)
                ? templateName
                : `${templateToInstall}-${templateName}`;
            templateToInstall = `${scope}${name}`;
        }
    }

    return Promise.resolve(templateToInstall);
}

function getTemporaryDirectory() {
    return new Promise((resolve, reject) => {
        // Unsafe cleanup lets us recursively delete the directory if it contains
        // contents; by default it only allows removal if it's empty
        tmp.dir({ unsafeCleanup: true }, (err, tmpdir, callback) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    tmpdir: tmpdir,
                    cleanup: () => {
                        try {
                            callback();
                        } catch (ignored) {
                            // Callback might throw and fail, since it's a temp directory the
                            // OS will clean it up eventually...
                        }
                    },
                });
            }
        });
    });
}

function extractStream(stream, dest) {
    return new Promise((resolve, reject) => {
        stream.pipe(
            unpack(dest, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dest);
                }
            })
        );
    });
}

// Extract package name from tarball url or path.
function getPackageInfo(installPackage) {
    if (installPackage.match(/^.+\.(tgz|tar\.gz)$/)) {
        return getTemporaryDirectory()
            .then(obj => {
                let stream;
                if (/^http/.test(installPackage)) {
                    stream = hyperquest(installPackage);
                } else {
                    stream = fs.createReadStream(installPackage);
                }
                return extractStream(stream, obj.tmpdir).then(() => obj);
            })
            .then(obj => {
                const { name, version } = require(path.join(
                    obj.tmpdir,
                    'package.json'
                ));
                obj.cleanup();
                return { name, version };
            })
            .catch(err => {
                // The package name could be with or without semver version, e.g. react-scripts-0.2.0-alpha.1.tgz
                // However, this function returns package name only without semver version.
                console.log(
                    `Could not extract the package name from the archive: ${err.message}`
                );
                const assumedProjectName = installPackage.match(
                    /^.+\/(.+?)(?:-\d+.+)?\.(tgz|tar\.gz)$/
                )[1];
                console.log(
                    `Based on the filename, assuming it is "${chalk.cyan(
                        assumedProjectName
                    )}"`
                );
                return Promise.resolve({ name: assumedProjectName });
            });
    } else if (installPackage.indexOf('git+') === 0) {
        // Pull package name out of git urls e.g:
        // git+https://github.com/mycompany/react-scripts.git
        // git+ssh://github.com/mycompany/react-scripts.git#v1.2.3
        return Promise.resolve({
            name: installPackage.match(/([^/]+)\.git(#.*)?$/)[1],
        });
    } else if (installPackage.match(/.+@/)) {
        // Do not match @scope/ when stripping off @version or @tag
        return Promise.resolve({
            name: installPackage.charAt(0) + installPackage.substr(1).split('@')[0],
            version: installPackage.split('@')[1],
        });
    } else if (installPackage.match(/^file:/)) {
        const installPackagePath = installPackage.match(/^file:(.*)?$/)[1];
        const { name, version } = require(path.join(
            installPackagePath,
            'package.json'
        ));
        return Promise.resolve({ name, version });
    }
    return Promise.resolve({ name: installPackage });
}

function checkNpmVersion() {
    let hasMinNpm = false;
    let npmVersion = null;
    try {
        npmVersion = execSync('npm --version')
            .toString()
            .trim();
        hasMinNpm = semver.gte(npmVersion, '5.0.0');
    } catch (err) {
        // ignore
    }
    return {
        hasMinNpm: hasMinNpm,
        npmVersion: npmVersion,
    };
}

function checkYarnVersion() {
    let hasMinYarnPnp = false;
    let yarnVersion = null;
    try {
        yarnVersion = execSync('yarnpkg --version')
            .toString()
            .trim();
        let trimmedYarnVersion = /^(.+?)[-+].+$/.exec(yarnVersion);
        if (trimmedYarnVersion) {
            trimmedYarnVersion = trimmedYarnVersion.pop();
        }
        hasMinYarnPnp = semver.gte(trimmedYarnVersion || yarnVersion, '1.12.0');
    } catch (err) {
        // ignore
    }
    return {
        hasMinYarnPnp: hasMinYarnPnp,
        yarnVersion: yarnVersion,
    };
}

function checkNodeVersion(packageName) {
    const packageJsonPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'package.json'
    );

    if (!fs.existsSync(packageJsonPath)) {
        return;
    }

    const packageJson = require(packageJsonPath);
    if (!packageJson.engines || !packageJson.engines.node) {
        return;
    }

    if (!semver.satisfies(process.version, packageJson.engines.node)) {
        console.error(
            chalk.red(
                'You are running Node %s.\n' +
                'Create React App requires Node %s or higher. \n' +
                'Please update your version of Node.'
            ),
            process.version,
            packageJson.engines.node
        );
        process.exit(1);
    }
}

function checkAppName(appName) {
    const validationResult = validateProjectName(appName);
    if (!validationResult.validForNewPackages) {
        console.error(
            `Could not create a project called ${chalk.red(
                `"${appName}"`
            )} because of npm naming restrictions:`
        );
        printValidationResults(validationResult.errors);
        printValidationResults(validationResult.warnings);
        process.exit(1);
    }

    // TODO: there should be a single place that holds the dependencies
    const dependencies = ['react', 'react-dom', 'react-scripts'].sort();
    if (dependencies.indexOf(appName) >= 0) {
        console.error(
            chalk.red(
                `We cannot create a project called ${chalk.green(
                    appName
                )} because a dependency with the same name exists.\n` +
                `Due to the way npm works, the following names are not allowed:\n\n`
            ) +
            chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
            chalk.red('\n\nPlease choose a different project name.')
        );
        process.exit(1);
    }
}

function makeCaretRange(dependencies, name) {
    const version = dependencies[name];

    if (typeof version === 'undefined') {
        console.error(chalk.red(`Missing ${name} dependency in package.json`));
        process.exit(1);
    }

    let patchedVersion = `^${version}`;

    if (!semver.validRange(patchedVersion)) {
        console.error(
            `Unable to patch ${name} dependency version because version ${chalk.red(
                version
            )} will become invalid ${chalk.red(patchedVersion)}`
        );
        patchedVersion = version;
    }

    dependencies[name] = patchedVersion;
}

function setCaretRangeForRuntimeDeps(packageName) {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = require(packagePath);

    if (typeof packageJson.dependencies === 'undefined') {
        console.error(chalk.red('Missing dependencies in package.json'));
        process.exit(1);
    }

    const packageVersion = packageJson.dependencies[packageName];
    if (typeof packageVersion === 'undefined') {
        console.error(chalk.red(`Unable to find ${packageName} in package.json`));
        process.exit(1);
    }

    makeCaretRange(packageJson.dependencies, 'react');
    makeCaretRange(packageJson.dependencies, 'react-dom');

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + os.EOL);
}

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
// We also special case IJ-based products .idea because it integrates with CRA:
// https://github.com/facebook/create-react-app/pull/368#issuecomment-243446094
function isSafeToCreateProjectIn(root, name) {
    const validFiles = [
        '.DS_Store',
        'Thumbs.db',
        '.git',
        '.gitignore',
        '.idea',
        'README.md',
        'LICENSE',
        '.hg',
        '.hgignore',
        '.hgcheck',
        '.npmignore',
        'mkdocs.yml',
        'docs',
        '.travis.yml',
        '.gitlab-ci.yml',
        '.gitattributes',
    ];
    console.log();

    const conflicts = fs
        .readdirSync(root)
        .filter(file => !validFiles.includes(file))
        // IntelliJ IDEA creates module files before CRA is launched
        .filter(file => !/\.iml$/.test(file))
        // Don't treat log files from previous installation as conflicts
        .filter(
            file => !errorLogFilePatterns.some(pattern => file.indexOf(pattern) === 0)
        );

    if (conflicts.length > 0) {
        console.log(
            `The directory ${chalk.green(name)} contains files that could conflict:`
        );
        console.log();
        for (const file of conflicts) {
            console.log(`  ${file}`);
        }
        console.log();
        console.log(
            'Either try using a new directory name, or remove the files listed above.'
        );

        return false;
    }

    // Remove any remnant files from a previous installation
    const currentFiles = fs.readdirSync(path.join(root));
    currentFiles.forEach(file => {
        errorLogFilePatterns.forEach(errorLogFilePattern => {
            // This will catch `(npm-debug|yarn-error|yarn-debug).log*` files
            if (file.indexOf(errorLogFilePattern) === 0) {
                fs.removeSync(path.join(root, file));
            }
        });
    });
    return true;
}

function getProxy() {
    if (process.env.https_proxy) {
        return process.env.https_proxy;
    } else {
        try {
            // Trying to read https-proxy from .npmrc
            let httpsProxy = execSync('npm config get https-proxy')
                .toString()
                .trim();
            return httpsProxy !== 'null' ? httpsProxy : undefined;
        } catch (e) {
            return;
        }
    }
}
function checkThatNpmCanReadCwd() {
    const cwd = process.cwd();
    let childOutput = null;
    try {
        // Note: intentionally using spawn over exec since
        // the problem doesn't reproduce otherwise.
        // `npm config list` is the only reliable way I could find
        // to reproduce the wrong path. Just printing process.cwd()
        // in a Node process was not enough.
        childOutput = spawn.sync('npm', ['config', 'list']).output.join('');
    } catch (err) {
        // Something went wrong spawning node.
        // Not great, but it means we can't do this check.
        // We might fail later on, but let's continue.
        return true;
    }
    if (typeof childOutput !== 'string') {
        return true;
    }
    const lines = childOutput.split('\n');
    // `npm config list` output includes the following line:
    // "; cwd = C:\path\to\current\dir" (unquoted)
    // I couldn't find an easier way to get it.
    const prefix = '; cwd = ';
    const line = lines.find(line => line.indexOf(prefix) === 0);
    if (typeof line !== 'string') {
        // Fail gracefully. They could remove it.
        return true;
    }
    const npmCWD = line.substring(prefix.length);
    if (npmCWD === cwd) {
        return true;
    }
    console.error(
        chalk.red(
            `Could not start an npm process in the right directory.\n\n` +
            `The current directory is: ${chalk.bold(cwd)}\n` +
            `However, a newly started npm process runs in: ${chalk.bold(
                npmCWD
            )}\n\n` +
            `This is probably caused by a misconfigured system terminal shell.`
        )
    );
    if (process.platform === 'win32') {
        console.error(
            chalk.red(`On Windows, this can usually be fixed by running:\n\n`) +
            `  ${chalk.cyan(
                'reg'
            )} delete "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n` +
            `  ${chalk.cyan(
                'reg'
            )} delete "HKLM\\Software\\Microsoft\\Command Processor" /v AutoRun /f\n\n` +
            chalk.red(`Try to run the above two lines in the terminal.\n`) +
            chalk.red(
                `To learn more about this problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/`
            )
        );
    }
    return false;
}

function checkIfOnline(useYarn) {
    if (!useYarn) {
        // Don't ping the Yarn registry.
        // We'll just assume the best case.
        return Promise.resolve(true);
    }

    return new Promise(resolve => {
        dns.lookup('registry.yarnpkg.com', err => {
            let proxy;
            if (err != null && (proxy = getProxy())) {
                // If a proxy is defined, we likely can't resolve external hostnames.
                // Try to resolve the proxy name as an indication of a connection.
                dns.lookup(url.parse(proxy).hostname, proxyErr => {
                    resolve(proxyErr == null);
                });
            } else {
                resolve(err == null);
            }
        });
    });
}

function executeNodeScript({ cwd, args }, data, source) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            process.execPath,
            [...args, '-e', source, '--', JSON.stringify(data)],
            { cwd, stdio: 'inherit' }
        );

        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `node ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    });
}
*/
