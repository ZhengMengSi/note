export default function sum(...args) {
    return args.reduce((p, c) => p +c, 0)();
}

// babel转后
/*function sum() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return args.reduce(function (p, c) {
        return p + c;
    }, 0);
}*/
