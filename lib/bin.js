#!/usr/bin/env node
import meow from 'meow';
import chalk from 'chalk';
import { promises } from 'fs';
import { resolve } from 'path';
import trimNewlines from 'trim-newlines';
import redent from 'redent';

import commandsManager from './utils/commandsManager.js';

(async function main() {
    try {
        let commandUnknown = false;
        let flags = {};
        const opsKeys = Object.keys(commandsManager);
        const commands = (await promises.readdir(
            resolve(process.cwd(), 'lib', 'commands')
        )).map(command => command.split('.')[0]);

        process.argv.slice(2).forEach(function (argv) {
            if (opsKeys.includes(argv)) {
                flags = {
                    ...flags,
                    ...commandsManager[argv].data.options
                }
            };
        });

        const cli = meow(chalk
        `
        Usage: json-to-folder <command> [options]
    
        Options:
            -v, --version       output the version number
            -h, --help          output usage information
        
        Commands:
            create -j= <pathToJsonfile> [options]    parse your json file and create folder
        
        Run {cyan json-to-folder <command> --help} for detailed usage of given command.
        `,
            {
                importMeta: import.meta,
                booleanDefault: undefined,
                flags
            }
        );

        if (cli.input.length === 0) return cli.showHelp(0);
        
        cli.input.forEach(function (command) {
            if (!commands.includes(command)) {
                commandUnknown = true;
                return true;
            }
        });

        if (commandUnknown) {
            return process.stderr.write(
                chalk`${cli.help}   {red Unknown command {yellow ${cli.input.join(', ')}}}`
            )
        }

        if (cli.flags.help) {
            console.log(
                redent(trimNewlines((commandsManager[cli.input[0]].data.helper || '').replace(/\t+\n*$/, '')), 2)
            );
            return process.exit(0);
        }

        return await commandsManager[cli.input[0]].start(cli.flags);
    } catch (error) {
        process.stderr.write(chalk`{bgRed ${error.message}}`);
        process.exit(-1);
    }
})()