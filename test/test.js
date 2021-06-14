import test from "ava";
import { promises } from 'fs';
import { resolve } from 'path';

import commands from '../lib/utils/commandsManager.js';

test.before(async function (t) {
    try {
        await promises.mkdir(
            resolve(
                `${process.cwd()}/test/tmp`
            )
        )

        t.context.commandKeys = Object.keys(commands);
        t.context.cmdsDirectory = (await promises.readdir(
            resolve(
                `${process.cwd()}/lib/commands`
            )
        ))
        .map(c => c.split(".")[0]);
    } catch (error) {
        t.fail(error.message)
    }
});

test('All commands are imported', function (t) {
    const isOk = t.context.commandKeys.every(function (k) {
        if (typeof commands[k] !== 'object') return false;
        return true;
    });

    if (!isOk) {
        t.fail('commands must be exported as object');
    }

    t.deepEqual(
        t.context.commandKeys,
        t.context.cmdsDirectory,
        'Command manager should have the same commands in commands directory'
    )
});

test.skip('All commands are well formated', function (t) {
    const mustHave = {
        data: {
            helper: 'string',
            options: 'object'
        },
        start: 'function'
    }
    const mustHaveKeys = Object.keys(mustHave);

    mustHaveKeys.forEach(function (mustHaveKey) {
        t.context.cmdsDirectory.forEach(function (cmd) {
            const cmdKey = Object.keys(commands[cmd]);

            if (!cmdKey.includes(mustHaveKey)) return t.fail(`Command ${commands[cmd]} is missing ${mustHaveKey} key`);

            if (typeof mustHave[mustHaveKey] === 'object') {}
        });
    });

    t.pass();
})

test.after.always(async function (t) {
    try {
        await promises.rmdir(
            resolve(
                `${process.cwd()}/test/tmp`
            )
        );
    } catch (error) {
        t.fail(error.message)
    }
})