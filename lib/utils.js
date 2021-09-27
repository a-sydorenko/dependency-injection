'use strict';

module.exports = {
    validateParam
};

function validateParam (o) {
    return typeof o.name === 'string' && o.Class instanceof Function;
}
