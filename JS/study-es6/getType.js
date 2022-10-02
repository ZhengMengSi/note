function getType(param) {
    let originType = Object.prototype.toString.call(param)
    let spaceIndex = originType.indexOf(' ')
    let type = originType.slice(spaceIndex + 1, -1)
    return type.toLowerCase()
}

console.log(getType(null))
console.log(getType(1))
console.log(getType({}))
