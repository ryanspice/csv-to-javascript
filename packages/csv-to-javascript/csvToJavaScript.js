
'use strict';
const chalk = require('chalk');
const commander = require('commander');
const path = require('path');
const fs = require('fs-extra');
const csvToArray = require('./csvToArray');
const pkg = require('./package.json');

let pathToFile;

/**
 * Commander Program
 */

const program = new commander.Command(pkg.name)
    .version(pkg.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action(path => {
        pathToFile = path;
    })
    .allowUnknownOption()
    .on('--help', () => {
        console.log(`    Only ${chalk.green('<project-directory>')} is required.`);
        console.log();
        console.log(
            `      - an exact path: ${chalk.green(
                'C:/path/file.cvs'
            )}`
        );
        console.log(
            `      - exports a : ${chalk.green(
                '*.json'
            )}`
        );
        console.log();
        console.log(
            `    If you have any problems, do not hesitate to file an issue:`
        );
        console.log(
            `      ${chalk.cyan(
                'https://github.com/ryanspice/csv-to-javascript/issues/new'
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
 * Execute Command
 */

csvToJavaScript(
    pathToFile,
    program
);

/**
 * CLI Command
 * @param pathToFile
 * @param program
 * @returns {Promise<void>}
 */

async function csvToJavaScript(
    pathToFile,
    program
) {

    console.log(`Opening ${chalk.green(pathToFile)}.`);

    const file = path.resolve(pathToFile);
    const data = await fs.readFileSync(file, 'utf8', (err, data) => {
        if (err) throw err;
    });

    const out = file.replace(".csv",".json");

    let output = csvToArray(data);
    output = JSON.stringify(output)
    //console.log(output);

    fs.outputFileSync(out, output);

    console.log(`Saving ${chalk.green(pathToFile).replace(".csv",".json")}.`);

}
