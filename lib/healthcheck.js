module.exports = function (options) {
    options = options || {};
    options.test = options.test || function () {};
    if (typeof options.test !== 'function') {
        throw new Error('express-healthcheck test method must be a function');
    }
    if (options.test.length === 0) {
        var test = options.test;
        options.test = function (callback) {
            setImmediate(callback(test()));
        };
    }
    return function (req, res, next) {
        options.test(function (err) {
            var status = 200,
                response = { uptime: process.uptime() };
            if (err) {
                status = 500;
                response = err;
            }
            res.json(status, response);
        });
    };
};
