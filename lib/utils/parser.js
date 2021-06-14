import chalk from "chalk";
import { promises, createWriteStream } from "fs";
import { resolve } from "path";

export default function parser(jsonData, pathToCreate) {
  if (!Array.isArray(jsonData)) {
    process.stderr.write(chalk`{bgRed json file must be an array}`);
    process.exit(-1);
  }

  jsonData.forEach(async function (data) {
    if (typeof data === "string") {
      if (!data.length) {
        process.stderr.write(chalk`{bgRed file must have a name}`);
        process.exit(-1);
      }

      return createWriteStream(`${resolve(pathToCreate)}/${data}`);
    }

    if (typeof data === "object") {
      if (!data.hasOwnProperty("name")) {
        process.stderr.write(chalk`{bgRed folder must have a name}`);
        process.exit(-1);
      }

      if (data.hasOwnProperty("files") && !Array.isArray(data.files)) {
        process.stderr.write(chalk`{bgRed sub files must be an array}`);
        process.exit(-1);
      }

      await promises.mkdir(`${resolve(pathToCreate)}/${data.name}`);

      if (data.files && data.files.length) {
        return parser(data.files, `${resolve(pathToCreate)}/${data.name}`);
      }
    }
  });
}
