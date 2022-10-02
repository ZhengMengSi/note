var arr = [1, [2, [3]], 4]

// 数组扁平化
function flatten1(arr) {
    let res = []

    arr.forEach(item => {
        if (Array.isArray(item)) {
            item.forEach(n => res.push(n))
        } else {
            res.push(item)
        }
    })

    return res
}

function flatten2(arr) {
    let res = []

    arr.forEach(item => {
        res = res.concat(item)
    })

    return res
}

function flatten3(arr) {
    let res = []

    arr.forEach(item => {
        console.log(item);
        if (Array.isArray(item)) {
            let flatItem = flatten3(item)
            flatItem.forEach(n => res.push(n))
        } else {
            res.push(item)
        }
    })

    return res
}

function flatten4(arr) {
    let res = []

    arr.forEach(item => {
        if (Array.isArray(item)) {
            let flatItem = flatten4(item)
            res = res.concat(flatItem)
        } else {
            res = res.concat(item)
        }
    })

    return res
}

// [1, 2, 3, 4]
console.log(flatten4(arr))
