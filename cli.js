#!/usr/bin/env node

const program = require("commander");
const utils = require("./index")

const {
    add,
    clear,
    showAll
} = utils

program
    .option('-d, --debug', 'output extra debugging')


program
    .command('add')
    .description('add tasks')
    .action(add);

program
    .command("clear")
    .description("clear all tasks")
    .action(clear);

program
    .command("show")
    .description("show all tasks")
    .action(showAll);

if (process.argv.length === 2) {
    process.argv.push('show')
}

program.parse(process.argv);