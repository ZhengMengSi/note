function cloneDeep(obj) {
    if (typeof obj !== 'object' || obj == null) return obj

    let result

    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = cloneDeep(obj[key])
        }
    }

    return result
}

var obj = {
    a: new Set([1,2,3]),
    b: new Map([['x', 1], ['y', 2]]),
    fn: function () {

    }
}
// obj.self = obj

console.log(cloneDeep(obj))
// console.log(JSON.stringify(obj))
