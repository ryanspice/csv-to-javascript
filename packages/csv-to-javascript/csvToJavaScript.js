
'use strict';
const chalk = require('chalk');
const commander = require('commander');
const path = require('path');
const fs = require('fs-extra');
const csvToArray = require('./csvToArray');

const packageJson = require('./package.json');

let pathToFile;

/**
 *
 */

const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(path => {
        pathToFile = path;
    })
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
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
    console.log();
    console.error('Please specify the project directory:');
    console.log(
        `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
    );
    console.log();
    console.log(
      `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
}

/**
 *
 */

csvToJavaScript(
    pathToFile,
    program
);

/**
 *
 * @param name
 * @param program
 * @returns {Promise<void>}
 */

async function csvToJavaScript(
    name,
    program
) {

    const root = path.resolve(name);
    const appName = path.basename(root);

    console.log(`Opening ${chalk.green(name)}.`);

    const file = name;
    const data = await fs.readFileSync(file, 'utf8', (err, data) => {
        if (err) throw err;
    });

    const out = file.replace(".csv",".json");
    let output = csvToArray(data);
    output = JSON.stringify(output)
    //console.log(output);

    fs.outputFileSync(out, output);

    console.log(`Saving ${chalk.green(name).replace(".csv",".json")}.`);

}
