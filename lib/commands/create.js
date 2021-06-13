import chalk from 'chalk';
import { promises, createReadStream } from 'fs'
import { resolve } from 'path';

import parser from '../utils/parser.js';

const data = {
    helper: chalk`
    Usage: create: [options]        parse your json file and create folder

    Options:
    -p, --path  <pathName>          the path to create the folder             
    `,
    options: {
        path: {
            type: 'string',
            alias: 'p',
            default: process.cwd()
        },
        jsonConfig: {
            type: 'string',
            alias: 'j',
            isRequired(flag, input) {
                if (input.includes('create')) {
                    return true;
                }

                return false;
            }
        }
    }
};

async function start(cliFlags) {
    await promises.access(cliFlags.jsonConfig);

    return createReadStream(resolve(cliFlags.jsonConfig))
    .on('data', function (c) {
        const jsonToParse = JSON.parse(c.toString())

        const ok = parser(jsonToParse, cliFlags.path);

        if (!ok) {
            throw new Error('json file has bad syntax, check documentation.')
        }
    });
}

export default {
    data,
    start
}