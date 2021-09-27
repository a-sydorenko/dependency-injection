'use strict';

const { nanoid } = require('nanoid');
const { Leaf } = require('./leaf');
const { readFolders } = require('./reader');
const { get, set } = require('./storage');

const defaultEntitiesList = [
    { name: 'service', depth: 1 },
    { name: 'task', depth: 1 },
    { name: 'model', depth: 1 },
];

class DI {

    constructor ({ entitiesList = defaultEntitiesList } = {}) {
        this.entitiesList = entitiesList;
        this.name = nanoid(10);
        set(this.name);
    }

    /**
     * @method scan
     * @description scan directory
     * @param {string} folderPath
     * @returns {void}
     * */
    scan (folderPath) {
        const STORAGE = get(this.name);
        for (let entity of this.entitiesList) {
            const current = STORAGE[entity.name] = STORAGE[entity.name] || {};

            for (let file of readFolders(folderPath, entity)) {
                current[file.name] = new Leaf(file.Class);
            }
        }
    }

    /**
     * @method get
     * @description get entity instance or constructor by its type and name
     * @param {string} type
     * @param {string} name
     * @param {object} options
     * @param {boolean} [options.singleton]
     * @returns {object|void}
     * */
    get (type, name, options = {}) {
        const STORAGE = get(this.name);
        const current = STORAGE[type] && STORAGE[type][name];

        if (!current) {
            return;
        }

        return options.singleton ? current.getSingleton() : current.getClass();
    }

    /**
     * @method getMany
     * @description get entity instances or constructors by its type and name
     * @param {string} type
     * @param {string[]} names
     * @param {object} options
     * @param {boolean} [options.singleton]
     * @returns {object|void}
     * */
    getMany (type, names, options) {
        return names
            .reduce((resultArr, name) => {
                const obj = this.get(type, name, options);
                if (obj) { resultArr.push(obj); }

                return resultArr;
            }, []);
    }

    /**
     * @method getMany
     * @description get entity instances or constructors by its type and name
     * @param {string} type
     * @param {object} options
     * @param {boolean} [options.singleton]
     * @returns {object|void}
     * */
    getAll (type, options = {}) {
        const current = get(this.name)[type];
        if (!current) { return; }

        const method = options.singleton ? 'getSingleton' : 'getClass';
        return Object.values(current).map(leaf => leaf[method]());
    }
}

module.exports = { DI };
