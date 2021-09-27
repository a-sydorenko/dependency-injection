'use strict';

const path = require('path');
const { DI } = require('../');
const { strictEqual } = require('assert');

describe('DI test', () => {
    describe('DI initialization', () => {
        const di = new DI();
        di.scan(path.resolve('test/src'));

        for (const type of ['model', 'service', 'task']) {

            it(`get: ${type} class is function`, () => {
                strictEqual(true, di.get(type, 'test') instanceof Function);
            });

            const obj = di.get(type, 'test', { singleton: true });
            it(`get: ${type} instance is object`, () => strictEqual(true, obj instanceof Object));
            it(`get: ${type} has method init`, () => strictEqual(true, obj.init instanceof Function));

            di.getAll(type)
                .forEach(func => {
                    it(`getAll: ${type} class is function`, () => strictEqual(true, func instanceof Function));
                });

            di.getAll(type, { singleton: true })
                .forEach(obj => {
                    it(`getAll: ${type} instance is object`, () => strictEqual(true, obj instanceof Object));
                    it(`getAll: ${type} has method init`, () => strictEqual(true, obj.init instanceof Function));
                });
        }
    });
});
