'use strict';

const fs = require('fs');
const path = require('path');

module.exports = { readFolders };

/**
 * @param {string} folderPath - folder path
 * @param {object} entity - entity
 * @param {string} entity.name - entity name
 * @param {string} entity.plural - entity name plural form
 * @param {number} entity.depth - entity depth
 * @returns {object[]} - middleware list
 * */
function readFolders (folderPath, entity) {
    const targetPath = path.join(folderPath, entity.plural || `${entity.name}s`);
    const result = [];

    readFolder(result, targetPath, '', entity.depth);
    return result;
}

/**
 * @param {*[]} resultArray - result
 * @param {string} folder - folder path
 * @param {string} entityName -  entity.name
 * @param {number} depth - entity.depth
 * @returns {void} - middleware list
 * */
function readFolder (resultArray, folder, entityName, depth) {
    if (!(fs.existsSync(folder) && depth)) {
        return;
    }

    fs.readdirSync(folder).forEach(element => {
        const targetPath = path.join(folder, element);

        switch (true) {
            case fs.statSync(targetPath).isDirectory() : {
                const indexFile = path.join(targetPath, 'index.js');
                if (fs.existsSync(indexFile) && !fs.statSync(indexFile).isDirectory()) {
                    resultArray.push(
                        serialize(targetPath, entityName === '' ? element : `${entityName}.${element}`)
                    );
                    break;
                }

                readFolder(
                    resultArray,
                    targetPath,
                    entityName === '' ? element : `${entityName}.${element}`,
                    depth - 1
                );
                break;
            }
            case element.substr(-3) === '.js' : {
                let e = element.substring(0, element.length - 3);
                resultArray.push(
                    serialize(targetPath, entityName === '' ? e : `${entityName}.${e}`)
                );
                break;
            }
        }
    });
}

/**
 * @param {string} targetPath - folder path
 * @param {string} name -  entity.name
 * @returns {object} - arguments for scanner
 * */
function serialize (targetPath, name) {
    return { name, Class: require(targetPath) };
}
