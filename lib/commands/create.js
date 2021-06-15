import chalk from "chalk";
import { promises, createReadStream } from "fs";
import { resolve } from "path";

import parser from "../utils/parser.js";

const data = {
  helper: chalk`
    Usage: create: [options]        parse your json file and create folder

    Options:
    -p, --path  <pathName>          the path to create the folder             
    `,
  options: {
    path: {
      type: "string",
      alias: "p",
      default: process.cwd(),
    },
    jsonConfig: {
      type: "string",
      alias: "j",
      isRequired(flag, input) {
        if (input.includes("create")) {
          return true;
        }

        return false;
      },
    },
  },
};

async function start(cliFlags) {
  await promises.access(cliFlags.jsonConfig);
  await promises.access(cliFlags.path);

  return createReadStream(resolve(cliFlags.jsonConfig)).on("data", (c) => {
    const jsonToParse = JSON.parse(c.toString());
    parser(jsonToParse, cliFlags.path);

    process.stdout.write(
      chalk`{green Folder correctly created} {yellow ${cliFlags.path}}`
    );
  });
}

export default {
  data,
  start,
};
