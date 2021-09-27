'use strict';

/**
 * @class Leaf
 * */
class Leaf {

    /**
     * @param {function} Class - class
     * */
    constructor (Class) {
        this.Class = Class;
        this.instance = null;
    }

    /**
     * @returns {function} this.Class
     * */
    getClass () {
        return this.Class;
    }

    /**
     * @returns {function} instance of this.Class
     * */
    getSingleton () {
        if (this.instance === null) {
            this.instance = new this.Class;
        }
        return this.instance;
    }

    instantiate (...args) {
        return new this.Class(...args);
    }
}

module.exports = { Leaf };
