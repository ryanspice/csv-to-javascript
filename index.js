#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const rootDir = path.join(__dirname, '');
const packagesDir = path.join(rootDir, 'packages');
/*
cp.execSync('yarn csv-to-javascript --',
    {
        cwd: rootDir,
        stdio: 'inherit',
    })

 */
//require('./packages/')
const args = process.argv.slice(2).length?process.argv.slice(2):["./MOCK_DATA.csv"];
const script = process.argv.indexOf('yarn')==-1?"yarn csv-to-javascript":"";

cp.execSync(
    `${script} ${args.join(' ')}`,
    {
        cwd: rootDir,
        stdio: 'inherit',
    }
);

