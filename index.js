#!/usr/bin/env node

const yaml = require('js-yaml');
const shell = require('shelljs');
const readline = require('readline');
const chalk = require('chalk');
const app = process.argv[2];
shell.config.silent = true;
const ls = shell.ls('./docker-compose.yml');
if (ls.code) {
    console.error('docker-compose.yml file cannot be found');
    process.exit(1);
}

const child = shell.exec('docker-compose config', {
    silent: true
});
const configYAML = child.stdout;
const config = yaml.load(configYAML);
const dependents = [];

if (!app) {
    console.error('Please provide a service name');
    process.exit(1);
}

if (!(app in config.services)) {
    console.error(`${app} is not a defined service`);
    process.exit(1);
}

function getDependents(app) {
    const deps = config.services[app].depends_on;
    if (deps) {
        if (Array.isArray(deps)) {
            deps.forEach((name) => {
                getDependents(name);
            });
        } else {
            Object.keys(deps).forEach((name) => {
                getDependents(name);
            });
        }
    }
    if (dependents.indexOf(app) === -1) {
        dependents.push(app);
    }
}
getDependents(app);

console.log(`${app} depends on ${chalk.green(dependents.length)} services.`);
console.log(dependents.map(n => ' - ' + chalk.yellow(n)).join('\n'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`Do you want to pull these images? ${chalk.green('[Y/n]')}: `, (answer) => {
    shell.config.silent = false;
    if (answer.toLowerCase()[0] === 'n') {
        process.exit(0);
    } else {
        dependents.forEach((service) => {
            shell.exec(`docker-compose pull ${service}`);
        });
    }
    rl.close();
});
