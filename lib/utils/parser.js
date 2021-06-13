import { promises, createReadStream, createWriteStream } from "fs";
import { join, basename, dirname } from "path";

export default function parser(jsonData, pathToCreate) {
    console.log(pathToCreate);
    if (!Array.isArray(jsonData)) throw new Error('json to parse must be an array');

    return jsonData.every(async function (data) {
        if (typeof data === 'string') {
            if (!data.length) {
                return false;
            }
        }

        if (typeof data === 'object') {
            if (!data.hasOwnProperty('name')) return false
            if (data.hasOwnProperty('files') && !Array.isArray(data.files)) return false;

            if (data.files && data.files.length ) {
                console.log(data);
            }
        };

        return true;
    });
}