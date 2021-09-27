'use strict';

/**
 * @object STORAGE
 * @property {object} initializer
 * @property {object} service
 * @property {object} task
 * @property {object} model
 * @property {object} schema
 * @property {object} storage
 * */
const STORAGE = {};

module.exports = {
    get (name) { return STORAGE[name]; },
    set (name) { return STORAGE[name] = {}; }
};
