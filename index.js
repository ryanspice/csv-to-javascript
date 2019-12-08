#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
/*
cp.execSync('yarn csv-to-javascript --',
    {
        cwd: rootDir,
        stdio: 'inherit',
    })

 */
//require('./packages/')
const args = process.argv.slice(2);
const csvScriptPath = path.join(packagesDir, 'csv-to-javascript', 'index.js');
cp.execSync(
    `node ${csvScriptPath} ${args.join(' ')} --scripts-version="${scriptsPath}"`,
    {
        cwd: rootDir,
        stdio: 'inherit',
    }
);
